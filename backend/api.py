#Start
"""
Singularity Backend API

File location:
    backend/api.py

Purpose:
    FastAPI backend for image fake detection.

Endpoints:
    GET  /
    GET  /health
    POST /predict

Expected local project structure:
    singularity/
    ├── backend/
    │   ├── api.py
    │   ├── model_inference.py
    │   └── ml_artifacts/
    │       └── efficientnet_b0_mvp/
    │           ├── model.pth
    │           ├── model_config.json
    │           ├── class_map.json
    │           └── inference_info.json
    ├── storage/
    │   ├── uploads/
    │   └── xai/
    └── ...

Run from backend folder:
    uvicorn api:app --reload --host 127.0.0.1 --port 8000

Or run from project root:
    uvicorn backend.api:app --reload --host 127.0.0.1 --port 8000
"""

from pathlib import Path
from datetime import datetime
import shutil
import uuid
import traceback
from typing import Dict, Any

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from model_inference import load_detector, predict_image_with_gradcam


# ============================================================
# 1. Paths
# ============================================================

BACKEND_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = BACKEND_DIR.parent

STORAGE_DIR = PROJECT_ROOT / "storage"
UPLOAD_DIR = STORAGE_DIR / "uploads"
XAI_DIR = STORAGE_DIR / "xai"

UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
XAI_DIR.mkdir(parents=True, exist_ok=True)


# ============================================================
# 2. App setup
# ============================================================

app = FastAPI(
    title="Singularity AI Backend",
    description="Fake image detection API with Grad-CAM explainability",
    version="1.0.0"
)

# Adjust origins later if needed.
# For local development, this allows frontend calls from common dev ports.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
        "*",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve storage files so frontend can display Grad-CAM images.
# Example:
#   /storage/xai/gradcam_xxxxx.png
app.mount(
    "/storage",
    StaticFiles(directory=str(STORAGE_DIR)),
    name="storage"
)


# ============================================================
# 3. Load detector once at startup
# ============================================================

detector = None


@app.on_event("startup")
def startup_event():
    global detector

    print("[Singularity API] Loading image detector...")

    detector = load_detector()

    print("[Singularity API] Detector loaded successfully.")


# ============================================================
# 4. Helpers
# ============================================================

ALLOWED_EXTENSIONS = {
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
    ".bmp"
}


def is_allowed_image(filename: str) -> bool:
    suffix = Path(filename).suffix.lower()
    return suffix in ALLOWED_EXTENSIONS


def safe_filename(original_filename: str) -> str:
    suffix = Path(original_filename).suffix.lower()

    if suffix == "":
        suffix = ".png"

    unique_name = f"{datetime.now().strftime('%Y%m%d_%H%M%S')}_{uuid.uuid4().hex[:12]}{suffix}"

    return unique_name


def convert_local_path_to_url(path_string: str) -> str:
    """
    Convert local file path under storage/ into frontend-accessible URL.

    Example:
        D:/singularity/storage/xai/gradcam_abc.png
    becomes:
        /storage/xai/gradcam_abc.png
    """
    path = Path(path_string).resolve()

    try:
        relative_path = path.relative_to(STORAGE_DIR.resolve())
        return "/storage/" + relative_path.as_posix()
    except Exception:
        return path_string


def simplify_prediction_result(raw_result: Dict[str, Any]) -> Dict[str, Any]:
    """
    Create frontend-friendly response.
    """
    xai = raw_result.get("xai", {})

    gradcam_path = xai.get("gradcam_image_path")
    original_path = xai.get("original_image_path")
    metadata_path = xai.get("metadata_path")

    response = {
        "success": True,
        "prediction": raw_result.get("prediction"),
        "confidence": raw_result.get("confidence"),
        "real_probability": raw_result.get("real_probability"),
        "fake_probability": raw_result.get("fake_probability"),
        "model": raw_result.get("model"),
        "input_image": raw_result.get("input_image"),
        "image_width": raw_result.get("image_width"),
        "image_height": raw_result.get("image_height"),
        "xai": {
            "method": xai.get("method"),
            "target_class": xai.get("target_class"),
            "interpretation_note": xai.get("interpretation_note"),
            "gradcam_path": gradcam_path,
            "original_path": original_path,
            "metadata_path": metadata_path,
            "gradcam_url": convert_local_path_to_url(gradcam_path) if gradcam_path else None,
            "original_url": convert_local_path_to_url(original_path) if original_path else None,
            "metadata_url": convert_local_path_to_url(metadata_path) if metadata_path else None,
        },
        "important_note": raw_result.get("important_note"),
        "timestamp": datetime.now().isoformat(),
    }

    return response


# ============================================================
# 5. Routes
# ============================================================

@app.get("/")
def root():
    return {
        "message": "Singularity AI backend is running",
        "service": "fake-image-detection",
        "model": "EfficientNet-B0",
        "endpoints": {
            "health": "/health",
            "predict": "/predict"
        }
    }


@app.get("/health")
def health():
    return {
        "status": "ok",
        "detector_loaded": detector is not None,
        "storage_dir": str(STORAGE_DIR),
        "upload_dir": str(UPLOAD_DIR),
        "xai_dir": str(XAI_DIR),
        "timestamp": datetime.now().isoformat()
    }


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    """
    Upload an image and receive:
        - real/fake prediction
        - confidence
        - probabilities
        - Grad-CAM image URL
    """
    global detector

    if detector is None:
        raise HTTPException(
            status_code=500,
            detail="Detector is not loaded."
        )

    if file.filename is None:
        raise HTTPException(
            status_code=400,
            detail="Uploaded file has no filename."
        )

    if not is_allowed_image(file.filename):
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type. Allowed: {sorted(ALLOWED_EXTENSIONS)}"
        )

    filename = safe_filename(file.filename)
    upload_path = UPLOAD_DIR / filename

    try:
        with open(upload_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        raw_result = predict_image_with_gradcam(
            detector=detector,
            image_path=upload_path,
            output_dir=XAI_DIR
        )

        response = simplify_prediction_result(raw_result)

        response["uploaded_file"] = {
            "original_filename": file.filename,
            "saved_filename": filename,
            "saved_path": str(upload_path),
            "url": convert_local_path_to_url(str(upload_path))
        }

        return response

    except Exception as error:
        traceback.print_exc()

        raise HTTPException(
            status_code=500,
            detail={
                "message": "Prediction failed.",
                "error": str(error)
            }
        )

    finally:
        await file.close()
#Finish