from voice.speech_service import SpeechService

print("=" * 50)
print("Initializing Speech Service...")
print("=" * 50)

speech = SpeechService()

print("\nModel Loaded Successfully!")

audio_file = "sample.m4a"

print(f"\nTranscribing: {audio_file}")

try:
    text = speech.transcribe(audio_file)

    print("\nTranscript:")
    print("-" * 50)
    print(text)
    print("-" * 50)

except Exception as e:
    print(f"\nError: {e}")