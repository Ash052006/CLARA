import os
from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

BASE_DIR = Path(__file__).resolve().parent
PROJECT_DIR = BASE_DIR.parent
FRONTEND_DIST = PROJECT_DIR / "frontend" / "dist"

load_dotenv(PROJECT_DIR / ".env")
load_dotenv(BASE_DIR / ".env")

from brain.conversation_manager import ConversationManager
from voice.routes import router as voice_router

app = FastAPI()

cors_origins = [
    origin.strip()
    for origin in os.getenv("CORS_ORIGINS", "").split(",")
    if origin.strip()
]

if cors_origins:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

clara = ConversationManager()

app.include_router(voice_router)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/chat/{message}")
def chat(message: str):
    return clara.process_message(message)


if FRONTEND_DIST.is_dir():
    assets_dir = FRONTEND_DIST / "assets"

    if assets_dir.is_dir():
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    @app.get("/{full_path:path}")
    def serve_frontend(full_path: str):
        requested = (FRONTEND_DIST / full_path).resolve()

        if (
            full_path
            and requested.is_file()
            and FRONTEND_DIST in requested.parents
        ):
            return FileResponse(requested)

        return FileResponse(FRONTEND_DIST / "index.html")
