from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.upload import router as upload_router

app = FastAPI(
    title="Singularity API",
    description="AI-powered deepfake detection backend",
    version="0.1.0"
)

# Allow frontend to communicate with backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register upload routes
app.include_router(upload_router, prefix="/api")

@app.get("/")
def root():
    return {
        "name": "Singularity API",
        "status": "running",
        "message": "Backend is working"
    }

@app.get("/api/health")
def health():
    return {
        "status": "healthy"
    }