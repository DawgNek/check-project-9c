// src/pages/TermsPage.jsx — Full Terms of Service
import { useEffect } from 'react';

const SECTIONS = [
  {
    title: 'I. Chấp nhận Điều khoản',
    body: `Bằng cách tạo tài khoản và sử dụng website 9C – Roots & Bloom ("Website"), bạn đồng ý tuân thủ các Điều khoản Sử dụng này ("Điều khoản"). Nếu bạn không đồng ý với bất kỳ điều khoản nào, vui lòng không sử dụng Website.

Website này là một dự án phi thương mại được tạo ra vì lợi ích chung của lớp 9C. Không có bất kỳ giao dịch thương mại nào diễn ra trên Website này.`,
  },
  {
    title: 'II. Điều kiện Sử dụng',
    body: `Để sử dụng Website, bạn phải:

— Là học sinh lớp 9C hoặc được quản trị viên cấp phép
— Sử dụng thông tin thật khi đăng ký tài khoản
— Không chia sẻ thông tin đăng nhập với người khác
— Cam kết sử dụng Website một cách có trách nhiệm và tôn trọng

Mỗi người chỉ được phép có một tài khoản. Tài khoản trùng lặp có thể bị xóa mà không cần thông báo.`,
  },
  {
    title: 'III. Nội dung được Phép & Không được Phép',
    body: `NỘI DUNG ĐƯỢC PHÉP:
— Ảnh cá nhân và ảnh lớp học phù hợp với lứa tuổi
— Lời nhắn, nhận xét tích cực, ủng hộ bạn bè
— Chữ ký cá nhân và các biểu hiện sáng tạo
— Phản ứng (reactions) với ảnh của người khác

NỘI DUNG KHÔNG ĐƯỢC PHÉP (sẽ bị xóa ngay lập tức):
— Nội dung khiêu dâm, bạo lực, hay phân biệt đối xử dưới bất kỳ hình thức nào
— Thông tin cá nhân nhạy cảm của người khác mà không có sự đồng ý
— Nội dung xúc phạm, bắt nạt, hay gây tổn hại đến người khác
— Thông tin sai lệch hay tin giả
— Nội dung vi phạm bản quyền của bên thứ ba
— Quảng cáo, spam hay nội dung thương mại`,
  },
  {
    title: 'IV. Quyền Sở hữu Nội dung',
    body: `Bạn giữ toàn quyền sở hữu đối với nội dung bạn đăng lên Website (ảnh, văn bản, chữ ký).

Bằng cách đăng tải, bạn cấp cho Website giấy phép phi độc quyền, miễn phí để hiển thị nội dung của bạn cho các thành viên trong lớp. Giấy phép này không bao gồm quyền sử dụng nội dung của bạn cho mục đích thương mại hay bên ngoài lớp học.

Bạn xác nhận rằng bạn có quyền hợp pháp để đăng tải nội dung đó — đặc biệt là ảnh có chứa hình ảnh người khác. Nếu có khiếu nại về bản quyền, quản trị viên có quyền xóa nội dung liên quan.`,
  },
  {
    title: 'V. Hành vi ứng xử & Cộng đồng',
    body: `Khu vườn ký ức 9C là không gian ấm áp, an toàn cho tất cả học sinh. Bạn đồng ý:

— Tôn trọng quyền riêng tư và cảm xúc của mọi thành viên trong lớp
— Không đăng ảnh của người khác mà không có sự cho phép của họ
— Viết nhận xét tử tế, xây dựng và khích lệ
— Báo cáo nội dung vi phạm cho quản trị viên thay vì tự xử lý
— Không sử dụng Website để giải quyết mâu thuẫn cá nhân

Vi phạm các quy tắc này có thể dẫn đến cảnh cáo, tạm khóa hoặc xóa tài khoản vĩnh viễn.`,
  },
  {
    title: 'VI. Tính năng "Tin nhắn cho Tương lai"',
    body: `Tính năng này có các điều kiện đặc biệt:

— Mỗi người dùng chỉ được gửi một tin nhắn (không thể sửa sau khi gửi)
— Tin nhắn sẽ bị khóa và ẩn cho đến ngày 01/06/2026 lúc 00:00 (UTC+7)
— Sau ngày mở khóa, tin nhắn sẽ hiển thị công khai với tất cả thành viên trong lớp
— Chỉ quản trị viên có thể xóa tin nhắn trong trường hợp vi phạm nghiêm trọng

Bằng cách gửi tin nhắn, bạn đồng ý với điều kiện hiển thị công khai sau ngày mở khóa.`,
  },
  {
    title: 'VII. Bảo mật Tài khoản',
    body: `Bạn chịu hoàn toàn trách nhiệm về:

— Bảo mật mật khẩu tài khoản của mình
— Mọi hoạt động xảy ra dưới tài khoản của bạn
— Thông báo ngay cho quản trị viên nếu phát hiện tài khoản bị xâm phạm

Chúng tôi khuyến khích bạn:
— Sử dụng mật khẩu mạnh (ít nhất 8 ký tự, kết hợp chữ và số)
— Không dùng cùng một mật khẩu với các tài khoản khác
— Đăng xuất sau khi sử dụng trên thiết bị chung`,
  },
  {
    title: 'VIII. Kiểm duyệt Nội dung',
    body: `Quản trị viên có quyền, nhưng không có nghĩa vụ, kiểm duyệt nội dung trên Website.

Chúng tôi có thể:
— Xóa nội dung vi phạm mà không cần thông báo trước
— Khóa tài khoản vi phạm tạm thời hoặc vĩnh viễn
— Chỉnh sửa hoặc ẩn nội dung không phù hợp

Chúng tôi không thể:
— Kiểm duyệt 100% nội dung trong thời gian thực
— Đảm bảo Website hoàn toàn không có nội dung không phù hợp

Nếu bạn thấy nội dung vi phạm, vui lòng báo cáo ngay cho quản trị viên.`,
  },
  {
    title: 'IX. Giới hạn Trách nhiệm',
    body: `Website được cung cấp "như hiện có" (as-is) cho mục đích phi thương mại. Chúng tôi không đảm bảo:

— Website sẽ hoạt động liên tục, không bị gián đoạn
— Dữ liệu sẽ không bao giờ bị mất (mặc dù chúng tôi cố gắng hết sức)
— Tất cả tính năng sẽ luôn hoạt động hoàn hảo

Đây là dự án cá nhân do học sinh tạo ra. Không có bất kỳ đảm bảo pháp lý hay thương mại nào được cung cấp.`,
  },
  {
    title: 'X. Thay đổi & Chấm dứt',
    body: `Chúng tôi có quyền:
— Thay đổi các Điều khoản này bất cứ lúc nào (có thông báo trước ít nhất 7 ngày)
— Thêm, sửa đổi hoặc xóa các tính năng của Website
— Tạm dừng hoặc đóng cửa Website (có thông báo trước ít nhất 30 ngày)

Bạn có quyền:
— Xóa tài khoản bất cứ lúc nào
— Yêu cầu xuất dữ liệu cá nhân trước khi Website đóng cửa

Việc tiếp tục sử dụng Website sau khi có thay đổi Điều khoản đồng nghĩa với việc bạn chấp nhận các thay đổi đó.

Liên hệ: [your@email.com] · Ngày hiệu lực: Tháng 4, 2026`,
  },
];

export default function TermsPage() {
  useEffect(() => {
    const obs = new IntersectionObserver(
      e => e.forEach(x => { if (x.isIntersecting) x.target.classList.add('visible'); }),
      { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <div className="wrap">
      <div className="section-header">
        <span className="section-eyebrow">✦ Điều khoản & Quy định ✦</span>
        <h1 className="section-title">Điều khoản Sử dụng</h1>
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
          — Hết Điều khoản Sử dụng —
        </div>
      </div>
    </div>
  );
}
