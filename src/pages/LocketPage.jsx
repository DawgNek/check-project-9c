// src/pages/LocketPage.jsx — Fixed camera layout + mobile UX
import { useEffect, useState, useRef, useCallback } from 'react';
import { useAuth } from '../lib/AuthContext';
import { getLocket, uploadLocketPhoto, uploadLocketFromCamera, addReaction, updateStreak, getStreak } from '../lib/firestore';
import toast from 'react-hot-toast';

const REACTIONS   = ['✿','❤','✦','☀','❧'];
const STREAK_LVLS = [
  {min:1,icon:'🌱',label:'1 ngày'},{min:3,icon:'🌿',label:'3 ngày'},
  {min:7,icon:'🌸',label:'7 ngày'},{min:14,icon:'🌺',label:'14 ngày'},
  {min:30,icon:'🌳',label:'30 ngày'},
];

/* ── Camera — full-screen fixed, proper layout ────── */
function LocketCamera({ onCapture, onClose }) {
  const videoRef  = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const [ready,  setReady]  = useState(false);
  const [facing, setFacing] = useState('user');
  const [flash,  setFlash]  = useState(false);

  const startCam = useCallback(async (fm = facing) => {
    try {
      streamRef.current?.getTracks().forEach(t => t.stop());
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: fm, width:{ ideal:1280 }, height:{ ideal:1280 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
          setReady(true);
        };
      }
    } catch (err) {
      toast.error('Không thể mở camera. Kiểm tra quyền truy cập.');
      onClose();
    }
  }, [facing, onClose]);

  useEffect(() => { startCam(); return () => streamRef.current?.getTracks().forEach(t=>t.stop()); }, []);

  const flip = () => {
    const nf = facing === 'user' ? 'environment' : 'user';
    setFacing(nf); startCam(nf);
  };

  const capture = () => {
    const video  = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    const size = Math.min(video.videoWidth, video.videoHeight);
    canvas.width = size; canvas.height = size;
    const ctx = canvas.getContext('2d');
    const ox = (video.videoWidth  - size) / 2;
    const oy = (video.videoHeight - size) / 2;
    if (facing === 'user') { ctx.save(); ctx.translate(size,0); ctx.scale(-1,1); }
    ctx.drawImage(video, ox, oy, size, size, 0, 0, size, size);
    if (facing === 'user') ctx.restore();
    setFlash(true);
    setTimeout(()=>setFlash(false), 350);
    canvas.toBlob(blob => { if (blob) onCapture(blob, canvas.toDataURL('image/jpeg',.88)); }, 'image/jpeg', .88);
  };

  return (
    <div style={{
      position:'fixed', inset:0, zIndex:800, background:'#111',
      display:'flex', flexDirection:'column', alignItems:'center',
      justifyContent:'space-between', paddingBottom:'env(safe-area-inset-bottom,0px)',
    }}>
      {/* Flash */}
      {flash && (
        <div style={{ position:'absolute', inset:0, background:'#fff', zIndex:10, animation:'flashOut .35s ease-out forwards', pointerEvents:'none' }}/>
      )}
      <style>{`@keyframes flashOut{from{opacity:1}to{opacity:0}}`}</style>

      {/* Top bar */}
      <div style={{
        position:'absolute', top:0, left:0, right:0, zIndex:5,
        padding:'calc(env(safe-area-inset-top,0px) + 14px) 20px 14px',
        display:'flex', justifyContent:'space-between', alignItems:'center',
        background:'linear-gradient(to bottom,rgba(0,0,0,.55),transparent)',
      }}>
        <button onClick={onClose} style={{
          color:'#fff', background:'rgba(255,255,255,.18)', backdropFilter:'blur(8px)',
          border:'none', borderRadius:24, padding:'9px 18px', cursor:'pointer',
          fontFamily:'var(--font-label)', fontSize:'.72rem', letterSpacing:'.08em',
          display:'flex', alignItems:'center', gap:6,
        }}>← Đóng</button>

        <div style={{ color:'#fff', fontFamily:'var(--font-display)', fontSize:'1.05rem', fontWeight:600, letterSpacing:'.04em' }}>
          Locket 📷
        </div>

        <button onClick={flip} style={{
          width:42, height:42, borderRadius:'50%',
          background:'rgba(255,255,255,.18)', backdropFilter:'blur(8px)',
          border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
          fontSize:'1.3rem', color:'#fff',
        }}>🔄</button>
      </div>

      {/* Video — fills all available space */}
      <div style={{ flex:1, width:'100%', display:'flex', alignItems:'center', justifyContent:'center', position:'relative', overflow:'hidden' }}>
        {/* Circular mask */}
        <div style={{
          position:'relative',
          width:'min(82vw, 82vh, 380px)',
          height:'min(82vw, 82vh, 380px)',
          borderRadius:'50%',
          overflow:'hidden',
          border:'4px solid rgba(246,193,204,.65)',
          boxShadow:'0 0 0 8px rgba(246,193,204,.15), 0 24px 80px rgba(0,0,0,.55)',
          flexShrink:0,
        }}>
          <video ref={videoRef} autoPlay playsInline muted
            style={{ width:'100%', height:'100%', objectFit:'cover',
              transform: facing==='user' ? 'scaleX(-1)' : 'none' }}
          />
          {!ready && (
            <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center',
              background:'rgba(0,0,0,.4)', color:'rgba(255,255,255,.7)',
              fontFamily:'var(--font-body)', fontSize:'.9rem', fontStyle:'italic', textAlign:'center', padding:16 }}>
              Đang khởi động camera...
            </div>
          )}
        </div>
        {/* Full-screen blurred background for non-circle area */}
        <video ref={videoRef} autoPlay playsInline muted
          style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover',
            transform: facing==='user' ? 'scaleX(-1)' : 'none',
            opacity:.25, filter:'blur(20px)', zIndex:-1 }}
        />
      </div>

      <canvas ref={canvasRef} style={{ display:'none' }}/>

      {/* Bottom controls */}
      <div style={{
        width:'100%', padding:'20px 32px 24px',
        display:'flex', alignItems:'center', justifyContent:'center',
        background:'linear-gradient(to top,rgba(0,0,0,.6),transparent)',
        gap:40,
      }}>
        {/* Gallery shortcut */}
        <label style={{ width:48, height:48, borderRadius:14, overflow:'hidden',
          background:'rgba(255,255,255,.22)', border:'2px solid rgba(255,255,255,.3)',
          cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.4rem' }}>
          <input type="file" accept="image/*" style={{ display:'none' }}
            onChange={e => {
              const f = e.target.files[0]; if (!f) return;
              const r = new FileReader();
              r.onload = ev => onCapture(f, ev.target.result);
              r.readAsDataURL(f);
            }}/>
          🖼️
        </label>

        {/* Shutter */}
        <button onClick={capture} disabled={!ready}
          style={{
            width:80, height:80, borderRadius:'50%',
            background:'#fff', border:'6px solid rgba(246,193,204,.8)',
            cursor: ready ? 'pointer' : 'default',
            boxShadow:'0 0 0 10px rgba(255,255,255,.18), 0 8px 32px rgba(0,0,0,.4)',
            transition:'transform .15s, box-shadow .15s', flexShrink:0,
            opacity: ready ? 1 : .55,
          }}
          onMouseDown={e=>{ e.currentTarget.style.transform='scale(.9)'; }}
          onMouseUp={e=>{ e.currentTarget.style.transform='scale(1)'; }}
          onTouchStart={e=>{ e.currentTarget.style.transform='scale(.88)'; }}
          onTouchEnd={e=>{ e.currentTarget.style.transform='scale(1)'; }}
        />

        {/* Spacer */}
        <div style={{ width:48, height:48 }}/>
      </div>

      <div style={{ color:'rgba(255,255,255,.5)', fontFamily:'var(--font-body)', fontSize:'.8rem',
        fontStyle:'italic', paddingBottom:'calc(env(safe-area-inset-bottom,0px) + 8px)', textAlign:'center' }}>
        Nhấn vòng tròn để chụp
      </div>
    </div>
  );
}

/* ── Capture preview ─────────────────────────────── */
function CapturePreview({ preview, onPost, onRetake, uploading }) {
  return (
    <div style={{ position:'fixed', inset:0, zIndex:800, background:'#111',
      display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:28, padding:32 }}>
      {/* Circular preview */}
      <div style={{
        width:'min(80vw,360px)', height:'min(80vw,360px)',
        borderRadius:'50%', overflow:'hidden',
        border:'5px solid rgba(246,193,204,.7)',
        boxShadow:'0 0 0 10px rgba(246,193,204,.12), 0 24px 80px rgba(0,0,0,.55)',
      }}>
        <img src={preview} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
      </div>
      <div style={{ fontFamily:'var(--font-heading)', fontSize:'.95rem', fontStyle:'italic',
        color:'rgba(255,255,255,.65)', textAlign:'center' }}>
        Nhìn đẹp đấy! Đăng ngay không? ✿
      </div>
      <div style={{ display:'flex', gap:16 }}>
        <button onClick={onRetake} style={{
          padding:'12px 28px', borderRadius:50,
          border:'1.5px solid rgba(255,255,255,.35)', background:'rgba(255,255,255,.1)',
          color:'#fff', fontFamily:'var(--font-label)', fontSize:'.74rem',
          letterSpacing:'.1em', textTransform:'uppercase', cursor:'pointer',
          backdropFilter:'blur(8px)',
        }}>Chụp lại</button>
        <button onClick={onPost} disabled={uploading} style={{
          padding:'12px 32px', borderRadius:50,
          background:'linear-gradient(135deg,var(--pink-deep),var(--rose-soft))',
          border:'none', color:'#fff', fontFamily:'var(--font-label)',
          fontSize:'.74rem', letterSpacing:'.1em', textTransform:'uppercase',
          cursor:'pointer', boxShadow:'0 8px 28px rgba(216,96,122,.45)',
        }}>
          {uploading ? '⏳...' : 'Đăng lên ✿'}
        </button>
      </div>
    </div>
  );
}

/* ── Polaroid card ──────────────────────────────── */
function Polaroid({ photo, onClick }) {
  const rot = ((photo.id?.charCodeAt(0)||0) % 7 - 3) * .6;
  return (
    <div onClick={onClick} style={{
      background:'#fffcf7', border:'1px solid var(--aged)', borderRadius:3,
      padding:'8px 8px 36px',
      boxShadow:`var(--shadow-sm), 1px 1px 0 var(--aged)`,
      cursor:'pointer', transform:`rotate(${rot}deg)`, transition:'all .35s', position:'relative',
    }}
      onMouseEnter={e=>{ e.currentTarget.style.transform='rotate(0) translateY(-8px) scale(1.03)'; e.currentTarget.style.zIndex=5; e.currentTarget.style.boxShadow='var(--shadow-md), 1px 1px 0 var(--aged)'; }}
      onMouseLeave={e=>{ e.currentTarget.style.transform=`rotate(${rot}deg)`; e.currentTarget.style.zIndex=1; e.currentTarget.style.boxShadow='var(--shadow-sm), 1px 1px 0 var(--aged)'; }}
    >
      <img src={photo.imageUrl} alt="" loading="lazy"
        style={{ width:'100%', aspectRatio:'1', objectFit:'cover', display:'block', filter:'sepia(.06) contrast(1.02)' }}/>
      <div style={{ position:'absolute', bottom:6, left:8, right:8, display:'flex', justifyContent:'space-between', alignItems:'flex-end' }}>
        <span style={{ fontFamily:'var(--font-heading)', fontSize:'.72rem', color:'var(--ink-muted)', fontStyle:'italic',
          overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:'70%' }}>
          {photo.userName?.split(' ').slice(-1)[0]}
        </span>
        {Object.values(photo.reactions||{}).some(v=>v>0) && (
          <span style={{ fontSize:'.65rem', color:'var(--rose-soft)' }}>
            {Object.entries(photo.reactions||{}).filter(([,v])=>v>0).slice(0,2).map(([e,c])=>`${e}${c}`).join(' ')}
          </span>
        )}
      </div>
      {/* Tape */}
      <div style={{ position:'absolute', top:-8, left:'22%', width:28, height:13, background:'rgba(232,200,120,.5)', borderRadius:2, transform:'rotate(-3deg)' }}/>
      <div style={{ position:'absolute', top:-8, right:'22%', width:24, height:13, background:'rgba(207,232,213,.6)', borderRadius:2, transform:'rotate(4deg)' }}/>
    </div>
  );
}

/* ── Reaction modal ──────────────────────────────── */
function ReactModal({ photo, onClose, onReact }) {
  if (!photo) return null;
  return (
    <div style={{ position:'fixed', inset:0, zIndex:700, background:'rgba(45,24,34,.6)',
      backdropFilter:'blur(8px)', display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}
      onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="card" style={{ maxWidth:420, width:'100%', padding:24, animation:'bloom .3s ease-out' }}>
        <style>{`@keyframes bloom{from{opacity:0;transform:scale(.93)}to{opacity:1;transform:scale(1)}}`}</style>
        <button onClick={onClose} style={{ float:'right', width:28, height:28, borderRadius:'50%',
          border:'1px solid var(--border)', background:'transparent', color:'var(--ink-faint)', cursor:'pointer', fontSize:13 }}>✕</button>
        <div style={{ padding:'0 6px 6px', background:'#faf6ef', border:'1px solid var(--aged)', borderRadius:3, marginBottom:16 }}>
          <img src={photo.imageUrl} alt="" style={{ width:'100%', borderRadius:2, filter:'sepia(.05)' }}/>
        </div>
        <div style={{ fontFamily:'var(--font-heading)', fontSize:'.92rem', fontWeight:600, color:'var(--rose-soft)', marginBottom:14 }}>
          {photo.userName} · {photo.dateStr}
        </div>
        <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
          {REACTIONS.map(r=>(
            <button key={r} className="btn btn-glass" style={{ padding:'10px 16px', fontSize:'1.2rem' }}
              onClick={()=>{ onReact(r); onClose(); }}>
              {r}{photo.reactions?.[r]>0 ? <sup style={{ fontSize:'.75rem' }}>{photo.reactions[r]}</sup> : null}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Main LocketPage ─────────────────────────────── */
export default function LocketPage() {
  const { user } = useAuth();
  const [photos,     setPhotos]     = useState([]);
  const [streak,     setStreak]     = useState(0);
  const [selected,   setSelected]   = useState(null);
  const [uploading,  setUploading]  = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [capBlob,    setCapBlob]    = useState(null);
  const [capPrev,    setCapPrev]    = useState(null);

  useEffect(() => {
    let unsub;
    try { unsub = getLocket(setPhotos); } catch {}
    getStreak(user.uid).then(setStreak).catch(()=>{});
    return () => unsub?.();
  }, [user.uid]);

  const handleUploadFile = async e => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    try {
      for (const f of files) await uploadLocketPhoto(user.uid, user.displayName||'Ẩn danh', f);
      const s = await updateStreak(user.uid); setStreak(s);
      toast.success(`Upload xong ✿ Streak: ${s} ngày`);
    } catch { toast.error('Upload thất bại. Cần cấu hình Firebase.'); }
    finally { setUploading(false); e.target.value=''; }
  };

  const handleCapture = (blobOrFile, preview) => {
    if (blobOrFile instanceof Blob) setCapBlob(blobOrFile);
    else setCapBlob(blobOrFile); // File also works
    setCapPrev(preview); setShowCamera(false);
  };

  const postCapture = async () => {
    if (!capBlob) return;
    setUploading(true);
    try {
      await uploadLocketFromCamera(user.uid, user.displayName||'Ẩn danh', capBlob);
      const s = await updateStreak(user.uid); setStreak(s);
      toast.success(`Locket đã đăng ✿ Streak: ${s} ngày`);
      setCapBlob(null); setCapPrev(null);
    } catch { toast.error('Đăng thất bại. Cần cấu hình Firebase.'); }
    finally { setUploading(false); }
  };

  const handleReact = async emoji => {
    if (selected) {
      try { await addReaction(selected.id, emoji); }
      catch { toast.error('Cần cấu hình Firebase'); }
    }
  };

  const grouped = photos.reduce((acc,p)=>{ const k=p.dateStr||'—'; if(!acc[k])acc[k]=[]; acc[k].push(p); return acc; },{});

  // Camera screens
  if (showCamera) return <LocketCamera onCapture={handleCapture} onClose={()=>setShowCamera(false)}/>;
  if (capPrev)    return <CapturePreview preview={capPrev} onPost={postCapture}
    onRetake={()=>{ setCapBlob(null); setCapPrev(null); setShowCamera(true); }} uploading={uploading}/>;

  return (
    <div className="wrap">
      {/* ── Header + action bar ─────────────────────── */}
      <div className="section-header" style={{ paddingBottom:8 }}>
        <span className="section-eyebrow">✦ Locket lớp 9C ✦</span>
        <h1 className="section-title">Locket</h1>
        <p className="section-subtitle">Ghi lại mọi khoảnh khắc — upload không giới hạn</p>
      </div>

      <div className="inner">
        {/* Action bar */}
        <div className="glass-card" style={{
          padding:'18px 22px', display:'flex', alignItems:'center',
          justifyContent:'space-between', flexWrap:'wrap', gap:14, marginBottom:28,
        }}>
          {/* Streak display */}
          <div>
            <div className="field-label" style={{ marginBottom:8 }}>Upload streak</div>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              {STREAK_LVLS.map(lv=>(
                <span key={lv.icon} title={lv.label}
                  style={{ fontSize:'1.25rem', opacity:streak>=lv.min?1:.22,
                    filter:streak>=lv.min?'none':'grayscale(1)', transition:'all .4s' }}>
                  {lv.icon}
                </span>
              ))}
              <span style={{ fontFamily:'var(--font-heading)', fontSize:'.98rem', color:'var(--rose-soft)', fontStyle:'italic', marginLeft:4 }}>
                {streak} ngày
              </span>
            </div>
          </div>
          {/* Buttons */}
          <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
            <button className="btn btn-pink" onClick={()=>setShowCamera(true)} style={{ padding:'12px 22px', fontSize:'.78rem', gap:6 }}>
              📷 Chụp ảnh
            </button>
            <label style={{ cursor:'pointer' }}>
              <input type="file" accept="image/*" multiple style={{ display:'none' }} onChange={handleUploadFile} disabled={uploading}/>
              <div className="btn btn-glass" style={{ padding:'11px 20px', pointerEvents:'none', whiteSpace:'nowrap', fontSize:'.76rem' }}>
                {uploading ? '⏳ Đang upload...' : '📁 Thư viện'}
              </div>
            </label>
          </div>
        </div>

        {/* Empty state */}
        {photos.length === 0 && (
          <div style={{ textAlign:'center', padding:'60px 20px' }}>
            <div style={{ fontSize:'3rem', marginBottom:16, opacity:.4 }}>📷</div>
            <div style={{ fontFamily:'var(--font-display)', fontSize:'1.2rem', color:'var(--ink-muted)', marginBottom:8 }}>Chưa có ảnh nào</div>
            <div style={{ fontFamily:'var(--font-body)', fontSize:'.9rem', fontStyle:'italic', color:'var(--ink-faint)', marginBottom:28 }}>
              Nhấn "Chụp ảnh" để bắt đầu ghi lại kỷ niệm
            </div>
            <button className="btn btn-pink" onClick={()=>setShowCamera(true)}>📷 Mở camera ngay</button>
          </div>
        )}

        {/* Photos grouped by date — polaroid style */}
        {Object.entries(grouped).map(([date,items])=>(
          <div key={date} style={{ marginBottom:48 }}>
            {/* Day header */}
            <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:26 }}>
              <div style={{ fontFamily:'var(--font-label)', fontSize:'.64rem', letterSpacing:'.18em', textTransform:'uppercase', color:'var(--rose-soft)' }}>{date}</div>
              <div style={{ flex:1, height:1, background:'linear-gradient(90deg,var(--border),transparent)' }}/>
              <div style={{ fontFamily:'var(--font-heading)', fontSize:'.8rem', fontStyle:'italic', color:'var(--ink-faint)' }}>{items.length} ảnh</div>
            </div>
            {/* Grid */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(140px,1fr))', gap:24, padding:'8px 4px 16px' }}>
              {items.map(p => <Polaroid key={p.id} photo={p} onClick={()=>setSelected(p)}/>)}
            </div>
          </div>
        ))}
      </div>

      <ReactModal photo={selected} onClose={()=>setSelected(null)} onReact={handleReact}/>
    </div>
  );
}
