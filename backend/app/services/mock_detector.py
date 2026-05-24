import random
from datetime import datetime
from PIL import Image
from io import BytesIO


def generate_signal(name, min_risk, max_risk, description):
    return {
        "name": name,
        "risk": random.randint(min_risk, max_risk),
        "description": description,
    }


def calculate_authenticity_score(file_size, content_type, image_info):
    score = 100

    # File size analysis
    if file_size < 50 * 1024:
        score -= 18

    elif file_size < 200 * 1024:
        score -= 10

    # Content type weighting
    if "image" in content_type:
        score -= random.randint(5, 15)

    elif "video" in content_type:
        score -= random.randint(10, 20)

    elif "audio" in content_type:
        score -= random.randint(8, 18)

    # Image metadata analysis
    if image_info:
        width = image_info.get("width", 0)
        height = image_info.get("height", 0)

        if width < 256 or height < 256:
            score -= 15

        if width > 3000 or height > 3000:
            score -= 8

    # Controlled randomness
    score -= random.randint(0, 12)

    return max(15, min(score, 98))


def determine_risk_level(score):
    if score >= 75:
        return "Likely Authentic"

    if score >= 45:
        return "Suspicious"

    return "High Risk"


def analyze_image(contents):
    try:
        image = Image.open(BytesIO(contents))

        return {
            "width": image.width,
            "height": image.height,
            "format": image.format,
        }

    except Exception:
        return None


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
        file_size=file_size,
        content_type=content_type,
        image_info=image_info,
    )

    risk_level = determine_risk_level(authenticity_score)

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
        generate_signal(
            "Visual Artifact Detection",
            30,
            90,
            "Scans for synthetic visual inconsistencies.",
        ),
    ]

    if image_info:
        signals.append(
            generate_signal(
                "Image Resolution Analysis",
                15,
                65,
                f"Detected image resolution: {image_info['width']}x{image_info['height']}",
            )
        )

    return {
        "filename": filename,
        "content_type": content_type,
        "file_size_bytes": file_size,
        "authenticity_score": authenticity_score,
        "risk_level": risk_level,
        "signals": signals,
        "model_version": "smart-mock-detector-v0.2",
        "image_info": image_info,
        "created_at": datetime.utcnow().isoformat(),
    }