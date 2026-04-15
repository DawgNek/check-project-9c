// HomePage.jsx — Editorial, rich, detailed
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const EXAM = new Date('2026-06-01T00:00:00+07:00');
function useCD() {
  const [ms, setMs] = useState(Math.max(0, EXAM - Date.now()));
  useEffect(() => { const iv = setInterval(() => setMs(Math.max(0, EXAM - Date.now())), 1000); return () => clearInterval(iv); }, []);
  return { d: Math.floor(ms/86400000), h: Math.floor((ms%86400000)/3600000), m: Math.floor((ms%3600000)/60000), s: Math.floor((ms%60000)/1000) };
}

// ── Countdown box ─────────────────────────────────────────
function CDBox({ num, label }) {
  return (
    <div style={{
      minWidth:82, textAlign:'center', padding:'18px 12px',
      background:'rgba(255,255,255,0.065)',
      border:'1px solid rgba(212,37,110,0.28)',
      borderRadius:14, position:'relative', overflow:'hidden',
      backdropFilter:'blur(12px)',
    }}>
      {/* Top accent line */}
      <div style={{ position:'absolute',top:0,left:0,right:0,height:2,background:'linear-gradient(90deg,transparent,rgba(212,37,110,.60),transparent)' }}/>
      <div style={{
        fontFamily:"'Fraunces',serif", fontSize:'2.6rem', fontWeight:900,
        lineHeight:1, color:'#fff', marginBottom:7,
        textShadow:'0 0 24px rgba(212,37,110,.45)',
        letterSpacing:'-0.02em',
      }}>
        {String(num).padStart(2,'0')}
      </div>
      <div style={{ fontFamily:"'Tenor Sans',sans-serif", fontSize:'9.5px', letterSpacing:'.22em', textTransform:'uppercase', color:'rgba(255,255,255,.40)' }}>
        {label}
      </div>
    </div>
  );
}

// ── 44-flower grid ────────────────────────────────────────
const COLORS = ['#D4256E','#E83580','#BF1852','#F26496','#2E5530','#4A7848','#F9C0D2','#D4256E','#E83580'];

function FlowerDot({ color, idx, bloomed, onClick }) {
  return (
    <button onClick={onClick}
      title={`Học sinh ${idx + 1}`}
      style={{
        width:36, height:36, borderRadius:'50%', cursor:'pointer',
        background: bloomed
          ? `radial-gradient(circle at 35% 35%, ${color}EE, ${color}88)`
          : 'rgba(255,255,255,0.06)',
        border: bloomed
          ? `1.5px solid ${color}55`
          : '1.5px solid rgba(255,255,255,0.10)',
        boxShadow: bloomed ? `0 0 12px ${color}44, 0 3px 10px rgba(0,0,0,0.35)` : 'none',
        transform: bloomed ? 'scale(1)' : 'scale(0.3)',
        opacity: bloomed ? 1 : 0,
        transition: `all .60s cubic-bezier(0.34,1.56,0.64,1)`,
        display:'flex', alignItems:'center', justifyContent:'center',
        fontSize: 14,
        flexShrink: 0,
      }}>
      {bloomed && <span style={{ fontSize:16, filter:'drop-shadow(0 1px 3px rgba(0,0,0,.5))' }}>✿</span>}
    </button>
  );
}

function FlowerGarden({ onNav }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (n >= 44) return;
    const t = setTimeout(() => setN(b => b + 1), 65);
    return () => clearTimeout(t);
  }, [n]);
  return (
    <div>
      <div className="label" style={{ textAlign:'center', marginBottom:18 }}>{n} / 44 học sinh</div>
      <div style={{ display:'flex', flexWrap:'wrap', gap:10, justifyContent:'center', maxWidth:520, margin:'0 auto' }}>
        {Array.from({ length:44 }, (_, i) => (
          <FlowerDot key={i} color={COLORS[i % COLORS.length]} idx={i} bloomed={i < n} onClick={onNav}/>
        ))}
      </div>
    </div>
  );
}

// ── Hanging photo ─────────────────────────────────────────
const DEMO = [
  { label:'Sinh Nhat', emoji:'❤', tint:'rgba(212,37,110,.18)' },
  { label:'Giờ ra chơi', emoji:'☀️', tint:'rgba(216,144,48,.18)' },
  { label:'Sinh nhật', emoji:'🎂', tint:'rgba(212,37,110,.12)' },
  { label:'Dã ngoại', emoji:'🌿', tint:'rgba(46,85,48,.20)' },
  { label:'Tổng kết', emoji:'📚', tint:'rgba(168,200,216,.18)' },
];

function HangingPhoto({ item, i }) {
  const hs = -1.4 + i * 0.25;
  const he =  1.2 + i * 0.20;
  return (
    <div style={{
      position:'relative', flexShrink:0,
      animation:`hang${i} ${3.0 + i * .6}s ease-in-out ${i * .35}s infinite`,
      transformOrigin:'top center',
    }}>
      <style>{`@keyframes hang${i}{0%,100%{transform:rotate(${hs}deg)}50%{transform:rotate(${he}deg)}}`}</style>
      {/* String */}
      <div style={{ position:'absolute',top:-32,left:'50%',transform:'translateX(-50%)',width:1.5,height:32, background:'linear-gradient(180deg,rgba(255,255,255,.20),rgba(255,255,255,.50))' }}/>
      {/* Clip */}
      <div style={{ position:'absolute',top:-12,left:'50%',transform:'translateX(-50%)',width:16,height:20,background:'#E8A838',borderRadius:'3px 3px 0 0',boxShadow:'0 2px 6px rgba(0,0,0,.40)' }}>
        <div style={{ position:'absolute',bottom:-2,left:2,right:2,height:4,background:'#C48018',borderRadius:'0 0 2px 2px' }}/>
      </div>
      {/* Photo */}
      <div style={{
        width:118, height:128, borderRadius:3,
        background: item.tint,
        backdropFilter:'blur(16px)',
        border:'5px solid rgba(255,255,255,.90)',
        borderBottom:'30px solid rgba(255,255,255,.90)',
        boxShadow:'0 10px 36px rgba(0,0,0,.50), 0 2px 8px rgba(0,0,0,.30)',
        display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
        cursor:'pointer', transition:'transform .3s, box-shadow .3s',
        position:'relative',
      }}
        onMouseEnter={e => { e.currentTarget.style.transform='scale(1.08)'; e.currentTarget.style.boxShadow='0 18px 50px rgba(0,0,0,.60)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform='scale(1)';    e.currentTarget.style.boxShadow='0 10px 36px rgba(0,0,0,.50)'; }}>
        <div style={{ fontSize:'2.2rem', marginBottom:4 }}>{item.emoji}</div>
        <div style={{ position:'absolute', bottom:6, fontFamily:"'Lora',serif", fontStyle:'italic', fontSize:11, color:'rgba(26,13,18,.65)', textAlign:'center', padding:'0 6px' }}>
          {item.label}
        </div>
      </div>
    </div>
  );
}

// ── Feature cards ─────────────────────────────────────────
const FEATURES = [
  { icon:'✉', title:'Thư Tương lai',  desc:'Gửi ảnh & lời nhắn — mở ngày 01/06/2026', to:'/chung'    },
  { icon:'🅾︎', title:'Locket',          desc:'Chụp & upload — polaroid kỹ thuật số',     to:'/locket'   },
  { icon:'💬', title:'Chat',            desc:'Nhắn tin realtime cả lớp & riêng tư',       to:'/chat'     },
  { icon:'✧', title:'Story',           desc:'Khoảnh khắc 24h tự biến mất',               to:'/story'    },
  { icon:'✰', title:'Sơ đồ Lớp',      desc:'Chỗ ngồi & nhận xét "bạn trong mắt tớ"',   to:'/seating'  },
  { icon:'✎', title:'Lưu bút',         desc:'Ký tên trên lưu bút kỹ thuật số',           to:'/signature'},
];

export default function HomePage() {
  const nav = useNavigate();
  const cd = useCD();

  useEffect(() => {
    const obs = new IntersectionObserver(
      e => e.forEach(x => { if (x.isIntersecting) x.target.classList.add('in'); }),
      { threshold: 0.08 }
    );
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const fa = (d = 0) => ({ opacity:0, animation:`fadeUp .88s ${d}ms var(--ease,ease) forwards` });

  return (
    <div className="wrap">
      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
        @keyframes floatUp{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
      `}</style>

      {/* ── HERO ─────────────────────────────────── */}
      <div style={{ textAlign:'center', padding:'84px 24px 56px', position:'relative', zIndex:10 }}>

        {/* Eyebrow */}
        <div style={{ ...fa(100) }}>
          <span className="eyebrow">✦  khu vườn ký niệm lớp 9C  ✦</span>
        </div>

        {/* Title */}
        <div style={{ ...fa(230), fontFamily:"'Fraunces',serif", fontSize:'clamp(5.5rem,18vw,11rem)', fontWeight:900, lineHeight:.90, letterSpacing:'-0.025em', color:'#fff', marginBottom:16, textShadow:'0 0 100px rgba(212,37,110,.55), 0 6px 40px rgba(0,0,0,.80)' }}>
          9<em style={{ color:'#F26496', fontStyle:'italic' }}>C</em>
        </div>

        <div style={{ ...fa(360), fontFamily:"'Lora',serif", fontStyle:'italic', fontSize:'clamp(1.15rem,3.5vw,1.75rem)', color:'rgba(255,255,255,.68)', letterSpacing:'.05em', marginBottom:64 }}>
          Roots &amp; Bloom — Nơi ký ức nở hoa
        </div>

        {/* Countdown */}
        <div style={{ ...fa(490), marginBottom:56 }}>
          <div style={{ fontFamily:"'Tenor Sans',sans-serif", fontSize:9.5, letterSpacing:'.25em', textTransform:'uppercase', color:'rgba(255,255,255,.35)', marginBottom:18 }}>
            ĐẾM NGƯỢC KỲ THI VÀO LỚP 10
          </div>
          <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
            <CDBox num={cd.d} label="Ngày"/>
            <CDBox num={cd.h} label="Giờ"/>
            <CDBox num={cd.m} label="Phút"/>
            <CDBox num={cd.s} label="Giây"/>
          </div>
          <div style={{ fontFamily:"'Lora',serif", fontStyle:'italic', fontSize:14, color:'rgba(212,37,110,.75)', marginTop:16 }}>
            Kỳ thi vào lớp 10 · Tháng 6, 2026
          </div>
        </div>

        {/* CTAs */}
        <div style={{ ...fa(620), display:'flex', gap:14, justifyContent:'center', flexWrap:'wrap', marginBottom:40 }}>
          <button className="btn btn-primary" onClick={() => nav('/chung')}>💌 Viết thư Tương lai</button>
          <button className="btn btn-ghost" onClick={() => nav('/locket')}>📷 Locket</button>
          <button className="btn btn-ghost" onClick={() => window.__startEnding?.()}>✦ Ending</button>
        </div>
      </div>

      {/* ── FLOWER GARDEN ────────────────────────── */}
      <div className="inner reveal" style={{ marginBottom:72, textAlign:'center' }}>
        <span className="eyebrow" style={{ marginBottom:12 }}>✦ khu vườn nở rộ ✦</span>
        <h2 style={{ fontFamily:"'Fraunces',serif", fontSize:'clamp(2rem,6vw,3rem)', fontWeight:700, color:'#fff', marginBottom:12, letterSpacing:'-.015em', textShadow:'0 2px 24px rgba(0,0,0,.55)' }}>
          44 Bông hoa
        </h2>
        <p style={{ fontFamily:"'Lora',serif", fontStyle:'italic', color:'rgba(255,255,255,.55)', marginBottom:36, fontSize:15 }}>
          Mỗi học sinh là một bông hoa — nhấn để xem sơ đồ lớp
        </p>
        <FlowerGarden onNav={() => nav('/seating')}/>
      </div>

      {/* ── HANGING ALBUM ─────────────────────────── */}
      <div className="inner reveal" style={{ marginBottom:72 }}>
        <div style={{ textAlign:'center', marginBottom:8 }}>
          <span className="eyebrow">✦ album kỷ niệm ✦</span>
          <h2 style={{ fontFamily:"'Fraunces',serif", fontSize:'clamp(2rem,6vw,3rem)', fontWeight:700, color:'#fff', letterSpacing:'-.015em', textShadow:'0 2px 24px rgba(0,0,0,.55)' }}>
            Những khoảnh khắc
          </h2>
        </div>
        {/* Rope line */}
        <div style={{ position:'relative', paddingTop:56, paddingBottom:24 }}>
          <div style={{ position:'absolute', top:22, left:'3%', right:'3%', height:1.5, background:'linear-gradient(90deg,rgba(255,255,255,.08),rgba(255,255,255,.35),rgba(255,255,255,.08))' }}/>
          <div style={{ display:'flex', gap:22, justifyContent:'center', flexWrap:'wrap', position:'relative', zIndex:2 }}>
            {DEMO.map((item, i) => <HangingPhoto key={i} item={item} i={i}/>)}
          </div>
        </div>
      </div>

      {/* ── FEATURE CARDS ─────────────────────────── */}
      <div className="inner">
        <div style={{ textAlign:'center', marginBottom:40 }}>
          <span className="eyebrow">✦ tính năng ✦</span>
          <h2 style={{ fontFamily:"'Fraunces',serif", fontSize:'clamp(2rem,6vw,3rem)', fontWeight:700, color:'#fff', letterSpacing:'-.015em', textShadow:'0 2px 24px rgba(0,0,0,.55)' }}>
            Khám phá khu vườn
          </h2>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:14, marginBottom:64 }}>
          {FEATURES.map((f, i) => (
            <div key={i} className="glass reveal" style={{ padding:'26px 22px', cursor:'pointer', transition:'all .40s', animationDelay:`${i*60}ms` }}
              onClick={() => nav(f.to)}
              onMouseEnter={e => { e.currentTarget.style.transform='translateY(-6px)'; e.currentTarget.style.borderColor='rgba(212,37,110,.42)'; e.currentTarget.style.boxShadow='0 24px 60px rgba(0,0,0,.55), 0 0 0 1px rgba(212,37,110,.20)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.borderColor=''; e.currentTarget.style.boxShadow=''; }}>
              <div style={{ fontSize:'2rem', marginBottom:16, animation:`floatUp ${3.5+i*.5}s ease-in-out ${i*.4}s infinite` }}>{f.icon}</div>
              <div style={{ fontFamily:"'Fraunces',serif", fontSize:'1.1rem', fontWeight:600, color:'#fff', marginBottom:8, letterSpacing:'-.01em' }}>{f.title}</div>
              <div style={{ fontFamily:"'Lora',serif", fontStyle:'italic', fontSize:14, color:'rgba(255,255,255,.55)', lineHeight:1.72 }}>{f.desc}</div>
              <div style={{ marginTop:18, fontFamily:"'Tenor Sans',sans-serif", fontSize:9.5, letterSpacing:'.16em', textTransform:'uppercase', color:'rgba(212,37,110,.70)' }}>
                Khám phá →
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
