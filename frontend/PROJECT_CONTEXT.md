# Singularity — Frontend Context

## Project Overview

Singularity is an AI-powered deepfake detection and media verification platform.

Users can upload:
- images
- videos
- audio

The platform analyzes suspicious media and generates:
- Authenticity Score
- Risk Level
- Detected Signals
- Recommendations
- Verification Reports

This project is for AI BuildFest.

---

# Current Stack

Frontend:
- Next.js App Router
- TypeScript
- Tailwind CSS

Backend:
- FastAPI
- Python

Database:
- None yet (planned later)

---

# Current Features Implemented

✅ Landing page
✅ Upload page
✅ Backend API integration
✅ File upload
✅ Authenticity score display
✅ Risk level badge
✅ Detected signals UI
✅ Loading state
✅ Docs page

---

# Current UI Style

Theme:
- Dark cybersecurity aesthetic
- Premium AI dashboard feel
- Cyan accent colors
- Rounded cards
- Glassmorphism/light transparency

---

# Important Rules

- Keep components reusable
- Keep UI modern and clean
- Use Tailwind only
- Do NOT overcomplicate architecture
- Mobile responsive preferred
- Avoid heavy frontend libraries

---

# Hardware Constraints

Developer laptop:
- Intel i5-6300U
- 8 GB RAM
- Low disk space

Avoid:
- heavy local AI models
- huge dependencies
- unnecessary packages

---

# Planned Features

Upcoming:
- Image preview
- Drag & drop upload
- Scan history
- Report export
- Better loading animations
- Video support improvements
- Audio support improvements

Future:
- Real AI model integration
- Heatmaps
- Browser extension
- pgvector similarity search

---

# Important Notes

Current backend uses:
mock-detector-v0.1

The current AI scoring is simulated for MVP/full-stack workflow development.

Real AI inference may later use:
- hosted APIs
- lightweight models
- Hugging Face inference