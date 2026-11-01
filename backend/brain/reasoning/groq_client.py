import logging

from groq import Groq

from config.settings import settings

logger = logging.getLogger(__name__)


class GroqClient:

    def __init__(self):

        self.model = settings.groq_model

        self._client = None

    @property
    def client(self):

        if self._client is None:

            api_key = settings.groq_api_key

            if not api_key:
                raise RuntimeError(
                    "GROQ_API_KEY is not configured on the backend."
                )

            self._client = Groq(
                api_key=api_key,
                timeout=settings.groq_timeout,
                max_retries=settings.groq_max_retries,
            )

        return self._client

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
