// src/pages/PrivacyPage.jsx — Long realistic privacy policy
import { useEffect } from 'react';

const SECTIONS = [
  {
    title: 'I. Giới thiệu & Phạm vi',
    body: `Chính sách Bảo mật này ("Chính sách") mô tả cách thức website 9C – Roots & Bloom ("Chúng tôi", "Website") thu thập, sử dụng, lưu trữ và bảo vệ thông tin cá nhân của bạn khi bạn sử dụng dịch vụ của chúng tôi.

Website này được xây dựng dành riêng cho học sinh lớp 9C và hoạt động hoàn toàn phi thương mại. Mọi dữ liệu thu thập chỉ nhằm mục đích lưu giữ và chia sẻ ký ức lớp học trong một môi trường an toàn, thân thiện.

Bằng cách tạo tài khoản và sử dụng Website, bạn đồng ý với các điều khoản trong Chính sách này. Nếu bạn không đồng ý, vui lòng không sử dụng dịch vụ.`,
  },
  {
    title: 'II. Thông tin chúng tôi thu thập',
    body: `Chúng tôi thu thập các loại thông tin sau:

A) Thông tin tài khoản:
Địa chỉ email, tên hiển thị (do bạn cung cấp khi đăng ký), và mật khẩu (được mã hóa hoàn toàn bởi Firebase Authentication — chúng tôi không bao giờ đọc được mật khẩu của bạn).

B) Nội dung do người dùng tạo ra (UGC):
Ảnh bạn upload lên Locket, Memory Garden và Signature; lời nhắn bạn viết trong mục Tin nhắn cho Tương lai; nhận xét bạn để lại trong Sơ đồ lớp; chữ ký canvas của bạn.

C) Dữ liệu sử dụng tự động:
Streak upload (số ngày liên tiếp), phản ứng (reactions) bạn thực hiện với ảnh, và timestamp của các hoạt động. Chúng tôi không sử dụng cookie theo dõi hay các công cụ phân tích thương mại.`,
  },
  {
    title: 'III. Cách chúng tôi sử dụng thông tin',
    body: `Thông tin thu thập chỉ được sử dụng vào các mục đích sau:

— Xác thực danh tính và bảo mật tài khoản
— Hiển thị nội dung cá nhân hóa trong phạm vi lớp học
— Vận hành các tính năng Locket, Memory Garden, Sơ đồ lớp
— Gửi thông báo sinh nhật và nhắc nhở sự kiện lớp
— Tính toán và hiển thị streak upload
— Duy trì hoạt động bình thường của Website

Chúng tôi KHÔNG sử dụng thông tin của bạn cho:
— Quảng cáo dưới bất kỳ hình thức nào
— Phân tích thương mại hay profiling
— Chia sẻ với bên thứ ba vì mục đích tiếp thị
— Bán dữ liệu người dùng`,
  },
  {
    title: 'IV. Nền tảng lưu trữ — Firebase',
    body: `Website sử dụng Google Firebase — một nền tảng phát triển ứng dụng của Google — để lưu trữ và xử lý dữ liệu:

Firebase Authentication: Quản lý tài khoản và phiên đăng nhập. Mật khẩu được hash bằng bcrypt, không ai có thể đọc mật khẩu gốc của bạn.

Cloud Firestore: Cơ sở dữ liệu NoSQL lưu trữ tin nhắn, nhận xét và thông tin lớp học. Dữ liệu được mã hóa khi lưu trữ và truyền tải (TLS 1.3).

Firebase Storage: Lưu trữ ảnh và file media. Tất cả file được phục vụ qua HTTPS và chỉ người dùng đã đăng nhập mới có thể truy cập.

Google không sử dụng dữ liệu Firebase của các ứng dụng của bên thứ ba cho mục đích quảng cáo. Tham khảo: firebase.google.com/support/privacy`,
  },
  {
    title: 'V. Đăng nhập bằng Google & Facebook',
    body: `Nếu bạn chọn đăng nhập bằng Google hoặc Facebook (khi tính năng được kích hoạt):

Google Sign-In: Chúng tôi chỉ nhận được tên, địa chỉ email và ảnh đại diện công khai từ tài khoản Google của bạn. Chúng tôi không có quyền truy cập vào mật khẩu Google, lịch sử tìm kiếm, hay bất kỳ dữ liệu Google nào khác.

Facebook Login: Tương tự, chúng tôi chỉ nhận email và tên công khai. Bạn có thể thu hồi quyền truy cập của ứng dụng này từ cài đặt Facebook bất cứ lúc nào.

Bạn luôn có thể thay vào đó sử dụng đăng nhập bằng email/mật khẩu truyền thống để tránh chia sẻ dữ liệu từ các nền tảng mạng xã hội.`,
  },
  {
    title: 'VI. Bảo mật dữ liệu',
    body: `Chúng tôi áp dụng các biện pháp kỹ thuật sau để bảo vệ dữ liệu của bạn:

— Toàn bộ giao tiếp được mã hóa TLS/HTTPS
— Mật khẩu được hash bởi Firebase (không lưu dạng văn bản)
— Firestore Security Rules: Chỉ người dùng đã xác thực mới có thể đọc/ghi dữ liệu
— Storage Security Rules: Ảnh chỉ truy cập được bởi thành viên đã đăng nhập
— Không có bảng quản trị công khai hay API bên ngoài

Dù vậy, không có hệ thống nào đảm bảo bảo mật 100%. Bạn có trách nhiệm bảo vệ mật khẩu tài khoản của mình và không chia sẻ thông tin đăng nhập.`,
  },
  {
    title: 'VII. Thời gian lưu trữ',
    body: `Dữ liệu của bạn được lưu trữ trong suốt thời gian tồn tại của Website. Cụ thể:

— Tài khoản và thông tin cá nhân: Lưu đến khi bạn yêu cầu xóa hoặc Website bị đóng
— Ảnh Locket: Lưu vĩnh viễn (mục đích kỷ niệm)
— Tin nhắn Tương lai: Khóa đến 01/06/2026, sau đó hiển thị vĩnh viễn
— Chữ ký và nhận xét: Lưu vĩnh viễn trong phạm vi lớp học
— Dữ liệu streak: Có thể reset nếu bạn yêu cầu

Website này là dự án kỷ niệm có thời hạn. Khi Website kết thúc hoạt động, quản trị viên sẽ thông báo trước ít nhất 30 ngày để bạn có thể xuất dữ liệu cá nhân.`,
  },
  {
    title: 'VIII. Quyền của bạn',
    body: `Là người dùng, bạn có các quyền sau đây:

Quyền truy cập: Bạn có thể xem tất cả nội dung bạn đã đăng tải trong trang Hồ sơ và các trang tương ứng.

Quyền chỉnh sửa: Bạn có thể cập nhật tên hiển thị thông qua phần Cài đặt tài khoản.

Quyền xóa: Bạn có thể yêu cầu xóa toàn bộ dữ liệu cá nhân bằng cách liên hệ trực tiếp với quản trị viên. Một số nội dung liên quan đến kỷ niệm tập thể có thể được ẩn thay vì xóa hoàn toàn.

Quyền phản đối: Nếu bạn không muốn dữ liệu của mình xuất hiện trong một tính năng cụ thể, liên hệ quản trị viên để được hỗ trợ.`,
  },
  {
    title: 'IX. Quyền riêng tư của trẻ em',
    body: `Website này được thiết kế cho học sinh lớp 9 (14–15 tuổi). Chúng tôi không cố ý thu thập thông tin từ trẻ em dưới 13 tuổi mà không có sự đồng ý của phụ huynh.

Nếu bạn là phụ huynh và tin rằng con bạn đã cung cấp thông tin cá nhân mà không có sự cho phép của bạn, vui lòng liên hệ với chúng tôi ngay lập tức để xóa thông tin đó.

Mọi nội dung trên Website đều được kiểm duyệt để đảm bảo phù hợp với lứa tuổi học sinh THCS.`,
  },
  {
    title: 'X. Liên hệ về Quyền riêng tư',
    body: `Nếu bạn có bất kỳ câu hỏi nào về Chính sách Bảo mật này hoặc muốn thực hiện quyền của mình, vui lòng liên hệ:

Email: [your@email.com]
Facebook: [Link Facebook]

Chúng tôi cam kết phản hồi trong vòng 7 ngày làm việc.

Chính sách này có thể được cập nhật theo thời gian. Mọi thay đổi quan trọng sẽ được thông báo đến người dùng qua thông báo trên Website. Ngày hiệu lực cuối: Tháng 4, 2026.`,
  },
];

export default function PrivacyPage() {
  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <div className="wrap">
      <div className="section-header">
        <span className="section-eyebrow">✦ Minh bạch & An toàn ✦</span>
        <h1 className="section-title">Chính sách Bảo mật</h1>
        <p className="section-subtitle">Hiệu lực: Tháng 4, 2026 · 9C – Roots & Bloom</p>
      </div>

      <div className="inner" style={{ maxWidth: 740 }}>
        {SECTIONS.map((s, i) => (
          <div key={i} className="reveal paper-card" style={{ padding: '28px 32px', marginBottom: 16 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 600, color: 'var(--amber)', marginBottom: 16, paddingBottom: 10, borderBottom: '1px solid var(--border-soft)' }}>
              {s.title}
            </h2>
            {s.body.split('\n').map((line, j) => (
              line.trim()
                ? <p key={j} style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', color: 'var(--ink-soft)', lineHeight: 1.85, marginBottom: 10 }}>{line}</p>
                : <div key={j} style={{ height: 6 }} />
            ))}
          </div>
        ))}
        <div style={{ textAlign: 'center', padding: '32px 0', fontFamily: 'var(--font-heading)', fontStyle: 'italic', color: 'var(--ink-faint)', fontSize: '.9rem' }}>
          — Hết Chính sách Bảo mật —
        </div>
      </div>
    </div>
  );
}
