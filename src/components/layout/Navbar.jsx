// src/components/layout/Navbar.jsx — Complete rewrite
import { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../lib/AuthContext';
import { updateOnlineStatus, setOffline } from '../../lib/firestore';

const DESK_LINKS = [
  {to:'/',label:'Home'},{to:'/chung',label:'Chung'},{to:'/seating',label:'Sơ đồ'},
  {to:'/profile',label:'Hồ sơ'},{to:'/locket',label:'Locket'},{to:'/chat',label:'Chat'},
  {to:'/story',label:'Story'},{to:'/playlist',label:'Playlist'},
  {to:'/signature',label:'Chữ ký'},{to:'/privacy',label:'Privacy'},
  {to:'/terms',label:'Terms'},{to:'/credit',label:'Credit'},
];

const BOT_MAIN = [
  {to:'/',      label:'Home',  icon:'🏠'},
  {to:'/chat',  label:'Chat',  icon:'💬'},
  {to:'/locket',label:'Locket',icon:'📷'},
  {to:'/story', label:'Story', icon:'✨'},
  {to:'/profile',label:'Tôi', icon:'👤'},
];

const MORE_ITEMS = [
  {to:'/chung',    label:'Chung',   icon:'💌'},
  {to:'/seating',  label:'Sơ đồ',   icon:'🪑'},
  {to:'/playlist', label:'Playlist',icon:'🎵'},
  {to:'/signature',label:'Chữ ký',  icon:'✍️'},
  {to:'/privacy',  label:'Privacy', icon:'📜'},
  {to:'/terms',    label:'Terms',   icon:'📋'},
  {to:'/credit',   label:'Credit',  icon:'👥'},
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const [solid,   setSolid]   = useState(false);
  const [ham,     setHam]     = useState(false);
  const [more,    setMore]    = useState(false);

  // Online heartbeat
  useEffect(() => {
    if (!user) return;
    const ping = () => updateOnlineStatus(user.uid, user.displayName || 'Ẩn danh').catch(() => {});
    ping();
    const iv = setInterval(ping, 30000);
    window.addEventListener('beforeunload', () => setOffline(user.uid).catch(() => {}));
    return () => clearInterval(iv);
  }, [user]);

  useEffect(() => {
    const fn = () => setSolid(window.scrollY > 30);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  // Close drawers on navigation
  useEffect(() => { setHam(false); setMore(false); }, [location.pathname]);

  const handleLogout = async () => {
    try { await setOffline(user?.uid); } catch {}
    await logout();
    navigate('/login');
  };

  const initial = (user?.displayName || user?.email || 'A')[0].toUpperCase();

  return (
    <>
      {/* ── DESKTOP TOP NAV ──────────────────────── */}
      <nav id="top-nav" className={solid ? 'solid' : ''}>
        <NavLink to="/" className="nav-brand">9<em>C</em></NavLink>

        <div className="nav-links">
          {DESK_LINKS.map(({to,label}) => (
            <NavLink key={to} to={to} end={to === '/'}
              className={({isActive}) => 'nav-a' + (isActive ? ' on' : '')}>
              {label}
            </NavLink>
          ))}
        </div>

        <div className="nav-end">
          <NavLink to="/profile" className="nav-ava">{initial}</NavLink>
          <button className="nav-logout" onClick={handleLogout}>Đăng xuất</button>
        </div>

        {/* Medium screen hamburger */}
        <button className="nav-ham" onClick={() => setHam(o => !o)} aria-label="Menu">
          <span style={{transform: ham ? 'rotate(45deg) translate(4px,4px)' : 'none'}}/>
          <span style={{opacity: ham ? 0 : 1}}/>
          <span style={{transform: ham ? 'rotate(-45deg) translate(4px,-4px)' : 'none'}}/>
        </button>
      </nav>

      {/* Desk slide-down drawer */}
      <div className={`desk-drawer ${ham ? 'on' : ''}`}>
        {DESK_LINKS.map(({to,label}) => (
          <NavLink key={to} to={to} end={to=='/'}
            className={({isActive}) => isActive ? 'on' : ''}
            onClick={() => setHam(false)}>
            {label}
          </NavLink>
        ))}
        <div style={{padding:'14px 36px 4px', borderTop:'1px solid rgba(255,255,255,.08)', marginTop:8}}>
          <button onClick={handleLogout}
            style={{fontSize:13,color:'#ff6b6b',cursor:'pointer',background:'none',border:'none'}}>
            Đăng xuất
          </button>
        </div>
      </div>

      {/* ── MOBILE BOTTOM NAV ────────────────────── */}
      <nav id="bot-nav">
        <div className="bot-items">
          {BOT_MAIN.map(({to,label,icon}) => (
            <NavLink key={to} to={to} end={to === '/'}
              className={({isActive}) => 'bot-item' + (isActive ? ' on' : '')}>
              <div className="bot-icon">
                {icon}
                <div className="bot-dot"/>
              </div>
              <span className="bot-label">{label}</span>
            </NavLink>
          ))}

          {/* More button */}
          <button className={`bot-item ${more ? 'on' : ''}`} onClick={() => setMore(o => !o)}>
            <div className="bot-icon">
              <span style={{fontSize:22, letterSpacing:1}}>⋯</span>
              <div className="bot-dot"/>
            </div>
            <span className="bot-label">Thêm</span>
          </button>
        </div>
      </nav>

      {/* More backdrop */}
      <div id="more-back" className={more ? 'on' : ''} onClick={() => setMore(false)}/>

      {/* More drawer */}
      <div id="more-drawer" className={more ? 'on' : ''}>
        <div className="more-handle"/>
        <div className="more-grid">
          {MORE_ITEMS.map(({to,label,icon}) => (
            <NavLink key={to} to={to} className="more-item" onClick={() => setMore(false)}>
              <span className="more-ico">{icon}</span>
              <span className="more-lbl">{label}</span>
            </NavLink>
          ))}
          <button className="more-item" onClick={handleLogout}>
            <span className="more-ico">🚪</span>
            <span className="more-lbl" style={{color:'#ff6b6b'}}>Đăng xuất</span>
          </button>
        </div>
      </div>
    </>
  );
}
