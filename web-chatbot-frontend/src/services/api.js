/**
 * API Service for INFO-SCRAPER FastAPI backend.
 */

const API_BASE_URL = 'http://127.0.0.1:8000';

export async function checkBackendHealth() {
  try {
    const res = await fetch(`${API_BASE_URL}/health`, { method: 'GET' });
    if (!res.ok) return { healthy: false };
    
    // Also fetch root for model info
    const rootRes = await fetch(`${API_BASE_URL}/`, { method: 'GET' });
    const rootData = rootRes.ok ? await rootRes.json() : {};
    
    return {
      healthy: true,
      model: rootData.model || 'llama-3.3-70b-versatile',
      status: 'online'
    };
  } catch (err) {
    return { healthy: false, error: err.message, status: 'offline' };
  }
}

export async function sendChatMessage({ message, url = null, session_id = null, use_web_search = true }) {
  const payload = {
    message: message.trim(),
    url: url && url.trim() !== '' ? url.trim() : null,
    session_id: session_id || null,
    use_web_search: Boolean(use_web_search)
  };

  const response = await fetch(`${API_BASE_URL}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const detailMsg = errorData.detail || `Server returned HTTP ${response.status}`;
    throw new Error(detailMsg);
  }

  return await response.json();
}

export async function clearSessionMemory(sessionId) {
  if (!sessionId) return false;
  try {
    const res = await fetch(`${API_BASE_URL}/session/${sessionId}`, {
      method: 'DELETE'
    });
    return res.ok;
  } catch (err) {
    console.error('Error clearing session memory:', err);
    return false;
  }
}
