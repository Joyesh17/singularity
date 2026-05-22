import os
import uuid

from fastapi import APIRouter, UploadFile, File, HTTPException

router = APIRouter()

# Allowed file types for MVP
ALLOWED_TYPES = {
    "image/jpeg",
    "image/png",
    "image/webp",
    "video/mp4",
    "audio/mpeg",
    "audio/wav",
}

# Max file size: 25 MB
MAX_FILE_SIZE = 25 * 1024 * 1024

# Upload folder
UPLOAD_DIR = os.path.abspath(
    os.path.join(
        os.path.dirname(__file__),
        "..",
        "..",
        "..",
        "storage",
        "uploads"
    )
)

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):

    # Validate file type
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type: {file.content_type}"
        )

    # Read file
    contents = await file.read()

    # Validate file size
    file_size = len(contents)

    if file_size > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail="File too large. Max size is 25 MB."
        )

    # Create upload folder if missing
    os.makedirs(UPLOAD_DIR, exist_ok=True)

    # Generate safe filename
    extension = os.path.splitext(file.filename)[1]

    safe_filename = f"{uuid.uuid4()}{extension}"

    file_path = os.path.join(UPLOAD_DIR, safe_filename)

    # Save file
    with open(file_path, "wb") as f:
        f.write(contents)

    # Mock authenticity score
    authenticity_score = 72
    risk_level = "Suspicious"

    return {
    "message": "File uploaded successfully",
    "original_filename": file.filename,
    "stored_filename": safe_filename,
    "content_type": file.content_type,
    "file_size_bytes": file_size,
    "authenticity_score": authenticity_score,
    "risk_level": risk_level,
    "model_version": "mock-detector-v0.1",

    "signals": [
        {
            "name": "Metadata Consistency",
            "risk": 34,
            "description": "Minor metadata inconsistencies detected."
        },
        {
            "name": "Compression Analysis",
            "risk": 61,
            "description": "Compression pattern appears unusual."
        },
        {
            "name": "Visual Artifact Detection",
            "risk": 72,
            "description": "Possible AI-generated visual artifacts detected."
        }
    ]
}