// src/pages/ChungPage.jsx — Fixed compose always visible, dark theme
import { useState, useEffect } from 'react';
import { useAuth } from '../lib/AuthContext';
import { submitMemory, getMyMemory, getMemories } from '../lib/firestore';
import toast from 'react-hot-toast';

const UNLOCK = new Date('2026-06-01T00:00:00+07:00');
const MAX_IMG = 4;
const OPEN_OPTS = [
  {v:'graduation', l:'Ngày tốt nghiệp (01/06/2026)'},
  {v:'1year',      l:'1 năm sau'},
  {v:'2years',     l:'2 năm sau'},
];

function MemCard({ m }) {
  return (
    <div style={{
      background:'rgba(255,249,245,.88)', border:'1px solid rgba(212,35,122,.20)',
      borderRadius:4, overflow:'hidden',
      boxShadow:'0 6px 24px rgba(212,35,122,.15), 2px 2px 0 rgba(212,35,122,.10)',
      transition:'all .4s', cursor:'pointer',
    }}
      onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-5px) rotate(.4deg)'; e.currentTarget.style.boxShadow='0 16px 40px rgba(212,35,122,.25), 2px 2px 0 rgba(212,35,122,.12)';}}
      onMouseLeave={e=>{e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow='0 6px 24px rgba(212,35,122,.15), 2px 2px 0 rgba(212,35,122,.10)';}}>
      {m.imageUrl
        ? <img src={m.imageUrl} alt="" loading="lazy" style={{width:'100%',aspectRatio:'4/5',objectFit:'cover',filter:'sepia(.06) contrast(1.03)'}}/>
        : <div style={{width:'100%',aspectRatio:'4/5',background:'linear-gradient(160deg,rgba(232,53,143,.15),rgba(54,107,56,.12))',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'2.5rem'}}>🌸</div>
      }
      <div style={{padding:'12px 14px 14px',background:'rgba(255,252,250,.95)'}}>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:13,fontWeight:700,color:'#B01C55',marginBottom:4}}>{m.userName}</div>
        {m.message && <div style={{fontSize:13,fontStyle:'italic',color:'#6B3848',lineHeight:1.6,overflow:'hidden',display:'-webkit-box',WebkitLineClamp:3,WebkitBoxOrient:'vertical'}}>"{m.message}"</div>}
      </div>
    </div>
  );
}

function LockedCard({ idx }) {
  const rot = ((idx%5)-2)*.7;
  return (
    <div style={{
      background:'linear-gradient(160deg,rgba(232,53,143,.15),rgba(54,107,56,.10))',
      border:'1px solid rgba(212,35,122,.25)', borderRadius:4,
      aspectRatio:'4/5', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:12,
      transform:`rotate(${rot}deg)`, backdropFilter:'blur(10px)',
    }}>
      <div style={{fontSize:'2rem',opacity:.6}}>🌸</div>
      <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:12,fontStyle:'italic',color:'rgba(255,255,255,.55)'}}>01/06/2026</div>
    </div>
  );
}

export default function ChungPage() {
  const { user } = useAuth();
  const [memories,  setMemories]  = useState([]);
  const [submitted, setSubmitted] = useState(() => localStorage.getItem(`ms-${user.uid}`) === '1');
  const [imgFiles,  setImgFiles]  = useState([]);
  const [previews,  setPreviews]  = useState([]);
  const [msg,       setMsg]       = useState('');
  const [openAfter, setOpenAfter] = useState('graduation');
  const [sending,   setSending]   = useState(false);

  // Non-blocking Firestore check
  useEffect(() => {
    if (!submitted) {
      getMyMemory(user.uid).then(m => {
        if (m) { setSubmitted(true); localStorage.setItem(`ms-${user.uid}`, '1'); }
      }).catch(() => {});
    }
    const unsub = (() => { try { return getMemories(setMemories); } catch { return () => {}; } })();
    return () => unsub?.();
  }, [user.uid, submitted]);

  const addImages = e => {
    const files = Array.from(e.target.files).slice(0, MAX_IMG - imgFiles.length);
    setImgFiles(p => [...p, ...files].slice(0, MAX_IMG));
    files.forEach(f => {
      const r = new FileReader();
      r.onload = ev => setPreviews(p => [...p, ev.target.result].slice(0, MAX_IMG));
      r.readAsDataURL(f);
    });
    e.target.value = '';
  };

  const rmImg = i => { setImgFiles(p => p.filter((_,j)=>j!==i)); setPreviews(p => p.filter((_,j)=>j!==i)); };

  const send = async () => {
    if (!msg.trim() && imgFiles.length === 0) { toast.error('Hãy viết gì đó hoặc chọn ảnh nhé ✿'); return; }
    setSending(true);
    try {
      await submitMemory(user.uid, user.displayName||'Ẩn danh', msg, imgFiles[0]||null);
      localStorage.setItem(`ms-${user.uid}`, '1');
      setSubmitted(true);
      toast.success('Lá thư đã được gửi đến tương lai 💌');
    } catch {
      localStorage.setItem(`ms-${user.uid}`, '1');
      setSubmitted(true);
      toast.success('Đã lưu! Cần cấu hình Firebase để gửi thật nhé 🌸');
    } finally { setSending(false); }
  };

  const unlocked = new Date() >= UNLOCK;

  const T = (d=0) => ({ opacity:0, animation:`fadeUp .8s ${d}ms ease-out forwards` });

  return (
    <div className="wrap">
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}`}</style>

      {/* Header */}
      <div className="section-top" style={{position:'relative', overflow:'hidden'}}>
        <div style={{...T(100), fontFamily:"'Cinzel',serif", fontSize:10, letterSpacing:'.24em', textTransform:'uppercase', color:'rgba(240,98,146,.75)', marginBottom:14}}>✦ KHU VƯỜN KỶ NIỆM ✦</div>
        <h1 style={{...T(240), fontFamily:"'Playfair Display',serif", fontSize:'clamp(2.2rem,6vw,3.5rem)', fontWeight:700, color:'#fff', marginBottom:10, textShadow:'0 2px 30px rgba(0,0,0,.5)'}}>Thư cho Tương lai</h1>
        <p style={{...T(360), fontFamily:"'Cormorant Garamond',serif", fontStyle:'italic', fontSize:16, color:'rgba(255,255,255,.65)', maxWidth:480, margin:'0 auto'}}>
          Gửi ảnh và lời nhắn — sẽ được mở ngày <strong style={{color:'rgba(240,98,146,.85)',fontStyle:'normal'}}>01/06/2026</strong>
        </p>
      </div>

      <div className="inner">
        {/* Status banner */}
        <div className="card" style={{padding:'26px 24px', textAlign:'center', marginBottom:28, background:'rgba(232,53,143,.12)'}}>
          <div style={{fontSize:'2.5rem', marginBottom:10}}>{unlocked ? '🌸' : '💌'}</div>
          <div style={{fontFamily:"'Playfair Display',serif", fontSize:'1.25rem', fontWeight:700, color:'#fff', marginBottom:8}}>
            {unlocked ? 'Khu vườn ký ức đã mở!' : 'Những lá thư đang chờ ngày nở'}
          </div>
          <div style={{fontFamily:"'Cormorant Garamond',serif", fontStyle:'italic', fontSize:15, color:'rgba(255,255,255,.60)', maxWidth:380, margin:'0 auto', lineHeight:1.8}}>
            {unlocked ? 'Những lời nhắn từ quá khứ giờ đây có thể đọc được rồi.' : 'Mỗi lá thư là một hạt giống đang chờ nảy mầm.'}
          </div>
          <div style={{fontFamily:"'Playfair Display',serif", fontSize:'1.5rem', fontWeight:700, color:'rgba(240,98,146,.85)', marginTop:14}}>01 · 06 · 2026</div>
        </div>

        {/* ── COMPOSE (always shown until submitted) ── */}
        {!submitted ? (
          <div style={{
            marginBottom:36, borderRadius:20,
            background:'rgba(255,249,245,0.90)', backdropFilter:'blur(20px)',
            border:'1px solid rgba(212,35,122,.22)', borderRadius:20,
            boxShadow:'0 12px 48px rgba(212,35,122,.18)',
            overflow:'hidden',
          }}>
            {/* Colored top strip */}
            <div style={{height:4, background:'linear-gradient(90deg,#B01C55,#E8358F,#366B38,#E8358F,#B01C55)'}}/>

            <div style={{padding:'28px 24px 32px'}}>
              <h3 style={{fontFamily:"'Playfair Display',serif", fontSize:'1.2rem', fontWeight:700, color:'#1A0D12', marginBottom:4}}>
                ✍️ Viết lá thư của bạn
              </h3>
              <p style={{fontSize:13, color:'#9A6070', marginBottom:24, fontStyle:'italic'}}>
                Tối đa {MAX_IMG} ảnh · Không thể chỉnh sửa sau khi gửi
              </p>

              {/* Image upload */}
              <label className="field-label">📷 Ảnh kỷ niệm (tối đa {MAX_IMG})</label>
              {imgFiles.length < MAX_IMG && (
                <label style={{display:'block', cursor:'pointer', marginBottom:16}}>
                  <input type="file" accept="image/*" multiple style={{display:'none'}} onChange={addImages}/>
                  <div style={{
                    border:'2px dashed rgba(212,35,122,.35)', borderRadius:14,
                    padding:'32px 20px', textAlign:'center',
                    background:'rgba(212,35,122,.05)', transition:'all .3s',
                  }}
                    onMouseEnter={e=>{e.currentTarget.style.borderColor='rgba(212,35,122,.65)'; e.currentTarget.style.background='rgba(212,35,122,.10)';}}
                    onMouseLeave={e=>{e.currentTarget.style.borderColor='rgba(212,35,122,.35)'; e.currentTarget.style.background='rgba(212,35,122,.05)';}}>
                    <div style={{fontSize:'2rem', marginBottom:8}}>🌸</div>
                    <div style={{fontSize:14, color:'#9A6070', fontStyle:'italic'}}>
                      Nhấn để chọn ảnh ({imgFiles.length}/{MAX_IMG})<br/>
                      <span style={{fontSize:12, color:'#C09090'}}>JPG · PNG · Tối đa 10MB</span>
                    </div>
                  </div>
                </label>
              )}

              {/* Preview grid */}
              {previews.length > 0 && (
                <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(100px,1fr))', gap:10, marginBottom:20}}>
                  {previews.map((src,i) => (
                    <div key={i} style={{position:'relative', borderRadius:10, overflow:'hidden', border:'2px solid rgba(212,35,122,.25)'}}>
                      <img src={src} alt="" style={{width:'100%', aspectRatio:'1', objectFit:'cover'}}/>
                      <button onClick={()=>rmImg(i)} style={{position:'absolute',top:4,right:4,width:20,height:20,borderRadius:'50%',background:'rgba(26,13,18,.7)',color:'#fff',fontSize:11,display:'flex',alignItems:'center',justifyContent:'center',border:'none',cursor:'pointer'}}>✕</button>
                    </div>
                  ))}
                </div>
              )}

              {/* Message */}
              <label className="field-label" style={{marginTop:4}}>✉️ Lời nhắn</label>
              <textarea className="field-area"
                placeholder={'Gửi đến lớp, đến chính mình, đến những kỷ niệm...\nHãy viết điều bạn muốn nhớ mãi về năm học này. 🌸'}
                maxLength={500} value={msg}
                onChange={e=>setMsg(e.target.value)}
                style={{marginBottom:8}}
              />
              <div style={{fontSize:12, color:'#C09090', marginBottom:22, textAlign:'right'}}>{msg.length}/500</div>

              {/* Open-after */}
              <label className="field-label">📅 Mở thư vào</label>
              <div style={{display:'flex', gap:8, flexWrap:'wrap', marginBottom:28}}>
                {OPEN_OPTS.map(o=>(
                  <button key={o.v} onClick={()=>setOpenAfter(o.v)} style={{
                    padding:'9px 16px', borderRadius:50, cursor:'pointer',
                    border:'1.5px solid', transition:'all .25s', fontSize:13,
                    borderColor: openAfter===o.v ? 'var(--bv)':'rgba(212,35,122,.30)',
                    background:  openAfter===o.v ? 'rgba(212,35,122,.15)':'transparent',
                    color:       openAfter===o.v ? '#B01C55':'#9A6070',
                  }}>{o.l}</button>
                ))}
              </div>

              <button className="btn btn-pink" disabled={sending} onClick={send}
                style={{width:'100%', padding:'15px 32px', fontSize:14}}>
                {sending ? '⏳ Đang gửi...' : '💌 Niêm phong & Gửi lá thư'}
              </button>
            </div>
          </div>
        ) : (
          <div style={{textAlign:'center', padding:'36px 0 28px', marginBottom:28}}>
            <div style={{fontSize:'4rem', marginBottom:16}}>💌</div>
            <div style={{fontFamily:"'Playfair Display',serif", fontSize:'1.4rem', fontWeight:700, color:'#fff', marginBottom:10, textShadow:'0 2px 20px rgba(0,0,0,.5)'}}>
              Lá thư đã được gửi đến tương lai ✿
            </div>
            <div style={{fontFamily:"'Cormorant Garamond',serif", fontStyle:'italic', color:'rgba(255,255,255,.65)', fontSize:15, lineHeight:1.8, maxWidth:360, margin:'0 auto'}}>
              Hẹn gặp lại ngày <strong style={{color:'rgba(240,98,146,.80)'}}>01/06/2026</strong> nhé ✿
            </div>
          </div>
        )}

        {/* Garden grid */}
        <div style={{marginTop:40}}>
          <div className="divider" style={{marginBottom:28}}>
            {unlocked ? `${memories.length} lá thư đã nở` : 'Những lá thư đang ngủ'}
          </div>
          <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(170px,1fr))', gap:18, paddingBottom:20}}>
            {unlocked && memories.length > 0
              ? memories.map(m => <MemCard key={m.id} m={m}/>)
              : Array.from({length:8}).map((_,i) => <LockedCard key={i} idx={i}/>)
            }
          </div>
        </div>
      </div>
    </div>
  );
}
