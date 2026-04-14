// Footer — dark, matching video
export default function Footer() {
  return (
    <footer id="footer">
      <div style={{textAlign:'center', marginBottom:36}}>
        <div style={{fontFamily:"'Playfair Display',serif", fontSize:'1.8rem', color:'rgba(240,98,146,.70)', letterSpacing:'.3em'}}>
          ✦ ❧ ✦
        </div>
      </div>
      <div className="footer-grid">
        <div>
          <div className="footer-hl">Website Creators</div>
          <p className="footer-line"><strong>Designer</strong> — [ Tên người thiết kế ]</p>
          <p className="footer-line"><strong>Developer</strong> — [ Tên người code ]</p>
          <p className="footer-line" style={{marginTop:10}}><strong>Stack:</strong><br/>React · Firebase · Vercel</p>
        </div>
        <div>
          <div className="footer-hl">Liên hệ</div>
          <a href="mailto:your@email.com" className="footer-link">✉ your@email.com</a><br/>
          <a href="https://facebook.com" target="_blank" rel="noreferrer" className="footer-link">⬡ Facebook</a><br/>
          <a href="https://github.com" target="_blank" rel="noreferrer" className="footer-link">⌥ GitHub</a>
        </div>
        <div>
          <div className="footer-hl">Lớp 9C</div>
          <p className="footer-line"><strong>Lớp:</strong> 9C</p>
          <p className="footer-line"><strong>Trường:</strong> [ Tên trường ]</p>
          <p className="footer-line"><strong>Năm học:</strong> 2025–2026</p>
        </div>
      </div>
      <div className="footer-bottom">
        <em>"Kỷ niệm không bao giờ phai — chỉ được chôn sâu hơn trong tim"</em><br/>
        <span style={{fontSize:11, marginTop:6, display:'block'}}>© 2026 · 9C Roots & Bloom</span>
      </div>
    </footer>
  );
}
