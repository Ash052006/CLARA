"""
Speech Service
Handles Speech-to-Text using Faster-Whisper
"""

import logging
from pathlib import Path

from config.settings import settings

logger = logging.getLogger(__name__)


class SpeechService:
    """
    Wrapper around Faster-Whisper
    """

    def __init__(
        self,
        model_name: str = None,
        device: str = None,
        compute_type: str = None,
    ):
        from faster_whisper import WhisperModel

        model_name = model_name or settings.whisper_model
        device = device or settings.whisper_device
        compute_type = compute_type or settings.whisper_compute_type

        logger.info(
            "loading whisper model model=%s device=%s compute_type=%s",
            model_name,
            device,
            compute_type,
        )

        self.model = WhisperModel(
            model_name,
            device=device,
            compute_type=compute_type,
        )

        logger.info("speech model loaded")

    def transcribe(self, audio_path: str) -> str:
        """
        Convert speech into text.
        """

        audio = Path(audio_path)

        if not audio.exists():
            raise FileNotFoundError(audio_path)

        segments, info = self.model.transcribe(
            str(audio),
            beam_size=5,
            language="en",
            vad_filter=True,
        )

        transcript = []

        for segment in segments:
            transcript.append(segment.text.strip())

        return " ".join(transcript)
