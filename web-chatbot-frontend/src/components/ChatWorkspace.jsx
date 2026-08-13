import React, { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { 
  Info, User, Globe, Link2, Copy, Check, 
  Search, AlertCircle, ArrowUpRight, RefreshCw 
} from 'lucide-react';

export default function ChatWorkspace({
  messages,
  isLoading,
  error,
  onSelectPrompt
}) {
  const messagesEndRef = useRef(null);
  const [copiedIndex, setCopiedIndex] = useState(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleCopyText = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div style={{
      flex: 1,
      overflowY: 'auto',
      padding: '24px 20px',
      maxWidth: '900px',
      width: '100%',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px'
    }}>
      {/* Error Alert */}
      {error && (
        <div style={{
          padding: '14px 20px',
          borderRadius: '12px',
          background: 'rgba(255, 30, 66, 0.12)',
          border: '1px solid rgba(255, 30, 66, 0.4)',
          color: '#ff2d55',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontSize: '0.9rem'
        }}>
          <AlertCircle size={20} />
          <div>
            <strong>Backend Communication Error:</strong> {error}
          </div>
        </div>
      )}

      {/* Normal Clean Empty State Hero Card */}
      {messages.length === 0 && (
        <div style={{
          padding: '40px 30px',
          textAlign: 'center',
          margin: 'auto 0'
        }} className="glass-panel">
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '20px',
            background: 'rgba(255, 30, 66, 0.15)',
            border: '1px solid rgba(255, 30, 66, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px auto',
            color: '#ff2d55'
          }}>
            <Info size={32} />
          </div>

          {/* Normal Title for Chat Bot Page */}
          <h2 style={{ fontSize: '1.85rem', fontWeight: 800, marginBottom: '10px', color: '#ffffff' }}>
            Welcome to <span className="gradient-text-red">INFO-SCRAPER</span>
          </h2>

          <p style={{ color: '#cbd5e1', fontSize: '0.95rem', maxWidth: '540px', margin: '0 auto 32px auto', lineHeight: 1.6 }}>
            An intelligent AI assistant for webpage extraction, live web synthesis via Tavily, and high-speed Groq model reasoning.
          </p>

          {/* 3 Core Capability Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '16px',
            textAlign: 'left'
          }}>
            {/* Card 1 */}
            <div 
              onClick={() => onSelectPrompt({
                message: "Summarize the key points of this webpage:",
                url: "https://news.ycombinator.com",
                useWebSearch: false
              })}
              style={{
                padding: '18px',
                borderRadius: '14px',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 30, 66, 0.2)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#ff2d55';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.background = 'rgba(255, 30, 66, 0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 30, 66, 0.2)';
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ff2d55', fontWeight: 600, marginBottom: '6px' }}>
                <Link2 size={16} /> Link Scraper Mode
              </div>
              <p style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
                Paste any URL to extract page context and query content directly.
              </p>
            </div>

            {/* Card 2 */}
            <div 
              onClick={() => onSelectPrompt({
                message: "What are the latest AI breakthroughs announced this month?",
                url: "",
                useWebSearch: true
              })}
              style={{
                padding: '18px',
                borderRadius: '14px',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 30, 66, 0.2)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#ff2d55';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.background = 'rgba(255, 30, 66, 0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 30, 66, 0.2)';
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ff2d55', fontWeight: 600, marginBottom: '6px' }}>
                <Search size={16} /> Live Web Search
              </div>
              <p style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
                Performs real-time web search with Tavily and cites source links.
              </p>
            </div>

            {/* Card 3 */}
            <div 
              onClick={() => onSelectPrompt({
                message: "Explain the architecture of FastAPI and Groq LLM integration.",
                url: "",
                useWebSearch: false
              })}
              style={{
                padding: '18px',
                borderRadius: '14px',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 30, 66, 0.2)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#ff2d55';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.background = 'rgba(255, 30, 66, 0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 30, 66, 0.2)';
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ff2d55', fontWeight: 600, marginBottom: '6px' }}>
                <Info size={16} /> Direct Groq Chat
              </div>
              <p style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
                High-speed AI reasoning model with per-session multi-turn memory.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Message List */}
      {messages.map((msg, index) => (
        <div
          key={index}
          style={{
            display: 'flex',
            gap: '14px',
            flexDirection: msg.role === 'user' ? 'row-reverse' : 'row'
          }}
        >
          {/* Avatar with Red Info Icon for Assistant */}
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            background: msg.role === 'user'
              ? 'linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%)'
              : 'linear-gradient(135deg, #ff2d55 0%, #ff1e42 100%)',
            color: msg.role === 'user' ? '#050508' : '#ffffff'
          }}>
            {msg.role === 'user' ? <User size={18} /> : <Info size={18} />}
          </div>

          {/* Message Bubble Panel */}
          <div style={{
            maxWidth: '82%',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <div style={{
              padding: '16px 20px',
              borderRadius: msg.role === 'user' ? '18px 4px 18px 18px' : '4px 18px 18px 18px',
              background: msg.role === 'user'
                ? 'rgba(255, 255, 255, 0.08)'
                : 'rgba(18, 18, 26, 0.92)',
              border: msg.role === 'user'
                ? '1px solid rgba(255, 255, 255, 0.2)'
                : '1px solid rgba(255, 30, 66, 0.3)',
              backdropFilter: 'blur(12px)',
              position: 'relative'
            }}>
              {/* Header Meta Info for Assistant */}
              {msg.role === 'assistant' && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '10px',
                  paddingBottom: '8px',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.06)'
                }}>
                  {/* Context Badge with Info Icon */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {msg.used_context === 'url' && (
                      <span style={{
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        padding: '3px 8px',
                        borderRadius: '10px',
                        background: 'rgba(255, 45, 85, 0.15)',
                        color: '#ff2d55',
                        border: '1px solid rgba(255, 45, 85, 0.35)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <Link2 size={12} /> URL CONTEXT
                      </span>
                    )}

                    {msg.used_context === 'web_search' && (
                      <span style={{
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        padding: '3px 8px',
                        borderRadius: '10px',
                        background: 'rgba(255, 30, 66, 0.15)',
                        color: '#ff1e42',
                        border: '1px solid rgba(255, 30, 66, 0.35)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <Search size={12} /> TAVILY WEB SEARCH
                      </span>
                    )}

                    {msg.used_context === 'none' && (
                      <span style={{
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        padding: '3px 8px',
                        borderRadius: '10px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        color: '#ffffff',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <Info size={12} /> DIRECT MODEL
                      </span>
                    )}
                  </div>

                  {/* Copy Button */}
                  <button
                    onClick={() => handleCopyText(msg.content, index)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: copiedIndex === index ? '#ffffff' : '#cbd5e1',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.75rem'
                    }}
                    title="Copy Answer"
                  >
                    {copiedIndex === index ? <Check size={13} color="#ff2d55" /> : <Copy size={13} />}
                    <span>{copiedIndex === index ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              )}

              {/* Message Content */}
              {msg.role === 'user' ? (
                <div style={{ whiteSpace: 'pre-wrap', fontSize: '0.95rem', color: '#ffffff' }}>
                  {msg.url && (
                    <div style={{
                      fontSize: '0.78rem',
                      fontFamily: 'JetBrains Mono',
                      color: '#ff2d55',
                      marginBottom: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <Link2 size={12} /> Target URL: {msg.url}
                    </div>
                  )}
                  {msg.content}
                </div>
              ) : (
                <div className="markdown-body">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              )}
            </div>

            {/* Sources Citation List */}
            {msg.role === 'assistant' && msg.sources && msg.sources.length > 0 && (
              <div style={{
                padding: '10px 14px',
                borderRadius: '12px',
                background: 'rgba(10, 10, 15, 0.7)',
                border: '1px solid rgba(255, 30, 66, 0.2)',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px'
              }}>
                <div style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#cbd5e1',
                  letterSpacing: '0.5px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <Globe size={13} color="#ff2d55" />
                  CITED SOURCES ({msg.sources.length})
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {msg.sources.map((src, sIdx) => {
                    let domain = '';
                    try {
                      domain = new URL(src.url).hostname.replace('www.', '');
                    } catch (e) {
                      domain = src.url;
                    }
                    return (
                      <a
                        key={sIdx}
                        href={src.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          padding: '4px 10px',
                          borderRadius: '8px',
                          background: 'rgba(255, 30, 66, 0.08)',
                          border: '1px solid rgba(255, 30, 66, 0.3)',
                          color: '#ff2d55',
                          fontSize: '0.78rem',
                          textDecoration: 'none',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(255, 30, 66, 0.18)';
                          e.currentTarget.style.borderColor = '#ff2d55';
                          e.currentTarget.style.color = '#ffffff';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'rgba(255, 30, 66, 0.08)';
                          e.currentTarget.style.borderColor = 'rgba(255, 30, 66, 0.3)';
                          e.currentTarget.style.color = '#ff2d55';
                        }}
                      >
                        <span>{src.title || domain}</span>
                        <ArrowUpRight size={12} />
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Typing Loader Indicator */}
      {isLoading && (
        <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(255, 30, 66, 0.15)',
            border: '1px solid rgba(255, 30, 66, 0.4)',
            color: '#ff2d55'
          }}>
            <Info size={18} className="animate-pulse" />
          </div>

          <div style={{
            padding: '12px 18px',
            borderRadius: '4px 18px 18px 18px',
            background: 'rgba(18, 18, 26, 0.95)',
            border: '1px solid rgba(255, 30, 66, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#ff2d55',
            fontSize: '0.88rem',
            fontFamily: 'JetBrains Mono'
          }}>
            <RefreshCw size={14} style={{ animation: 'spin 1.5s linear infinite' }} />
            <span>Processing Query & Extracting Data...</span>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}
