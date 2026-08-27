/* ============================================================================
   HEADER PROFILE & ROLE SWITCHER COMPONENT (REACT)
   ============================================================================ */

import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

export const HeaderProfile = ({ onOpenAuth, onOpenLeaderboard, onOpenGallery, onOpenSql, onOpenSupabase, onOpenAnalytics, onOpenAddLesson, onOpenChatbot }) => {
  const { currentUser, logout, switchRole } = useAuth();
  const { isDbConnected } = useData();

  const isTeacherOrAdmin = currentUser?.role === 'teacher' || currentUser?.role === 'admin';
  const isAdmin = currentUser?.role === 'admin' || (currentUser?.email || '').trim().toLowerCase() === 'hdieudate10284@gmail.com';

  const handleAnalyticsClick = () => {
    if (!isTeacherOrAdmin) {
      if (window.confirm('🔒 Chức năng Báo cáo Thống kê Lượng tương tác & Xuất file Excel dành cho vai trò Giáo viên / Admin.\n\nBạn có muốn tự động chuyển sang vai trò "👨‍🏫 Giáo viên" để xem báo cáo thống kê ngay bây giờ không?')) {
        switchRole('teacher');
        onOpenAnalytics();
      }
      return;
    }
    onOpenAnalytics();
  };

  const handleSupabaseClick = () => {
    if (!isAdmin) {
      alert('🔒 QUYỀN TRUY CẬP BỊ TỪ CHỐI!\n\nChức năng Cấu hình & Quản trị Supabase DB chỉ dành riêng cho Admin QTV.\n\nGiáo viên có thể sử dụng các chức năng Thêm bài giảng, Xem thống kê & Xuất Excel!');
      return;
    }
    onOpenSupabase();
  };

  return (
    <section className="profile-header-card">
      <div className="profile-left-info">
        <div className="profile-avatar-box">
          <img src={currentUser?.avatar} className="profile-avatar" alt="Avatar" />
          <span className="profile-badge-icon">TOP 3</span>
        </div>
        <div className="profile-text-info">
          <h3>{currentUser?.name || 'Học sinh THCS'}</h3>
          <p>{currentUser?.class} • Level {currentUser?.level} ({currentUser?.role === 'admin' ? '⚙️ Admin QTV' : currentUser?.role === 'teacher' ? '👩‍🏫 Giáo viên' : '🎓 Học sinh'})</p>
        </div>
      </div>

      <div className="profile-actions">
        {/* Nút Đăng nhập / Đăng xuất */}
        {currentUser?.username && currentUser.username !== 'guest' ? (
          <button 
            className="btn-primary" 
            style={{ background: '#FEE2E2', color: '#991B1B', borderColor: '#FECACA', fontWeight: 800 }}
            onClick={logout}
          >
            🚪 Đăng Xuất ({currentUser.username})
          </button>
        ) : (
          <button 
            className="btn-primary" 
            style={{ background: 'linear-gradient(135deg, #7C3AED, #4F46E5)', borderColor: '#6D28D9', fontWeight: 800 }}
            onClick={() => onOpenAuth('login')}
          >
            🔐 Đăng Nhập / Đăng Ký
          </button>
        )}

        {/* Trạng thái Supabase Cloud */}
        <span 
          id="supabase-status-pill" 
          className="hero-badge" 
          style={{ 
            fontSize: '11px', 
            padding: '6px 12px', 
            cursor: 'pointer', 
            borderRadius: '999px',
            background: isDbConnected ? '#DCFCE7' : '#FEF3C7',
            color: isDbConnected ? '#15803D' : '#92400E',
            borderColor: isDbConnected ? '#86EFAC' : '#FCD34D'
          }} 
          onClick={handleSupabaseClick}
        >
          {isDbConnected ? '🟢 Supabase: Đã kết nối' : '⚡ Supabase DB (Cấu hình)'}
        </span>

        {/* Chuyển Đổi Vai trò */}
        <select 
          className="role-switcher-select" 
          value={currentUser?.role || 'student'}
          onChange={(e) => switchRole(e.target.value)}
        >
          <option value="student">🎓 Vai trò: Học sinh</option>
          <option value="teacher">👨‍🏫 Vai trò: Giáo viên</option>
          <option value="admin">⚙️ Vai trò: Admin QTV</option>
        </select>

        {/* Nút Thêm Bài Giảng (Chỉ hiển thị cho Giáo Viên / Admin) */}
        {isTeacherOrAdmin && (
          <button 
            className="btn-primary" 
            style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)', borderColor: '#B45309', fontWeight: 800 }}
            onClick={onOpenAddLesson}
          >
            ➕ Thêm Bài Giảng
          </button>
        )}

        {/* Nút Thống Kê & Báo Cáo Excel (Chỉ Giáo viên mới được xem) */}
        <button 
          className="btn-primary" 
          style={{ 
            background: isTeacherOrAdmin ? 'linear-gradient(135deg, #10B981, #059669)' : '#F1F5F9', 
            color: isTeacherOrAdmin ? 'white' : '#64748B',
            borderColor: isTeacherOrAdmin ? '#047857' : '#CBD5E1', 
            fontWeight: 800,
            cursor: 'pointer'
          }}
          onClick={handleAnalyticsClick}
          title={isTeacherOrAdmin ? 'Bấm để xem thống kê & xuất file Excel' : 'Quyền hạn dành riêng cho Giáo viên'}
        >
          {isTeacherOrAdmin ? '📊 Thống Kê & Excel (Giáo Viên)' : '🔒 Thống Kê (Giáo Viên)'}
        </button>

        {/* Nút GIẢI ĐÁP THẮC MẮC & TRỢ GIÚP (Cutebot AI) */}
        <a 
          href="https://home.aiphocap.vn/chat/cutebot-xu-ly-tinh-huong-2358" 
          target="_blank" 
          rel="noopener noreferrer"
          className="btn-primary" 
          style={{ 
            background: 'linear-gradient(135deg, #4F46E5, #7C3AED)', 
            color: 'white',
            borderColor: '#4338CA', 
            fontWeight: 900, 
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(79, 70, 229, 0.35)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            textDecoration: 'none'
          }}
          onClick={() => onOpenChatbot && onOpenChatbot()}
        >
          <span>💬</span> GIẢI ĐÁP THẮC MẮC &amp; TRỢ GIÚP
        </a>

        {/* Các nút hành động */}
        <button className="btn-primary" onClick={onOpenLeaderboard}>
          🏆 Vinh Danh ({currentUser?.xp || 0} XP)
        </button>
        <button className="btn-secondary" onClick={onOpenGallery}>
          🖼️ Triển Lãm ({isTeacherOrAdmin ? 'Duyệt Bài' : 'Nộp Bài'})
        </button>
        <button className="btn-secondary" onClick={onOpenSql}>
          🗄️ SQL DB Schema
        </button>
      </div>
    </section>
  );
};
