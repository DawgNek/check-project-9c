// src/pages/PwaPage.jsx — Fixed: no require(), dark bougainvillea theme
import { useState } from 'react';

export default function PwaPage({ onDismiss }) {
  const isAndroid = /android/i.test(navigator.userAgent);
  const [tab, setTab] = useState(isAndroid ? 'android' : 'ios');

  const steps = {
    ios: [
      'Mở trang này bằng Safari',
      <>Nhấn nút <strong style={{color:'#fff'}}>Share ⬆️</strong> ở dưới màn hình</>,
      <>Chọn <strong style={{color:'#fff'}}>Add to Home Screen</strong></>,
      <>Nhấn <strong style={{color:'#fff'}}>Add</strong> để xác nhận</>,
    ],
    android: [
      'Mở trang này bằng Chrome',
      <>Nhấn menu <strong style={{color:'#fff'}}>⋮</strong> góc trên phải</>,
      <>Chọn <strong style={{color:'#fff'}}>Add to Home Screen</strong></>,
      <>Nhấn <strong style={{color:'#fff'}}>Install</strong></>,
    ],
  };

  return (
    <div style={{
      minHeight: '100dvh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(160deg,#1E0A14 0%,#2D1520 50%,#1A2A1C 100%)',
      padding: 24, position: 'relative', zIndex: 10,
    }}>
      <div style={{ maxWidth: 400, width: '100%', textAlign: 'center' }}>

        {/* Logo */}
        <div style={{
          fontFamily: "'Playfair Display',serif", fontSize: '4.5rem', fontWeight: 900,
          color: '#fff', lineHeight: 1, marginBottom: 8,
          textShadow: '0 0 60px rgba(232,53,143,.55)',
        }}>
          9<em style={{ color: '#F06292', fontStyle: 'italic' }}>C</em>
        </div>
        <div style={{
          fontFamily: "'Cormorant Garamond',serif", fontStyle: 'italic',
          color: 'rgba(240,98,146,.70)', fontSize: '1rem', letterSpacing: '.08em', marginBottom: 36,
        }}>
          Roots & Bloom
        </div>

        {/* Card */}
        <div style={{
          background: 'rgba(20,8,14,0.80)', backdropFilter: 'blur(20px)',
          border: '1px solid rgba(212,35,122,.28)', borderRadius: 20,
          padding: '28px 24px 24px', marginBottom: 20,
          boxShadow: '0 16px 60px rgba(0,0,0,.50)',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position:'absolute',top:0,left:0,right:0,height:2,background:'linear-gradient(90deg,#B01C55,#E8358F,#366B38,#E8358F,#B01C55)' }}/>

          <div style={{ fontSize: '1.8rem', marginBottom: 10 }}>📱</div>
          <div style={{
            fontFamily: "'Playfair Display',serif", fontSize: '1.15rem', fontWeight: 700,
            color: '#fff', marginBottom: 8,
          }}>Thêm vào Màn hình chính</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,.55)', marginBottom: 22, fontStyle: 'italic' }}>
            Để trải nghiệm như ứng dụng thật sự
          </div>

          {/* OS Tabs */}
          <div style={{ display:'flex', gap:4, background:'rgba(255,255,255,.06)', borderRadius:10, padding:4, marginBottom:20 }}>
            {['ios','android'].map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                flex:1, padding:'9px 0', borderRadius:8, border:'none', cursor:'pointer',
                fontFamily:"'Cinzel',serif", fontSize:10, letterSpacing:'.08em', textTransform:'uppercase',
                color: tab===t ? '#F06292' : 'rgba(255,255,255,.40)',
                background: tab===t ? 'rgba(255,255,255,.10)' : 'transparent',
                transition: 'all .3s',
              }}>
                {t === 'ios' ? '🍎 iOS' : '🤖 Android'}
              </button>
            ))}
          </div>

          {/* Steps */}
          {steps[tab].map((step, i) => (
            <div key={i} style={{
              display:'flex', alignItems:'center', gap:12, padding:'11px 0',
              borderBottom: i < steps[tab].length-1 ? '1px solid rgba(255,255,255,.07)' : 'none',
              textAlign:'left',
            }}>
              <div style={{
                width:26, height:26, borderRadius:'50%', flexShrink:0,
                background:'linear-gradient(135deg,#B01C55,#E8358F)',
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:12, fontWeight:700, color:'#fff',
              }}>{i+1}</div>
              <div style={{ fontSize:13, color:'rgba(255,255,255,.65)', lineHeight:1.5 }}>{step}</div>
            </div>
          ))}
        </div>

        <p style={{ fontSize:12, color:'rgba(255,255,255,.30)', marginBottom:14, fontStyle:'italic' }}>
          Sau khi thêm, mở app từ màn hình chính
        </p>
        <button onClick={onDismiss} style={{
          fontSize:13, color:'rgba(240,98,146,.65)', background:'none', border:'none',
          cursor:'pointer', textDecoration:'underline',
        }}>
          Bỏ qua, tiếp tục trong trình duyệt →
        </button>
      </div>
    </div>
  );
}
