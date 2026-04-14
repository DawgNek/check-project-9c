import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './lib/AuthContext';
import GardenBg     from './components/ui/GardenBg';
import MusicBtn     from './components/ui/MusicBtn';
import Navbar       from './components/layout/Navbar';
import Footer       from './components/layout/Footer';
import PwaPage      from './pages/PwaPage';
import AuthPage     from './pages/AuthPage';
import HomePage     from './pages/HomePage';
import ChungPage    from './pages/ChungPage';
import SeatingPage  from './pages/SeatingPage';
import ProfilePage  from './pages/ProfilePage';
import LocketPage   from './pages/LocketPage';
import SignaturePage from './pages/SignaturePage';
import PrivacyPage  from './pages/PrivacyPage';
import TermsPage    from './pages/TermsPage';
import CreditPage   from './pages/CreditPage';
import ChatPage     from './pages/ChatPage';
import StoryPage    from './pages/StoryPage';
import { PlaylistPage, EndingCinematic } from './pages/OtherPages';
import './styles/globals.css';

function isPwa() { return window.matchMedia('(display-mode:standalone)').matches || window.navigator.standalone; }

function Loader() {
  return (
    <div style={{minHeight:'100dvh',display:'flex',alignItems:'center',justifyContent:'center',position:'relative',zIndex:20}}>
      <div style={{textAlign:'center'}}>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:'5rem',fontWeight:900,color:'#fff',lineHeight:1,marginBottom:24,textShadow:'0 0 60px rgba(232,53,143,.5)'}}>
          9<em style={{color:'#F06292',fontStyle:'italic'}}>C</em>
        </div>
        <div style={{width:30,height:30,border:'2px solid rgba(240,98,146,.3)',borderTopColor:'#E8358F',borderRadius:'50%',animation:'spin .9s linear infinite',margin:'0 auto'}}/>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    </div>
  );
}

function Guard({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <Loader/>;
  if (!user)   return <Navigate to="/login" replace/>;
  return children;
}

function Reveal() {
  const loc = useLocation();
  useEffect(() => {
    const obs = new IntersectionObserver(
      e => e.forEach(x => { if (x.isIntersecting) x.target.classList.add('in'); }),
      { threshold: 0.1 }
    );
    const t = setTimeout(() => {
      document.querySelectorAll('.reveal:not(.in)').forEach(el => obs.observe(el));
    }, 150);
    return () => { clearTimeout(t); obs.disconnect(); };
  }, [loc]);
  return null;
}

function Wrapper({ children }) {
  const loc = useLocation();
  return <div key={loc.pathname} className="page-enter">{children}</div>;
}

const BDAYS = [];
function BdayBanner() {
  const today = new Date();
  const names = BDAYS.filter(b=>b.m===today.getMonth()+1&&b.d===today.getDate()).map(b=>b.name);
  const [off, setOff] = useState(false);
  if (!names.length || off) return null;
  return (
    <div style={{position:'fixed',top:'calc(var(--nav-h) + 10px)',left:14,right:14,zIndex:180,
      background:'rgba(212,35,122,.22)',backdropFilter:'blur(16px)',
      border:'1px solid rgba(212,35,122,.35)',borderRadius:14,
      padding:'12px 18px',display:'flex',alignItems:'center',gap:14,
      boxShadow:'0 4px 24px rgba(212,35,122,.25)'}}>
      <span style={{fontSize:'1.3rem'}}>🎂</span>
      <span style={{fontSize:14,color:'#fff',flex:1}}>Sinh nhật <strong>{names.join(', ')}</strong> hôm nay! 🎉</span>
      <button onClick={()=>setOff(true)} style={{color:'rgba(255,255,255,.55)',cursor:'pointer',fontSize:16}}>✕</button>
    </div>
  );
}

function Shell() {
  const [ending, setEnding] = useState(false);
  const loc = useLocation();
  useEffect(() => { window.__startEnding = () => setEnding(true); return () => delete window.__startEnding; }, []);
  const noFooter = ['/chat','/locket'].includes(loc.pathname);
  return (
    <>
      <Reveal/>
      <Navbar/>
      <BdayBanner/>
      <MusicBtn/>
      <Wrapper>
        <div style={{position:'relative',zIndex:10}}>
          <Routes>
            <Route path="/"          element={<HomePage/>}/>
            <Route path="/chung"     element={<ChungPage/>}/>
            <Route path="/seating"   element={<SeatingPage/>}/>
            <Route path="/profile"   element={<ProfilePage/>}/>
            <Route path="/locket"    element={<LocketPage/>}/>
            <Route path="/chat"      element={<ChatPage/>}/>
            <Route path="/story"     element={<StoryPage/>}/>
            <Route path="/playlist"  element={<PlaylistPage/>}/>
            <Route path="/signature" element={<SignaturePage/>}/>
            <Route path="/privacy"   element={<PrivacyPage/>}/>
            <Route path="/terms"     element={<TermsPage/>}/>
            <Route path="/credit"    element={<CreditPage/>}/>
            <Route path="*"          element={<Navigate to="/" replace/>}/>
          </Routes>
          {!noFooter && <Footer/>}
        </div>
      </Wrapper>
      {ending && <EndingCinematic onClose={()=>setEnding(false)}/>}
    </>
  );
}

function Root() {
  const [pwa, setPwa] = useState(isPwa() || localStorage.getItem('pwa-ok')==='1');
  if (!pwa) return <PwaPage onDismiss={()=>{ localStorage.setItem('pwa-ok','1'); setPwa(true); }}/>;
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<AuthPage/>}/>
          <Route path="/*" element={<Guard><Shell/></Guard>}/>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <>
      <GardenBg/>
      <Root/>
      <Toaster position="bottom-center"
        toastOptions={{
          duration:3000,
          style:{
            background:'rgba(255,249,245,.96)', color:'#1A0D12',
            border:'1px solid rgba(212,35,122,.22)', borderRadius:14,
            fontSize:14, boxShadow:'0 8px 32px rgba(0,0,0,.25)',
          },
          success:{ iconTheme:{ primary:'#E8358F', secondary:'#fff' } },
          error:  { iconTheme:{ primary:'#b33', secondary:'#fff' } },
        }}
      />
    </>
  );
}
