from brain.reasoning.groq_client import GroqClient
from brain.greetings import greeting_response


class ChatManager:

    def __init__(self):

        self.groq = GroqClient()

    def chat(self, message):

        response = greeting_response(message)
        if response:
            return response

        return self.groq.generate(
            message
        )