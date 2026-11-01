"""
Speech Service
Handles Speech-to-Text using Faster-Whisper
"""

from pathlib import Path
from faster_whisper import WhisperModel


class SpeechService:
    """
    Wrapper around Faster-Whisper
    """

    def __init__(
        self,
        model_name: str = "base",
        device: str = "cpu",
        compute_type: str = "int8",
    ):
        print("Loading Faster Whisper model...")

        self.model = WhisperModel(
            model_name,
            device=device,
            compute_type=compute_type,
        )

        print("Speech model loaded.")

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