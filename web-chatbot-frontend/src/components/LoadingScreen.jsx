import React, { useEffect, useRef } from 'react';

export default function LoadingScreen({ onComplete }) {
  const canvasRef = useRef(null);

  // Background canvas animation: red on left/right sides, pitch black center for text contrast
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Create 60 particles constrained to left & right sides
    const particleCount = 60;
    const particles = Array.from({ length: particleCount }, () => {
      const isLeft = Math.random() > 0.5;
      const x = isLeft
        ? Math.random() * (width * 0.28)
        : width * 0.72 + Math.random() * (width * 0.28);
      return {
        x,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        size: 1.5 + Math.random() * 2.5,
        color: Math.random() > 0.4 ? '#ff2d55' : '#ff1e42',
        alpha: 0.4 + Math.random() * 0.6
      };
    });

    const render = () => {
      // Clear with pitch black
      ctx.fillStyle = '#050508';
      ctx.fillRect(0, 0, width, height);

      // Draw Red atmospheric gradient glows on LEFT and RIGHT sides
      const leftGlow = ctx.createRadialGradient(0, height / 2, 20, 0, height / 2, width * 0.45);
      leftGlow.addColorStop(0, 'rgba(255, 30, 66, 0.32)');
      leftGlow.addColorStop(0.5, 'rgba(159, 18, 57, 0.14)');
      leftGlow.addColorStop(1, 'rgba(5, 5, 8, 0)');
      ctx.fillStyle = leftGlow;
      ctx.fillRect(0, 0, width * 0.5, height);

      const rightGlow = ctx.createRadialGradient(width, height / 2, 20, width, height / 2, width * 0.45);
      rightGlow.addColorStop(0, 'rgba(255, 30, 66, 0.32)');
      rightGlow.addColorStop(0.5, 'rgba(159, 18, 57, 0.14)');
      rightGlow.addColorStop(1, 'rgba(5, 5, 8, 0)');
      ctx.fillStyle = rightGlow;
      ctx.fillRect(width * 0.5, 0, width * 0.5, height);

      // Draw subtle side grid lines (keeping middle 45% clean)
      ctx.strokeStyle = 'rgba(255, 30, 66, 0.05)';
      ctx.lineWidth = 1;
      const gridSize = 45;
      for (let x = 0; x < width; x += gridSize) {
        if (x > width * 0.28 && x < width * 0.72) continue;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      // Update and render side particles
      particles.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;

        // Keep out of center zone (between 28% and 72% width)
        if (p.x > width * 0.28 && p.x < width * 0.72) {
          if (p.x < width * 0.5) p.x = width * 0.27;
          else p.x = width * 0.73;
          p.vx *= -1;
        }

        // Keep inside canvas bounds
        if (p.x < 0) p.x = 0;
        if (p.x > width) p.x = width;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Draw particle dot
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;

        // Draw connecting beam lines between nearby side particles
        for (let j = idx + 1; j < particleCount; j++) {
          const p2 = particles[j];
          const dx = p2.x - p.x;
          const dy = p2.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 90) {
            ctx.strokeStyle = `rgba(255, 45, 85, ${0.25 * (1 - dist / 90)})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Timer for loading screen completion
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 2200);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      backgroundColor: '#050508',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#ffffff',
      padding: '20px',
      overflow: 'hidden'
    }}>
      {/* Background Canvas Animation */}
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0 }} />

      {/* Clashing Title Words in Pitch Black Center */}
      <div style={{ position: 'relative', zIndex: 10 }}>
        <h1 className="title-clash-wrapper" style={{ fontSize: 'clamp(3.2rem, 9vw, 5.5rem)' }}>
          <span className="title-part-info">Info</span>
          <span className="title-part-hyphen">-</span>
          <span className="title-part-scraper">Scraper</span>
        </h1>
      </div>
    </div>
  );
}
