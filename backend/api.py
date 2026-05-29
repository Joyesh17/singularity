from pathlib import Path
from datetime import datetime
import shutil
import uuid
import traceback
from typing import Dict, Any
import os
import logging

from PIL import Image, UnidentifiedImageError
from fastapi import FastAPI, UploadFile, File, HTTPException, Request, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from model_inference import load_detector, predict_image_with_gradcam
try:
    from slowapi import Limiter, _rate_limit_exceeded_handler
    from slowapi.util import get_remote_address
    from slowapi.errors import RateLimitExceeded
    from slowapi.middleware import SlowAPIMiddleware
    _SLOWAPI_AVAILABLE = True
except Exception:
    # If slowapi is not installed, provide a no-op fallback so the API can run
    _SLOWAPI_AVAILABLE = False

    class RateLimitExceeded(Exception):
        pass

    def _rate_limit_exceeded_handler(request, exc):
        raise HTTPException(status_code=429, detail="Rate limit exceeded")

    # Dummy limiter with a `.limit()` decorator that is a no-op
    class _NoOpLimiter:
        def __init__(self, *args, **kwargs):
            pass

        def limit(self, *args, **kwargs):
            def _decorator(func):
                return func

            return _decorator

    def get_remote_address(request):
        # best-effort remote address extraction; return placeholder
        try:
            return request.client.host  # type: ignore
        except Exception:
            return "unknown"

    Limiter = _NoOpLimiter


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

# Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("singularity")


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
# Configure CORS from environment variable `ALLOWED_ORIGINS` (comma-separated),
# falling back to common local dev origins.
allowed_origins_env = os.getenv("ALLOWED_ORIGINS")
if allowed_origins_env:
    allow_origins = [o.strip() for o in allowed_origins_env.split(",") if o.strip()]
else:
    allow_origins = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve storage files so frontend can display Grad-CAM images.
# Example:
#   /storage/xai/gradcam_xxxxx.png
# Serve only the uploads and xai subfolders to avoid exposing unrelated files.
app.mount("/storage/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")
app.mount("/storage/xai", StaticFiles(directory=str(XAI_DIR)), name="xai")


# Security headers middleware
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    # Common security headers for public services behind TLS
    response.headers.setdefault("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload")
    response.headers.setdefault("X-Content-Type-Options", "nosniff")
    response.headers.setdefault("X-Frame-Options", "DENY")
    response.headers.setdefault("Referrer-Policy", "strict-origin-when-cross-origin")
    response.headers.setdefault("Permissions-Policy", "interest-cohort=()")
    return response


# -----------------------------
# Rate limiting & API key
# -----------------------------
# Simple in-memory rate limiter for MVP using slowapi. Configure via env vars:
#   SIMPLE_API_KEYS=key1,key2
#   RATE_LIMIT=30/minute

RATE_LIMIT = os.getenv("RATE_LIMIT", "30/minute")

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Only add the SlowAPI middleware when the package is available.
if _SLOWAPI_AVAILABLE:
    app.add_middleware(SlowAPIMiddleware)
else:
    logger.warning("slowapi not available; rate limiting is disabled. Install 'slowapi' to enable it.")

_api_keys_env = os.getenv("SIMPLE_API_KEYS", "")
ALLOWED_API_KEYS = {k.strip() for k in _api_keys_env.split(",") if k.strip()}



# ============================================================
# 3. Load detector once at startup
# ============================================================

detector = None


@app.on_event("startup")
def startup_event():
    global detector
    logger.info("Loading image detector...")

    # Try to load model artifacts. Allow overriding artifact dir via
    # the `MODEL_ARTIFACT_DIR` environment variable so users can place
    # artifacts anywhere (useful for contributors who keep them outside
    # of the repository).
    try:
        artifact_dir = os.getenv("MODEL_ARTIFACT_DIR")
        detector = load_detector(artifact_dir) if artifact_dir else load_detector()
        logger.info("Detector loaded successfully.")
    except FileNotFoundError as exc:
        # Don't crash the whole app on missing model files — provide a
        # helpful log message and keep the server running so health
        # checks and other static endpoints still work.
        logger.error("Model artifacts not found: %s", exc)
        logger.error(
            "Model artifacts are required to run predictions. Place the files:\\n"
            "  backend/ml_artifacts/efficientnet_b0_mvp/model.pth\\n"
            "  backend/ml_artifacts/efficientnet_b0_mvp/model_config.json\\n"
            "  backend/ml_artifacts/efficientnet_b0_mvp/class_map.json\\n"
            "  backend/ml_artifacts/efficientnet_b0_mvp/inference_info.json\\n"
            "Or set the MODEL_ARTIFACT_DIR environment variable to a valid folder."
        )
        detector = None
    except Exception:
        logger.exception("Failed to load detector; continuing without model.")
        detector = None


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


def verify_image_file(image_path: Path) -> None:
    """
    Ensure the uploaded file is a real, readable image before inference.
    """
    try:
        with Image.open(image_path) as image:
            image.verify()
    except UnidentifiedImageError as error:
        raise HTTPException(
            status_code=400,
            detail="Uploaded file is not a valid image."
        ) from error
    except Exception as error:
        raise HTTPException(
            status_code=400,
            detail="Uploaded image could not be processed."
        ) from error


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


# Maximum upload size (bytes). Default 10 MB, configurable via `MAX_UPLOAD_SIZE_BYTES`.
MAX_UPLOAD_SIZE_BYTES = int(os.getenv("MAX_UPLOAD_SIZE_BYTES", 10 * 1024 * 1024))


@app.post("/predict")
@limiter.limit(RATE_LIMIT)
async def predict(request: Request, file: UploadFile = File(...), x_api_key: str | None = Header(None)):
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

    # API key enforcement (if keys are configured)
    if ALLOWED_API_KEYS:
        if not x_api_key or x_api_key not in ALLOWED_API_KEYS:
            logger.warning("Unauthorized request from %s", request.client.host if request.client else "unknown")
            raise HTTPException(status_code=401, detail="Missing or invalid API key")
    if file.filename is None:
        raise HTTPException(
            status_code=400,
            detail="Uploaded file has no filename."
        )
    # Basic content-type validation
    content_type = (file.content_type or "").lower()
    if not content_type.startswith("image/"):
        raise HTTPException(
            status_code=400,
            detail="Uploaded file is not an image."
        )

    if not is_allowed_image(file.filename):
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type. Allowed: {sorted(ALLOWED_EXTENSIONS)}"
        )

    # Optional: check Content-Length header when available
    content_length = request.headers.get("content-length")
    if content_length:
        try:
            length = int(content_length)
            if length > MAX_UPLOAD_SIZE_BYTES:
                raise HTTPException(
                    status_code=413,
                    detail=f"Uploaded file is too large (>{MAX_UPLOAD_SIZE_BYTES} bytes)."
                )
        except ValueError:
            # ignore malformed header and fall back to on-disk check below
            pass

    filename = safe_filename(file.filename)
    upload_path = UPLOAD_DIR / filename

    try:
        # Stream file to disk
        with open(upload_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        verify_image_file(upload_path)

        # Verify on-disk size as a last resort
        file_size = upload_path.stat().st_size
        if file_size > MAX_UPLOAD_SIZE_BYTES:
            # remove partially written file
            try:
                upload_path.unlink()
            except Exception:
                pass

            raise HTTPException(
                status_code=413,
                detail=f"Uploaded file is too large (>{MAX_UPLOAD_SIZE_BYTES} bytes)."
            )

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

    except HTTPException:
        # Re-raise known HTTP exceptions
        if upload_path.exists():
            try:
                upload_path.unlink()
            except Exception:
                pass
        raise

    except Exception as error:
        logger.exception("Prediction failed")

        if upload_path.exists():
            try:
                upload_path.unlink()
            except Exception:
                pass

        raise HTTPException(
            status_code=500,
            detail={
                "message": "Prediction failed.",
                "error": str(error)
            }
        )

    finally:
        await file.close()