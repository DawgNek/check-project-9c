// src/pages/HomePage.jsx — Bougainvillea themed, dark overlay style
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FlowerSVG } from '../components/ui/GardenBg';

const EXAM = new Date('2026-06-01T00:00:00+07:00');

function useCD(target) {
  const [d, setD] = useState(target - Date.now());
  useEffect(() => { const iv = setInterval(() => setD(target - Date.now()), 1000); return () => clearInterval(iv); }, [target]);
  const ms = Math.max(0, d);
  return { days: Math.floor(ms/86400000), hours: Math.floor((ms%86400000)/3600000), mins: Math.floor((ms%3600000)/60000), secs: Math.floor((ms%60000)/1000) };
}

function CDBox({ num, label }) {
  return (
    <div style={{
      minWidth: 80, textAlign: 'center', padding: '16px 12px',
      background: 'rgba(255,249,245,0.10)',
      border: '1px solid rgba(240,98,146,0.35)',
      borderRadius: 14, backdropFilter: 'blur(10px)',
      boxShadow: '0 4px 20px rgba(212,35,122,0.18)',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:'linear-gradient(90deg,transparent,rgba(240,98,146,.6),transparent)' }}/>
      <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'2.4rem', fontWeight:700, color:'#fff', lineHeight:1, marginBottom:6, textShadow:'0 0 20px rgba(240,98,146,.5)' }}>
        {String(num).padStart(2,'0')}
      </div>
      <div style={{ fontFamily:"'Cinzel',serif", fontSize:'9px', letterSpacing:'.18em', textTransform:'uppercase', color:'rgba(255,255,255,.50)' }}>
        {label}
      </div>
    </div>
  );
}

// 44 student flower grid — bloom one by one
const COLORS = ['#E8358F','#D4237A','#F06292','#B01C55','#366B38','#5A9B5C','#FFB3D1','#E91E8C'];

function FlowerGarden({ onGoSeating }) {
  const [bloomed, setBloomed] = useState(0);
  useEffect(() => {
    if (bloomed >= 44) return;
    const t = setTimeout(() => setBloomed(b => b + 1), 70);
    return () => clearTimeout(t);
  }, [bloomed]);
  return (
    <div>
      <div style={{ fontFamily:"'Cinzel',serif", fontSize:10, letterSpacing:'.2em', textTransform:'uppercase', color:'rgba(240,98,146,.75)', marginBottom:20, textAlign:'center' }}>
        {bloomed} / 44 học sinh
      </div>
      <div style={{ display:'flex', flexWrap:'wrap', gap:12, justifyContent:'center', maxWidth:560, margin:'0 auto' }}>
        {Array.from({length:44},(_,i) => (
          <button key={i} onClick={onGoSeating}
            title={`Học sinh ${i+1}`}
            style={{
              background:'none', border:'none', padding:0, cursor:'pointer',
              opacity: i < bloomed ? 1 : 0,
              transform: i < bloomed ? 'scale(1)' : 'scale(0.2)',
              transition: 'all .6s cubic-bezier(.34,1.56,.64,1)',
              filter: i < bloomed ? 'drop-shadow(0 2px 8px rgba(212,35,122,.45))' : 'none',
            }}>
            <FlowerSVG size={34 + Math.sin(i*1.5)*8} color={COLORS[i%COLORS.length]}/>
          </button>
        ))}
      </div>
      <style>{`@keyframes bvPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.08) rotate(4deg)}}`}</style>
    </div>
  );
}

// Feature cards
const CARDS = [
  {icon:'💌',title:'Thư Tương lai',  desc:'Gửi ảnh & lời nhắn đến ngày 01/06/2026',to:'/chung'},
  {icon:'📷',title:'Locket',         desc:'Chụp & upload ảnh mỗi ngày',             to:'/locket'},
  {icon:'💬',title:'Chat',           desc:'Nhắn tin realtime với cả lớp',            to:'/chat'},
  {icon:'✨',title:'Story',          desc:'Khoảnh khắc 24h tự xóa',                 to:'/story'},
  {icon:'🪑',title:'Sơ đồ Lớp',     desc:'Chỗ ngồi & nhận xét bạn bè',            to:'/seating'},
  {icon:'✍️',title:'Lưu bút',        desc:'Ký tên vào cuốn lưu bút kỹ thuật số',   to:'/signature'},
];

export default function HomePage() {
  const navigate = useNavigate();
  const cd = useCD(EXAM.getTime());

  useEffect(() => {
    const obs = new IntersectionObserver(e => e.forEach(x => { if (x.isIntersecting) x.target.classList.add('in'); }), { threshold:.1 });
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const fa = (d=0) => ({ opacity:0, animation:`fadeUp .85s ${d}ms ease-out forwards` });

  return (
    <div className="wrap">
      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
        @keyframes floatUp{0%,100%{transform:translateY(0)}50%{transform:translateY(-9px)}}
      `}</style>

      {/* ── HERO ─────────────────────────────────── */}
      <div style={{ textAlign:'center', padding:'80px 24px 56px', position:'relative', zIndex:10 }}>

        {/* Eyebrow */}
        <div style={{ ...fa(100), fontFamily:"'Cinzel',serif", fontSize:10, letterSpacing:'.28em', textTransform:'uppercase', color:'rgba(240,98,146,.80)', marginBottom:22 }}>
          ✦ &nbsp; KHU VƯỜN KỶ NIỆM LỚP 9C &nbsp; ✦
        </div>

        {/* Main title */}
        <h1 style={{ ...fa(240), fontFamily:"'Playfair Display',serif", fontSize:'clamp(5rem,16vw,10rem)', fontWeight:900, lineHeight:.92, marginBottom:14, color:'#fff', textShadow:'0 0 80px rgba(232,53,143,.50), 0 4px 30px rgba(0,0,0,.60)' }}>
          9<em style={{color:'#F06292',fontStyle:'italic'}}>C</em>
        </h1>

        <div style={{ ...fa(360), fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(1.1rem,3.5vw,1.7rem)', fontStyle:'italic', color:'rgba(255,255,255,.72)', letterSpacing:'.06em', marginBottom:60 }}>
          Roots & Bloom — Nơi ký ức nở hoa
        </div>

        {/* Countdown */}
        <div style={{ ...fa(480), marginBottom:52 }}>
          <div style={{ fontFamily:"'Cinzel',serif", fontSize:10, letterSpacing:'.22em', textTransform:'uppercase', color:'rgba(255,255,255,.42)', marginBottom:18 }}>
            Đếm ngược kỳ thi vào lớp 10
          </div>
          <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
            <CDBox num={cd.days}  label="Ngày"/>
            <CDBox num={cd.hours} label="Giờ"/>
            <CDBox num={cd.mins}  label="Phút"/>
            <CDBox num={cd.secs}  label="Giây"/>
          </div>
          <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:14, fontStyle:'italic', color:'rgba(240,98,146,.70)', marginTop:14 }}>
            Kỳ thi vào lớp 10 · Tháng 6, 2026
          </div>
        </div>

        {/* CTA buttons */}
        <div style={{ ...fa(600), display:'flex', gap:14, justifyContent:'center', flexWrap:'wrap', marginBottom:48 }}>
          <button className="btn btn-pink" onClick={() => navigate('/chung')}>
            💌 Viết thư Tương lai
          </button>
          <button className="btn btn-outline" onClick={() => navigate('/locket')}>
            📷 Locket lớp
          </button>
          <button className="btn btn-outline" onClick={() => window.__startEnding?.()}>
            ✦ Xem Ending
          </button>
        </div>
      </div>

      {/* ── FLOWER GARDEN ────────────────────────── */}
      <div className="inner reveal" style={{ marginBottom:64, textAlign:'center' }}>
        <div style={{ fontFamily:"'Cinzel',serif", fontSize:10, letterSpacing:'.22em', textTransform:'uppercase', color:'rgba(240,98,146,.65)', marginBottom:14 }}>✦ KHU VƯỜN NỞ RỘ ✦</div>
        <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(1.8rem,5vw,2.8rem)', fontWeight:700, color:'#fff', marginBottom:10, textShadow:'0 2px 20px rgba(0,0,0,.5)' }}>
          44 Bông hoa
        </h2>
        <p style={{ fontFamily:"'Cormorant Garamond',serif", fontStyle:'italic', color:'rgba(255,255,255,.60)', marginBottom:32 }}>
          Mỗi học sinh là một bông hoa — nhấn để xem sơ đồ lớp
        </p>
        <FlowerGarden onGoSeating={() => navigate('/seating')}/>
      </div>

      {/* ── FEATURE CARDS ───────────────────────── */}
      <div className="inner">
        <div style={{ textAlign:'center', marginBottom:36 }}>
          <div style={{ fontFamily:"'Cinzel',serif", fontSize:10, letterSpacing:'.22em', textTransform:'uppercase', color:'rgba(240,98,146,.65)', marginBottom:12 }}>✦ TÍNH NĂNG ✦</div>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(1.8rem,5vw,2.8rem)', fontWeight:700, color:'#fff', textShadow:'0 2px 20px rgba(0,0,0,.5)' }}>Khám phá khu vườn</h2>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:16, marginBottom:60 }}>
          {CARDS.map((c,i) => (
            <div key={i} className="reveal card" style={{ padding:'26px 22px', cursor:'pointer', transition:'all .4s' }}
              onClick={() => navigate(c.to)}
              onMouseEnter={e => { e.currentTarget.style.transform='translateY(-6px)'; e.currentTarget.style.boxShadow='0 18px 52px rgba(212,35,122,.28)'; e.currentTarget.style.borderColor='rgba(240,98,146,.45)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow=''; e.currentTarget.style.borderColor=''; }}>
              <div style={{ fontSize:'2rem', marginBottom:14, animation:`floatUp ${3.5+i*.5}s ease-in-out ${i*.4}s infinite` }}>{c.icon}</div>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.1rem', fontWeight:700, color:'#fff', marginBottom:8 }}>{c.title}</div>
              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontStyle:'italic', fontSize:14, color:'rgba(255,255,255,.60)', lineHeight:1.7 }}>{c.desc}</div>
              <div style={{ marginTop:16, fontFamily:"'Cinzel',serif", fontSize:9, letterSpacing:'.12em', textTransform:'uppercase', color:'rgba(240,98,146,.70)' }}>
                Khám phá →
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
