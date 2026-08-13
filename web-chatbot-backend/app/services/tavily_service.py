"""Tavily integration with direct HTTP web scraping fallback."""
from typing import Any
import re
import httpx

from app.config import settings

TAVILY_BASE = "https://api.tavily.com"
_TIMEOUT = httpx.Timeout(30.0)

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/120.0.0.0 Safari/537.36"
    )
}


async def direct_fetch_url(url: str) -> dict[str, Any]:
    """Fallback web scraper: fetch URL directly using HTTP and extract plain text."""
    async with httpx.AsyncClient(timeout=_TIMEOUT, follow_redirects=True, headers=HEADERS) as client:
        resp = await client.get(url)
        resp.raise_for_status()
        html = resp.text

    # Extract title
    title_match = re.search(r"<title[^>]*>(.*?)</title>", html, re.IGNORECASE | re.DOTALL)
    title = title_match.group(1).strip() if title_match else url

    # Clean HTML script, style, comments
    cleaned = re.sub(r"<(script|style|svg|header|footer|nav)[^>]*>.*?</\1>", "", html, flags=re.IGNORECASE | re.DOTALL)
    text = re.sub(r"<[^>]+>", " ", cleaned)
    text = re.sub(r"\s+", " ", text).strip()

    if not text:
        raise ValueError(f"Could not extract readable text content from URL: {url}")

    return {
        "content": text[:15000],
        "sources": [{"title": title, "url": url}]
    }


async def extract_url(url: str) -> dict[str, Any]:
    """Extract readable content of a web page using Tavily, falling back to direct HTTP scraping."""
    # Check if Tavily API key is valid or placeholder
    if settings.tavily_api_key and settings.tavily_api_key != "tvly-placeholder":
        try:
            payload = {"api_key": settings.tavily_api_key, "urls": [url]}
            async with httpx.AsyncClient(timeout=_TIMEOUT) as client:
                resp = await client.post(f"{TAVILY_BASE}/extract", json=payload)
                if resp.status_code == 200:
                    data = resp.json()
                    results = data.get("results", [])
                    if results:
                        content = "\n\n".join(r.get("raw_content", "") for r in results if r.get("raw_content"))
                        sources = [{"title": None, "url": r.get("url", url)} for r in results]
                        return {"content": content.strip(), "sources": sources}
        except Exception as e:
            print(f"[Warning] Tavily extraction failed ({e}). Falling back to direct HTTP scraper.")

    # Fall back to direct HTTP scraping
    return await direct_fetch_url(url)


async def web_search(query: str, max_results: int = 5) -> dict[str, Any]:
    """Search the web via Tavily, returning empty results on auth error to allow LLM fallback."""
    if not settings.tavily_api_key or settings.tavily_api_key == "tvly-placeholder":
        print("[Warning] Tavily API key missing or placeholder. Skipping live web search.")
        return {"content": "", "sources": []}

    try:
        payload = {
            "api_key": settings.tavily_api_key,
            "query": query,
            "search_depth": "advanced",
            "max_results": max_results,
            "include_answer": True,
        }
        async with httpx.AsyncClient(timeout=_TIMEOUT) as client:
            resp = await client.post(f"{TAVILY_BASE}/search", json=payload)
            if resp.status_code >= 400:
                print(f"[Warning] Tavily search API returned HTTP {resp.status_code}. Falling back to LLM knowledge.")
                return {"content": "", "sources": []}
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
    except Exception as e:
        print(f"[Warning] Web search failed ({e}). Falling back to direct LLM response.")
        return {"content": "", "sources": []}

