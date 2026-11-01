import logging
import os
import shutil
import tempfile
import threading
import traceback

from fastapi import APIRouter, Depends, UploadFile, File, HTTPException

from auth.dependencies import require_auth
from config.settings import settings
from runtime import get_conversation_manager

router = APIRouter(
    prefix="/voice",
    tags=["Voice"],
    dependencies=[Depends(require_auth)],
)

logger = logging.getLogger(__name__)

_speech = None
_speech_lock = threading.Lock()


def get_speech():
    """Load the Whisper model on first use, not at import time."""

    global _speech

    if not settings.voice_enabled:
        raise HTTPException(
            status_code=503,
            detail="Voice transcription is disabled on this deployment.",
        )

    if _speech is None:
        with _speech_lock:
            if _speech is None:
                from voice.speech_service import SpeechService

                _speech = SpeechService()

    return _speech


@router.post("/chat")
async def voice_chat(audio: UploadFile = File(...)):

    if audio.filename is None:
        raise HTTPException(400, "No file uploaded")

    suffix = os.path.splitext(audio.filename)[1]

    with tempfile.NamedTemporaryFile(
        delete=False,
        suffix=suffix
    ) as temp:

        shutil.copyfileobj(audio.file, temp)

        temp_path = temp.name

    try:

        transcript = get_speech().transcribe(temp_path)

        logger.info("voice transcript received")

        clara_response = get_conversation_manager().process_message(transcript)

        return {
            "success": True,
            "transcript": transcript,
            "response": clara_response
        }

    except HTTPException:
        raise

    except Exception as e:
        traceback.print_exc()

        logger.exception("voice chat failed")

        detail = "Internal server error" if settings.is_production else str(e)

        raise HTTPException(
            status_code=500,
            detail=detail
        )

    finally:

        if os.path.exists(temp_path):
            os.remove(temp_path)
