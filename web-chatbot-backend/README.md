# Web-Link AI Chatbot Backend

A FastAPI backend for a chatbot that answers questions using **Groq** (LLM) and
**Tavily** (web extract + search). Paste a web link and it answers based on that
page; ask without a link and it searches the web. Conversations have per-session
memory for follow-up questions.

## Security note

The included `.env` contains API keys that were shared in plain text. **Rotate
both keys** (regenerate in the Groq and Tavily dashboards) and replace them in
`.env`. Never commit `.env` to git — it is already in `.gitignore`.

## Setup

```bash
cd web-chatbot-backend
python -m venv .venv
# Windows:  .venv\Scripts\activate
# macOS/Linux:  source .venv/bin/activate
pip install -r requirements.txt
```

Copy `.env.example` to `.env` and fill in your keys (an `.env` with the provided
keys is already included):

```bash
cp .env.example .env
```

## Run

```bash
uvicorn app.main:app --reload
```

Open interactive docs at http://127.0.0.1:8000/docs

## API

### `POST /chat`

```json
{
  "message": "What is this article about?",
  "url": "https://example.com/some-article",
  "session_id": null,
  "use_web_search": true
}
```

- `message` (required) — your question.
- `url` (optional) — a web link. If given, the page is extracted and used as context.
- `session_id` (optional) — omit on the first call; reuse the returned id to keep memory.
- `use_web_search` (default `true`) — when no `url` is given, search the web for context.

Response:

```json
{
  "session_id": "3f2c...",
  "answer": "...",
  "sources": [{"title": "...", "url": "https://..."}],
  "used_context": "url"
}
```

`used_context` is `url`, `web_search`, or `none`.

### `DELETE /session/{session_id}`

Clears the stored conversation history for a session.

### `GET /health`

Health check.

## How it works

1. If a `url` is provided, `POST https://api.tavily.com/extract` pulls the page's
   readable content. Otherwise (and if `use_web_search` is on),
   `POST https://api.tavily.com/search` returns web snippets.
2. That context, plus the recent conversation history, is sent to Groq's
   OpenAI-compatible chat completions endpoint.
3. The reply is returned and stored in the in-memory session.

## Configuration (`.env`)

| Variable | Meaning | Default |
|---|---|---|
| `GROQ_API_KEY` | Groq API key | — |
| `TAVILY_API_KEY` | Tavily API key | — |
| `GROQ_MODEL` | Groq chat model | `openai/gpt-oss-120b` |
| `MAX_HISTORY_TURNS` | Turns kept per session | `8` |
| `CORS_ORIGINS` | Allowed origins (`*` or comma list) | `*` |

> Model note: Groq deprecated `llama-3.3-70b-versatile` in mid-2026. This project
> defaults to `openai/gpt-oss-120b`. Check the current list at
> https://console.groq.com/docs/models and set `GROQ_MODEL` accordingly.

## Notes / next steps

- Session memory is in-process and resets on restart. For production, back it
  with Redis or a database.
- Consider adding auth (an API key header) before exposing this publicly.
