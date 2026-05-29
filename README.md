\*\*\* End Patch
│ │ ├── RecommendationBox.tsx
│ │ └── DownloadReportButton.tsx
│ └── public/
│
└── storage/
├── uploads/
└── xai/

````

---

## Backend Setup

Navigate to the backend folder:

```bash
cd backend
````

Create and activate a virtual environment.

### Windows PowerShell

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

### macOS/Linux

```bash
python3 -m venv venv
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

If `requirements.txt` does not exist yet, create it with:

```txt
fastapi
uvicorn
python-multipart
torch
torchvision
numpy
pillow
opencv-python-headless
```

Run the backend:

```bash
uvicorn api:app --reload --host 127.0.0.1 --port 8000
```

Backend URL:

```text
http://127.0.0.1:8000
```

Health check:

```text
http://127.0.0.1:8000/health
```

API docs:

```text
http://127.0.0.1:8000/docs
```

---

## Frontend Setup

Navigate to the frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create a local environment file:

```text
.env.local
```

Add:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/predict
```

Run the frontend:

```bash
npm run dev
```

Frontend URL:

```text
http://localhost:3000
```

---

## API Overview

### Health Check

```http
GET /health
```

Example response:

```json
{
  "status": "ok",
  "detector_loaded": true
}
```

### Prediction Endpoint

```http
POST /predict
Content-Type: multipart/form-data
```

Request field:

```text
file: image file
```

Example response:

```json
{
  "success": true,
  "prediction": "fake",
  "confidence": 0.982,
  "real_probability": 0.018,
  "fake_probability": 0.982,
  "model": "EfficientNet-B0",
  "xai": {
    "method": "Grad-CAM",
    "target_class": "fake",
    "gradcam_url": "/storage/xai/gradcam_example.png",
    "original_url": "/storage/xai/original_example.png"
  }
}
```

---

## Local Testing Workflow

Run backend:

```bash
cd backend
uvicorn api:app --reload --host 127.0.0.1 --port 8000
```

Run frontend:

```bash
cd frontend
npm run dev
```

Open:

```text
http://localhost:3000
```

Test pages:

```text
/
/upload
/history
/docs
```

---

## Deployment Plan

Recommended free deployment stack:

```text
Frontend: Vercel
Backend: Render
```

### Frontend Deployment

Deploy the `frontend/` folder to Vercel.

Set environment variable:

```env
NEXT_PUBLIC_API_URL=https://your-render-backend-url.onrender.com/predict
```

### Backend Deployment

Deploy the `backend/` folder to Render.

Example start command:

```bash
uvicorn api:app --host 0.0.0.0 --port $PORT
```

Render should install dependencies from:

```text
backend/requirements.txt
```

---

## Model Artifact Notice

The trained model file:

```text
backend/ml_artifacts/efficientnet_b0_mvp/model.pth
```

may be large.

Before pushing to GitHub, check file size. If the file is too large, avoid committing it directly.

Recommended options:

- GitHub Releases
- Hugging Face model repository
- Google Drive download link
- Git LFS

The backend expects the model artifact folder to exist at runtime.

---

## Environment Variables

### Frontend

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/predict
```

### Backend

The current local MVP does not require secrets.

Recommended production variables:

```env
ALLOWED_ORIGINS=https://your-frontend-domain.com
MODEL_ARTIFACT_DIR=backend/ml_artifacts/efficientnet_b0_mvp
```

---

## Current Limitations

MVP v1 limitations:

1. **Image-only detection**
   - Video and audio are not supported in MVP v1.

2. **Single-generator fake training**
   - Fake training images are primarily Stable Diffusion v1.5.
   - The model may not generalize well to StyleGAN, DALL·E, Midjourney, or other generators.

3. **Local browser history**
   - Scan history is stored in browser localStorage.
   - It is not synced to a database.

4. **No authentication**
   - The MVP does not include user accounts or API keys.

5. **No rate limiting**
   - Production deployment should add basic abuse protection.

6. **CPU inference**
   - The current deployment path assumes CPU inference.
   - EfficientNet-B0 is lightweight enough for demo-scale use.

---

## Responsible AI Statement

Singularity is designed as an assistive verification tool, not a final authority.

The model output should be interpreted as evidence, not absolute truth. For high-impact or sensitive media, users should verify results through trusted sources and additional forensic review.

The system provides:

- transparent prediction probabilities
- visible confidence scoring
- Grad-CAM explanation heatmaps
- explicit limitation notes

The project does not claim universal deepfake detection capability in MVP v1.

---

## Recommended GitHub Checklist

Before pushing publicly:

- [ ] Remove unused template files.
- [ ] Remove unused mock backend files if no longer needed.
- [ ] Ensure `backend/requirements.txt` exists.
- [ ] Ensure `.env.local` is not committed.
- [ ] Check whether `model.pth` should be committed or hosted separately.
- [ ] Run `npm run build` inside `frontend/`.
- [ ] Run backend import test.
- [ ] Run `/health` endpoint.
- [ ] Test `/predict` from Swagger UI.
- [ ] Test frontend upload flow.
- [ ] Test history page.
- [ ] Test docs page.

---

## Troubleshooting

### Pylance cannot resolve Python imports

Select the backend virtual environment interpreter in VS Code:

```text
D:\singularity\backend\venv\Scripts\python.exe
```

If the interpreter does not appear, use:

```text
Python: Select Interpreter → Enter interpreter path
```

Then install dependencies:

```bash
pip install -r requirements.txt
```

### Backend does not start

Verify dependencies:

```bash
python -c "import torch; import torchvision; import fastapi; import cv2; print('Backend imports OK')"
```

### Frontend cannot connect to backend

Check that the backend is running:

```text
http://127.0.0.1:8000/health
```

Check frontend `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/predict
```

Restart the frontend dev server after editing `.env.local`.

---

## License

This project is intended for hackathon and educational use.

Add a formal `LICENSE` file before public production release.
