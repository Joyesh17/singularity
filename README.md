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

### First-time backend setup

Run these steps the first time you set up the project on a new PC.

1. Open PowerShell and go to the backend folder:

```powershell
cd backend
```

2. Create a virtual environment:

```powershell
python -m venv venv
```

3. Activate the virtual environment:

```powershell
.\venv\Scripts\Activate.ps1
```

If PowerShell blocks script execution, run this once in an Administrator PowerShell, then try activation again:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

4. Install the backend dependencies:

```powershell
pip install -r requirements.txt
```

5. Make sure the model artifacts exist in this folder:

```text
backend/ml_artifacts/efficientnet_b0_mvp/
```

Required files:

- `model.pth`
- `model_config.json`
- `class_map.json`
- `inference_info.json`

6. Start the backend:

```powershell
.\venv\Scripts\python.exe -m uvicorn api:app --reload --host 127.0.0.1 --port 8000
```

If you run the command from the project root instead of `backend/`, use:

```powershell
.\backend\venv\Scripts\python.exe -m uvicorn backend.api:app --reload --host 127.0.0.1 --port 8000
```

7. Verify it is running:

```text
http://127.0.0.1:8000/health
http://127.0.0.1:8000/docs
```

Quick summary: `venv` creates an isolated Python environment, `Activate.ps1` turns it on, `pip install -r requirements.txt` installs dependencies, and `uvicorn api:app` starts the FastAPI server.

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

Place model files under `backend/ml_artifacts/efficientnet_b0_mvp/` with the expected names (these are intentionally not tracked in git):

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

Troubleshooting: If the backend fails on startup with a message like:

```
FileNotFoundError: Model file not found: backend/ml_artifacts/efficientnet_b0_mvp/model.pth
```

Then either:

- Place the required model files in `backend/ml_artifacts/efficientnet_b0_mvp/`, or
- Set the environment variable `MODEL_ARTIFACT_DIR` to point to a folder that contains the four required files.

Example (PowerShell):

```powershell
$env:MODEL_ARTIFACT_DIR = 'D:\path\to\artifacts\efficientnet_b0_mvp'
.\venv\Scripts\python.exe -m uvicorn api:app --reload --host 127.0.0.1 --port 8000
```

The backend will now start even if the model is missing; requests to `/predict` will return a 500 with a helpful message until the artifacts are available.

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
