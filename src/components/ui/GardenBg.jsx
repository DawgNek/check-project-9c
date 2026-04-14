// src/components/ui/GardenBg.jsx — Bougainvillea video BG + petals + bloom intro
import { useEffect, useState } from 'react';

/* ── Bougainvillea petal SVGs (matching real flower shape) */
const PETALS = [
  // Triangular bougainvillea bract (the colorful "petals" are actually bracts)
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 26 32'><path d='M13 2 Q22 8 24 20 Q16 30 8 28 Q2 18 6 8 Z' fill='%23E8358F' opacity='.85'/><path d='M13 2 Q18 10 16 22 Q13 28 10 24 Q6 14 10 6 Z' fill='%23F06292' opacity='.50'/></svg>`,
  // Rounder petal
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 28'><ellipse cx='12' cy='14' rx='10' ry='13' fill='%23D4237A' opacity='.82'/><ellipse cx='12' cy='12' rx='7' ry='9' fill='%23F48FB1' opacity='.45'/></svg>`,
  // Leaf shape
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 22 30'><path d='M11 2 Q20 8 18 22 Q11 30 4 22 Q2 8 11 2 Z' fill='%23366B38' opacity='.72'/></svg>`,
  // Small vivid bract
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 26'><path d='M10 1 Q18 7 17 18 Q10 26 3 18 Q2 7 10 1 Z' fill='%23E91E8C' opacity='.88'/></svg>`,
  // Pale pink
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 22 28'><ellipse cx='11' cy='14' rx='9' ry='12' fill='%23FFB3D1' opacity='.75'/></svg>`,
];

/* ── Bloom intro ─────────────────────────────────────── */
const BLOOM_FLOWERS = [
  { x:5,  y:8,  s:140, c:'#E8358F', d:0   },
  { x:72, y:3,  s:110, c:'#D4237A', d:160 },
  { x:38, y:50, s:160, c:'#F06292', d:80  },
  { x:2,  y:58, s:95,  c:'#B01C55', d:280 },
  { x:78, y:48, s:120, c:'#E8358F', d:130 },
  { x:25, y:5,  s:85,  c:'#366B38', d:220 },
  { x:55, y:75, s:100, c:'#D4237A', d:340 },
  { x:84, y:78, s:75,  c:'#F06292', d:190 },
  { x:50, y:25, s:90,  c:'#B01C55', d:60  },
];

function BvFlower({ size, color }) {
  const n = 5;
  const angles = Array.from({length:n},(_,i)=>(360/n)*i);
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      {angles.map((a,i)=>(
        <g key={i} transform={`rotate(${a} 50 50)`}>
          <path d="M50 18 Q62 28 60 46 Q50 56 40 46 Q38 28 50 18 Z" fill={color} opacity=".85"/>
          <path d="M50 22 Q57 30 55 42 Q50 50 45 42 Q43 30 50 22 Z" fill="rgba(255,255,255,.28)"/>
        </g>
      ))}
      <circle cx="50" cy="50" r="13" fill="#F5C842" opacity=".92"/>
      <circle cx="50" cy="50" r="7"  fill="#FFF3C0" opacity=".85"/>
    </svg>
  );
}

export { BvFlower as FlowerSVG };

function BloomIntro({ onDone }) {
  const [done, setDone] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => { setDone(true); setTimeout(onDone, 900); }, 3000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div id="bloom-overlay" className={done ? 'done' : ''}>
      <style>{`
        @keyframes bvBloom {
          0%   { transform: scale(0) rotate(-25deg); opacity: 0; }
          55%  { transform: scale(1.12) rotate(4deg); opacity: 1; }
          100% { transform: scale(1) rotate(0); opacity: 1; }
        }
        @keyframes titleRise {
          from { opacity: 0; transform: translate(-50%,-50%) translateY(20px); }
          to   { opacity: 1; transform: translate(-50%,-50%) translateY(0); }
        }
        .bf {
          position: absolute; animation: bvBloom 1.5s ease-out both;
          transform-origin: center; pointer-events: none;
        }
      `}</style>

      {/* Animated flowers */}
      {BLOOM_FLOWERS.map((f,i) => (
        <div key={i} className="bf" style={{ left:`${f.x}%`, top:`${f.y}%`, animationDelay:`${f.d}ms` }}>
          <BvFlower size={f.s} color={f.c}/>
        </div>
      ))}

      {/* Central title */}
      <div style={{
        position:'absolute', top:'50%', left:'50%',
        animation:'titleRise 1s 1.8s ease-out both',
        textAlign:'center', zIndex:10, pointerEvents:'none',
      }}>
        <div style={{
          fontFamily:'\'Playfair Display\',serif', fontSize:'clamp(4rem,13vw,9rem)',
          fontWeight:900, color:'#fff', lineHeight:.95,
          textShadow:'0 0 60px rgba(232,53,143,.6), 0 4px 20px rgba(0,0,0,.5)',
        }}>
          9<em style={{color:'#F06292',fontStyle:'italic'}}>C</em>
        </div>
        <div style={{
          fontFamily:'\'Cormorant Garamond\',serif', fontSize:'clamp(1rem,3vw,1.6rem)',
          fontStyle:'italic', color:'rgba(255,255,255,.80)', marginTop:10, letterSpacing:'.08em',
        }}>
          Roots & Bloom
        </div>
      </div>
    </div>
  );
}

/* ── Main component ──────────────────────────────────── */
export default function GardenBg() {
  const [bloomDone, setBloomDone] = useState(
    () => sessionStorage.getItem('bloom-done') === '1'
  );
  const isMobile = window.innerWidth < 640;

  useEffect(() => {
    // Petals
    const layer = document.getElementById('petal-layer');
    const count = isMobile ? 8 : 20;
    for (let i = 0; i < count; i++) {
      const el = document.createElement('img');
      el.className = 'bv-petal';
      const svg = PETALS[Math.floor(Math.random() * PETALS.length)];
      el.src = `data:image/svg+xml,${svg}`;
      const size = 12 + Math.random() * 24;
      el.style.cssText = `
        width:${size}px; height:auto;
        left:${-5 + Math.random() * 110}%;
        --px:${(Math.random() - 0.5) * 200}px;
        --pr:${(Math.random() > 0.5 ? 1 : -1) * (180 + Math.random() * 320)}deg;
        animation-duration:${16 + Math.random() * 26}s;
        animation-delay:${Math.random() * 30}s;
      `;
      layer?.appendChild(el);
    }

    // Scroll burst
    let lastY = 0;
    const onScroll = () => {
      if (!layer) return;
      const delta = Math.abs(window.scrollY - lastY);
      if (delta > 80) {
        lastY = window.scrollY;
        for (let i = 0; i < 4; i++) {
          const el = document.createElement('img');
          el.className = 'bv-petal';
          el.src = `data:image/svg+xml,${PETALS[Math.floor(Math.random() * PETALS.length)]}`;
          const s = 10 + Math.random() * 18;
          el.style.cssText = `width:${s}px;height:auto;left:${Math.random()*100}%;--px:${(Math.random()-.5)*140}px;--pr:${(Math.random()>.5?1:-1)*280}deg;animation-duration:${10+Math.random()*7}s;animation-delay:0s;`;
          layer.appendChild(el);
          setTimeout(() => el.remove(), 17000);
        }
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { if (layer) layer.innerHTML = ''; window.removeEventListener('scroll', onScroll); };
  }, []);

  return (
    <>
      {/* Video background */}
      <div id="video-bg">
        <video
          src="/bg.mp4"
          autoPlay muted loop playsInline
          onError={e => e.target.style.display = 'none'}
        />
      </div>
      <div id="vignette"/>

      {/* Petals */}
      <div id="petal-layer"/>

      {/* First-load bloom */}
      {!bloomDone && (
        <BloomIntro onDone={() => {
          sessionStorage.setItem('bloom-done', '1');
          setBloomDone(true);
        }}/>
      )}
    </>
  );
}
