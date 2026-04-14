// src/pages/ProfilePage.jsx — Vintage redesign
import { useAuth } from '../lib/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const initial  = (user?.displayName || user?.email || 'A')[0].toUpperCase();

  const handleLogout = async () => { await logout(); navigate('/login'); };

  const sections = [
    {
      title: 'Hoạt động',
      items: [
        { icon: '📷', label: 'Ảnh của tôi trong Locket',    to: '/locket' },
        { icon: '💌', label: 'Tin nhắn tương lai của tôi',   to: '/chung' },
        { icon: '✍️', label: 'Chữ ký của tôi',               to: '/signature' },
        { icon: '🪑', label: 'Xem sơ đồ lớp',               to: '/seating' },
      ],
    },
    {
      title: 'Thông tin',
      items: [
        { icon: '📜', label: 'Chính sách Bảo mật',           to: '/privacy' },
        { icon: '📋', label: 'Điều khoản Sử dụng',           to: '/terms' },
        { icon: '👥', label: 'Credit & Danh sách lớp',       to: '/credit' },
      ],
    },
  ];

  return (
    <div className="wrap">

      {/* Profile hero */}
      <div style={{ padding: '56px 24px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>

        {/* Avatar ring */}
        <div style={{ position: 'relative', marginBottom: 20 }}>
          {/* Decorative ring */}
          <div style={{ position: 'absolute', inset: -8, borderRadius: '50%', border: '1.5px dashed var(--border)', animation: 'slowSpin 20s linear infinite' }} />
          <style>{`@keyframes slowSpin{to{transform:rotate(360deg)}}`}</style>

          <div style={{ width: 88, height: 88, borderRadius: '50%', background: 'linear-gradient(135deg,var(--rose) 0%,var(--gold) 100%)', border: '4px solid var(--ivory)', boxShadow: 'var(--shadow-warm)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, color: '#fff' }}>
            {initial}
          </div>
        </div>

        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.7rem', fontWeight: 700, color: 'var(--ink)', marginBottom: 4 }}>
          {user?.displayName || 'Ẩn danh'}
        </h1>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '.9rem', fontStyle: 'italic', color: 'var(--ink-faint)', marginBottom: 8 }}>
          {user?.email}
        </p>
        <div style={{ fontFamily: 'var(--font-label)', fontSize: '.68rem', letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--gold)' }}>
          Thành viên lớp 9C · 2025–2026
        </div>

        {/* Decorative flowers */}
        <div style={{ display: 'flex', gap: 6, marginTop: 16, fontSize: '1.1rem', color: 'var(--rose)' }}>
          {'✿❀✾✿❀'.split('').map((f,i)=><span key={i} style={{ opacity: .6+i*.08 }}>{f}</span>)}
        </div>
      </div>

      {/* Sections */}
      <div style={{ maxWidth: 560, margin: '0 auto', padding: '0 20px 80px' }}>
        {sections.map((sec, si) => (
          <div key={si} style={{ marginBottom: 20 }}>
            <div style={{ fontFamily: 'var(--font-label)', fontSize: '.68rem', letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--ink-faint)', marginBottom: 10, paddingLeft: 4 }}>
              {sec.title}
            </div>
            <div className="paper" style={{ overflow: 'hidden' }}>
              {sec.items.map((item, i) => (
                <div key={i} onClick={() => navigate(item.to)} style={{
                  display: 'flex', alignItems: 'center', gap: 14, padding: '15px 20px',
                  borderBottom: i < sec.items.length - 1 ? '1px solid var(--border-soft)' : 'none',
                  cursor: 'pointer', transition: 'all .25s',
                }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(202,165,106,.07)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <span style={{ fontSize: '1.1rem', opacity: .8 }}>{item.icon}</span>
                  <span style={{ flex: 1, fontFamily: 'var(--font-body)', fontSize: '.98rem', color: 'var(--ink-soft)' }}>{item.label}</span>
                  <span style={{ fontFamily: 'var(--font-display)', color: 'var(--gold)', fontSize: '.9rem', opacity: .6 }}>›</span>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Logout */}
        <div className="paper" style={{ overflow: 'hidden', marginTop: 8 }}>
          <div onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '15px 20px', cursor: 'pointer', transition: 'all .25s' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(192,57,43,.05)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            <span style={{ fontSize: '1.1rem', opacity: .8 }}>🚪</span>
            <span style={{ flex: 1, fontFamily: 'var(--font-body)', fontSize: '.98rem', color: '#b33' }}>Đăng xuất</span>
          </div>
        </div>
      </div>
    </div>
  );
}
