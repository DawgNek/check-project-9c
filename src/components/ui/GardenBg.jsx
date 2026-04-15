// GardenBg.jsx — Video BG + bougainvillea petals + bloom intro
import { useEffect, useState, useRef } from 'react';

/* ── Bougainvillea bract SVGs (triangular — like the real flower) */
const BRACT_SVGS = [
  // Deep magenta bract
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 30'><path d='M12 2 Q22 9 20 22 Q12 30 4 22 Q2 9 12 2Z' fill='%23D4256E' opacity='.88'/><path d='M12 5 Q19 11 17 21 Q12 27 7 21 Q5 11 12 5Z' fill='%23F26496' opacity='.40'/></svg>`,
  // Vivid pink bract
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 22 28'><path d='M11 1 Q20 8 18 21 Q11 28 4 21 Q2 8 11 1Z' fill='%23E83580' opacity='.90'/><ellipse cx='11' cy='12' rx='5' ry='8' fill='%23F9C0D2' opacity='.35'/></svg>`,
  // Green leaf
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 28'><path d='M10 1 Q19 7 17 20 Q10 27 3 20 Q1 7 10 1Z' fill='%232E5530' opacity='.82'/><path d='M10 4 Q16 9 14 19 Q10 24 6 19 Q4 9 10 4Z' fill='%234A7848' opacity='.45'/></svg>`,
  // Pale pink bract
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 26'><path d='M10 2 Q18 8 16 19 Q10 26 4 19 Q2 8 10 2Z' fill='%23F9C0D2' opacity='.78'/></svg>`,
  // Small deep bract
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 18 24'><path d='M9 1 Q17 7 15 18 Q9 24 3 18 Q1 7 9 1Z' fill='%23BF1852' opacity='.85'/></svg>`,
];

/* ── Flower SVG for bloom intro ───────────────────────────── */
function BvBloom({ size, color, cx = 50, cy = 50 }) {
  const petals = 5;
  const angles = Array.from({ length: petals }, (_, i) => (360 / petals) * i);
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      {angles.map((a, i) => (
        <g key={i} transform={`rotate(${a} 50 50)`}>
          <path d="M50 15 Q62 26 60 44 Q50 56 40 44 Q38 26 50 15Z" fill={color} opacity="0.86"/>
          <path d="M50 19 Q58 28 56 42 Q50 50 44 42 Q42 28 50 19Z" fill="rgba(255,255,255,0.22)"/>
        </g>
      ))}
      <circle cx="50" cy="50" r="12" fill="#D89030" opacity="0.94"/>
      <circle cx="50" cy="50" r="6"  fill="#F0D060" opacity="0.80"/>
    </svg>
  );
}
export { BvBloom as FlowerSVG };

/* ── Bloom Intro ─────────────────────────────────────────── */
const BLOOMS = [
  { x:5,  y:8,  s:150, c:'#D4256E', d:0   },
  { x:68, y:3,  s:120, c:'#E83580', d:150 },
  { x:38, y:50, s:170, c:'#BF1852', d:75  },
  { x:2,  y:60, s:100, c:'#E83580', d:260 },
  { x:75, y:48, s:130, c:'#D4256E', d:120 },
  { x:24, y:5,  s:90,  c:'#2E5530', d:200 },
  { x:55, y:74, s:108, c:'#D4256E', d:330 },
  { x:84, y:76, s:82,  c:'#E83580', d:180 },
  { x:48, y:22, s:95,  c:'#BF1852', d:55  },
];

function BloomIntro({ onDone }) {
  const [out, setOut] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => { setOut(true); setTimeout(onDone, 850); }, 3000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div id="bloom-intro" className={out ? 'out' : ''}>
      <style>{`
        @keyframes bloomIn {
          0%   { transform: translate(var(--bx), var(--by)) scale(0) rotate(-20deg); opacity: 0; }
          55%  { transform: translate(var(--bx), var(--by)) scale(1.10) rotate(3deg); opacity: 1; }
          100% { transform: translate(var(--bx), var(--by)) scale(1) rotate(0deg); opacity: 1; }
        }
        .bloom-petal {
          position: absolute; animation: bloomIn 1.5s cubic-bezier(0.34,1.56,0.64,1) both;
          transform-origin: center; pointer-events: none;
        }
        @keyframes introTitle {
          from { opacity: 0; transform: translate(-50%,-50%) translateY(24px) scale(0.94); filter: blur(6px); }
          to   { opacity: 1; transform: translate(-50%,-50%) translateY(0) scale(1); filter: blur(0); }
        }
      `}</style>

      {BLOOMS.map((b, i) => (
        <div key={i} className="bloom-petal"
          style={{ '--bx':'0px', '--by':'0px', left:`${b.x}%`, top:`${b.y}%`, animationDelay:`${b.d}ms` }}>
          <BvBloom size={b.s} color={b.c}/>
        </div>
      ))}

      {/* Central title */}
      <div style={{
        position:'absolute', top:'50%', left:'50%',
        animation: 'introTitle 1s 1.75s cubic-bezier(0.25,0.46,0.45,0.94) both',
        textAlign:'center', zIndex:10, pointerEvents:'none',
        width:'100%',
      }}>
        <div style={{
          fontFamily:"'Fraunces',serif", fontSize:'clamp(5rem,16vw,10rem)',
          fontWeight:900, color:'#fff', lineHeight:0.92, letterSpacing:'-0.02em',
          textShadow:'0 0 100px rgba(212,37,110,0.65), 0 6px 40px rgba(0,0,0,0.80)',
        }}>
          9<em style={{ color:'#F26496', fontStyle:'italic' }}>C</em>
        </div>
        <div style={{
          fontFamily:"'Lora',serif", fontStyle:'italic',
          fontSize:'clamp(1rem,3.5vw,1.6rem)',
          color:'rgba(255,255,255,0.72)', marginTop:12, letterSpacing:'0.08em',
        }}>
          Roots & Bloom
        </div>
      </div>
    </div>
  );
}

/* ── Main component ──────────────────────────────────────── */
export default function GardenBg() {
  const [bloomDone, setBloomDone] = useState(
    () => sessionStorage.getItem('9c-bloom') === '1'
  );
  const isMobile = window.innerWidth < 640;

  useEffect(() => {
    const layer = document.getElementById('petal-layer');
    const count = isMobile ? 9 : 22;

    for (let i = 0; i < count; i++) {
      const el = document.createElement('img');
      el.className = 'bv-petal';
      el.src = `data:image/svg+xml,${BRACT_SVGS[Math.floor(Math.random() * BRACT_SVGS.length)]}`;
      const size = 13 + Math.random() * 22;
      el.style.cssText = `
        width:${size}px; height:auto;
        left:${-5 + Math.random() * 110}%;
        --px:${(Math.random() - 0.5) * 200}px;
        --pr:${(Math.random() > 0.5 ? 1 : -1) * (120 + Math.random() * 300)}deg;
        animation-duration:${18 + Math.random() * 28}s;
        animation-delay:${Math.random() * 32}s;
      `;
      layer?.appendChild(el);
    }

    // Scroll burst
    let lastY = 0;
    const onScroll = () => {
      if (!layer) return;
      const d = Math.abs(window.scrollY - lastY);
      if (d > 90) {
        lastY = window.scrollY;
        for (let i = 0; i < 3; i++) {
          const el = document.createElement('img');
          el.className = 'bv-petal';
          el.src = `data:image/svg+xml,${BRACT_SVGS[Math.floor(Math.random() * BRACT_SVGS.length)]}`;
          const s = 11 + Math.random() * 18;
          el.style.cssText = `width:${s}px;height:auto;left:${Math.random()*100}%;--px:${(Math.random()-.5)*150}px;--pr:${(Math.random()>.5?1:-1)*260}deg;animation-duration:${9+Math.random()*8}s;animation-delay:0s;`;
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
      <div id="bg-video-wrap">
        <video src="/bg.mp4" autoPlay muted loop playsInline
          onError={e => e.target.style.display = 'none'}/>
      </div>
      <div id="vignette"/>
      <div id="petal-layer"/>
      {!bloomDone && (
        <BloomIntro onDone={() => {
          sessionStorage.setItem('9c-bloom', '1');
          setBloomDone(true);
        }}/>
      )}
    </>
  );
}
