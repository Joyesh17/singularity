# Singularity — AI Image Authenticity Scanner

Lightweight MVP for detecting AI-generated images with explainability (Grad-CAM).

## Repository layout (top-level)

```
backend/                # FastAPI backend (model inference)
frontend/               # Next.js frontend (React + TypeScript)
storage/                # runtime: uploads and xai output
backend/ml_artifacts/   # local model artifacts (not tracked)
```

## Quickstart

Prerequisites:

- Python 3.10+ (for backend)
- Node 18+ (for Next 16 / React 19)

1. Backend

```bash
cd backend
python -m venv venv
# Windows PowerShell
.\venv\Scripts\Activate.ps1
# macOS / Linux
# source venv/bin/activate
pip install -r requirements.txt
uvicorn api:app --reload --host 127.0.0.1 --port 8000
```

Health: http://127.0.0.1:8000/health
Docs: http://127.0.0.1:8000/docs

2. Frontend

```bash
cd frontend
npm install
# create .env.local with NEXT_PUBLIC_API_URL if needed
npm run dev
```

App: http://localhost:3000

## Environment variables

Frontend (.env.local):

```
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/predict
```

Backend (recommended in prod):

```
ALLOWED_ORIGINS=http://localhost:3000
SIMPLE_API_KEYS=key1,key2
RATE_LIMIT=30/minute
MODEL_ARTIFACT_DIR=backend/ml_artifacts/efficientnet_b0_mvp
```

## Model artifacts

Place model files under `backend/ml_artifacts/efficientnet_b0_mvp/` with the expected names:

- `model.pth` (weights)
- `model_config.json`
- `class_map.json`
- `inference_info.json`

These files are large and should not be committed directly. Use one of:

- Git LFS
- GitHub Releases / external hosting (Hugging Face, Google Drive)

To stop tracking a model already committed:

```bash
git rm --cached backend/ml_artifacts/efficientnet_b0_mvp/model.pth
git commit -m "Stop tracking model weights; add to .gitignore"
```

## CI / Deployment recommendations

- Add a minimal GitHub Actions workflow to run lint/tests and a backend import smoke test.
- Use Vercel for `frontend/` and Render/Heroku for `backend/` (or Docker). Example backend command for Render:

```text
uvicorn api:app --host 0.0.0.0 --port $PORT
```

## Checklist before pushing

- [ ] Ensure `.env.local` and other secrets are not committed
- [ ] Remove large model files from git history or use Git LFS
- [ ] Add `README.md` (this file) and `LICENSE` if desired
- [ ] Add basic CI (lint/test)

## Troubleshooting

- If backend imports fail, ensure the correct Python interpreter and dependencies are installed.
- If frontend cannot reach API, confirm `NEXT_PUBLIC_API_URL` and CORS settings in backend.

## License

Add a license file (e.g., MIT) if you intend to publish.

This project is intended for hackathon and educational use.

Add a formal `LICENSE` file before public production release.
