"""
Speech Service
Handles Speech-to-Text using Faster-Whisper
"""

import os
from pathlib import Path


class SpeechService:
    """
    Wrapper around Faster-Whisper
    """

    def __init__(
        self,
        model_name: str = None,
        device: str = "cpu",
        compute_type: str = "int8",
    ):
        self.model_name = (
            model_name
            or os.getenv("CLARA_WHISPER_MODEL", "base")
        )
        self.device = device
        self.compute_type = compute_type
        self.model = None

    def _load_model(self):
        if self.model is not None:
            return self.model

        from faster_whisper import WhisperModel

        print("Loading Faster Whisper model...")

        self.model = WhisperModel(
            self.model_name,
            device=self.device,
            compute_type=self.compute_type,
        )

        print("Speech model loaded.")

        return self.model

    def transcribe(self, audio_path: str) -> str:
        """
        Convert speech into text.
        """

        audio = Path(audio_path)

        if not audio.exists():
            raise FileNotFoundError(audio_path)

        model = self._load_model()

        segments, info = model.transcribe(
            str(audio),
            beam_size=5,
            language="en",
            vad_filter=True,
        )

        transcript = []

        for segment in segments:
            transcript.append(segment.text.strip())

        return " ".join(transcript)
