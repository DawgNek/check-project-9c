// src/pages/OtherPages.jsx
import { useState, useEffect, useRef } from 'react';
import { FlowerSVG } from '../components/ui/GardenBg';

// ─── PLAYLIST ────────────────────────────────────────────────
export function PlaylistPage() {
  return (
    <div className="page-wrap">
      <div className="section-header">
        <span className="section-eyebrow">✦ Âm nhạc của lớp ✦</span>
        <h1 className="section-title">Playlist 9C</h1>
        <p className="section-subtitle">"Những giai điệu gắn liền với ký ức của chúng ta"</p>
      </div>
      <div style={{ maxWidth:520, margin:'0 auto', padding:'0 24px 80px', textAlign:'center' }}>
        {/* Vinyl */}
        <div style={{ position:'relative', width:200, height:200, margin:'0 auto 40px' }}>
          <style>{`@keyframes vinylSpin{to{transform:rotate(360deg)}}`}</style>
          <div style={{ width:200, height:200, borderRadius:'50%',
            background:'conic-gradient(#3d2b2f 0deg,#5c3a40 30deg,#3d2b2f 60deg,#6b4550 90deg,#3d2b2f 120deg,#5c3a40 150deg,#3d2b2f 180deg,#6b4550 210deg,#3d2b2f 240deg,#5c3a40 270deg,#3d2b2f 300deg,#6b4550 330deg,#3d2b2f 360deg)',
            animation:'vinylSpin 10s linear infinite',
            boxShadow:'0 0 0 3px rgba(249,198,208,.4), 0 20px 60px rgba(58,32,48,.25)',
            position:'relative' }}>
            <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:72, height:72, borderRadius:'50%', background:'var(--petal-blush)', border:'3px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <div style={{ width:12, height:12, borderRadius:'50%', background:'var(--rose-soft)' }}/>
            </div>
          </div>
        </div>

        <h2 style={{ fontFamily:'var(--font-display)', fontSize:'1.7rem', color:'var(--ink)', marginBottom:10 }}>Roots & Bloom Playlist</h2>
        <p style={{ fontFamily:'var(--font-heading)', fontSize:'1rem', fontStyle:'italic', color:'var(--ink-muted)', marginBottom:36 }}>Lớp 9C · 2025–2026</p>

        <a href="https://open.spotify.com" target="_blank" rel="noreferrer"
          style={{ display:'inline-flex', alignItems:'center', gap:12, padding:'15px 36px', borderRadius:50, background:'#1DB954', color:'#000', fontFamily:'var(--font-label)', fontSize:'.76rem', letterSpacing:'.1em', textTransform:'uppercase', fontWeight:700, boxShadow:'0 8px 32px rgba(29,185,84,.35)', transition:'all .3s', marginBottom:40, textDecoration:'none' }}
          onMouseEnter={e=>{ e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 12px 40px rgba(29,185,84,.45)'; }}
          onMouseLeave={e=>{ e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 8px 32px rgba(29,185,84,.35)'; }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>
          Tham gia Playlist
        </a>

        <div className="petal-card" style={{ padding:24, textAlign:'left' }}>
          <div style={{ fontFamily:'var(--font-label)', fontSize:'.65rem', letterSpacing:'.18em', textTransform:'uppercase', color:'var(--leaf)', marginBottom:12, display:'flex', alignItems:'center', gap:8 }}>
            <div style={{ width:7, height:7, borderRadius:'50%', background:'var(--leaf)', animation:'blink 1.2s ease-in-out infinite' }}/>
            Đang phát trong lớp
          </div>
          <style>{`@keyframes blink{0%,100%{opacity:1}50%{opacity:.2}}`}</style>
          <div style={{ fontFamily:'var(--font-display)', fontSize:'1.2rem', color:'var(--ink)', marginBottom:4 }}>Playlist 9C</div>
          <div style={{ fontFamily:'var(--font-body)', fontSize:'.9rem', color:'var(--ink-muted)', fontStyle:'italic' }}>Roots & Bloom · 2025–2026</div>
        </div>
      </div>
    </div>
  );
}

// ─── CINEMATIC ENDING — Dreamy pink garden version ───────────
const SCENES = [
  { title:'9C',                        sub:'Roots & Bloom',                                    dur:3500, color:'#f9c6d0' },
  { title:'Một năm bắt đầu...',        sub:'Những ngày đầu tiên của lớp 9C',                   dur:5000, color:'#a8d4a5' },
  { title:'44 bông hoa',               sub:'1 giáo viên · Vô số ký ức đang chờ nở',             dur:4500, color:'#f9c6d0' },
  { title:'Tình bạn',                  sub:'"Những người bạn mà bạn sẽ nhớ mãi"',              dur:5000, color:'#fde8ef' },
  { title:'Cô giáo',                   sub:'"Người đã vun trồng khu vườn chúng ta"',             dur:5000, color:'#a8d4a5' },
  { title:'Có những cơn mưa...',        sub:'Nhưng sau mưa trời lại sáng, và hoa lại nở',       dur:5000, color:'#d4ead2' },
  { title:'Và chúng ta đã lớn lên',    sub:'Từ những hạt giống nhỏ — thành khu vườn rực rỡ',   dur:5000, color:'#f9c6d0' },
  { title:'Tương lai đang chờ',        sub:'Nhưng ký ức thì ở lại mãi mãi',                   dur:5000, color:'#fde8ef' },
  { title:'Cảm ơn vì đã là 9C',       sub:'Dù đường đời có chia đôi ngả\nKhu vườn này sẽ mãi nở trong tim\n— 9C · Roots & Bloom —', dur:9000, color:'#f9c6d0' },
];

export function EndingCinematic({ onClose }) {
  const [idx,      setIdx]      = useState(0);
  const [progress, setProgress] = useState(0);
  const [flowers,  setFlowers]  = useState([]);
  const startRef  = useRef(Date.now());
  const totalMs   = SCENES.reduce((a,s)=>a+s.dur,0);

  useEffect(() => {
    const t = setInterval(() => setProgress(Math.min(100,(Date.now()-startRef.current)/totalMs*100)), 120);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (idx >= SCENES.length) { onClose(); return; }
    const timer = setTimeout(() => setIdx(i=>i+1), SCENES[idx].dur);
    // Burst flowers on scene change
    const newFlowers = Array.from({length:6},(_,i)=>({
      id: Date.now()+i, x: 10+Math.random()*80, y: 10+Math.random()*80,
      size: 40+Math.random()*60, color: SCENES[Math.min(idx,SCENES.length-1)].color,
      petals: 5+Math.floor(Math.random()*3), delay: i*150,
    }));
    setFlowers(newFlowers);
    return () => clearTimeout(timer);
  }, [idx]);

  const scene = SCENES[Math.min(idx, SCENES.length-1)];

  return (
    <div style={{ position:'fixed', inset:0, zIndex:900,
      background:'linear-gradient(160deg,#fff0f5 0%,#fdf8f0 50%,#f0f5ee 100%)',
      display:'flex', alignItems:'center', justifyContent:'center', textAlign:'center', padding:48,
    }}>
      <style>{`
        @keyframes sceneIn{from{opacity:0;transform:scale(.95)}to{opacity:1;transform:scale(1)}}
        @keyframes flowerPop{0%{opacity:0;transform:scale(0) rotate(-20deg)}60%{transform:scale(1.1) rotate(5deg);opacity:1}100%{transform:scale(1) rotate(0);opacity:.7}}
      `}</style>

      {/* Ambient flower decorations */}
      {flowers.map(f => (
        <div key={f.id} style={{ position:'absolute', left:f.x+'%', top:f.y+'%', transform:'translate(-50%,-50%)', animation:`flowerPop .7s ${f.delay}ms ease-out both`, opacity:.6, pointerEvents:'none' }}>
          <FlowerSVG size={f.size} color={f.color} petals={f.petals} centerColor="#f5d070"/>
        </div>
      ))}

      {/* Sunray */}
      <div style={{ position:'absolute', top:0, left:0, width:'60vw', height:'60vh', background:'radial-gradient(ellipse at 20% 10%,rgba(245,208,112,.18) 0%,transparent 70%)', filter:'blur(30px)', pointerEvents:'none' }}/>

      {/* Close */}
      <button onClick={onClose} style={{ position:'absolute', top:24, right:24, width:40, height:40, borderRadius:'50%', background:'rgba(249,198,208,.3)', border:'1px solid rgba(249,198,208,.5)', color:'var(--rose-muted)', fontSize:18, cursor:'pointer', transition:'all .3s' }}
        onMouseEnter={e=>e.currentTarget.style.background='rgba(249,198,208,.5)'}
        onMouseLeave={e=>e.currentTarget.style.background='rgba(249,198,208,.3)'}>
        ✕
      </button>

      {/* Content */}
      <div key={idx} style={{ animation:'sceneIn 1.3s ease-out forwards', maxWidth:560, position:'relative', zIndex:2 }}>
        <div style={{ fontFamily:'var(--font-display)', fontSize:'clamp(2rem,8vw,5rem)', fontWeight:900, color:'var(--ink)', lineHeight:1.1, marginBottom:24, textShadow:`0 0 60px ${scene.color}88` }}>
          {scene.title}
        </div>
        <div style={{ fontFamily:'var(--font-heading)', fontSize:'clamp(1rem,2.8vw,1.4rem)', fontStyle:'italic', color:'var(--ink-muted)', lineHeight:1.9, whiteSpace:'pre-line' }}>
          {scene.sub}
        </div>
      </div>

      {/* Progress */}
      <div style={{ position:'absolute', bottom:0, left:0, right:0, height:3, background:'rgba(249,198,208,.25)' }}>
        <div style={{ height:'100%', width:progress+'%', background:'linear-gradient(90deg,var(--petal-deep),var(--rose-soft),var(--leaf-soft))', transition:'width .12s linear' }}/>
      </div>

      {/* Scene dots */}
      <div style={{ position:'absolute', bottom:16, left:'50%', transform:'translateX(-50%)', display:'flex', gap:8 }}>
        {SCENES.map((_,i)=>(
          <div key={i} onClick={()=>setIdx(i)}
            style={{ width:i===idx?20:7, height:7, borderRadius:4, background:i===idx?'var(--rose-soft)':'rgba(249,198,208,.45)', transition:'all .4s', cursor:'pointer' }}/>
        ))}
      </div>
    </div>
  );
}
