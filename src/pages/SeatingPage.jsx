// src/pages/SeatingPage.jsx — Vintage classroom map redesign
import { useState, useEffect } from 'react';
import { useAuth } from '../lib/AuthContext';
import { addReview, getReviews } from '../lib/firestore';
import toast from 'react-hot-toast';

// ⚠️  Thay bằng 44 tên học sinh thật theo thứ tự ngồi
const STUDENTS = [
  'Nguyễn An','Trần Bình','Lê Châu','Phạm Dung','Hoàng Em','Ngô Phúc',
  'Vũ Giang','Đặng Hà','Bùi Ích','Trịnh Khoa','Đinh Lan','Phan Minh',
  'Lý Nam','Tô Oanh','Hồ Phương','Cao Quỳnh','Dương Ri','Kiều Sa',
  'Lưu Tâm','Mai Uyên','Nhan Vy','Ông Xanh','Quách Yên','Rạng Zi',
  'Sầm An','Tạ Bảo','Ưu Ca','Vương Đào','Xô Em','Yên Phi',
  'Ái Quốc','Bá Lộc','Cảnh Nam','Đức Minh','Gia Bảo','Hải Long',
  'Ích Nhân','Khánh Vi','Lan Anh','Minh Tuấn','Nhật Huy','Oanh Thư',
  'Phi Hùng','Quyết Chiến',
];

const FLOWERS = ['✿','❀','✾','❁','✽','✻','❃','✦','❋','⚘'];

// Vintage palette for avatars
const AVATAR_COLORS = [
  ['#e8d5b7','#7a5f3e'],['#d4c5e2','#5a3e7a'],['#c5deb8','#3e6a3e'],
  ['#f2d0c8','#8a4040'],['#c8d8e8','#3e5a7a'],['#e8dab8','#7a6a3e'],
];

/* ── Student detail modal ────────────────────────────────── */
function StudentModal({ students, deskNum, onClose }) {
  const { user } = useAuth();
  const [reviews,    setReviews]    = useState([]);
  const [reviewText, setReviewText] = useState('');
  const studentId = `desk_${deskNum}`;

  useEffect(() => {
    const unsub = getReviews(studentId, setReviews);
    return unsub;
  }, [studentId]);

  const submit = async () => {
    if (!reviewText.trim()) return;
    const flower = FLOWERS[Math.floor(Math.random() * FLOWERS.length)];
    await addReview(studentId, user.displayName || 'Ẩn danh', reviewText, flower);
    setReviewText('');
    toast.success('Nhận xét đã được gửi ✿');
  };

  const primaryStudent = students[0] || '—';
  const colors = AVATAR_COLORS[deskNum % AVATAR_COLORS.length];

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 500, background: 'rgba(44,31,14,.6)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="paper" style={{ maxWidth: 460, width: '100%', padding: '36px 32px', animation: 'bloom .3s ease-out', position: 'relative', overflow: 'visible' }}>
        <style>{`@keyframes bloom{from{opacity:0;transform:scale(.93)}to{opacity:1;transform:scale(1)}}`}</style>

        {/* Corner floral */}
        <svg width="52" height="52" viewBox="0 0 52 52" style={{ position: 'absolute', top: -8, right: -8, opacity: .2 }} xmlns="http://www.w3.org/2000/svg">
          <path d="M2 2 Q2 22 22 2" stroke="#caa56a" strokeWidth="1.5" fill="none"/>
          <ellipse cx="16" cy="7" rx="5" ry="9" fill="#e8a0bf" opacity=".7" transform="rotate(-30 16 7)"/>
          <ellipse cx="7" cy="16" rx="5" ry="9" fill="#b6d7a8" opacity=".7" transform="rotate(60 7 16)"/>
          <circle cx="2" cy="2" r="3" fill="#caa56a" opacity=".6"/>
        </svg>

        <button onClick={onClose} style={{ position: 'absolute', top: 14, right: 14, width: 28, height: 28, borderRadius: '50%', border: '1px solid var(--border)', background: 'transparent', color: 'var(--ink-faint)', fontSize: 13, cursor: 'pointer' }}>✕</button>

        {/* Avatar */}
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: colors[0], border: '3px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 700, color: colors[1] }}>
          {primaryStudent[0]}
        </div>

        <div style={{ textAlign: 'center', fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--ink)', marginBottom: 4 }}>{students.join(' & ')}</div>
        <div style={{ textAlign: 'center', fontFamily: 'var(--font-heading)', fontSize: '.88rem', fontStyle: 'italic', color: 'var(--gold)', marginBottom: 24 }}>Bàn số {deskNum}</div>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18, color: 'var(--gold)' }}>
          <div style={{ flex: 1, height: 1, background: 'var(--border-soft)' }} />
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '.9rem' }}>✦</span>
          <div style={{ flex: 1, height: 1, background: 'var(--border-soft)' }} />
        </div>

        {/* Reviews */}
        <div style={{ fontFamily: 'var(--font-label)', fontSize: '.65rem', letterSpacing: '.15em', textTransform: 'uppercase', color: 'var(--ink-faint)', marginBottom: 12 }}>
          Nhận xét từ bạn bè
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20, minHeight: 36 }}>
          {reviews.length === 0
            ? <div style={{ fontFamily: 'var(--font-body)', fontSize: '.88rem', fontStyle: 'italic', color: 'var(--ink-faint)' }}>Chưa có nhận xét nào...</div>
            : reviews.map(r => (
              <div key={r.id} style={{ background: 'rgba(202,165,106,.10)', border: '1px solid var(--border-soft)', borderRadius: 20, padding: '6px 14px', fontFamily: 'var(--font-body)', fontSize: '.85rem', color: 'var(--ink-soft)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ color: 'var(--gold)' }}>{r.flower}</span>
                {r.text}
                <span style={{ fontSize: '.75rem', color: 'var(--ink-faint)' }}>— {r.authorName.split(' ').slice(-1)[0]}</span>
              </div>
            ))
          }
        </div>

        {/* Write review */}
        <div style={{ display: 'flex', gap: 8 }}>
          <input className="field" style={{ flex: 1, fontSize: '.92rem' }}
            placeholder="Viết điều bạn nghĩ về họ..."
            value={reviewText} onChange={e => setReviewText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && submit()} />
          <button className="btn btn-pink" onClick={submit} style={{ padding: '12px 18px', fontSize: '.8rem', whiteSpace: 'nowrap' }}>Gửi ✿</button>
        </div>
      </div>
    </div>
  );
}

/* ── Desk component ─────────────────────────────────────── */
function Desk({ deskNum, students, onClick }) {
  const colors = AVATAR_COLORS[deskNum % AVATAR_COLORS.length];
  return (
    <div onClick={onClick} style={{
      background: '#faf6ef',
      border: '1px solid var(--aged)',
      borderRadius: 'var(--radius)',
      overflow: 'hidden',
      cursor: 'pointer',
      transition: 'all .3s',
      boxShadow: 'var(--shadow-sm)',
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.borderColor = 'var(--gold)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; e.currentTarget.style.borderColor = 'var(--aged)'; }}
    >
      {students.map((s, i) => (
        <div key={i} style={{ padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: i === 0 ? '1px solid var(--border-soft)' : 'none', background: i === 0 ? 'transparent' : 'rgba(202,165,106,.04)' }}>
          <div style={{ width: 30, height: 30, borderRadius: '50%', background: colors[0], border: `2px solid ${colors[1]}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: '.82rem', fontWeight: 700, color: colors[1], flexShrink: 0 }}>
            {s[0]}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '.88rem', fontWeight: 500, color: 'var(--ink-soft)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s}</div>
            <div style={{ fontFamily: 'var(--font-label)', fontSize: '.58rem', letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ink-faint)' }}>Bàn {deskNum}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function SeatingPage() {
  const [selected, setSelected] = useState(null);

  // Build 7 rows × 3 desks
  const rows = [];
  let idx = 0;
  for (let row = 0; row < 7; row++) {
    const desks = [];
    for (let col = 0; col < 3; col++) {
      const deskNum = row * 3 + col + 1;
      desks.push({ deskNum, students: [STUDENTS[idx++] || '—', STUDENTS[idx++] || '—'] });
    }
    rows.push(desks);
  }

  return (
    <div className="wrap">
      <div className="section-header">
        <span className="section-eyebrow">✦ Lớp 9C ✦</span>
        <h1 className="section-title">Sơ đồ Lớp</h1>
        <p className="section-subtitle">Nhấn vào bàn để xem thông tin học sinh và viết nhận xét</p>
      </div>

      <div style={{ maxWidth: 680, margin: '0 auto', padding: '0 16px 80px' }}>

        {/* Blackboard label */}
        <div style={{
          background: 'linear-gradient(135deg,#2a4a2a,#1e361e)',
          border: '3px solid #4a6a4a',
          borderRadius: 8,
          padding: '16px 32px',
          textAlign: 'center',
          marginBottom: 36,
          boxShadow: 'inset 0 2px 8px rgba(0,0,0,.3), var(--shadow-md)',
          position: 'relative',
        }}>
          {/* chalk dots */}
          <div style={{ position: 'absolute', inset: 4, border: '1px dashed rgba(255,255,255,.12)', borderRadius: 5, pointerEvents: 'none' }} />
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', color: 'rgba(230,230,200,.9)', letterSpacing: '.08em', fontWeight: 500 }}>
            🎓 &nbsp; Bàn Giáo viên — Cô Chủ nhiệm
          </div>
        </div>

        {/* Row legend */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, padding: '0 4px' }}>
          {['Dãy A','Dãy B','Dãy C'].map(l => (
            <div key={l} style={{ fontFamily: 'var(--font-label)', fontSize: '.62rem', letterSpacing: '.15em', textTransform: 'uppercase', color: 'var(--ink-faint)', flex: 1, textAlign: 'center' }}>{l}</div>
          ))}
        </div>

        {/* Desk grid */}
        {rows.map((desks, ri) => (
          <div key={ri} style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 12 }}>
            {desks.map(({ deskNum, students }) => (
              <Desk key={deskNum} deskNum={deskNum} students={students} onClick={() => setSelected({ deskNum, students })} />
            ))}
          </div>
        ))}

        <div style={{ textAlign: 'center', marginTop: 24, fontFamily: 'var(--font-heading)', fontSize: '.88rem', fontStyle: 'italic', color: 'var(--ink-faint)' }}>
          Nhấn vào bàn để xem chi tiết và để lại lời nhắn
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 20 }}>
          {AVATAR_COLORS.slice(0,3).map((c,i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: c[0], border: `2px solid ${c[1]}44` }} />
              <span style={{ fontFamily: 'var(--font-label)', fontSize: '.6rem', letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ink-faint)' }}>Nhóm {i+1}</span>
            </div>
          ))}
        </div>
      </div>

      {selected && (
        <StudentModal students={selected.students} deskNum={selected.deskNum} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
