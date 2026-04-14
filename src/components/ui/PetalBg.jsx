// src/components/ui/PetalBg.jsx
import { useEffect, useRef } from 'react';

const COLORS = [
  'rgba(196,181,253,0.55)',
  'rgba(244,114,182,0.50)',
  'rgba(245,158,11,0.40)',
  'rgba(251,113,133,0.40)',
  'rgba(94,234,212,0.30)',
];

export default function PetalBg() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const count = window.innerWidth < 640 ? 10 : 22;

    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      const size = 6 + Math.random() * 9;
      const dur  = 9 + Math.random() * 14;
      const delay = Math.random() * 18;
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      const isOval = Math.random() > 0.5;

      Object.assign(p.style, {
        position: 'absolute',
        width: size + 'px',
        height: (isOval ? size * 1.3 : size) + 'px',
        left: Math.random() * 100 + '%',
        top:  Math.random() * 100 + '%',
        background: color,
        borderRadius: isOval ? '50% 50% 50% 0' : '50%',
        transform: `rotate(${Math.random() * 360}deg)`,
        opacity: '0',
        animation: `petalFall ${dur}s ${delay}s linear infinite`,
        willChange: 'transform, opacity',
      });
      container.appendChild(p);
    }

    const style = document.createElement('style');
    style.textContent = `
      @keyframes petalFall {
        0%   { transform: translateY(-20px) rotate(0deg) translateX(0);    opacity: 0; }
        8%   { opacity: 0.7; }
        88%  { opacity: 0.3; }
        100% { transform: translateY(110vh) rotate(600deg) translateX(60px); opacity: 0; }
      }
    `;
    document.head.appendChild(style);

    return () => {
      container.innerHTML = '';
      style.remove();
    };
  }, []);

  return (
    <>
      <div id="global-bg" />
      <div id="vignette" />
      <div
        ref={containerRef}
        style={{ position: 'fixed', inset: 0, zIndex: 2, pointerEvents: 'none', overflow: 'hidden' }}
      />
    </>
  );
}
