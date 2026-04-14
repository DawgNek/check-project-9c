// src/pages/CreditPage.jsx — Vintage archive style
import { useEffect } from 'react';

// ⚠️  Thay đổi thông tin thật vào đây
const CREATORS = [
  { role: 'Thiết kế & Giao diện',  name: '[ Tên người thiết kế ]', detail: 'UI/UX Design · Visual Identity · Brand Direction', contact: '' },
  { role: 'Lập trình & Phát triển', name: '[ Tên người code ]',      detail: 'React · Firebase · Vercel · Full-Stack Development', contact: '' },
];

const TOOLS = [
  { name: 'Vercel',   desc: 'Hosting & CI/CD',              url: 'https://vercel.com' },
  { name: 'Firebase', desc: 'Auth · Database · Storage',    url: 'https://firebase.google.com' },
  { name: 'React',    desc: 'UI Framework',                  url: 'https://react.dev' },
  { name: 'Vite',     desc: 'Build Tool',                    url: 'https://vitejs.dev' },
];

// ⚠️  Danh sách 44 học sinh — thay tên thật vào
const STUDENTS = [
  { name: 'Nguyễn An',     nickname: '', msg: '' },
  { name: 'Trần Bình',     nickname: '', msg: '' },
  { name: 'Lê Châu',       nickname: '', msg: '' },
  { name: 'Phạm Dung',     nickname: '', msg: '' },
  { name: 'Hoàng Em',      nickname: '', msg: '' },
  { name: 'Ngô Phúc',      nickname: '', msg: '' },
  { name: 'Vũ Giang',      nickname: '', msg: '' },
  { name: 'Đặng Hà',       nickname: '', msg: '' },
  { name: 'Bùi Ích',       nickname: '', msg: '' },
  { name: 'Trịnh Khoa',    nickname: '', msg: '' },
  { name: 'Đinh Lan',      nickname: '', msg: '' },
  { name: 'Phan Minh',     nickname: '', msg: '' },
  { name: 'Lý Nam',        nickname: '', msg: '' },
  { name: 'Tô Oanh',       nickname: '', msg: '' },
  { name: 'Hồ Phương',     nickname: '', msg: '' },
  { name: 'Cao Quỳnh',     nickname: '', msg: '' },
  { name: 'Dương Ri',      nickname: '', msg: '' },
  { name: 'Kiều Sa',       nickname: '', msg: '' },
  { name: 'Lưu Tâm',       nickname: '', msg: '' },
  { name: 'Mai Uyên',      nickname: '', msg: '' },
  { name: 'Nhan Vy',       nickname: '', msg: '' },
  { name: 'Ông Xanh',      nickname: '', msg: '' },
  { name: 'Quách Yên',     nickname: '', msg: '' },
  { name: 'Rạng Zi',       nickname: '', msg: '' },
  { name: 'Sầm An',        nickname: '', msg: '' },
  { name: 'Tạ Bảo',        nickname: '', msg: '' },
  { name: 'Ưu Ca',         nickname: '', msg: '' },
  { name: 'Vương Đào',     nickname: '', msg: '' },
  { name: 'Xô Em',         nickname: '', msg: '' },
  { name: 'Yên Phi',       nickname: '', msg: '' },
  { name: 'Ái Quốc',       nickname: '', msg: '' },
  { name: 'Bá Lộc',        nickname: '', msg: '' },
  { name: 'Cảnh Nam',      nickname: '', msg: '' },
  { name: 'Đức Minh',      nickname: '', msg: '' },
  { name: 'Gia Bảo',       nickname: '', msg: '' },
  { name: 'Hải Long',      nickname: '', msg: '' },
  { name: 'Ích Nhân',      nickname: '', msg: '' },
  { name: 'Khánh Vi',      nickname: '', msg: '' },
  { name: 'Lan Anh',       nickname: '', msg: '' },
  { name: 'Minh Tuấn',     nickname: '', msg: '' },
  { name: 'Nhật Huy',      nickname: '', msg: '' },
  { name: 'Oanh Thư',      nickname: '', msg: '' },
  { name: 'Phi Hùng',      nickname: '', msg: '' },
  { name: 'Quyết Chiến',   nickname: '', msg: '' },
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
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 700, color: 'var(--ink)', marginBottom: 10 }}>[ Tên cô giáo ]</div>
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
