"""Tavily integration: extract content from a URL, or search the web."""
from typing import Any
import httpx

from app.config import settings

TAVILY_BASE = "https://api.tavily.com"
_TIMEOUT = httpx.Timeout(30.0)


async def extract_url(url: str) -> dict[str, Any]:
    """Extract the readable content of a web page.

    Returns {"content": str, "sources": [{"title": None, "url": url}]}.
    """
    payload = {"api_key": settings.tavily_api_key, "urls": [url]}
    async with httpx.AsyncClient(timeout=_TIMEOUT) as client:
        resp = await client.post(f"{TAVILY_BASE}/extract", json=payload)
        resp.raise_for_status()
        data = resp.json()

    results = data.get("results", [])
    if not results:
        failed = data.get("failed_results", [])
        reason = failed[0].get("error") if failed else "no content returned"
        raise ValueError(f"Could not extract content from URL: {reason}")

    content = "\n\n".join(r.get("raw_content", "") for r in results if r.get("raw_content"))
    sources = [{"title": None, "url": r.get("url", url)} for r in results]
    return {"content": content.strip(), "sources": sources}


async def web_search(query: str, max_results: int = 5) -> dict[str, Any]:
    """Search the web and return combined snippets plus source list."""
    payload = {
        "api_key": settings.tavily_api_key,
        "query": query,
        "search_depth": "advanced",
        "max_results": max_results,
        "include_answer": True,
    }
    async with httpx.AsyncClient(timeout=_TIMEOUT) as client:
        resp = await client.post(f"{TAVILY_BASE}/search", json=payload)
        resp.raise_for_status()
        data = resp.json()

    results = data.get("results", [])
    parts: list[str] = []
    if data.get("answer"):
        parts.append(f"Summary: {data['answer']}")
    for r in results:
        title = r.get("title", "")
        url = r.get("url", "")
        snippet = r.get("content", "")
        parts.append(f"[{title}]({url})\n{snippet}")

    sources = [{"title": r.get("title"), "url": r.get("url", "")} for r in results]
    return {"content": "\n\n".join(parts).strip(), "sources": sources}
