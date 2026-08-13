import React from 'react';
import { Info, Trash2 } from 'lucide-react';

export default function Navbar({
  sessionId,
  onNewSession
}) {
  return (
    <header style={{
      padding: '16px 32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: '1px solid var(--border-color)',
      background: 'rgba(5, 5, 8, 0.92)',
      backdropFilter: 'blur(12px)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      {/* Brand & Logo with Info Icon */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '10px',
          background: 'rgba(255, 30, 66, 0.15)',
          border: '1px solid rgba(255, 30, 66, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ff2d55'
        }}>
          <Info size={20} />
        </div>

        <div>
          <h1 style={{
            fontSize: '1.25rem',
            fontWeight: 800,
            letterSpacing: '0.5px',
            color: '#ffffff',
            margin: 0
          }}>
            INFO<span className="gradient-text-red">-SCRAPER</span>
          </h1>
          <p style={{ fontSize: '0.75rem', color: '#cbd5e1', margin: 0 }}>
            Web Extraction & AI Knowledge Assistant
          </p>
        </div>
      </div>

      {/* Right Controls */}
      {sessionId && (
        <button
          onClick={onNewSession}
          className="btn-secondary"
          title="Start New Chat"
          style={{
            fontSize: '0.8rem',
            padding: '6px 14px',
            borderColor: 'rgba(255, 45, 85, 0.4)',
            color: '#ff2d55'
          }}
        >
          <Trash2 size={14} /> New Chat
        </button>
      )}
    </header>
  );
}
