// src/pages/SignaturePage.jsx — Vintage calligraphy redesign
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../lib/AuthContext';
import { saveSignature, getSignatures } from '../lib/firestore';
import toast from 'react-hot-toast';

const COLORS = [
  { hex: '#2c1f0e', label: 'Mực tàu'    },
  { hex: '#7a3e1a', label: 'Nâu cổ'     },
  { hex: '#1a3a5c', label: 'Xanh mực'   },
  { hex: '#4a2a6a', label: 'Tím hoàng'  },
  { hex: '#3a5a3a', label: 'Lá cổ'      },
  { hex: '#8a3a3a', label: 'Đỏ son'     },
];

export default function SignaturePage() {
  const { user } = useAuth();
  const canvasRef   = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [color,   setColor]   = useState('#2c1f0e');
  const [sigs,    setSigs]    = useState([]);
  const [saving,  setSaving]  = useState(false);
  const lastPos = useRef(null);

  useEffect(() => {
    const unsub = getSignatures(setSigs);
    return unsub;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width  = canvas.parentElement.clientWidth;
    canvas.height = 220;
    const ctx = canvas.getContext('2d');
    // Parchment background
    ctx.fillStyle = '#f8f3e8';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // Lined paper effect
    ctx.strokeStyle = 'rgba(202,165,106,.18)';
    ctx.lineWidth = 1;
    for (let y = 44; y < canvas.height; y += 36) {
      ctx.beginPath(); ctx.moveTo(24, y); ctx.lineTo(canvas.width - 24, y); ctx.stroke();
    }
  }, []);

  const getCtx = () => {
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) { ctx.strokeStyle = color; ctx.lineWidth = 2.5; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; }
    return ctx;
  };

  const getPos = e => {
    const rect = canvasRef.current.getBoundingClientRect();
    const src  = e.touches ? e.touches[0] : e;
    return { x: src.clientX - rect.left, y: src.clientY - rect.top };
  };

  const start = e => { e.preventDefault(); setDrawing(true); lastPos.current = getPos(e); };
  const move  = e => {
    e.preventDefault();
    if (!drawing) return;
    const ctx = getCtx(); if (!ctx) return;
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    lastPos.current = pos;
  };
  const end = () => setDrawing(false);

  const clear = () => {
    const canvas = canvasRef.current;
    const ctx    = canvas?.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#f8f3e8';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'rgba(202,165,106,.18)';
    ctx.lineWidth = 1;
    for (let y = 44; y < canvas.height; y += 36) {
      ctx.beginPath(); ctx.moveTo(24, y); ctx.lineTo(canvas.width - 24, y); ctx.stroke();
    }
  };

  const save = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setSaving(true);
    try {
      await saveSignature(user.uid, user.displayName || 'Ẩn danh', canvas.toDataURL('image/png'));
      toast.success('Chữ ký đã được lưu vào lưu bút ✿');
      clear();
    } catch { toast.error('Lỗi khi lưu. Thử lại nhé'); }
    finally { setSaving(false); }
  };

  return (
    <div className="wrap">
      <div className="section-header">
        <span className="eyebrow">✦ Lưu bút lớp ✦</span>
        <h1 className="section-title">Chữ ký của lớp</h1>
        <p className="section-subtitle">Ký tên của bạn — lưu lại trong cuốn lưu bút kỹ thuật số mãi mãi</p>
      </div>

      <div style={{ maxWidth: 640, margin: '0 auto', padding: '0 20px 80px' }}>

        {/* Canvas — parchment style */}
        <div style={{ position: 'relative', marginBottom: 20 }}>
          {/* Paper edge decoration */}
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: 'linear-gradient(180deg,var(--rose-deep) 0%,var(--rose) 100%)', borderRadius: '4px 0 0 4px', opacity: .7 }} />
          <div style={{ marginLeft: 4, background: '#f8f3e8', border: '1px solid var(--aged)', borderRadius: '0 var(--radius) var(--radius) 0', overflow: 'hidden', boxShadow: 'var(--shadow-md), inset 0 0 0 1px rgba(255,255,255,.5)', cursor: 'crosshair', touchAction: 'none' }}>
            <canvas ref={canvasRef}
              onMouseDown={start} onMouseMove={move} onMouseUp={end} onMouseLeave={end}
              onTouchStart={start} onTouchMove={move} onTouchEnd={end}
              style={{ display: 'block', width: '100%', height: 220 }}
            />
          </div>
        </div>

        {/* Ink palette & tools */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 24, padding: '16px 20px', background: 'rgba(232,217,192,.3)', border: '1px solid var(--border-soft)', borderRadius: 'var(--radius)' }}>
          <div style={{ fontFamily: 'var(--font-label)', fontSize: '.62rem', letterSpacing: '.15em', textTransform: 'uppercase', color: 'var(--ink-faint)', marginRight: 4 }}>Màu mực</div>
          {COLORS.map(c => (
            <button key={c.hex} onClick={() => setColor(c.hex)} title={c.label}
              style={{ width: 26, height: 26, borderRadius: '50%', background: c.hex, cursor: 'pointer', border: color === c.hex ? '3px solid var(--gold)' : '2px solid rgba(44,31,14,.12)', transition: 'all .2s', transform: color === c.hex ? 'scale(1.2)' : 'scale(1)' }} />
          ))}
          <div style={{ flex: 1 }} />
          <button className="btn-ghost" onClick={clear} style={{ fontSize: '.88rem' }}>Xóa</button>
          <button className="btn btn-pink" onClick={save} disabled={saving} style={{ padding: '10px 22px', fontSize: '.78rem' }}>
            {saving ? '...' : 'Lưu chữ ký ✿'}
          </button>
        </div>

        {/* Hint */}
        <div style={{ fontFamily: 'var(--font-heading)', fontSize: '.88rem', fontStyle: 'italic', color: 'var(--ink-faint)', textAlign: 'center', marginBottom: 36 }}>
          Ký tên theo phong cách của bạn — mỗi chữ ký là một dấu ấn riêng
        </div>

        {/* Signatures archive */}
        {sigs.length > 0 && (
          <>
            <div className="ornamental-divider" style={{ marginBottom: 28 }}>Lưu bút của lớp</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 16 }}>
              {sigs.map(s => (
                <div key={s.id} style={{
                  background: '#faf6ef',
                  border: '1px solid var(--aged)',
                  borderRadius: 4,
                  padding: '12px 12px 16px',
                  boxShadow: '0 3px 12px rgba(44,31,14,.08), 1px 1px 0 var(--aged)',
                  transition: 'all .3s',
                  position: 'relative',
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px) rotate(0.5deg)'; e.currentTarget.style.boxShadow = '0 10px 28px rgba(44,31,14,.14), 1px 1px 0 var(--aged)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0) rotate(0)'; e.currentTarget.style.boxShadow = '0 3px 12px rgba(44,31,14,.08), 1px 1px 0 var(--aged)'; }}
                >
                  {/* Tape decoration */}
                  <div style={{ position: 'absolute', top: -8, left: '50%', transform: 'translateX(-50%)', width: 36, height: 14, background: 'rgba(232,200,120,.5)', borderRadius: 2 }} />
                  <img src={s.imageUrl} alt="" style={{ width: '100%', borderRadius: 2, filter: 'sepia(.05)', display: 'block', marginBottom: 10 }} />
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: '.82rem', fontStyle: 'italic', color: 'var(--ink-muted)', textAlign: 'center' }}>{s.userName}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {sigs.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 0', fontFamily: 'var(--font-body)', fontStyle: 'italic', color: 'var(--ink-faint)' }}>
            Lưu bút đang chờ những chữ ký đầu tiên...
          </div>
        )}
      </div>
    </div>
  );
}
