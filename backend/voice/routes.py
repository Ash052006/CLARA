import os
import shutil
import tempfile
import traceback

from fastapi import APIRouter, UploadFile, File, HTTPException

from brain.conversation_manager import ConversationManager
from voice.speech_service import SpeechService

router = APIRouter(prefix="/voice", tags=["Voice"])

speech = SpeechService()
clara = ConversationManager()


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

        transcript = speech.transcribe(temp_path)
        print("\n" + "=" * 80)
        print("VOICE TRANSCRIPT")
        print(repr(transcript))
        print("=" * 80)

        clara_response = clara.process_message(transcript)

        return {
            "success": True,
            "transcript": transcript,
            "response": clara_response
        }

    

    except Exception as e:
        traceback.print_exc()

        print("=" * 80)
        print("VOICE CHAT ERROR")
        print("Type :", type(e).__name__)
        print("Error:", repr(e))
        print("=" * 80)

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

    finally:

        if os.path.exists(temp_path):
            os.remove(temp_path)