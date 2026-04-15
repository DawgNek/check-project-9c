// src/pages/CreditPage.jsx — Vintage archive style
import { useEffect } from 'react';

// ⚠️  Thay đổi thông tin thật vào đây
const CREATORS = [
  { role: 'Thiết kế & Giao diện',  name: '[ dang ]', detail: 'UI/UX Design · Visual Identity · Brand Direction', contact: '' },
  { role: 'Lập trình & Phát triển', name: '[ dang ]',      detail: 'React · Firebase · Vercel · Full-Stack Development', contact: '' },
];

const TOOLS = [
  { name: 'Vercel',   desc: 'Hosting & CI/CD',              url: 'https://vercel.com/dawgneks-projects/check9c' },
  { name: 'Firebase', desc: 'Auth · Database · Storage',    url: 'https://console.firebase.google.com/u/0/project/cmemories-86b62/overview' },
  { name: 'React',    desc: 'UI Framework',                  url: 'https://react.dev' },
  { name: 'Vite',     desc: 'Build Tool',                    url: 'https://vitejs.dev' },
];

// ⚠️  Danh sách 44 học sinh — thay tên thật vào
const STUDENTS = [
  { name: '1 ',     nickname: '', msg: '' },
  { name: '2',     nickname: '', msg: '' },
  { name: '3',       nickname: '', msg: '' },
  { name: '4',     nickname: '', msg: '' },
  { name: '5',      nickname: '', msg: '' },
  { name: '6',      nickname: '', msg: '' },
  { name: '7',      nickname: '', msg: '' },
  { name: '8',       nickname: '', msg: '' },
  { name: '9',       nickname: '', msg: '' },
  { name: '10',    nickname: '', msg: '' },
  { name: '11',      nickname: '', msg: '' },
  { name: '12',     nickname: '', msg: '' },
  { name: '13',        nickname: '', msg: '' },
  { name: '14',       nickname: '', msg: '' },
  { name: '15',     nickname: '', msg: '' },
  { name: '16',     nickname: '', msg: '' },
  { name: '17',      nickname: '', msg: '' },
  { name: '18',       nickname: '', msg: '' },
  { name: '19',       nickname: '', msg: '' },
  { name: '20',      nickname: '', msg: '' },
  { name: '21',       nickname: '', msg: '' },
  { name: '22',      nickname: '', msg: '' },
  { name: '23',     nickname: '', msg: '' },
  { name: '24',       nickname: '', msg: '' },
  { name: '25',        nickname: '', msg: '' },
  { name: '26',        nickname: '', msg: '' },
  { name: '27',         nickname: '', msg: '' },
  { name: '27',     nickname: '', msg: '' },
  { name: '28',         nickname: '', msg: '' },
  { name: '29',       nickname: '', msg: '' },
  { name: '30',       nickname: '', msg: '' },
  { name: '31',        nickname: '', msg: '' },
  { name: '32',      nickname: '', msg: '' },
  { name: '33',      nickname: '', msg: '' },
  { name: '34',       nickname: '', msg: '' },
  { name: '35',      nickname: '', msg: '' },
  { name: '36',      nickname: '', msg: '' },
  { name: '37',      nickname: '', msg: '' },
  { name: '38',       nickname: '', msg: '' },
  { name: '39',     nickname: '', msg: '' },
  { name: '40',      nickname: '', msg: '' },
  { name: '41',      nickname: '', msg: '' },
  { name: '42',      nickname: '', msg: '' },
  { name: '43',   nickname: '', msg: '' },
  { name: '44',   nickname: '', msg: '' },
];

export default function CreditPage() {
  useEffect(() => {
    const obs = new IntersectionObserver(
      e => e.forEach(x => { if (x.isIntersecting) x.target.classList.add('visible'); }),
      { threshold: 0.08 }
    );
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <div className="wrap">
      <div className="section-header">
        <span className="section-eyebrow">✦ Những người tạo nên khu vườn ✦</span>
        <h1 className="section-title">Credit</h1>
        <p className="section-subtitle">Website được xây dựng với tất cả tình yêu dành cho lớp 9C</p>
      </div>

      <div className="inner">

        {/* ── PART 1: Website Creators ─────────────────────── */}
        <div className="ornamental-divider reveal">Người tạo ra Website</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 20, marginBottom: 48 }}>
          {CREATORS.map((c, i) => (
            <div key={i} className="reveal vintage-card" style={{ padding: '32px 28px', textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-label)', fontSize: '.68rem', letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 14 }}>{c.role}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--ink)', marginBottom: 10 }}>{c.name}</div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: '.9rem', color: 'var(--ink-muted)', fontStyle: 'italic', lineHeight: 1.7 }}>{c.detail}</div>
              {c.contact && <div style={{ marginTop: 12, fontSize: '.85rem', color: 'var(--amber)' }}>{c.contact}</div>}
            </div>
          ))}
        </div>

        {/* ── PART 2: Tools ────────────────────────────────── */}
        <div className="ornamental-divider reveal">Công cụ & Nền tảng</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 14, marginBottom: 56 }}>
          {TOOLS.map((t, i) => (
            <a key={i} href={t.url} target="_blank" rel="noreferrer"
              className="reveal paper-card"
              style={{ padding: '20px 18px', textAlign: 'center', transition: 'all .3s', display: 'block' }}
              onMouseEnter={e => e.currentTarget.style.transform='translateY(-4px)'}
              onMouseLeave={e => e.currentTarget.style.transform='translateY(0)'}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 600, color: 'var(--amber)', marginBottom: 6 }}>{t.name}</div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: '.82rem', color: 'var(--ink-faint)', fontStyle: 'italic' }}>{t.desc}</div>
            </a>
          ))}
        </div>

        {/* ── PART 3: Danh sách học sinh ────────────────────── */}
        <div className="ornamental-divider reveal">Học sinh lớp 9C — 2025–2026</div>
        <div style={{ marginBottom: 24, textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontStyle: 'italic', color: 'var(--ink-muted)' }}>
            44 học sinh · 1 giáo viên · Vô số kỷ niệm
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 12, marginBottom: 60 }}>
          {STUDENTS.map((s, i) => (
            <div key={i} className="reveal paper-card"
              style={{ padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 14, transition: 'all .3s' }}
              onMouseEnter={e => e.currentTarget.style.background='rgba(202,165,106,.08)'}
              onMouseLeave={e => e.currentTarget.style.background=''}>
              {/* Index */}
              <div style={{ fontFamily: 'var(--font-label)', fontSize: '.65rem', color: 'var(--ink-faint)', minWidth: 24, letterSpacing: '.05em' }}>
                {String(i+1).padStart(2,'0')}
              </div>
              {/* Avatar circle */}
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: `hsl(${(i*47)%360},40%,70%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: '.85rem', fontWeight: 700, color: '#fff', flexShrink: 0 }}>
                {s.name[0]}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 600, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.name}</div>
                {s.nickname && <div style={{ fontSize: '.78rem', color: 'var(--ink-faint)', fontStyle: 'italic' }}>"{s.nickname}"</div>}
                {s.msg && <div style={{ fontSize: '.78rem', color: 'var(--ink-muted)', marginTop: 2, fontStyle: 'italic', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.msg}</div>}
              </div>
            </div>
          ))}
        </div>

        {/* Teacher */}
        <div className="reveal vintage-card" style={{ padding: '32px', textAlign: 'center', marginBottom: 60 }}>
          <div style={{ fontSize: '2rem', marginBottom: 12 }}>🌿</div>
          <div style={{ fontFamily: 'var(--font-label)', fontSize: '.68rem', letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 10 }}>Giáo viên Chủ nhiệm</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 700, color: 'var(--ink)', marginBottom: 10 }}>[ Lưu Thị Hằng ]</div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontStyle: 'italic', color: 'var(--ink-muted)', maxWidth: 400, margin: '0 auto', lineHeight: 1.8 }}>
            "Người đã dẫn dắt và đồng hành cùng chúng ta trong suốt năm học đáng nhớ này"
          </div>
        </div>

        {/* Closing quote */}
        <div style={{ textAlign: 'center', padding: '0 24px 40px' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--gold)', marginBottom: 16 }}>❧</div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontStyle: 'italic', color: 'var(--ink-muted)', lineHeight: 1.9, maxWidth: 500, margin: '0 auto' }}>
            "Dù đường đời có chia đôi ngả, ký ức này sẽ theo chúng ta mãi."
          </div>
          <div style={{ marginTop: 16, fontFamily: 'var(--font-label)', fontSize: '.7rem', letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--gold)' }}>
            9C · Roots & Bloom · 2025–2026
          </div>
        </div>
      </div>
    </div>
  );
}
