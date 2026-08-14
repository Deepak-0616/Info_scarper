"""Orchestrates the chat: builds context from a URL or web search,
keeps per-session memory, and calls Groq."""
import uuid
from collections import defaultdict

from app.config import settings
from app.models import ChatRequest, ChatResponse, SourceItem
from app.services import tavily_service, groq_service

# In-memory session store: {session_id: [ {role, content}, ... ]}
# NOTE: this lives in process memory and resets on restart. Swap for Redis/DB
# if you need persistence or horizontal scaling.
_SESSIONS: dict[str, list[dict[str, str]]] = defaultdict(list)

SYSTEM_PROMPT = (
    "You are a strict webpage Q&A assistant. Answer the user's question ONLY and "
    "exclusively using the details explicitly provided in the CONTEXT from the webpage. "
    "Do NOT include any external knowledge, outside facts, or assumptions not found in the context. "
    "If the answer cannot be found in the provided context, state clearly: "
    "'The provided webpage does not contain information to answer this question.' "
    "Be concise, direct, and adhere strictly to the provided page text."
)

# Rough char budget for injected context so we stay within model limits.
_MAX_CONTEXT_CHARS = 12000


def _get_history(session_id: str) -> list[dict[str, str]]:
    return _SESSIONS[session_id]


def _trim_history(session_id: str) -> None:
    limit = settings.max_history_turns * 2  # user + assistant per turn
    if len(_SESSIONS[session_id]) > limit:
        _SESSIONS[session_id] = _SESSIONS[session_id][-limit:]


def reset_session(session_id: str) -> bool:
    return _SESSIONS.pop(session_id, None) is not None


async def handle_chat(req: ChatRequest) -> ChatResponse:
    session_id = req.session_id or str(uuid.uuid4())
    history = _get_history(session_id)

    context_text = ""
    sources: list[dict] = []
    used_context = "none"

    # 1) Gather context: prefer an explicit URL, else optional web search.
    if req.url:
        extracted = await tavily_service.extract_url(req.url)
        context_text = extracted["content"]
        sources = extracted["sources"]
        used_context = "url"
    elif req.use_web_search:
        searched = await tavily_service.web_search(req.message)
        context_text = searched["content"]
        sources = searched["sources"]
        used_context = "web_search"

    if context_text:
        context_text = context_text[:_MAX_CONTEXT_CHARS]

    # 2) Build the message list: system + history + current turn (with context).
    messages: list[dict[str, str]] = [{"role": "system", "content": SYSTEM_PROMPT}]
    messages.extend(history)

    if context_text:
        user_content = f"CONTEXT:\n{context_text}\n\n---\n\nQUESTION: {req.message}"
    else:
        user_content = req.message
    messages.append({"role": "user", "content": user_content})

    # 3) Call Groq.
    answer = await groq_service.chat_completion(messages)

    # 4) Persist to session memory (store the raw question, not the bulky context).
    history.append({"role": "user", "content": req.message})
    history.append({"role": "assistant", "content": answer})
    _trim_history(session_id)

    return ChatResponse(
        session_id=session_id,
        answer=answer,
        sources=[SourceItem(**s) for s in sources],
        used_context=used_context,
    )
