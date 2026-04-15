// LocketPage.jsx — Completely rebuilt. Camera works. Masonry gallery.
import { useEffect, useState, useRef, useCallback } from 'react';
import { useAuth } from '../lib/AuthContext';
import { getLocket, uploadLocketPhoto, uploadLocketFromCamera, addReaction, updateStreak, getStreak } from '../lib/firestore';
import toast from 'react-hot-toast';

// ── Camera ────────────────────────────────────────────────
function Camera({ onCapture, onClose }) {
  const vidRef    = useRef(null);
  const canRef    = useRef(null);
  const streamRef = useRef(null);
  const [ready,  setReady]  = useState(false);
  const [facing, setFacing] = useState('user');
  const [flash,  setFlash]  = useState(false);

  const start = useCallback(async (fm) => {
    try {
      streamRef.current?.getTracks().forEach(t => t.stop());
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: fm, width: { ideal: 1280 }, height: { ideal: 1280 } },
        audio: false,
      });
      streamRef.current = stream;
      const v = vidRef.current;
      if (v) { v.srcObject = stream; v.onloadedmetadata = () => { v.play().then(() => setReady(true)); }; }
    } catch {
      toast.error('Không thể mở camera');
      onClose();
    }
  }, [onClose]);

  useEffect(() => { start('user'); return () => streamRef.current?.getTracks().forEach(t => t.stop()); }, [start]);

  const flip = () => { const nf = facing === 'user' ? 'environment' : 'user'; setFacing(nf); start(nf); };

  const shoot = () => {
    const v = vidRef.current; const c = canRef.current;
    if (!v || !c || !ready) return;
    const size = Math.min(v.videoWidth, v.videoHeight);
    c.width = size; c.height = size;
    const ctx = c.getContext('2d');
    const ox = (v.videoWidth  - size) / 2;
    const oy = (v.videoHeight - size) / 2;
    if (facing === 'user') { ctx.save(); ctx.translate(size, 0); ctx.scale(-1, 1); }
    ctx.drawImage(v, ox, oy, size, size, 0, 0, size, size);
    if (facing === 'user') ctx.restore();
    setFlash(true); setTimeout(() => setFlash(false), 300);
    c.toBlob(blob => blob && onCapture(blob, c.toDataURL('image/jpeg', .88)), 'image/jpeg', .88);
  };

  return (
    <div style={{
      position:'fixed', inset:0, zIndex:800, background:'#000',
      display:'flex', flexDirection:'column',
      paddingBottom:'env(safe-area-inset-bottom,0px)',
    }}>
      {/* Flash */}
      {flash && <div style={{ position:'absolute',inset:0,zIndex:10,background:'#fff',animation:'flashOut .3s ease-out both',pointerEvents:'none' }}/>}
      <style>{`@keyframes flashOut{from{opacity:1}to{opacity:0}}`}</style>

      {/* Header */}
      <div style={{
        position:'absolute', top:0, left:0, right:0, zIndex:5,
        padding:'calc(env(safe-area-inset-top,0px) + 16px) 20px 16px',
        display:'flex', justifyContent:'space-between', alignItems:'center',
        background:'linear-gradient(to bottom,rgba(0,0,0,.65),transparent)',
      }}>
        <button onClick={onClose} style={{ background:'rgba(255,255,255,.15)', backdropFilter:'blur(10px)', border:'1px solid rgba(255,255,255,.25)', borderRadius:24, padding:'9px 18px', color:'#fff', fontFamily:"'Tenor Sans',sans-serif", fontSize:10, letterSpacing:'.18em', textTransform:'uppercase', cursor:'pointer' }}>
          ← Đóng
        </button>
        <div style={{ fontFamily:"'Fraunces',serif", fontWeight:600, fontSize:'1.1rem', color:'#fff', letterSpacing:'-.01em' }}>Locket</div>
        <button onClick={flip} style={{ width:40, height:40, borderRadius:'50%', background:'rgba(255,255,255,.15)', backdropFilter:'blur(10px)', border:'1px solid rgba(255,255,255,.25)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 4v6h6M23 20v-6h-6"/><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/>
          </svg>
        </button>
      </div>

      {/* Viewfinder */}
      <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', position:'relative' }}>
        {/* Blurred bg */}
        <video ref={vidRef} playsInline muted style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', transform: facing==='user'?'scaleX(-1)':'none', opacity:.25, filter:'blur(24px)', pointerEvents:'none' }}/>
        {/* Circular frame */}
        <div style={{
          position:'relative',
          width:'min(82vw,82svh,380px)', height:'min(82vw,82svh,380px)',
          borderRadius:'50%', overflow:'hidden', flexShrink:0,
          border:'3px solid rgba(212,37,110,0.55)',
          boxShadow:'0 0 0 8px rgba(212,37,110,0.12), 0 24px 80px rgba(0,0,0,0.70)',
        }}>
          <video ref={vidRef} playsInline muted style={{ width:'100%', height:'100%', objectFit:'cover', transform: facing==='user'?'scaleX(-1)':'none' }}/>
          {!ready && (
            <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(0,0,0,.55)', color:'rgba(255,255,255,.6)', fontFamily:"'Lora',serif", fontStyle:'italic', fontSize:15, textAlign:'center', padding:20 }}>
              Đang khởi động camera...
            </div>
          )}
        </div>
      </div>
      <canvas ref={canRef} style={{ display:'none' }}/>

      {/* Controls */}
      <div style={{ padding:'20px 0 24px', display:'flex', alignItems:'center', justifyContent:'center', gap:40, background:'linear-gradient(to top,rgba(0,0,0,.65),transparent)', flexShrink:0 }}>
        {/* Gallery */}
        <label style={{ width:50, height:50, borderRadius:14, background:'rgba(255,255,255,.18)', border:'1.5px solid rgba(255,255,255,.30)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', fontSize:'1.4rem' }}>
          <input type="file" accept="image/*" style={{ display:'none' }} onChange={e => {
            const f = e.target.files[0]; if (!f) return;
            const r = new FileReader(); r.onload = ev => onCapture(f, ev.target.result); r.readAsDataURL(f);
          }}/>🖼️
        </label>
        {/* Shutter */}
        <button onClick={shoot} disabled={!ready} style={{
          width:80, height:80, borderRadius:'50%',
          background: ready ? '#fff' : 'rgba(255,255,255,.4)',
          border:'5px solid rgba(212,37,110,0.65)',
          cursor: ready ? 'pointer' : 'default',
          boxShadow:'0 0 0 10px rgba(255,255,255,.12), 0 8px 32px rgba(0,0,0,.55)',
          transition:'transform .15s',
          flexShrink: 0,
        }}
          onPointerDown={e => e.currentTarget.style.transform='scale(.90)'}
          onPointerUp={e   => e.currentTarget.style.transform='scale(1)'}/>
        <div style={{ width:50 }}/>
      </div>
      <div style={{ textAlign:'center', paddingBottom:'calc(env(safe-area-inset-bottom,0px) + 8px)', fontFamily:"'Lora',serif", fontStyle:'italic', fontSize:12, color:'rgba(255,255,255,.45)' }}>
        Chạm vòng tròn để chụp
      </div>
    </div>
  );
}

// ── Preview confirm ───────────────────────────────────────
function Preview({ src, onPost, onRetake, busy }) {
  return (
    <div style={{ position:'fixed',inset:0,zIndex:800,background:'#0A0508', display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:28,padding:32 }}>
      <div style={{ width:'min(80vw,360px)',height:'min(80vw,360px)',borderRadius:'50%',overflow:'hidden', border:'3px solid rgba(212,37,110,.55)', boxShadow:'0 0 0 10px rgba(212,37,110,.10),0 24px 80px rgba(0,0,0,.70)' }}>
        <img src={src} alt="" style={{ width:'100%',height:'100%',objectFit:'cover' }}/>
      </div>
      <p style={{ fontFamily:"'Lora',serif",fontStyle:'italic',color:'rgba(255,255,255,.60)',fontSize:15,textAlign:'center' }}>
        Trông tuyệt đấy! Đăng ngay nhé? ✿
      </p>
      <div style={{ display:'flex',gap:16 }}>
        <button onClick={onRetake} className="btn btn-ghost" style={{ padding:'12px 28px' }}>Chụp lại</button>
        <button onClick={onPost} disabled={busy} className="btn btn-primary" style={{ padding:'12px 32px' }}>
          {busy ? '⏳' : 'Đăng lên ✿'}
        </button>
      </div>
    </div>
  );
}

// ── Photo card (polaroid with tape) ──────────────────────
function PhotoCard({ p, onClick }) {
  const rot = ((p.id?.charCodeAt(0) || 0) % 9 - 4) * 0.55;
  const total = Object.values(p.reactions || {}).reduce((a,b)=>a+b, 0);
  return (
    <div onClick={onClick} style={{
      background:'#F5F0EC', borderRadius:3, padding:'8px 8px 40px',
      cursor:'pointer', position:'relative',
      transform:`rotate(${rot}deg)`,
      boxShadow:`0 4px 20px rgba(0,0,0,.32), 1px 1px 0 rgba(0,0,0,.08)`,
      transition:'transform .35s cubic-bezier(.25,.46,.45,.94), box-shadow .35s',
      willChange:'transform',
    }}
      onMouseEnter={e => { e.currentTarget.style.transform='rotate(0deg) translateY(-10px) scale(1.03)'; e.currentTarget.style.boxShadow='0 16px 48px rgba(0,0,0,.45), 1px 1px 0 rgba(0,0,0,.10)'; e.currentTarget.style.zIndex=10; }}
      onMouseLeave={e => { e.currentTarget.style.transform=`rotate(${rot}deg)`; e.currentTarget.style.boxShadow='0 4px 20px rgba(0,0,0,.32), 1px 1px 0 rgba(0,0,0,.08)'; e.currentTarget.style.zIndex=1; }}>
      <img src={p.imageUrl} alt="" loading="lazy"
        style={{ width:'100%', aspectRatio:'1', objectFit:'cover', display:'block', filter:'sepia(.06) contrast(1.04)' }}/>
      {/* Caption strip */}
      <div style={{ position:'absolute',bottom:0,left:0,right:0,padding:'6px 10px 10px', display:'flex',justifyContent:'space-between',alignItems:'flex-end' }}>
        <span style={{ fontFamily:"'Lora',serif",fontStyle:'italic',fontSize:11.5,color:'#5A3040', overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',maxWidth:'68%' }}>
          {p.userName?.split(' ').slice(-1)[0]}
        </span>
        {total > 0 && (
          <span style={{ fontSize:11,color:'#C4185A' }}>
            {Object.entries(p.reactions||{}).filter(([,v])=>v>0).slice(0,2).map(([e,c])=>`${e}${c}`).join(' ')}
          </span>
        )}
      </div>
      {/* Tape strips */}
      <div style={{ position:'absolute',top:-9,left:'20%',width:32,height:14,background:'rgba(212,37,110,.30)',borderRadius:2,transform:'rotate(-3deg)' }}/>
      <div style={{ position:'absolute',top:-9,right:'20%',width:26,height:14,background:'rgba(46,85,48,.28)',borderRadius:2,transform:'rotate(4deg)' }}/>
    </div>
  );
}

// ── Reaction modal ────────────────────────────────────────
const EMOJIS = ['✿','❤️','🔥','😍','✦','☀'];
function ReactModal({ p, onClose, onReact }) {
  if (!p) return null;
  return (
    <div className="modal-bg" onClick={e => e.target===e.currentTarget && onClose()}>
      <div className="glass modal" style={{ maxWidth:420, padding:0, overflow:'hidden' }}>
        <div style={{ padding:'8px 8px 0', background:'rgba(255,255,255,.04)' }}>
          <img src={p.imageUrl} alt="" style={{ width:'100%',borderRadius:'var(--r-lg) var(--r-lg) 0 0',filter:'sepia(.05)' }}/>
        </div>
        <div style={{ padding:'18px 22px 22px' }}>
          <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16 }}>
            <div>
              <div style={{ fontFamily:"'Fraunces',serif",fontWeight:600,fontSize:'1rem',color:'var(--t0)' }}>{p.userName}</div>
              <div style={{ fontFamily:"'Tenor Sans',sans-serif",fontSize:10,letterSpacing:'.12em',textTransform:'uppercase',color:'var(--t3)' }}>{p.dateStr}</div>
            </div>
            <button onClick={onClose} className="btn-icon" style={{ width:32,height:32,fontSize:14 }}>✕</button>
          </div>
          <div style={{ display:'flex',gap:8,flexWrap:'wrap' }}>
            {EMOJIS.map(e => (
              <button key={e} onClick={() => { onReact(e); onClose(); }}
                style={{ padding:'9px 16px',borderRadius:50,background:'rgba(255,255,255,.08)',border:'1px solid rgba(255,255,255,.16)',color:'var(--t0)',fontSize:16,cursor:'pointer',transition:'all .2s' }}
                onMouseEnter={el => el.currentTarget.style.background='rgba(212,37,110,.20)'}
                onMouseLeave={el => el.currentTarget.style.background='rgba(255,255,255,.08)'}>
                {e}{p.reactions?.[e]>0 ? <sup style={{fontSize:10,marginLeft:3}}>{p.reactions[e]}</sup> : null}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Streak indicator ──────────────────────────────────────
const STREAK_STAGES = [
  {min:1,  icon:'🌱', label:'1 ngày'},
  {min:3,  icon:'🌿', label:'3 ngày'},
  {min:7,  icon:'🌸', label:'7 ngày'},
  {min:14, icon:'🌺', label:'14 ngày'},
  {min:30, icon:'🌳', label:'30 ngày'},
];

// ── Main page ─────────────────────────────────────────────
export default function LocketPage() {
  const { user } = useAuth();
  const [photos,    setPhotos]    = useState([]);
  const [streak,    setStreak]    = useState(0);
  const [selected,  setSelected]  = useState(null);
  const [uploading, setUploading] = useState(false);
  const [showCam,   setShowCam]   = useState(false);
  const [capBlob,   setCapBlob]   = useState(null);
  const [capPrev,   setCapPrev]   = useState(null);

  useEffect(() => {
    let unsub;
    try { unsub = getLocket(setPhotos); } catch {}
    getStreak(user.uid).then(setStreak).catch(() => {});
    return () => unsub?.();
  }, [user.uid]);

  const doUpload = async e => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    try {
      for (const f of files) await uploadLocketPhoto(user.uid, user.displayName || 'Ẩn danh', f);
      const s = await updateStreak(user.uid); setStreak(s);
      toast.success(`Upload xong ✿  Streak: ${s} ngày`);
    } catch { toast.error('Cần cấu hình Firebase để upload'); }
    finally { setUploading(false); e.target.value = ''; }
  };

  const onCapture = (blobOrFile, preview) => {
    setCapBlob(blobOrFile); setCapPrev(preview); setShowCam(false);
  };
  const postCapture = async () => {
    if (!capBlob) return;
    setUploading(true);
    try {
      await uploadLocketFromCamera(user.uid, user.displayName || 'Ẩn danh', capBlob);
      const s = await updateStreak(user.uid); setStreak(s);
      toast.success(`Locket đã đăng ✿  Streak: ${s} ngày`);
      setCapBlob(null); setCapPrev(null);
    } catch { toast.error('Cần cấu hình Firebase'); }
    finally { setUploading(false); }
  };

  const doReact = async emoji => {
    if (selected) try { await addReaction(selected.id, emoji); } catch {}
  };

  // Group by date
  const grouped = photos.reduce((acc, p) => {
    const k = p.dateStr || '—';
    if (!acc[k]) acc[k] = [];
    acc[k].push(p);
    return acc;
  }, {});

  // Camera & preview fullscreen views
  if (showCam)  return <Camera onCapture={onCapture} onClose={() => setShowCam(false)}/>;
  if (capPrev)  return <Preview src={capPrev} onPost={postCapture}
    onRetake={() => { setCapBlob(null); setCapPrev(null); setShowCam(true); }} busy={uploading}/>;

  return (
    <div className="wrap">
      {/* Header */}
      <div className="page-hero" style={{ paddingBottom:8 }}>
        <span className="eyebrow">✦ Locket lớp 9C ✦</span>
        <h1 className="title-lg" style={{ marginBottom:10 }}>Locket</h1>
        <p className="body-italic" style={{ maxWidth:400, margin:'0 auto' }}>
          Ghi lại mọi khoảnh khắc — upload không giới hạn
        </p>
      </div>

      <div className="inner">
        {/* Action bar */}
        <div className="glass" style={{ padding:'18px 22px', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:14, marginBottom:28 }}>
          {/* Streak */}
          <div>
            <div className="label" style={{ marginBottom:9 }}>Upload streak</div>
            <div style={{ display:'flex',alignItems:'center',gap:8 }}>
              {STREAK_STAGES.map(s => (
                <span key={s.icon} title={s.label} style={{
                  fontSize:'1.3rem', lineHeight:1,
                  opacity: streak >= s.min ? 1 : 0.20,
                  filter: streak >= s.min ? 'none' : 'grayscale(1)',
                  transition:'all .4s',
                }}>{s.icon}</span>
              ))}
              {streak > 0 && (
                <span style={{ fontFamily:"'Fraunces',serif", fontStyle:'italic', fontSize:'0.95rem', color:'var(--f-light)', marginLeft:6 }}>
                  {streak} ngày
                </span>
              )}
            </div>
          </div>
          {/* Buttons */}
          <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
            <button className="btn btn-primary" onClick={() => setShowCam(true)}>
              📷 Chụp ảnh
            </button>
            <label style={{ cursor:'pointer' }}>
              <input type="file" accept="image/*" multiple style={{ display:'none' }} onChange={doUpload} disabled={uploading}/>
              <span className="btn btn-ghost" style={{ pointerEvents:'none' }}>
                {uploading ? '⏳ Đang tải...' : '🖼 Thư viện'}
              </span>
            </label>
          </div>
        </div>

        {/* Empty */}
        {photos.length === 0 && (
          <div style={{ textAlign:'center', padding:'72px 0' }}>
            <div style={{ fontSize:'3.5rem', marginBottom:18, opacity:.4 }}>📷</div>
            <h3 className="title-md" style={{ marginBottom:10, opacity:.75 }}>Chưa có ảnh nào</h3>
            <p className="body-italic" style={{ marginBottom:28 }}>Bắt đầu ghi lại kỷ niệm từ hôm nay</p>
            <button className="btn btn-primary" onClick={() => setShowCam(true)}>📷 Mở camera ngay</button>
          </div>
        )}

        {/* Photo groups */}
        {Object.entries(grouped).map(([date, items]) => (
          <div key={date} style={{ marginBottom:52 }}>
            {/* Date header */}
            <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:28 }}>
              <span className="eyebrow" style={{ marginBottom:0 }}>{date}</span>
              <div style={{ flex:1, height:1, background:'linear-gradient(90deg,rgba(212,37,110,.25),transparent)' }}/>
              <span style={{ fontFamily:"'Lora',serif", fontStyle:'italic', fontSize:13, color:'var(--t3)' }}>{items.length} ảnh</span>
            </div>
            {/* Polaroid grid */}
            <div style={{
              display:'grid',
              gridTemplateColumns:'repeat(auto-fill, minmax(145px, 1fr))',
              gap:28,
              padding:'10px 6px 16px',
            }}>
              {items.map(p => <PhotoCard key={p.id} p={p} onClick={() => setSelected(p)}/>)}
            </div>
          </div>
        ))}
      </div>

      <ReactModal p={selected} onClose={() => setSelected(null)} onReact={doReact}/>
    </div>
  );
}
