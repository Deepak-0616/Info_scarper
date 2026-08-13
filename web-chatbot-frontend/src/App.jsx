import React, { useState, useEffect } from 'react';
import LoadingScreen from './components/LoadingScreen';
import Navbar from './components/Navbar';
import ChatWorkspace from './components/ChatWorkspace';
import ChatInputControls from './components/ChatInputControls';
import { checkBackendHealth, sendChatMessage, clearSessionMemory } from './services/api';

export default function App() {
  const [showLoadingScreen, setShowLoadingScreen] = useState(true);
  const [backendStatus, setBackendStatus] = useState({ healthy: false, status: 'checking' });
  const [messages, setMessages] = useState([]);
  const [sessionId, setSessionId] = useState(() => localStorage.getItem('info_scraper_session_id') || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Input states
  const [urlInput, setUrlInput] = useState('');
  const [useWebSearch, setUseWebSearch] = useState(true);

  // Initial Backend Connection check
  useEffect(() => {
    async function verifyBackend() {
      const status = await checkBackendHealth();
      setBackendStatus(status);
    }
    verifyBackend();
    const interval = setInterval(verifyBackend, 15000);
    return () => clearInterval(interval);
  }, []);

  // Save session ID
  useEffect(() => {
    if (sessionId) {
      localStorage.setItem('info_scraper_session_id', sessionId);
    }
  }, [sessionId]);

  // Send Chat Message
  const handleSendMessage = async ({ message, url, useWebSearch: webSearchFlag }) => {
    setIsLoading(true);
    setError(null);

    // Append User Message to Chat State
    const userMsg = {
      role: 'user',
      content: message,
      url: url || null,
      timestamp: new Date().toISOString()
    };

    setMessages((prev) => [...prev, userMsg]);

    try {
      const response = await sendChatMessage({
        message,
        url: url || null,
        session_id: sessionId || null,
        use_web_search: webSearchFlag
      });

      // Update session ID if backend returned one
      if (response.session_id) {
        setSessionId(response.session_id);
      }

      // Append Assistant Response to Chat State
      const assistantMsg = {
        role: 'assistant',
        content: response.answer,
        sources: response.sources || [],
        used_context: response.used_context || 'none',
        timestamp: new Date().toISOString()
      };

      setMessages((prev) => [...prev, assistantMsg]);
      setUrlInput(''); // clear url after submit
    } catch (err) {
      console.error('Chat error:', err);
      setError(err.message || 'Failed to send request to INFO-SCRAPER backend');
    } finally {
      setIsLoading(false);
    }
  };

  // Quick prompt select from empty state
  const handleSelectPrompt = (promptConfig) => {
    if (promptConfig.url) setUrlInput(promptConfig.url);
    if (typeof promptConfig.useWebSearch === 'boolean') setUseWebSearch(promptConfig.useWebSearch);
    handleSendMessage({
      message: promptConfig.message,
      url: promptConfig.url,
      useWebSearch: promptConfig.useWebSearch
    });
  };

  // Start new session
  const handleNewSession = async () => {
    if (sessionId) {
      await clearSessionMemory(sessionId);
    }
    setSessionId('');
    localStorage.removeItem('info_scraper_session_id');
    setMessages([]);
    setError(null);
  };

  return (
    <>
      {/* Loading Page with Title Clash Animation */}
      {showLoadingScreen && (
        <LoadingScreen onComplete={() => setShowLoadingScreen(false)} />
      )}

      {/* Main Chat Bot Application Page */}
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
        <Navbar
          sessionId={sessionId}
          onNewSession={handleNewSession}
        />

        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <ChatWorkspace
            messages={messages}
            isLoading={isLoading}
            error={error}
            onSelectPrompt={handleSelectPrompt}
          />

          <ChatInputControls
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            urlInput={urlInput}
            setUrlInput={setUrlInput}
            useWebSearch={useWebSearch}
            setUseWebSearch={setUseWebSearch}
          />
        </main>
      </div>
    </>
  );
}
