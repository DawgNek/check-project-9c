// Navbar.jsx — Clean, refined, no bugs
import { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../lib/AuthContext';
import { updateOnlineStatus, setOffline } from '../../lib/firestore';

const DESK = [
  ['/', 'Home'], ['/chung','Chung'], ['/seating','Sơ đồ'], ['/profile','Hồ sơ'],
  ['/locket','Locket'], ['/chat','Chat'], ['/story','Story'],
  ['/playlist','Playlist'], ['/signature','Chữ ký'],
  ['/privacy','Privacy'], ['/terms','Terms'], ['/credit','Credit'],
];
const BOT = [
  ['/','Home','🏠'], ['/chat','Chat','💬'], ['/locket','Locket','📷'],
  ['/story','Story','✨'], ['/profile','Tôi','👤'],
];
const MORE = [
  ['/chung','Chung','💌'], ['/seating','Sơ đồ','🪑'], ['/playlist','Playlist','🎵'],
  ['/signature','Chữ ký','✍️'], ['/privacy','Privacy','📜'],
  ['/terms','Terms','📋'], ['/credit','Credit','👥'],
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const loc = useLocation();
  const [solid, setSolid] = useState(false);
  const [ham,   setHam]   = useState(false);
  const [more,  setMore]  = useState(false);

  // Online presence
  useEffect(() => {
    if (!user) return;
    const ping = () => updateOnlineStatus(user.uid, user.displayName || 'Ẩn danh').catch(() => {});
    ping();
    const iv = setInterval(ping, 30000);
    const bye = () => setOffline(user.uid).catch(() => {});
    window.addEventListener('beforeunload', bye);
    return () => { clearInterval(iv); window.removeEventListener('beforeunload', bye); };
  }, [user]);

  useEffect(() => {
    const fn = () => setSolid(window.scrollY > 30);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  // Close on navigate
  useEffect(() => { setHam(false); setMore(false); }, [loc.pathname]);

  const doLogout = async () => {
    try { await setOffline(user?.uid); } catch {}
    await logout(); navigate('/login');
  };

  const initial = (user?.displayName || user?.email || 'A')[0].toUpperCase();

  return (
    <>
      {/* Desktop top nav */}
      <nav id="top-nav" className={solid ? 'solid' : ''}>
        <NavLink to="/" className="nav-logo">9<em>C</em></NavLink>

        <div className="nav-links">
          {DESK.map(([to, label]) => (
            <NavLink key={to} to={to} end={to === '/'}
              className={({ isActive }) => 'nav-a' + (isActive ? ' on' : '')}>
              {label}
            </NavLink>
          ))}
        </div>

        <div className="nav-end">
          <NavLink to="/profile" className="nav-avatar">{initial}</NavLink>
          <button className="nav-out" onClick={doLogout}>Đăng xuất</button>
        </div>

        <button className="nav-ham" onClick={() => setHam(o => !o)} aria-label="Menu">
          <span style={{ transform: ham ? 'rotate(45deg) translate(4.5px, 4.5px)' : 'none' }}/>
          <span style={{ opacity: ham ? 0 : 1 }}/>
          <span style={{ transform: ham ? 'rotate(-45deg) translate(4.5px,-4.5px)' : 'none' }}/>
        </button>
      </nav>

      {/* Medium-screen drawer */}
      <div className={`nav-drawer ${ham ? 'on' : ''}`}>
        {DESK.map(([to, label]) => (
          <NavLink key={to} to={to} end={to === '/'}
            className={({ isActive }) => 'nav-drawer-a' + (isActive ? ' on' : '')}
            onClick={() => setHam(false)}>
            {label}
          </NavLink>
        ))}
        <div style={{ padding:'14px 32px 0', borderTop:'1px solid rgba(255,255,255,.07)', marginTop:8 }}>
          <button onClick={doLogout} style={{ fontFamily:"'Tenor Sans',sans-serif", fontSize:9.5, letterSpacing:'.18em', textTransform:'uppercase', color:'#FF6B6B', cursor:'pointer', background:'none', border:'none' }}>
            Đăng xuất
          </button>
        </div>
      </div>

      {/* Mobile bottom nav */}
      <nav id="bot-nav">
        <div className="bot-row">
          {BOT.map(([to, label, icon]) => (
            <NavLink key={to} to={to} end={to === '/'}
              className={({ isActive }) => 'bot-btn' + (isActive ? ' on' : '')}>
              <div className="bot-ico">{icon}<div className="bot-dot"/></div>
              <span className="bot-lbl">{label}</span>
            </NavLink>
          ))}
          {/* More */}
          <button className={`bot-btn${more ? ' on' : ''}`} onClick={() => setMore(o => !o)}>
            <div className="bot-ico">
              <svg width="22" height="6" viewBox="0 0 22 6" fill="none">
                <circle cx="3" cy="3" r="2.5" fill="currentColor" opacity={more ? 1 : 0.55}/>
                <circle cx="11" cy="3" r="2.5" fill="currentColor" opacity={more ? 1 : 0.55}/>
                <circle cx="19" cy="3" r="2.5" fill="currentColor" opacity={more ? 1 : 0.55}/>
              </svg>
              <div className="bot-dot"/>
            </div>
            <span className="bot-lbl">Thêm</span>
          </button>
        </div>
      </nav>

      {/* Backdrop */}
      <div id="more-scrim" className={more ? 'on' : ''} onClick={() => setMore(false)}/>

      {/* More bottom sheet */}
      <div id="more-sheet" className={more ? 'on' : ''}>
        <div className="sheet-handle"/>
        <div className="sheet-grid">
          {MORE.map(([to, label, icon]) => (
            <NavLink key={to} to={to} className="sheet-item" onClick={() => setMore(false)}>
              <span className="sheet-ico">{icon}</span>
              <span className="sheet-lbl">{label}</span>
            </NavLink>
          ))}
          <button className="sheet-item" onClick={doLogout}>
            <span className="sheet-ico">🚪</span>
            <span className="sheet-lbl" style={{ color:'#FF6B6B' }}>Đăng xuất</span>
          </button>
        </div>
      </div>
    </>
  );
}
