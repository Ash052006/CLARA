from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from brain.conversation_manager import ConversationManager
from voice.routes import router as voice_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

clara = ConversationManager()

app.include_router(voice_router)


@app.get("/")
def home():
    return {"message": "CLARA is alive"}


@app.get("/chat/{message}")
def chat(message: str):
    return clara.process_message(message)