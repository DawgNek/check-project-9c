// src/pages/AuthPage.jsx — Dark bougainvillea theme
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import { FlowerSVG } from '../components/ui/GardenBg';
import toast from 'react-hot-toast';

const ERRS = {
  'auth/user-not-found':'Email không tồn tại','auth/wrong-password':'Mật khẩu không đúng',
  'auth/invalid-credential':'Email hoặc mật khẩu không đúng','auth/email-already-in-use':'Email đã được đăng ký',
  'auth/invalid-email':'Email không hợp lệ','auth/weak-password':'Mật khẩu cần ≥ 6 ký tự',
  'auth/too-many-requests':'Thử lại sau vài phút',
};

function Strength({ pw }) {
  const s = Math.min(Math.floor(pw.length/2), 5);
  return (
    <div style={{display:'flex',gap:8,justifyContent:'center',margin:'10px 0 4px',height:24}}>
      {['🌱','🌿','🌸','🌺','🌳'].map((f,i) => (
        <span key={i} style={{fontSize:'1.1rem',transition:'all .4s',transform:i<s?'scale(1)':'scale(0.4)',opacity:i<s?1:.22,filter:i<s?'none':'grayscale(1)'}}>{f}</span>
      ))}
    </div>
  );
}

export default function AuthPage() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('login');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email:'', password:'', name:'' });
  const set = (k,v) => setForm(p=>({...p,[k]:v}));

  const go = async (fn, ok) => {
    setLoading(true);
    try { await fn(); toast.success(ok); navigate('/'); }
    catch(e) { toast.error(ERRS[e.code] || 'Có lỗi xảy ra'); }
    finally { setLoading(false); }
  };

  const login_ = () => {
    if (!form.email||!form.password) { toast.error('Vui lòng điền đầy đủ'); return; }
    go(()=>login(form.email,form.password), 'Chào mừng trở lại! 🌸');
  };
  const reg_ = () => {
    if (!form.name||!form.email||!form.password) { toast.error('Vui lòng điền đầy đủ'); return; }
    go(()=>register(form.email,form.password,form.name), 'Chào mừng đến khu vườn 9C! 🌸');
  };

  return (
    <div style={{minHeight:'100dvh',display:'flex',alignItems:'center',justifyContent:'center',padding:24,position:'relative',zIndex:10}}>
      <style>{`@keyframes authIn{from{opacity:0;transform:translateY(32px) scale(.97)}to{opacity:1;transform:translateY(0) scale(1)}} @keyframes floatF{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}`}</style>

      <div style={{maxWidth:440,width:'100%',animation:'authIn .72s ease-out both'}}>
        {/* Floating flowers */}
        <div style={{display:'flex',justifyContent:'center',gap:14,marginBottom:22,opacity:.75}}>
          {['#E8358F','#366B38','#D4237A','#5A9B5C','#E8358F'].map((c,i)=>(
            <div key={i} style={{animation:`floatF ${2.5+i*.4}s ease-in-out ${i*.3}s infinite`}}>
              <FlowerSVG size={26} color={c}/>
            </div>
          ))}
        </div>

        {/* Title */}
        <div style={{textAlign:'center',marginBottom:28}}>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:'4rem',fontWeight:900,color:'#fff',lineHeight:1,marginBottom:6,textShadow:'0 0 60px rgba(232,53,143,.5)'}}>
            9<em style={{color:'#F06292',fontStyle:'italic'}}>C</em>
          </div>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontStyle:'italic',color:'rgba(255,255,255,.65)',letterSpacing:'.07em'}}>
            Roots & Bloom — Khu vườn ký ức
          </div>
        </div>

        {/* Card */}
        <div style={{background:'rgba(20,8,14,0.80)',backdropFilter:'blur(24px)',border:'1px solid rgba(212,35,122,.28)',borderRadius:24,padding:'36px 32px 30px',boxShadow:'0 24px 80px rgba(0,0,0,.50)',position:'relative',overflow:'hidden'}}>
          {/* Top border */}
          <div style={{position:'absolute',top:0,left:0,right:0,height:2,background:'linear-gradient(90deg,#B01C55,#E8358F,#366B38,#E8358F,#B01C55)'}}/>

          {/* Tabs */}
          <div style={{display:'flex',gap:4,background:'rgba(255,255,255,.06)',borderRadius:12,padding:4,marginBottom:28}}>
            {[['login','Đăng nhập'],['register','Đăng ký']].map(([t,l])=>(
              <button key={t} onClick={()=>setTab(t)} style={{
                flex:1,padding:'10px 0',borderRadius:9,border:'none',cursor:'pointer',
                fontFamily:"'Cinzel',serif",fontSize:11,letterSpacing:'.08em',textTransform:'uppercase',
                color:tab===t?'#F06292':'rgba(255,255,255,.45)',
                background:tab===t?'rgba(255,255,255,.10)':'transparent',
                boxShadow:tab===t?'0 2px 10px rgba(0,0,0,.2)':'none',
                transition:'all .3s',
              }}>{l}</button>
            ))}
          </div>

          {/* Fields */}
          {tab==='register' && (
            <div style={{marginBottom:16}}>
              <label className="field-label" style={{color:'rgba(255,255,255,.50)'}}>Tên của bạn</label>
              <input className="field" type="text" placeholder="Nguyễn Văn A" value={form.name} onChange={e=>set('name',e.target.value)}
                style={{background:'rgba(255,255,255,.10)',border:'1px solid rgba(212,35,122,.30)',color:'#fff'}}/>
            </div>
          )}
          <div style={{marginBottom:16}}>
            <label className="field-label" style={{color:'rgba(255,255,255,.50)'}}>Email</label>
            <input className="field" type="email" placeholder="email@example.com" value={form.email} onChange={e=>set('email',e.target.value)}
              onKeyDown={e=>e.key==='Enter'&&(tab==='login'?login_():reg_())}
              style={{background:'rgba(255,255,255,.10)',border:'1px solid rgba(212,35,122,.30)',color:'#fff'}}/>
          </div>
          <div style={{marginBottom:8}}>
            <label className="field-label" style={{color:'rgba(255,255,255,.50)'}}>Mật khẩu</label>
            <input className="field" type="password" placeholder="••••••••" value={form.password} onChange={e=>set('password',e.target.value)}
              onKeyDown={e=>e.key==='Enter'&&(tab==='login'?login_():reg_())}
              style={{background:'rgba(255,255,255,.10)',border:'1px solid rgba(212,35,122,.30)',color:'#fff'}}/>
          </div>
          <Strength pw={form.password}/>

          <button className="btn btn-pink" disabled={loading} onClick={tab==='login'?login_:reg_}
            style={{width:'100%',marginTop:18,padding:'14px 32px'}}>
            {loading?'...':tab==='login'?'Bước vào khu vườn 🌸':'Gia nhập lớp 9C 🌸'}
          </button>

          {/* Social — placeholder */}
          <div style={{display:'flex',alignItems:'center',gap:12,margin:'18px 0',color:'rgba(255,255,255,.30)'}}>
            <div style={{flex:1,height:1,background:'rgba(255,255,255,.10)'}}/>
            <span style={{fontSize:12,fontStyle:'italic',fontFamily:"'Cormorant Garamond',serif"}}>hoặc</span>
            <div style={{flex:1,height:1,background:'rgba(255,255,255,.10)'}}/>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:10}}>
            {[['Google','#fff','rgba(255,255,255,.08)','rgba(255,255,255,.25)'],
              ['Facebook','#fff','rgba(255,255,255,.08)','rgba(255,255,255,.25)']].map(([name,c,bg,bc])=>(
              <button key={name} onClick={()=>toast(`${name} login — cần cấu hình Firebase Auth`)}
                style={{width:'100%',padding:'12px 20px',borderRadius:50,border:`1.5px solid ${bc}`,background:bg,backdropFilter:'blur(8px)',color:c,fontSize:14,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:10,transition:'all .3s'}}
                onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,.15)'}
                onMouseLeave={e=>e.currentTarget.style.background=bg}>
                Tiếp tục với {name}
              </button>
            ))}
          </div>
        </div>

        <p style={{textAlign:'center',marginTop:18,fontFamily:"'Cormorant Garamond',serif",fontStyle:'italic',fontSize:13,color:'rgba(255,255,255,.35)'}}>
          Website dành riêng cho học sinh lớp 9C
        </p>
      </div>
    </div>
  );
}
