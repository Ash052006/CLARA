from brain.reasoning.groq_client import GroqClient


class ChatManager:

    def __init__(self):

        self.groq = GroqClient()

    def chat(self, message):

        return self.groq.generate(
            message
        )