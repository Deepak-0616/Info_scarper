"""FastAPI entrypoint for the web-link AI chatbot backend."""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.models import ChatRequest, ChatResponse
from app.services import chat_service

app = FastAPI(
    title="Web-Link AI Chatbot Backend",
    description="Paste a web link (or ask anything); the bot answers using Groq + Tavily.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"status": "ok", "model": settings.groq_model, "docs": "/docs"}


@app.get("/health")
async def health():
    return {"status": "healthy"}


@app.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    """Ask a question. Provide `url` to answer from a specific page,
    or leave it out to use web search. Pass a `session_id` for multi-turn memory."""
    if not req.message.strip():
        raise HTTPException(status_code=400, detail="message cannot be empty")
    try:
        return await chat_service.handle_chat(req)
    except ValueError as e:  # e.g. extraction failed
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:  # upstream API errors
        raise HTTPException(status_code=502, detail=f"Upstream error: {e}")


@app.delete("/session/{session_id}")
async def clear_session(session_id: str):
    """Forget the conversation history for a session."""
    existed = chat_service.reset_session(session_id)
    return {"cleared": existed, "session_id": session_id}
