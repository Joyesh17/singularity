import os
import uuid

from fastapi import APIRouter, UploadFile, File, HTTPException

from app.services.mock_detector import analyze_media

router = APIRouter()

ALLOWED_TYPES = {
    "image/jpeg",
    "image/png",
    "image/webp",
    "video/mp4",
    "audio/mpeg",
    "audio/wav",
}

MAX_FILE_SIZE = 25 * 1024 * 1024

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
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type: {file.content_type}"
        )

    contents = await file.read()

    file_size = len(contents)

    if file_size > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail="File too large. Max size is 25 MB."
        )

    os.makedirs(UPLOAD_DIR, exist_ok=True)

    extension = os.path.splitext(file.filename)[1]

    safe_filename = f"{uuid.uuid4()}{extension}"

    file_path = os.path.join(UPLOAD_DIR, safe_filename)

    with open(file_path, "wb") as f:
        f.write(contents)

    analysis_result = analyze_media(
        filename=file.filename,
        content_type=file.content_type,
        file_size=file_size,
        contents=contents,
    )

    return {
        "message": "File uploaded successfully",
        "original_filename": file.filename,
        "stored_filename": safe_filename,
        "content_type": file.content_type,
        "file_size_bytes": file_size,
        "authenticity_score": analysis_result["authenticity_score"],
        "risk_level": analysis_result["risk_level"],
        "signals": analysis_result["signals"],
        "model_version": analysis_result["model_version"],
        "image_info": analysis_result["image_info"],
        "created_at": analysis_result["created_at"],
    }