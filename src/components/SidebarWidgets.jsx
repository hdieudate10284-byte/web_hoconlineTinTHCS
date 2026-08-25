/* ============================================================================
   SIDEBAR WIDGETS COLUMN COMPONENT (REACT)
   ============================================================================ */

import React from 'react';

export const SidebarWidgets = () => {
  return (
    <aside className="side-widgets-column">
      {/* Widget: Về Chúng Tôi */}
      <div className="side-widget-card widget-about-purple" id="side-about-widget">
        <div className="widget-about-header">
          <h4>VỀ CHÚNG TÔI</h4>
          <div className="lamp-graphic-box">💡</div>
        </div>
        <p className="widget-about-desc">
          Hệ thống học liệu Tin học THCS giúp học sinh yêu thích môn học, hiểu các chủ đề phức tạp và tự tin đạt kết quả cao!
        </p>
        <button 
          className="btn-yellow-sm" 
          onClick={() => alert('Hệ thống học liệu chuẩn Chương trình GDPT 2018 Tin học THCS!')}
        >
          XEM THÊM ➔
        </button>
      </div>

      {/* Widget: Hình Thức Học Tập */}
      <div className="side-widget-card">
        <h4 style={{ fontSize: '13px', fontWeight: 900, letterSpacing: '1px', color: '#7C3AED', marginBottom: '12px' }}>
          HÌNH THỨC HỌC TẬP
        </h4>
        <ul className="widget-format-list">
          <li className="widget-format-item">
            <div className="widget-format-icon">💻</div>
            <span>Học trực tuyến & Tương tác</span>
          </li>
          <li className="widget-format-item">
            <div className="widget-format-icon">⏱️</div>
            <span>Thời lượng 45 phút / bài</span>
          </li>
          <li className="widget-format-item">
            <div className="widget-format-icon">📅</div>
            <span>Lịch học linh hoạt 24/7</span>
          </li>
          <li className="widget-format-item">
            <div className="widget-format-icon">🎮</div>
            <span>Minigame ôn tập có thưởng</span>
          </li>
        </ul>
      </div>

      {/* Widget: Đánh Giá Học Viên */}
      <div className="side-widget-card widget-review-yellow">
        <h4 style={{ fontSize: '13px', fontWeight: 900, letterSpacing: '1px', color: '#854D0E', marginBottom: '8px' }}>
          ĐÁNH GIÁ HỌC VIÊN
        </h4>
        <p className="widget-review-quote">
          "Cảm ơn thầy cô vì những bài học an toàn số rất dễ hiểu! Em đã biết cách tạo mật khẩu mạnh và không sợ bị lừa đảo mạng nữa."
        </p>
        <div className="widget-review-author">— Nguyễn Mỹ Nhi, Lớp 8C</div>
      </div>

      {/* Widget: Liên Hệ */}
      <div className="side-widget-card">
        <h4 style={{ fontSize: '13px', fontWeight: 900, letterSpacing: '1px', color: '#334155', marginBottom: '8px' }}>
          LIÊN HỆ TRỢ GIÚP
        </h4>
        <p style={{ fontSize: '12px', color: '#64748B' }}>Kết nối với giáo viên hỗ trợ nhanh:</p>
        <div className="social-buttons-row">
          <div className="social-btn" style={{ background: '#0088cc' }} title="Telegram">T</div>
          <div className="social-btn" style={{ background: '#25D366' }} title="WhatsApp">W</div>
          <div className="social-btn" style={{ background: '#7C3AED' }} title="Zalo">Z</div>
          <div className="social-btn" style={{ background: '#EF4444' }} title="Email">@</div>
        </div>
      </div>
    </aside>
  );
};
