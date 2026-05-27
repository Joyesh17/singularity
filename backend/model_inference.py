#Start
"""
Singularity - Image Fake Detection Inference Module

File location:
    backend/model_inference.py

Expected local model artifact folder:
    backend/ml_artifacts/efficientnet_b0_mvp/

Required files:
    backend/ml_artifacts/efficientnet_b0_mvp/model.pth
    backend/ml_artifacts/efficientnet_b0_mvp/model_config.json
    backend/ml_artifacts/efficientnet_b0_mvp/class_map.json
    backend/ml_artifacts/efficientnet_b0_mvp/inference_info.json

Main functions:
    load_detector()
    predict_image()
    predict_image_with_gradcam()

This module is designed for local backend/website inference.
It does NOT depend on Google Drive paths.
"""

from pathlib import Path
from datetime import datetime
from typing import Any, Dict, Optional
import json
import uuid

import numpy as np
from PIL import Image

import torch
import torch.nn as nn
import torch.nn.functional as F
import torchvision.models as models
from torchvision import transforms

try:
    import cv2
except ImportError:
    cv2 = None


# ============================================================
# 1. Path helpers
# ============================================================

def get_backend_root() -> Path:
    """
    Returns:
        backend folder path.

    Expected file location:
        singularity/backend/model_inference.py
    """
    return Path(__file__).resolve().parent


def get_project_root() -> Path:
    """
    Returns:
        singularity project root folder.
    """
    return get_backend_root().parent


def get_default_artifact_dir() -> Path:
    """
    Returns:
        backend/ml_artifacts/efficientnet_b0_mvp
    """
    return get_backend_root() / "ml_artifacts" / "efficientnet_b0_mvp"


# ============================================================
# 2. Detector wrapper
# ============================================================

class SingularityImageDetector:
    """
    EfficientNet-B0 fake-image detector wrapper.
    """

    def __init__(
        self,
        model: torch.nn.Module,
        model_config: Dict[str, Any],
        artifact_dir: Path,
        device: torch.device
    ):
        self.model = model
        self.model_config = model_config
        self.artifact_dir = artifact_dir
        self.device = device

        self.class_names = model_config["class_names"]
        self.input_size = int(model_config["input_size"])
        self.num_classes = int(model_config["num_classes"])

        self.mean = model_config["normalization"]["mean"]
        self.std = model_config["normalization"]["std"]

        self.preprocess = transforms.Compose([
            transforms.Resize((self.input_size, self.input_size)),
            transforms.ToTensor(),
            transforms.Normalize(
                mean=self.mean,
                std=self.std
            )
        ])

    def prepare_image(self, image_path: str | Path) -> tuple[Image.Image, torch.Tensor]:
        """
        Loads and preprocesses an image.

        Args:
            image_path:
                Local image path.

        Returns:
            original PIL image and preprocessed tensor.
        """
        image_path = Path(image_path)

        if not image_path.exists():
            raise FileNotFoundError(f"Image not found: {image_path}")

        image = Image.open(image_path).convert("RGB")
        tensor = self.preprocess(image).unsqueeze(0).to(self.device)

        return image, tensor

    def predict_tensor(self, image_tensor: torch.Tensor) -> Dict[str, Any]:
        """
        Runs model prediction on a preprocessed image tensor.

        Args:
            image_tensor:
                Tensor shape [1, 3, 224, 224]

        Returns:
            JSON-serializable prediction dictionary.
        """
        self.model.eval()

        with torch.no_grad():
            logits = self.model(image_tensor)
            probabilities = F.softmax(logits, dim=1)[0]

        real_probability = float(probabilities[0].detach().cpu().item())
        fake_probability = float(probabilities[1].detach().cpu().item())

        predicted_index = int(torch.argmax(probabilities).detach().cpu().item())
        prediction = self.class_names[predicted_index]
        confidence = max(real_probability, fake_probability)

        result = {
            "prediction": prediction,
            "predicted_index": predicted_index,
            "confidence": confidence,
            "real_probability": real_probability,
            "fake_probability": fake_probability,
            "model": "EfficientNet-B0",
            "artifact_dir": str(self.artifact_dir),
            "timestamp": datetime.now().isoformat(),
            "important_note": (
                "MVP v1 model is trained primarily on Imagenette real images "
                "and Stable Diffusion v1.5 fake images. "
                "MVP v2 should expand to StyleGAN, DALL-E, Midjourney and other generators."
            )
        }

        return result


# ============================================================
# 3. Load detector
# ============================================================

def load_detector(
    artifact_dir: Optional[str | Path] = None,
    device: Optional[str] = None
) -> SingularityImageDetector:
    """
    Loads the local EfficientNet-B0 fake-image detector.

    Args:
        artifact_dir:
            Optional path to local artifact folder.
            Default:
                backend/ml_artifacts/efficientnet_b0_mvp

        device:
            Optional device string:
                "cpu" or "cuda".
            If None, auto-detects CUDA.

    Returns:
        SingularityImageDetector instance.
    """
    if artifact_dir is None:
        artifact_dir = get_default_artifact_dir()
    else:
        artifact_dir = Path(artifact_dir)

    artifact_dir = Path(artifact_dir)

    model_path = artifact_dir / "model.pth"
    config_path = artifact_dir / "model_config.json"
    class_map_path = artifact_dir / "class_map.json"
    inference_info_path = artifact_dir / "inference_info.json"

    if not artifact_dir.exists():
        raise FileNotFoundError(f"Artifact directory not found: {artifact_dir}")

    if not model_path.exists():
        raise FileNotFoundError(f"Model file not found: {model_path}")

    if not config_path.exists():
        raise FileNotFoundError(f"Model config not found: {config_path}")

    if not class_map_path.exists():
        raise FileNotFoundError(f"Class map not found: {class_map_path}")

    if not inference_info_path.exists():
        raise FileNotFoundError(f"Inference info not found: {inference_info_path}")

    with open(config_path, "r", encoding="utf-8") as file:
        model_config = json.load(file)

    if device is None:
        torch_device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    else:
        torch_device = torch.device(device)

    model = models.efficientnet_b0(weights=None)

    in_features = model.classifier[1].in_features
    model.classifier[1] = nn.Linear(
        in_features,
        int(model_config["num_classes"])
    )

    state_dict = torch.load(model_path, map_location=torch_device)
    model.load_state_dict(state_dict)

    model = model.to(torch_device)
    model.eval()

    detector = SingularityImageDetector(
        model=model,
        model_config=model_config,
        artifact_dir=artifact_dir,
        device=torch_device
    )

    return detector


# ============================================================
# 4. Basic prediction
# ============================================================

def predict_image(
    detector: SingularityImageDetector,
    image_path: str | Path
) -> Dict[str, Any]:
    """
    Predicts whether an image is real or fake.

    Args:
        detector:
            Loaded SingularityImageDetector.

        image_path:
            Local image path.

    Returns:
        JSON-serializable prediction result.
    """
    image_path = Path(image_path)

    original_image, image_tensor = detector.prepare_image(image_path)
    result = detector.predict_tensor(image_tensor)

    result["input_image"] = str(image_path)
    result["image_width"] = original_image.size[0]
    result["image_height"] = original_image.size[1]

    return result


# ============================================================
# 5. Grad-CAM
# ============================================================

class GradCAM:
    """
    Grad-CAM helper for EfficientNet-B0.

    Important:
        Red/yellow regions indicate high contribution to the predicted class.
        Red/yellow does not automatically mean "fake area".
    """

    def __init__(self, model: torch.nn.Module, target_layer: torch.nn.Module):
        self.model = model
        self.target_layer = target_layer

        self.activations = None
        self.gradients = None

        self.forward_handle = self.target_layer.register_forward_hook(
            self._save_activation
        )

        self.backward_handle = self.target_layer.register_full_backward_hook(
            self._save_gradient
        )

    def _save_activation(self, module, input_tensor, output_tensor):
        self.activations = output_tensor.detach()

    def _save_gradient(self, module, grad_input, grad_output):
        self.gradients = grad_output[0].detach()

    def generate(self, input_tensor: torch.Tensor, class_idx: int) -> np.ndarray:
        """
        Generates normalized Grad-CAM heatmap.

        Args:
            input_tensor:
                Preprocessed image tensor.

            class_idx:
                Target class index.

        Returns:
            2D normalized heatmap array.
        """
        self.model.zero_grad()

        output = self.model(input_tensor)
        score = output[:, class_idx].sum()

        score.backward()

        if self.activations is None or self.gradients is None:
            raise RuntimeError("Grad-CAM failed to capture activations or gradients.")

        gradients = self.gradients
        activations = self.activations

        weights = gradients.mean(dim=(2, 3), keepdim=True)
        cam = (weights * activations).sum(dim=1, keepdim=True)

        cam = F.relu(cam)
        cam = cam.squeeze().detach().cpu().numpy()

        cam_min = float(cam.min())
        cam_max = float(cam.max())

        if cam_max - cam_min < 1e-8:
            cam = np.zeros_like(cam)
        else:
            cam = (cam - cam_min) / (cam_max - cam_min)

        return cam

    def close(self):
        self.forward_handle.remove()
        self.backward_handle.remove()


# ============================================================
# 6. Prediction with Grad-CAM
# ============================================================

def predict_image_with_gradcam(
    detector: SingularityImageDetector,
    image_path: str | Path,
    output_dir: str | Path,
    alpha: float = 0.40
) -> Dict[str, Any]:
    """
    Predicts real/fake and generates Grad-CAM heatmap.

    Args:
        detector:
            Loaded detector.

        image_path:
            Local image path.

        output_dir:
            Folder where original, Grad-CAM, and metadata are saved.

        alpha:
            Heatmap overlay strength.

    Returns:
        JSON-serializable result containing prediction and XAI file paths.
    """
    if cv2 is None:
        raise ImportError(
            "opencv-python is required for Grad-CAM. "
            "Install it with: pip install opencv-python"
        )

    image_path = Path(image_path)
    output_dir = Path(output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    original_image, image_tensor = detector.prepare_image(image_path)

    prediction_result = detector.predict_tensor(image_tensor)
    predicted_index = int(prediction_result["predicted_index"])

    gradcam = GradCAM(
        model=detector.model,
        target_layer=detector.model.features[-1]
    )

    cam = gradcam.generate(image_tensor, predicted_index)
    gradcam.close()

    original_np = np.array(original_image)

    cam_resized = cv2.resize(
        cam,
        (original_image.size[0], original_image.size[1])
    )

    heatmap_bgr = cv2.applyColorMap(
        np.uint8(255 * cam_resized),
        cv2.COLORMAP_JET
    )

    heatmap_rgb = cv2.cvtColor(
        heatmap_bgr,
        cv2.COLOR_BGR2RGB
    )

    overlay_np = cv2.addWeighted(
        original_np,
        1.0 - alpha,
        heatmap_rgb,
        alpha,
        0
    )

    unique_id = uuid.uuid4().hex[:12]

    original_output_path = output_dir / f"original_{unique_id}.png"
    gradcam_output_path = output_dir / f"gradcam_{unique_id}.png"
    metadata_output_path = output_dir / f"metadata_{unique_id}.json"

    original_image.save(original_output_path)
    Image.fromarray(overlay_np).save(gradcam_output_path)

    result = {
        **prediction_result,
        "input_image": str(image_path),
        "image_width": original_image.size[0],
        "image_height": original_image.size[1],
        "xai": {
            "method": "Grad-CAM",
            "target_class": prediction_result["prediction"],
            "original_image_path": str(original_output_path),
            "gradcam_image_path": str(gradcam_output_path),
            "metadata_path": str(metadata_output_path),
            "interpretation_note": (
                "Grad-CAM highlights image regions that contributed to the predicted class. "
                "Red/yellow indicates stronger relative contribution. "
                "Red/yellow does not necessarily mean fake artifacts."
            )
        }
    }

    with open(metadata_output_path, "w", encoding="utf-8") as file:
        json.dump(result, file, indent=2)

    return result


# ============================================================
# 7. Direct test helper
# ============================================================

def run_local_test(image_path: str | Path) -> Dict[str, Any]:
    """
    Quick local test function.

    Args:
        image_path:
            Local image path.

    Returns:
        Prediction with Grad-CAM result.
    """
    detector = load_detector()

    output_dir = get_project_root() / "backend_outputs" / "xai"

    result = predict_image_with_gradcam(
        detector=detector,
        image_path=image_path,
        output_dir=output_dir
    )

    return result


# ============================================================
# 8. CLI usage
# ============================================================

if __name__ == "__main__":
    import sys

    if len(sys.argv) < 2:
        print("Usage:")
        print("  python backend/model_inference.py path/to/image.jpg")
        raise SystemExit(0)

    test_image_path = Path(sys.argv[1])

    detector_instance = load_detector()

    output_folder = get_project_root() / "backend_outputs" / "xai"

    inference_result = predict_image_with_gradcam(
        detector=detector_instance,
        image_path=test_image_path,
        output_dir=output_folder
    )

    print(json.dumps(inference_result, indent=2))
#Finish