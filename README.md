# 🧠 Info-Scraper — Web-Link AI Chatbot

Paste a link, ask a question, get an answer grounded in that page. No link? It
searches the web. Nothing works? It falls back to the model's own knowledge.
Conversations remember context, so follow-up questions just work.

Built with **FastAPI** (Python) on the backend and **React 19 + Vite** on the
frontend, powered by **Groq** (LLM) and **Tavily** (web extract + search).

---

## ✨ Features

- **Answer from a URL** — extracts a page's readable content and answers from it.
- **Answer from the web** — no URL? runs a live web search for context.
- **Graceful fallback** — Tavily → direct HTTP scraper → pure LLM knowledge, so it never just dies.
- **Per-session memory** — multi-turn conversations with follow-up questions.
- **Cited sources** — responses come back with the source URLs they used.
- **Live backend status** — the UI polls health and shows online/offline.

---

## 🏗️ Architecture

```
┌────────────────────┐        POST /chat        ┌────────────────────────┐
│  React + Vite UI   │ ───────────────────────▶ │   FastAPI Backend      │
│  (localhost:5173)  │ ◀─────────────────────── │   (localhost:8000)     │
└────────────────────┘   { answer, sources }    └───────────┬────────────┘
                                                            │
                                        ┌───────────────────┼───────────────────┐
                                        ▼                                       ▼
                                 ┌─────────────┐                        ┌──────────────┐
                                 │   Tavily    │  extract / search      │     Groq     │
                                 │  (context)  │                        │   (the LLM)  │
                                 └─────────────┘                        └──────────────┘
```

**Request flow:** UI → `POST /chat` → `chat_service` gathers context (URL or
web search) → builds `system + history + question` → `groq_service` calls the
model → returns `{ answer, sources, used_context }`.

---

## 📁 Project Structure

```
AI Model/
├── web-chatbot-backend/
│   ├── app/
│   │   ├── main.py            # FastAPI routes + error mapping
│   │   ├── config.py          # Env-based settings (pydantic-settings)
│   │   ├── models.py          # Request/response schemas
│   │   └── services/
│   │       ├── chat_service.py    # Orchestration + session memory
│   │       ├── groq_service.py    # Groq LLM integration
│   │       └── tavily_service.py  # Web extract/search + scraper fallback
│   ├── requirements.txt
│   └── .env.example
│
└── web-chatbot-frontend/
    ├── src/
    │   ├── App.jsx            # App state, session persistence
    │   ├── services/api.js    # Backend client
    │   └── components/        # Navbar, ChatWorkspace, input controls, etc.
    ├── package.json
    └── vite.config.js
```

---

## 🚀 Getting Started

### 1. Backend

```bash
cd web-chatbot-backend
python -m venv .venv
# Windows:  .venv\Scripts\activate
# macOS/Linux:  source .venv/bin/activate
pip install -r requirements.txt

cp .env.example .env          # then fill in your keys
uvicorn app.main:app --reload
```

Interactive API docs: **http://127.0.0.1:8000/docs**

### 2. Frontend

```bash
cd web-chatbot-frontend
npm install
npm run dev
```

App runs at **http://localhost:5173** (default Vite port).

---

## 🔑 Environment Variables

Set these in `web-chatbot-backend/.env`:

| Variable            | Required | Default                | Description                          |
| ------------------- | -------- | ---------------------- | ------------------------------------ |
| `GROQ_API_KEY`      | ✅       | —                      | Your Groq API key.                   |
| `TAVILY_API_KEY`    | ✅       | —                      | Your Tavily API key.                 |
| `GROQ_MODEL`        | ❌       | `openai/gpt-oss-120b`  | Which Groq model to use.             |
| `MAX_HISTORY_TURNS` | ❌       | `8`                    | Turns of memory kept per session.    |
| `CORS_ORIGINS`      | ❌       | `*`                    | Comma-separated allowed origins.     |

> ⚠️ **Never commit `.env`.** If keys were ever shared in plaintext, rotate them
> in the Groq and Tavily dashboards.

---

## 📡 API Reference

### `POST /chat`

**Request**

```json
{
  "message": "What is this article about?",
  "url": "https://example.com/some-article",
  "session_id": null,
  "use_web_search": true
}
```

| Field            | Type    | Notes                                                        |
| ---------------- | ------- | ------------------------------------------------------------ |
| `message`        | string  | Required. Your question.                                     |
| `url`            | string? | Optional. If given, the page is extracted and used.          |
| `session_id`     | string? | Omit on first call; reuse the returned id to keep memory.    |
| `use_web_search` | bool    | Default `true`. Used only when no `url` is given.            |

**Response**

```json
{
  "session_id": "…",
  "answer": "…",
  "sources": [{ "title": "…", "url": "…" }],
  "used_context": "url"
}
```

`used_context` is one of `url`, `web_search`, or `none`.

### Other endpoints

| Method | Path                    | Description                          |
| ------ | ----------------------- | ------------------------------------ |
| `GET`  | `/`                     | Status + active model.               |
| `GET`  | `/health`               | Health check.                        |
| `DELETE` | `/session/{id}`       | Forget a session's conversation.     |

---

## 🧩 How It Works (under the hood)

- **Context priority:** a supplied `url` wins; otherwise an optional web search;
  otherwise no context and the model answers from general knowledge.
- **Resilience in 3 tiers:** Tavily API → hand-rolled HTTP scraper
  (`direct_fetch_url`) → pure LLM. Auth or network failures degrade instead of
  erroring.
- **Context budget:** injected page text is capped (~12k chars) to stay within
  model limits.
- **Bounded memory:** only the last `MAX_HISTORY_TURNS` turns are kept; the raw
  question is stored, not the bulky context.

---

## ⚙️ Tech Stack

**Backend:** FastAPI · Uvicorn · httpx · Pydantic · pydantic-settings
**Frontend:** React 19 · Vite · react-markdown · lucide-react · canvas-confetti
**External:** Groq (LLM) · Tavily (web extract + search)

---

## 🛣️ Known Limitations & Roadmap

- Sessions live in process memory — they reset on restart and don't scale
  horizontally. → Swap for **Redis/DB**.
- HTML scraping is regex-based and fragile. → Move to **BeautifulSoup**.
- `CORS` defaults to `*`. → Lock down for production.
- No streaming responses yet. → Add **server-sent events** for token streaming.

---

## 📄 License

MIT — do what you like, no warranty.
