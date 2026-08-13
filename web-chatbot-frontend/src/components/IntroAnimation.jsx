import React, { useEffect, useState } from 'react';
import { Info, RefreshCw, CheckCircle2 } from 'lucide-react';

export default function IntroAnimation({ onComplete, message = "Synchronizing INFO-SCRAPER services..." }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          if (onComplete) setTimeout(onComplete, 300);
          return 100;
        }
        return prev + 20;
      });
    }, 70);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      backgroundColor: 'rgba(11, 15, 25, 0.85)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff',
      padding: '20px'
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        padding: '32px 40px',
        maxWidth: '440px',
        width: '100%',
        background: '#161e2e',
        borderRadius: '20px',
        border: '1px solid rgba(99, 102, 241, 0.25)',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)'
      }}>
        {/* Info Icon / Refresh Indicator */}
        <div style={{
          width: '52px',
          height: '52px',
          borderRadius: '16px',
          background: 'rgba(99, 102, 241, 0.12)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '16px',
          color: '#38bdf8'
        }}>
          {progress < 100 ? (
            <RefreshCw size={24} style={{ animation: 'spin 1.5s linear infinite' }} />
          ) : (
            <CheckCircle2 size={24} color="#10b981" />
          )}
        </div>

        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '6px', color: '#f8fafc' }}>
          {progress < 100 ? 'Refreshing Connection' : 'System Ready'}
        </h3>

        <p style={{ color: '#94a3b8', fontSize: '0.88rem', marginBottom: '20px' }}>
          {message}
        </p>

        {/* Clean Progress Bar */}
        <div style={{ width: '100%' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '0.75rem',
            color: '#38bdf8',
            fontFamily: 'JetBrains Mono',
            marginBottom: '6px'
          }}>
            <span>STATUS</span>
            <span>{progress}%</span>
          </div>

          <div style={{
            width: '100%',
            height: '6px',
            background: 'rgba(255, 255, 255, 0.08)',
            borderRadius: '10px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${progress}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #6366f1, #38bdf8)',
              borderRadius: '10px',
              transition: 'width 0.1s linear'
            }} />
          </div>
        </div>
      </div>
    </div>
  );
}
