import React, { useState } from 'react';
import { Send, Link2, Search, X, Globe, Info } from 'lucide-react';

export default function ChatInputControls({
  onSendMessage,
  isLoading,
  urlInput,
  setUrlInput,
  useWebSearch,
  setUseWebSearch
}) {
  const [message, setMessage] = useState('');
  const [showUrlField, setShowUrlField] = useState(false);

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!message.trim() || isLoading) return;

    onSendMessage({
      message: message.trim(),
      url: urlInput.trim() !== '' ? urlInput.trim() : null,
      useWebSearch
    });

    setMessage('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div style={{
      padding: '16px 24px 24px 24px',
      maxWidth: '900px',
      width: '100%',
      margin: '0 auto'
    }}>
      <div className="glass-panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        
        {/* Top Control Bar: URL Field Toggle & Web Search Switch */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px',
          paddingBottom: '10px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)'
        }}>
          {/* Left: Link & Web Search Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            {/* Toggle Link Input */}
            <button
              type="button"
              onClick={() => setShowUrlField(!showUrlField)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '5px 12px',
                borderRadius: '16px',
                background: showUrlField || urlInput ? 'rgba(255, 45, 85, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                border: `1px solid ${showUrlField || urlInput ? '#ff2d55' : 'rgba(255, 255, 255, 0.1)'}`,
                color: showUrlField || urlInput ? '#ff2d55' : '#cbd5e1',
                fontSize: '0.8rem',
                cursor: 'pointer',
                fontWeight: 600,
                transition: 'all 0.2s ease'
              }}
            >
              <Link2 size={13} />
              <span>{urlInput ? 'URL Attached' : 'Attach Web Link'}</span>
            </button>

            {/* Toggle Web Search */}
            <button
              type="button"
              onClick={() => setUseWebSearch(!useWebSearch)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '5px 12px',
                borderRadius: '16px',
                background: useWebSearch ? 'rgba(255, 30, 66, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                border: `1px solid ${useWebSearch ? '#ff1e42' : 'rgba(255, 255, 255, 0.1)'}`,
                color: useWebSearch ? '#ff1e42' : '#cbd5e1',
                fontSize: '0.8rem',
                cursor: 'pointer',
                fontWeight: 600,
                transition: 'all 0.2s ease'
              }}
            >
              <Search size={13} />
              <span>Web Search: {useWebSearch ? 'ON' : 'OFF'}</span>
            </button>
          </div>

          {/* Right Mode Indicator with Red Info icon */}
          <div style={{ fontSize: '0.75rem', color: '#cbd5e1', fontFamily: 'JetBrains Mono', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Info size={12} color="#ff2d55" />
            <span>Mode: {urlInput ? 'Link Scraper' : useWebSearch ? 'Live Web Search' : 'Direct Model'}</span>
          </div>
        </div>

        {/* Expandable URL Input Field */}
        {(showUrlField || urlInput) && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255, 30, 66, 0.06)',
            border: '1px solid rgba(255, 30, 66, 0.3)',
            padding: '8px 12px',
            borderRadius: '10px'
          }}>
            <Globe size={15} color="#ff2d55" />
            <input
              type="url"
              placeholder="Paste target webpage URL (e.g. https://example.com/article)..."
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                color: '#ffffff',
                outline: 'none',
                fontSize: '0.85rem',
                fontFamily: 'JetBrains Mono'
              }}
            />
            {urlInput && (
              <button
                type="button"
                onClick={() => setUrlInput('')}
                style={{ background: 'none', border: 'none', color: '#ff2d55', cursor: 'pointer' }}
              >
                <X size={14} />
              </button>
            )}
          </div>
        )}

        {/* Text Input Area & Red Submit Button */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
          <textarea
            placeholder="Ask a question, request web summary, or query live web data..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={2}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              color: '#ffffff',
              outline: 'none',
              fontSize: '0.95rem',
              resize: 'none',
              fontFamily: 'var(--font-main)',
              lineHeight: 1.5
            }}
          />

          <button
            type="submit"
            disabled={!message.trim() || isLoading}
            className="btn-primary"
            style={{
              padding: '12px 20px',
              borderRadius: '10px',
              flexShrink: 0
            }}
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
