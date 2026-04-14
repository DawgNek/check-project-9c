// src/pages/StoryPage.jsx — Instagram-style 24h stories
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../lib/AuthContext';
import { getActiveStories, uploadStory, markStoryViewed } from '../lib/firestore';
import toast from 'react-hot-toast';

const AVATAR_COLORS = [
  ['#fde8ef','#d4758a'],['#e8f4e8','#5a8a58'],['#fff8e0','#c8900a'],
  ['#e8f0fd','#5a6aaa'],['#f4e8fd','#8a5aaa'],
];
const avatarColor = name => AVATAR_COLORS[(name?.charCodeAt(0) || 0) % AVATAR_COLORS.length];

/* ── Story ring avatar ──────────────────────────────── */
function StoryRing({ group, hasNew, onClick }) {
  const [bg, txt] = avatarColor(group.userName);
  const initial   = (group.userName || '?')[0].toUpperCase();
  return (
    <button onClick={onClick} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0, padding: '4px 2px' }}>
      <div style={{
        width: 64, height: 64, borderRadius: '50%', padding: 3,
        background: hasNew
          ? 'linear-gradient(135deg,var(--petal-deep),var(--rose-soft),var(--gold))'
          : 'rgba(202,165,106,.3)',
      }}>
        <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700, color: txt, border: '2px solid var(--ivory)' }}>
          {initial}
        </div>
      </div>
      <span style={{ fontFamily: 'var(--font-body)', fontSize: '.75rem', color: 'var(--ink-muted)', maxWidth: 64, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'center' }}>
        {group.userName?.split(' ').slice(-1)[0]}
      </span>
    </button>
  );
}

/* ── Story viewer ────────────────────────────────────── */
function StoryViewer({ groups, startGroupIdx, onClose, currentUserId }) {
  const [gIdx,    setGIdx]    = useState(startGroupIdx);
  const [sIdx,    setSIdx]    = useState(0);
  const [progress,setProgress]= useState(0);
  const timerRef = useRef(null);
  const DURATION = 5000;

  const group   = groups[gIdx];
  const story   = group?.stories?.[sIdx];

  useEffect(() => {
    if (!story) return;
    markStoryViewed(story.id, currentUserId);
    setProgress(0);
    clearInterval(timerRef.current);
    const start = Date.now();
    timerRef.current = setInterval(() => {
      const p = Math.min(100, (Date.now() - start) / DURATION * 100);
      setProgress(p);
      if (p >= 100) advance();
    }, 80);
    return () => clearInterval(timerRef.current);
  }, [gIdx, sIdx, story?.id]);

  const advance = () => {
    clearInterval(timerRef.current);
    if (sIdx < group.stories.length - 1) { setSIdx(s => s + 1); }
    else if (gIdx < groups.length - 1)   { setGIdx(g => g + 1); setSIdx(0); }
    else onClose();
  };
  const goBack = () => {
    clearInterval(timerRef.current);
    if (sIdx > 0)   { setSIdx(s => s - 1); }
    else if (gIdx > 0) { setGIdx(g => g - 1); setSIdx(groups[gIdx-1].stories.length - 1); }
  };

  if (!story) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 800, background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ position: 'relative', width: '100%', maxWidth: 420, height: '100dvh', maxHeight: 780, background: '#111', overflow: 'hidden' }}>
        {/* Progress bars */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10, display: 'flex', gap: 4, padding: '12px 12px 0' }}>
          {group.stories.map((_, i) => (
            <div key={i} style={{ flex: 1, height: 2.5, borderRadius: 2, background: 'rgba(255,255,255,.3)', overflow: 'hidden' }}>
              <div style={{ height: '100%', background: '#fff', width: i < sIdx ? '100%' : i === sIdx ? progress + '%' : '0%', transition: i === sIdx ? 'none' : 'none' }} />
            </div>
          ))}
        </div>

        {/* Header */}
        <div style={{ position: 'absolute', top: 20, left: 0, right: 0, zIndex: 10, display: 'flex', alignItems: 'center', gap: 10, padding: '0 14px' }}>
          <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(255,255,255,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, color: '#fff', border: '2px solid rgba(255,255,255,.5)' }}>
            {(story.userName || '?')[0].toUpperCase()}
          </div>
          <div>
            <div style={{ color: '#fff', fontFamily: 'var(--font-heading)', fontSize: '.92rem', fontWeight: 600 }}>{story.userName}</div>
            <div style={{ color: 'rgba(255,255,255,.65)', fontSize: '.72rem' }}>
              {story.createdAt?.toDate?.()?.toLocaleTimeString('vi-VN', { hour:'2-digit', minute:'2-digit' })}
            </div>
          </div>
          <button onClick={onClose} style={{ marginLeft: 'auto', color: 'rgba(255,255,255,.8)', fontSize: '1.4rem', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px' }}>✕</button>
        </div>

        {/* Story image */}
        <img src={story.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />

        {/* Caption */}
        {story.caption && (
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '60px 20px 30px', background: 'linear-gradient(to top,rgba(0,0,0,.65),transparent)' }}>
            <div style={{ color: '#fff', fontFamily: 'var(--font-body)', fontSize: '1rem', fontStyle: 'italic', lineHeight: 1.6 }}>{story.caption}</div>
          </div>
        )}

        {/* Tap zones */}
        <div style={{ position: 'absolute', inset: 0, display: 'flex' }}>
          <div style={{ flex: 1 }} onClick={goBack} />
          <div style={{ flex: 1 }} onClick={advance} />
        </div>
      </div>
    </div>
  );
}

/* ── Upload Story ────────────────────────────────────── */
function UploadStoryBtn({ userId, userName }) {
  const [uploading, setUploading] = useState(false);
  const [caption,   setCaption]   = useState('');
  const [preview,   setPreview]   = useState(null);
  const [file,      setFile]      = useState(null);
  const [showForm,  setShowForm]  = useState(false);

  const handleFile = e => {
    const f = e.target.files[0]; if (!f) return;
    setFile(f);
    const r = new FileReader();
    r.onload = ev => setPreview(ev.target.result);
    r.readAsDataURL(f);
    setShowForm(true);
    e.target.value = '';
  };

  const submit = async () => {
    if (!file) return;
    setUploading(true);
    try {
      await uploadStory(userId, userName, file, caption);
      toast.success('Story đã được đăng ✿');
      setShowForm(false); setFile(null); setPreview(null); setCaption('');
    } catch { toast.error('Đăng story thất bại'); }
    finally { setUploading(false); }
  };

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flexShrink: 0 }}>
        <label style={{ width: 64, height: 64, borderRadius: '50%', border: '2px dashed var(--petal-deep)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: 'rgba(240,160,184,.08)', transition: 'background .2s' }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(240,160,184,.18)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(240,160,184,.08)'}>
          <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
          <span style={{ fontSize: '1.6rem', color: 'var(--rose-soft)' }}>+</span>
        </label>
        <span style={{ fontFamily: 'var(--font-body)', fontSize: '.75rem', color: 'var(--rose-soft)' }}>Thêm</span>
      </div>

      {showForm && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 700, background: 'rgba(58,32,48,.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
          onClick={e => e.target === e.currentTarget && setShowForm(false)}>
          <div className="card" style={{ maxWidth: 380, width: '100%', padding: 28, animation: 'bloom .3s ease-out' }}>
            <style>{`@keyframes bloom{from{opacity:0;transform:scale(.93)}to{opacity:1;transform:scale(1)}}`}</style>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--ink)', marginBottom: 18 }}>Thêm Story</div>
            {preview && <img src={preview} alt="" style={{ width: '100%', borderRadius: 12, marginBottom: 16, objectFit: 'cover', maxHeight: 240 }} />}
            <input className="field-input" placeholder="Caption (không bắt buộc)..." value={caption} onChange={e => setCaption(e.target.value)} style={{ marginBottom: 16 }} />
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-outline" onClick={() => setShowForm(false)} style={{ flex: 1 }}>Hủy</button>
              <button className="btn btn-pink" onClick={submit} disabled={uploading} style={{ flex: 1 }}>
                {uploading ? '...' : 'Đăng Story ✿'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ── StoryPage ──────────────────────────────────────── */
export default function StoryPage() {
  const { user } = useAuth();
  const [groups,  setGroups]  = useState([]);
  const [viewing, setViewing] = useState(null); // startGroupIdx

  useEffect(() => {
    const unsub = getActiveStories(setGroups);
    return unsub;
  }, []);

  return (
    <div className="wrap">
      <div className="section-header">
        <span className="section-eyebrow">✦ Khoảnh khắc 24h ✦</span>
        <h1 className="section-title">Story lớp</h1>
        <p className="section-subtitle">Chia sẻ khoảnh khắc — tự động biến mất sau 24 giờ</p>
      </div>

      <div className="inner">
        {/* Story rings row */}
        <div style={{ display: 'flex', gap: 14, overflowX: 'auto', paddingBottom: 8, marginBottom: 40, scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}>
          <style>{`.story-scroll::-webkit-scrollbar{display:none}`}</style>

          {/* Upload own story */}
          <UploadStoryBtn userId={user.uid} userName={user.displayName || 'Ẩn danh'} />

          {/* Others' stories */}
          {groups.map((g, i) => {
            const hasNew = !g.stories[0]?.viewers?.includes(user.uid);
            return (
              <StoryRing key={g.userId} group={g} hasNew={hasNew}
                onClick={() => setViewing(i)} />
            );
          })}
        </div>

        {/* Story grid — all active stories */}
        {groups.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div style={{ fontSize: '3rem', marginBottom: 16, opacity: .5 }}>🌸</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--ink-muted)', marginBottom: 8 }}>Chưa có story nào</div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '.9rem', fontStyle: 'italic', color: 'var(--ink-faint)' }}>Hãy là người đầu tiên chia sẻ khoảnh khắc ✿</div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: 12, marginBottom: 60 }}>
            {groups.flatMap((g, gi) =>
              g.stories.map((s, si) => (
                <div key={s.id} onClick={() => setViewing(gi)}
                  style={{ position: 'relative', borderRadius: 16, overflow: 'hidden', cursor: 'pointer', aspectRatio: '9/16', background: 'var(--petal-blush)', boxShadow: 'var(--shadow-sm)', transition: 'transform .3s' }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
                  <img src={s.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(0,0,0,.5) 0%,transparent 50%)' }} />
                  <div style={{ position: 'absolute', bottom: 10, left: 10, right: 10 }}>
                    <div style={{ color: '#fff', fontFamily: 'var(--font-heading)', fontSize: '.8rem', fontWeight: 600 }}>{s.userName?.split(' ').slice(-1)[0]}</div>
                    {s.caption && <div style={{ color: 'rgba(255,255,255,.75)', fontSize: '.72rem', fontStyle: 'italic', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.caption}</div>}
                  </div>
                  {/* Ring border if new */}
                  {!s.viewers?.includes(user.uid) && (
                    <div style={{ position: 'absolute', inset: 0, borderRadius: 16, border: '3px solid var(--petal-deep)', pointerEvents: 'none' }} />
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {viewing !== null && (
        <StoryViewer groups={groups} startGroupIdx={viewing} currentUserId={user.uid} onClose={() => setViewing(null)} />
      )}
    </div>
  );
}
