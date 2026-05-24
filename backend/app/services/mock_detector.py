import random
from datetime import datetime
from io import BytesIO

from PIL import Image


def generate_signal(name, min_risk, max_risk, description):
    return {
        "name": name,
        "risk": random.randint(min_risk, max_risk),
        "description": description,
    }


def determine_risk_level(score):
    if score >= 75:
        return "Likely Authentic"

    if score >= 45:
        return "Suspicious"

    return "High Risk"


def analyze_image(contents):
    try:
        image = Image.open(BytesIO(contents))

        width = image.width
        height = image.height

        aspect_ratio = round(width / height, 2)

        megapixels = round((width * height) / 1_000_000, 2)

        exif_data = image.getexif()

        has_exif = len(exif_data) > 0

        return {
            "width": width,
            "height": height,
            "format": image.format,
            "mode": image.mode,
            "aspect_ratio": aspect_ratio,
            "megapixels": megapixels,
            "has_exif": has_exif,
        }

    except Exception:
        return None


def calculate_authenticity_score(
    filename,
    file_size,
    content_type,
    image_info,
):
    score = 100

    filename_lower = filename.lower()

    suspicious_keywords = [
        "deepfake",
        "ai",
        "generated",
        "fake",
        "synthetic",
    ]

    # Suspicious filename patterns
    if any(keyword in filename_lower for keyword in suspicious_keywords):
        score -= random.randint(10, 20)

    # File size analysis
    if file_size < 50 * 1024:
        score -= 18

    elif file_size < 200 * 1024:
        score -= 10

    elif file_size > 8 * 1024 * 1024:
        score -= 5

    # Media type weighting
    if "image" in content_type:
        score -= random.randint(5, 12)

    elif "video" in content_type:
        score -= random.randint(10, 18)

    elif "audio" in content_type:
        score -= random.randint(8, 16)

    # Image forensic analysis
    if image_info:
        width = image_info["width"]
        height = image_info["height"]

        megapixels = image_info["megapixels"]

        has_exif = image_info["has_exif"]

        # Extremely low resolution
        if width < 256 or height < 256:
            score -= 20

        # Unusually large image
        if width > 5000 or height > 5000:
            score -= 10

        # Low megapixel suspicious
        if megapixels < 0.3:
            score -= 12

        # Missing EXIF metadata
        if not has_exif:
            score -= 8

    # Controlled randomness
    score -= random.randint(0, 10)

    return max(12, min(score, 98))


def generate_signals(image_info, content_type):
    signals = [
        generate_signal(
            "Metadata Consistency",
            20,
            75,
            "Analyzes file metadata integrity and consistency.",
        ),
        generate_signal(
            "Compression Analysis",
            25,
            80,
            "Detects unusual compression and encoding artifacts.",
        ),
    ]

    if "image" in content_type:
        signals.append(
            generate_signal(
                "Visual Artifact Detection",
                35,
                90,
                "Scans for synthetic visual inconsistencies and AI-generated artifacts.",
            )
        )

    if "video" in content_type:
        signals.append(
            generate_signal(
                "Frame Sequence Analysis",
                30,
                85,
                "Analyzes temporal consistency across extracted video patterns.",
            )
        )

    if "audio" in content_type:
        signals.append(
            generate_signal(
                "Voice Synthesis Detection",
                25,
                88,
                "Detects possible synthetic speech generation characteristics.",
            )
        )

    if image_info:
        signals.append(
            generate_signal(
                "Image Resolution Analysis",
                15,
                60,
                f"Detected resolution: {image_info['width']}x{image_info['height']}",
            )
        )

        signals.append(
            generate_signal(
                "Aspect Ratio Verification",
                10,
                55,
                f"Aspect ratio detected: {image_info['aspect_ratio']}",
            )
        )

        exif_description = (
            "EXIF metadata detected."
            if image_info["has_exif"]
            else "No EXIF metadata detected."
        )

        signals.append(
            generate_signal(
                "Metadata Presence Check",
                15,
                70,
                exif_description,
            )
        )

    return signals


def analyze_media(
    filename,
    content_type,
    file_size,
    contents,
):
    image_info = None

    if "image" in content_type:
        image_info = analyze_image(contents)

    authenticity_score = calculate_authenticity_score(
        filename=filename,
        file_size=file_size,
        content_type=content_type,
        image_info=image_info,
    )

    risk_level = determine_risk_level(authenticity_score)

    signals = generate_signals(
        image_info=image_info,
        content_type=content_type,
    )

    media_category = "Unknown"

    if "image" in content_type:
        media_category = "Image"

    elif "video" in content_type:
        media_category = "Video"

    elif "audio" in content_type:
        media_category = "Audio"

    return {
        "filename": filename,
        "content_type": content_type,
        "media_category": media_category,
        "file_size_bytes": file_size,
        "authenticity_score": authenticity_score,
        "risk_level": risk_level,
        "signals": signals,
        "model_version": "smart-mock-detector-v0.3",
        "image_info": image_info,
        "created_at": datetime.utcnow().isoformat(),
    }