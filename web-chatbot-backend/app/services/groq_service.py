"""Groq chat completion integration."""
from typing import Any
import httpx

from app.config import settings

GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"
_TIMEOUT = httpx.Timeout(60.0)


async def chat_completion(messages: list[dict[str, Any]], temperature: float = 0.3) -> str:
    """Send messages to Groq and return the assistant's reply text."""
    payload = {
        "model": settings.groq_model,
        "messages": messages,
        "temperature": temperature,
    }
    headers = {
        "Authorization": f"Bearer {settings.groq_api_key}",
        "Content-Type": "application/json",
    }
    try:
        async with httpx.AsyncClient(timeout=_TIMEOUT) as client:
            resp = await client.post(GROQ_URL, json=payload, headers=headers)
            if resp.status_code >= 400:
                raise RuntimeError(f"Groq API error {resp.status_code}: {resp.text}")
            data = resp.json()
    except httpx.ConnectError as e:
        raise RuntimeError("Unable to connect to Groq API (api.groq.com). Check your internet connection, proxy, or VPN.") from e
    except httpx.TimeoutException as e:
        raise RuntimeError("Request to Groq API timed out after 60 seconds.") from e

    return data["choices"][0]["message"]["content"].strip()
