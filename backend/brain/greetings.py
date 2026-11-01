from typing import Optional


GREETINGS = {
    "hi",
    "hello",
    "hey",
    "hi there",
    "hello there",
    "hey there",
    "good morning",
    "good afternoon",
    "good evening",
}


def greeting_response(message: str) -> Optional[str]:
    text = message.lower().strip().strip(" !.,?")

    if text not in GREETINGS:
        return None

    if text.startswith("good "):
        return f"{text.capitalize()}! How can I help you today?"

    return "Hi! How can I help you today?"
