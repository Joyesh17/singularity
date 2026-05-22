# Singularity — Backend Context

## Overview

Singularity backend is built using FastAPI.

Purpose:
- file uploads
- media validation
- AI analysis
- authenticity scoring
- report generation

---

# Current Features

✅ Upload API
✅ File validation
✅ File saving
✅ Mock authenticity scoring
✅ Detected signals response

---

# Current API

POST /api/upload

Returns:
- filename
- content_type
- authenticity_score
- risk_level
- signals
- model_version

---

# Current Detection Logic

Current version:
mock-detector-v0.1

This is NOT a real deepfake detector yet.

Purpose:
- build full-stack workflow first
- allow frontend integration
- allow UI development
- allow report system development

---

# Planned Backend Features

Upcoming:
- image metadata analysis
- image dimensions analysis
- file hash generation
- scan history
- JSON report export

Future:
- real AI model integration
- video frame extraction
- audio processing
- Whisper transcript extraction
- OCR support

---

# Hardware Constraints

Developer laptop:
- Intel i5-6300U
- 8 GB RAM
- low disk space

Avoid:
- large local models
- PyTorch-heavy workflows
- large datasets

Prefer:
- lightweight processing
- hosted inference later