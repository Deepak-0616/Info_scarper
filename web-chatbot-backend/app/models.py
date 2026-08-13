"""Pydantic request/response schemas."""
from typing import Literal, Optional
from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    message: str = Field(..., description="The user's question or message.")
    url: Optional[str] = Field(
        None,
        description="Optional web link. If provided, its content is extracted and used to answer.",
    )
    session_id: Optional[str] = Field(
        None,
        description="Session id for multi-turn memory. Omit to start a new session.",
    )
    use_web_search: bool = Field(
        True,
        description="If no URL is given, search the web for context before answering.",
    )


class SourceItem(BaseModel):
    title: Optional[str] = None
    url: str


class ChatResponse(BaseModel):
    session_id: str
    answer: str
    sources: list[SourceItem] = []
    used_context: Literal["url", "web_search", "none"] = "none"


class Message(BaseModel):
    role: Literal["user", "assistant"]
    content: str
