/* ============================================================================
   SIDEBAR WIDGETS COLUMN COMPONENT (REACT)
   ============================================================================ */

import React from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';

export const SidebarWidgets = ({ onOpenAnalytics, onOpenChatbot }) => {
  const { analyticsStats } = useData();
  const { switchRole, currentUser } = useAuth();
  const { gradeStats = {}, studentLogs = [] } = analyticsStats || {};

  let totalLessonViews = 0;
  let totalGameViews = 0;
  [6, 7, 8, 9].forEach(g => {
    totalLessonViews += (gradeStats[g]?.lessonViews || 0);
    totalGameViews += (gradeStats[g]?.gameViews || 0);
  });
  const grandTotal = totalLessonViews + totalGameViews;

  const handleOpenStats = () => {
    if (currentUser?.role !== 'teacher' && currentUser?.role !== 'admin') {
      alert('🔒 Chức năng Xem Báo Cáo & Xuất Excel dành cho Giáo viên / Admin.\n\nVui lòng đăng nhập tài khoản Giáo viên/Admin để truy cập!');
      return;
    }
    if (onOpenAnalytics) onOpenAnalytics();
  };

  return (
    <aside className="side-widgets-column">
      {/* Widget: Thống Kê Tương Tác Trực Tiếp */}
      <div className="side-widget-card" style={{ background: 'linear-gradient(135deg, #ECFDF5, #F0FDF4)', border: '1.5px solid #6EE7B7', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.12)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <h4 style={{ fontSize: '13px', fontWeight: 900, letterSpacing: '0.5px', color: '#047857' }}>
            📊 THỐNG KÊ TƯƠNG TÁC WEB
          </h4>
          <span style={{ fontSize: '10px', background: '#10B981', color: 'white', padding: '2px 8px', borderRadius: '999px', fontWeight: 800 }}>LIVE</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
          <div style={{ background: 'white', padding: '8px 10px', borderRadius: '10px', border: '1px solid #A7F3D0', textAlign: 'center' }}>
            <div style={{ fontSize: '18px', fontWeight: 900, color: '#059669' }}>{studentLogs.length} em</div>
            <div style={{ fontSize: '11px', color: '#047857', fontWeight: 700 }}>Học sinh học</div>
          </div>
          <div style={{ background: 'white', padding: '8px 10px', borderRadius: '10px', border: '1px solid #A7F3D0', textAlign: 'center' }}>
            <div style={{ fontSize: '18px', fontWeight: 900, color: '#2563EB' }}>{grandTotal}</div>
            <div style={{ fontSize: '11px', color: '#1D4ED8', fontWeight: 700 }}>Lượt tương tác</div>
          </div>
        </div>
        <button 
          className="btn-primary" 
          onClick={handleOpenStats}
          style={{ width: '100%', background: 'linear-gradient(135deg, #10B981, #059669)', fontSize: '12.5px', fontWeight: 800, padding: '8px 12px' }}
        >
          🔍 Xem Báo Cáo &amp; Xuất Excel ➔
        </button>
      </div>

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

      {/* Widget: Liên Hệ Trợ Giúp & Giải Đáp Thắc Mắc AI */}
      <div 
        className="side-widget-card"
        style={{
          border: '2px solid #C7D2FE',
          background: 'linear-gradient(180deg, #FFFFFF 0%, #EEF2FF 100%)',
          boxShadow: '0 4px 14px rgba(79, 70, 229, 0.15)',
          cursor: 'pointer',
          transition: 'all 0.2s ease-in-out'
        }}
        onClick={() => onOpenChatbot && onOpenChatbot()}
      >
        <h4 style={{ fontSize: '13px', fontWeight: 900, letterSpacing: '1px', color: '#4338CA', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          💬 GIẢI ĐÁP THẮC MẮC &amp; TRỢ GIÚP
        </h4>
        <p style={{ fontSize: '12px', color: '#475569', lineHeight: '1.5', marginBottom: '12px' }}>
          Em có thắc mắc bài học hoặc cần xử lý tình huống An toàn số? Kết nối ngay với <strong>Trợ lý AI</strong> để được giải đáp 24/7!
        </p>
        <a 
          href="https://home.aiphocap.vn/chat/cutebot-xu-ly-tinh-huong-2358" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{
            width: '100%',
            padding: '10px 14px',
            background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontWeight: 800,
            fontSize: '12.5px',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(124, 58, 237, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            textDecoration: 'none',
            boxSizing: 'border-box'
          }}
          onClick={(e) => {
            if (onOpenChatbot) onOpenChatbot();
          }}
        >
          <span>🤖</span> Mở Chatbox Cutebot AI ↗
        </a>
      </div>
    </aside>
  );
};
