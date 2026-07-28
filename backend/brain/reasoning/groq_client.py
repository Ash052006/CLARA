import os

from dotenv import load_dotenv
from groq import Groq

load_dotenv()


class GroqClient:

    def __init__(self):

        api_key = os.getenv("GROQ_API_KEY")

        if not api_key:
            raise Exception("GROQ_API_KEY not found in .env")

        self.client = Groq(
            api_key=api_key
        )

        self.model = "llama-3.3-70b-versatile"

    def generate(self, prompt):

        response = self.client.chat.completions.create(

            model=self.model,

            messages=[
                {
                    "role": "system",
                    "content":
                    (
                        "You are CLARA, an intelligent AI desktop assistant. "
                        "Answer naturally and accurately."
                    )
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],

            temperature=0.4,

            max_tokens=1024
        )

        return (
            response
            .choices[0]
            .message
            .content
        )