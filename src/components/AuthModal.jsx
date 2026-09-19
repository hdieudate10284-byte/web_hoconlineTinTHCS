/* ============================================================================
   AUTH MODAL COMPONENT (REACT 18 - LOGIN & REGISTER SYSTEM)
   Đồng bộ trực tiếp với Supabase Cloud DB + Live Validation + Avatar Picker + Confetti
   ============================================================================ */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

// Danh sách Avatar mẫu để học sinh/giáo viên lựa chọn trực quan
const AVATAR_OPTIONS = [
  { id: 'bot1', label: 'Robot Alpha', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=student1' },
  { id: 'bot2', label: 'Robot Beta', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=duyen' },
  { id: 'bot3', label: 'Robot Gamma', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=binh' },
  { id: 'bot4', label: 'Robot Spark', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=cuong' },
  { id: 'hero1', label: 'Chiến Binh Số', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=cyber' },
  { id: 'hero2', label: 'Thần Đồng Code', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=coder' },
  { id: 'teacher1', label: 'Thầy Giáo', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=teacher' },
  { id: 'admin1', label: 'Quản Trị Viên', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=admin' }
];

// Danh sách tất cả các lớp từ /1 đến /13 cho các Khối 6, 7, 8, 9
export const ALL_CLASSES_BY_GRADE = {
  6: Array.from({ length: 13 }, (_, i) => `6/${i + 1}`),
  7: Array.from({ length: 13 }, (_, i) => `7/${i + 1}`),
  8: Array.from({ length: 13 }, (_, i) => `8/${i + 1}`),
  9: Array.from({ length: 13 }, (_, i) => `9/${i + 1}`)
};

export const AuthModal = ({ isOpen, onClose, initialTab = 'login' }) => {
  const [tab, setTab] = useState(initialTab);
  
  // State Đăng nhập
  const [loginRole, setLoginRole] = useState('student');
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginClass, setLoginClass] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  
  // State Đăng ký
  const [regUsername, setRegUsername] = useState('');
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regRole, setRegRole] = useState('student');
  const [regGrade, setRegGrade] = useState('6');
  const [regClass, setRegClass] = useState('Lớp 6A1');
  const [regAvatar, setRegAvatar] = useState(AVATAR_OPTIONS[0].url);
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  
  // Feedback & Loading
  const [statusMsg, setStatusMsg] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, register } = useAuth();
  const { syncSupabaseData, isDbConnected } = useData();

  // Reset tab khi mở modal
  useEffect(() => {
    if (isOpen) {
      setTab(initialTab);
      setStatusMsg(null);
    }
  }, [isOpen, initialTab]);

  // Cập nhật tên lớp mặc định khi đổi khối
  useEffect(() => {
    if (regRole === 'teacher') {
      setRegClass('Giáo viên');
    } else {
      setRegClass(`${regGrade}/1`);
    }
  }, [regGrade, regRole]);

  if (!isOpen) return null;

  // Tính toán độ mạnh mật khẩu (Password Strength)
  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, text: 'Chưa nhập', color: '#94A3B8', width: '0%' };
    if (pass.length < 4) return { score: 1, text: 'Rất yếu (≥ 4 ký tự)', color: '#EF4444', width: '25%' };
    if (pass.length < 6) return { score: 2, text: 'Trung bình', color: '#F59E0B', width: '50%' };
    if (/[A-Z]/.test(pass) || /[0-9]/.test(pass) || /[^A-Za-z0-9]/.test(pass)) {
      return { score: 4, text: 'Mạnh & An toàn', color: '#10B981', width: '100%' };
    }
    return { score: 3, text: 'Khá tốt', color: '#3B82F6', width: '75%' };
  };

  const passwordStrength = getPasswordStrength(regPassword);

  // Xử lý nộp Form Đăng nhập
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginUsername.trim() || !loginPassword.trim()) {
      setStatusMsg({ type: 'error', text: '⚠️ Vui lòng điền đầy đủ Tên đăng nhập và Mật khẩu!' });
      return;
    }

    setIsSubmitting(true);
    setStatusMsg({ type: 'info', text: '⏳ Đang xác thực thông tin tài khoản...' });

    const res = await login(loginUsername, loginPassword, loginClass);
    setIsSubmitting(false);

    if (res.success) {
      setStatusMsg({ type: 'success', text: res.message });
      // Kích hoạt pháo hoa ăn mừng
      if (window.confetti) {
        window.confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
      }
      // Tự động đồng bộ lại Leaderboard & Dữ liệu
      syncSupabaseData();

      setTimeout(() => {
        onClose();
        setStatusMsg(null);
      }, 1000);
    } else {
      setStatusMsg({ type: 'error', text: res.message });
    }
  };

  // Xử lý nộp Form Đăng ký
  const handleRegister = async (e) => {
    e.preventDefault();

    if (regPassword !== regConfirmPassword) {
      setStatusMsg({ type: 'error', text: '⚠️ Mật khẩu và Xác nhận mật khẩu không khớp nhau!' });
      return;
    }

    if (regPassword.length < 4) {
      setStatusMsg({ type: 'error', text: '⚠️ Mật khẩu phải có tối thiểu 4 ký tự!' });
      return;
    }

    setIsSubmitting(true);
    setStatusMsg({ type: 'info', text: '⏳ Đang ghi danh và lưu tài khoản vào Supabase Cloud...' });

    const res = await register({
      username: regUsername,
      password: regPassword,
      fullName: regFullName,
      email: regEmail,
      role: regRole,
      className: regClass,
      gradeLevel: regGrade,
      avatarUrl: regAvatar
    });

    setIsSubmitting(false);

    if (res.success) {
      setStatusMsg({ type: 'success', text: res.message });
      // Kích hoạt pháo hoa rực rỡ khi tạo tài khoản thành công
      if (window.confetti) {
        window.confetti({ particleCount: 120, spread: 80, origin: { y: 0.5 } });
      }
      syncSupabaseData();

      setTimeout(() => {
        onClose();
        setStatusMsg(null);
      }, 1200);
    } else {
      setStatusMsg({ type: 'error', text: res.message });
    }
  };

  // Điền nhanh tài khoản demo để trải nghiệm 1 chạm
  const fillQuickLogin = (u, p, c) => {
    setLoginUsername(u);
    setLoginPassword(p);
    if (c) setLoginClass(c);
    setStatusMsg({ type: 'info', text: `✨ Đã chọn tài khoản mẫu "${u}" (Lớp ${c || '6/1'}). Bấm "Đăng Nhập Ngay" để vào hệ thống!` });
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target.className === 'modal-overlay' && onClose()}>
      <div className="modal-container" style={{ maxWidth: '520px', borderRadius: '24px', padding: '28px 32px' }}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Đóng popup">✕</button>

        {/* Header Tiêu đề */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: '999px', background: '#EDE9FE', color: '#6D28D9', fontSize: '12px', fontWeight: 800, marginBottom: '8px' }}>
            <span>{isDbConnected ? '🟢 Supabase Cloud Active' : '⚡ Chế độ Học Liệu THCS'}</span>
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 900, color: '#1E293B', letterSpacing: '-0.5px' }}>
            {tab === 'login' ? 'Đăng Nhập Tài Khoản' : 'Đăng Ký Thành Viên Mới'}
          </h2>
          <p style={{ fontSize: '13px', color: '#64748B', marginTop: '4px' }}>
            {tab === 'login' 
              ? 'Nhập Username & Mật khẩu để đồng bộ điểm XP và bảng xếp hạng' 
              : 'Tạo tài khoản học tập để nhận ngay +100 XP danh dự khởi đầu'}
          </p>
        </div>

        {/* Tab chuyển đổi Đăng nhập / Đăng ký */}
        <div style={{ 
          display: 'flex', 
          background: '#F1F5F9', 
          borderRadius: '14px', 
          padding: '4px', 
          marginBottom: '20px', 
          border: '1px solid #E2E8F0' 
        }}>
          <button 
            type="button"
            style={{
              flex: 1, 
              padding: '10px 16px', 
              border: 'none', 
              borderRadius: '10px', 
              fontWeight: 800, 
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              background: tab === 'login' ? '#FFFFFF' : 'transparent',
              color: tab === 'login' ? '#7C3AED' : '#64748B',
              boxShadow: tab === 'login' ? '0 4px 12px rgba(124, 58, 237, 0.12)' : 'none'
            }}
            onClick={() => { setTab('login'); setStatusMsg(null); }}
          >
            🔑 Đăng Nhập
          </button>
          <button 
            type="button"
            style={{
              flex: 1, 
              padding: '10px 16px', 
              border: 'none', 
              borderRadius: '10px', 
              fontWeight: 800, 
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              background: tab === 'register' ? '#FFFFFF' : 'transparent',
              color: tab === 'register' ? '#7C3AED' : '#64748B',
              boxShadow: tab === 'register' ? '0 4px 12px rgba(124, 58, 237, 0.12)' : 'none'
            }}
            onClick={() => { setTab('register'); setStatusMsg(null); }}
          >
            📝 Đăng Ký (+100 XP)
          </button>
        </div>

        {/* Hộp thông báo trạng thái */}
        {statusMsg && (
          <div style={{
            padding: '12px 16px', 
            borderRadius: '12px', 
            fontSize: '13px', 
            fontWeight: 600, 
            marginBottom: '18px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: statusMsg.type === 'success' ? '#DCFCE7' : statusMsg.type === 'error' ? '#FEE2E2' : '#EFF6FF',
            color: statusMsg.type === 'success' ? '#15803D' : statusMsg.type === 'error' ? '#991B1B' : '#1E40AF',
            border: `1px solid ${statusMsg.type === 'success' ? '#86EFAC' : statusMsg.type === 'error' ? '#FECACA' : '#BFDBFE'}`,
            animation: 'modalFadeIn 0.2s ease'
          }}>
            <span>{statusMsg.text}</span>
          </div>
        )}

        {/* ==========================================
            FORM 1: ĐĂNG NHẬP
            ========================================== */}
        {tab === 'login' ? (
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Bộ chọn Vai trò khi Đăng nhập */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                🎭 Vai trò tài khoản đăng nhập:
              </label>
              <div style={{ display: 'flex', gap: '8px', background: '#F1F5F9', padding: '4px', borderRadius: '12px' }}>
                <button
                  type="button"
                  onClick={() => { setLoginRole('student'); if (loginClass === 'Giáo viên') setLoginClass(''); }}
                  style={{
                    flex: 1, padding: '8px', borderRadius: '8px', border: 'none', fontWeight: 800, fontSize: '13px', cursor: 'pointer',
                    background: loginRole === 'student' ? '#FFFFFF' : 'transparent',
                    color: loginRole === 'student' ? '#7C3AED' : '#64748B',
                    boxShadow: loginRole === 'student' ? '0 2px 6px rgba(0,0,0,0.08)' : 'none'
                  }}
                >
                  🎓 Học sinh
                </button>
                <button
                  type="button"
                  onClick={() => { setLoginRole('teacher'); setLoginClass('Giáo viên'); }}
                  style={{
                    flex: 1, padding: '8px', borderRadius: '8px', border: 'none', fontWeight: 800, fontSize: '13px', cursor: 'pointer',
                    background: loginRole === 'teacher' ? '#FFFFFF' : 'transparent',
                    color: loginRole === 'teacher' ? '#D97706' : '#64748B',
                    boxShadow: loginRole === 'teacher' ? '0 2px 6px rgba(0,0,0,0.08)' : 'none'
                  }}
                >
                  👨‍🏫 Giáo viên
                </button>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                {loginRole === 'teacher' ? '✉️ Địa chỉ Email Giáo viên:' : '👤 Tên đăng nhập (Username Học sinh):'}
              </label>
              <div style={{ position: 'relative' }}>
                <input 
                  type={loginRole === 'teacher' ? 'email' : 'text'} 
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  placeholder={loginRole === 'teacher' ? 'Ví dụ: thaynam@gmail.com hoặc hdieudate10284@gmail.com' : 'Ví dụ: hocsinh6, nguyenvana6...'}
                  required
                  autoFocus
                  style={{ 
                    width: '100%', 
                    padding: '12px 16px', 
                    borderRadius: '12px', 
                    border: '1.5px solid #CBD5E1', 
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    background: loginRole === 'teacher' ? '#FEF3C7' : '#F8FAFC'
                  }}
                  onFocus={(e) => e.target.style.borderColor = loginRole === 'teacher' ? '#D97706' : '#7C3AED'}
                  onBlur={(e) => e.target.style.borderColor = '#CBD5E1'}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                🏫 Chọn Lớp Học / Vai Trò:
              </label>
              <div style={{ position: 'relative' }}>
                <select 
                  value={loginClass}
                  onChange={(e) => {
                    setLoginClass(e.target.value);
                    if (e.target.value === 'Giáo viên') setLoginRole('teacher');
                  }}
                  style={{ 
                    width: '100%', 
                    padding: '12px 16px', 
                    borderRadius: '12px', 
                    border: '1.5px solid #CBD5E1', 
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    background: '#FFFFFF',
                    fontWeight: 700,
                    color: '#1E293B',
                    cursor: 'pointer'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#7C3AED'}
                  onBlur={(e) => e.target.style.borderColor = '#CBD5E1'}
                >
                  <option value="">-- Bấm vào đây để chọn Lớp / Vai trò --</option>
                  <optgroup label="👨‍🏫 DÀNH CHO GIÁO VIÊN">
                    <option value="Giáo viên">👨‍🏫 Giáo viên</option>
                  </optgroup>
                  <optgroup label="🎓 KHỐI 6 (Từ Lớp 6/1 đến Lớp 6/13)">
                    {ALL_CLASSES_BY_GRADE[6].map(cls => (
                      <option key={cls} value={cls}>Lớp {cls}</option>
                    ))}
                  </optgroup>
                  <optgroup label="🎓 KHỐI 7 (Từ Lớp 7/1 đến Lớp 7/13)">
                    {ALL_CLASSES_BY_GRADE[7].map(cls => (
                      <option key={cls} value={cls}>Lớp {cls}</option>
                    ))}
                  </optgroup>
                  <optgroup label="🎓 KHỐI 8 (Từ Lớp 8/1 đến Lớp 8/13)">
                    {ALL_CLASSES_BY_GRADE[8].map(cls => (
                      <option key={cls} value={cls}>Lớp {cls}</option>
                    ))}
                  </optgroup>
                  <optgroup label="🎓 KHỐI 9 (Từ Lớp 9/1 đến Lớp 9/13)">
                    {ALL_CLASSES_BY_GRADE[9].map(cls => (
                      <option key={cls} value={cls}>Lớp {cls}</option>
                    ))}
                  </optgroup>
                </select>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: 700, color: '#334155' }}>
                  🔒 Mật khẩu:
                </label>
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  style={{ background: 'none', border: 'none', color: '#7C3AED', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
                >
                  {showLoginPassword ? '🙈 Ẩn mật khẩu' : '👁️ Hiện mật khẩu'}
                </button>
              </div>
              <div style={{ position: 'relative' }}>
                <input 
                  type={showLoginPassword ? 'text' : 'password'}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Mật khẩu tài khoản (Mặc định demo: 123456)"
                  required
                  style={{ 
                    width: '100%', 
                    padding: '12px 16px', 
                    borderRadius: '12px', 
                    border: '1.5px solid #CBD5E1', 
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    background: '#F8FAFC'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#7C3AED'}
                  onBlur={(e) => e.target.style.borderColor = '#CBD5E1'}
                />
              </div>
            </div>

            {/* Checkbox Ghi nhớ đăng nhập */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#475569', fontWeight: 600 }}>
                <input 
                  type="checkbox" 
                  checked={rememberMe} 
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{ accentColor: '#7C3AED', width: '16px', height: '16px' }}
                />
                Ghi nhớ phiên đăng nhập
              </label>
              <span style={{ color: '#64748B', fontSize: '12px' }}>Mặc định pass: <strong>123456</strong></span>
            </div>

            {/* Nút Submit Đăng Nhập */}
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="btn-primary" 
              style={{ 
                padding: '14px', 
                fontSize: '15px', 
                fontWeight: 900, 
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)',
                borderColor: '#6D28D9',
                boxShadow: '0 8px 20px -4px rgba(124, 58, 237, 0.4)',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                opacity: isSubmitting ? 0.7 : 1
              }}
            >
              {isSubmitting ? '⏳ Đang xác thực...' : '🚀 ĐĂNG NHẬP NGAY'}
            </button>

            {/* Tài khoản mẫu 1 chạm */}
            <div style={{ 
              background: '#F8FAFC', 
              border: '1px solid #E2E8F0', 
              borderRadius: '14px', 
              padding: '14px', 
              marginTop: '6px' 
            }}>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#1E293B', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>💡 Bấm 1 chạm thử nhanh tài khoản mẫu (Pass: 123456):</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
                <button type="button" className="btn-secondary" style={{ fontSize: '11px', padding: '6px', fontWeight: 700 }} onClick={() => fillQuickLogin('hocsinh6', '123456', '6/1')}>🎓 Lớp 6/1</button>
                <button type="button" className="btn-secondary" style={{ fontSize: '11px', padding: '6px', fontWeight: 700 }} onClick={() => fillQuickLogin('hocsinh7', '123456', '7/1')}>🎓 Lớp 7/1</button>
                <button type="button" className="btn-secondary" style={{ fontSize: '11px', padding: '6px', fontWeight: 700 }} onClick={() => fillQuickLogin('hocsinh8', '123456', '8/1')}>🎓 Lớp 8/1</button>
                <button type="button" className="btn-secondary" style={{ fontSize: '11px', padding: '6px', fontWeight: 700 }} onClick={() => fillQuickLogin('hocsinh9', '123456', '9/1')}>🎓 Lớp 9/1</button>
              </div>
            </div>
          </form>
        ) : (
          /* ==========================================
             FORM 2: ĐĂNG KÝ TÀI KHOẢN MỚI
             ========================================== */
          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Tên đăng nhập & Họ tên */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  👤 Tên đăng nhập (Username):
                </label>
                <input 
                  type="text" 
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                  placeholder="nguyenvana6"
                  required
                  style={{ 
                    width: '100%', padding: '10px 12px', borderRadius: '10px', 
                    border: '1.5px solid #CBD5E1', fontSize: '13px', background: '#F8FAFC' 
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  {regRole === 'teacher' ? '📛 Họ và tên Giáo viên:' : '📛 Họ và tên học sinh:'}
                </label>
                <input 
                  type="text" 
                  value={regFullName}
                  onChange={(e) => setRegFullName(e.target.value)}
                  placeholder={regRole === 'teacher' ? 'Ví dụ: Cô Nguyễn Thị Huyền Diệu, Thầy Nam...' : 'Nguyễn Văn An'}
                  required
                  style={{ 
                    width: '100%', padding: '10px 12px', borderRadius: '10px', 
                    border: '1.5px solid #CBD5E1', fontSize: '13px', background: '#F8FAFC' 
                  }}
                />
              </div>
            </div>

            {/* Vai trò & Khối lớp */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  🎭 Vai trò thành viên:
                </label>
                <select 
                  value={regRole}
                  onChange={(e) => setRegRole(e.target.value)}
                  style={{ 
                    width: '100%', padding: '10px', borderRadius: '10px', 
                    border: '1.5px solid #CBD5E1', fontSize: '13px', background: '#FFFFFF', fontWeight: 600 
                  }}
                >
                  <option value="student">🎓 Học sinh THCS</option>
                  <option value="teacher">👨‍🏫 Giáo viên</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  🏫 Khối lớp học:
                </label>
                <select 
                  value={regGrade}
                  disabled={regRole === 'teacher'}
                  onChange={(e) => setRegGrade(e.target.value)}
                  style={{ 
                    width: '100%', padding: '10px', borderRadius: '10px', 
                    border: '1.5px solid #CBD5E1', fontSize: '13px', background: regRole === 'teacher' ? '#F1F5F9' : '#FFFFFF', fontWeight: 600 
                  }}
                >
                  <option value="6">Khối 6</option>
                  <option value="7">Khối 7</option>
                  <option value="8">Khối 8</option>
                  <option value="9">Khối 9</option>
                </select>
              </div>
            </div>

            {/* Email Bắt buộc cho Giáo viên */}
            {regRole === 'teacher' && (
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#DC2626', marginBottom: '4px' }}>
                  ✉️ Email Giáo viên chính thức (Bắt buộc):
                </label>
                <input 
                  type="email" 
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="hdieudate10284@gmail.com"
                  required
                  style={{ 
                    width: '100%', padding: '10px 12px', borderRadius: '10px', 
                    border: '1.5px solid #FCA5A5', fontSize: '13px', background: '#FEF2F2', fontWeight: 700, color: '#991B1B' 
                  }}
                />
              </div>
            )}

            {/* Nút thả chọn Tên Lớp cụ thể */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                🏫 Chọn Tên Lớp Học Cụ Thể (từ {regGrade}/1 đến {regGrade}/13):
              </label>
              <select 
                value={regClass}
                disabled={regRole === 'teacher'}
                onChange={(e) => setRegClass(e.target.value)}
                style={{ 
                  width: '100%', padding: '10px 12px', borderRadius: '10px', 
                  border: '1.5px solid #CBD5E1', fontSize: '13px', background: regRole === 'teacher' ? '#F1F5F9' : '#FFFFFF', fontWeight: 700, color: '#1E293B'
                }}
              >
                {regRole === 'teacher' ? (
                  <option value="Giáo viên">Giáo viên</option>
                ) : (
                  (ALL_CLASSES_BY_GRADE[regGrade] || ALL_CLASSES_BY_GRADE[6]).map(cls => (
                    <option key={cls} value={cls}>Lớp {cls}</option>
                  ))
                )}
              </select>
            </div>

            {/* Bộ chọn Avatar nhân vật trực quan */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                🤖 Chọn Ảnh đại diện (Avatar):
              </label>
              <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                {AVATAR_OPTIONS.map((av) => {
                  const isSelected = regAvatar === av.url;
                  return (
                    <div 
                      key={av.id}
                      onClick={() => setRegAvatar(av.url)}
                      style={{
                        cursor: 'pointer',
                        padding: '4px',
                        borderRadius: '50%',
                        border: isSelected ? '3px solid #7C3AED' : '2px solid transparent',
                        background: isSelected ? '#EDE9FE' : '#F1F5F9',
                        transform: isSelected ? 'scale(1.1)' : 'scale(1)',
                        transition: 'all 0.2s',
                        flexShrink: 0
                      }}
                      title={av.label}
                    >
                      <img 
                        src={av.url} 
                        alt={av.label} 
                        style={{ width: '38px', height: '38px', borderRadius: '50%', display: 'block' }} 
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Mật khẩu & Xác nhận */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                  🔒 Mật khẩu (Tối thiểu 4 ký tự):
                </label>
                <button
                  type="button"
                  onClick={() => setShowRegPassword(!showRegPassword)}
                  style={{ background: 'none', border: 'none', color: '#7C3AED', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
                >
                  {showRegPassword ? '🙈 Ẩn' : '👁️ Hiện'}
                </button>
              </div>
              <input 
                type={showRegPassword ? 'text' : 'password'}
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                placeholder="Nhập mật khẩu bí mật"
                required
                style={{ 
                  width: '100%', padding: '10px 12px', borderRadius: '10px', 
                  border: '1.5px solid #CBD5E1', fontSize: '13px', background: '#F8FAFC' 
                }}
              />

              {/* Thanh đo độ mạnh mật khẩu */}
              {regPassword && (
                <div style={{ marginTop: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: passwordStrength.color, fontWeight: 700, marginBottom: '3px' }}>
                    <span>Độ an toàn: {passwordStrength.text}</span>
                  </div>
                  <div style={{ height: '4px', background: '#E2E8F0', borderRadius: '999px', overflow: 'hidden' }}>
                    <div style={{ width: passwordStrength.width, height: '100%', background: passwordStrength.color, transition: 'all 0.3s' }}></div>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                🔒 Nhập lại mật khẩu:
              </label>
              <input 
                type={showRegPassword ? 'text' : 'password'}
                value={regConfirmPassword}
                onChange={(e) => setRegConfirmPassword(e.target.value)}
                placeholder="Nhập lại chính xác mật khẩu trên"
                required
                style={{ 
                  width: '100%', padding: '10px 12px', borderRadius: '10px', 
                  border: regConfirmPassword && regConfirmPassword !== regPassword ? '1.5px solid #EF4444' : '1.5px solid #CBD5E1', 
                  fontSize: '13px', background: '#F8FAFC' 
                }}
              />
              {regConfirmPassword && regConfirmPassword !== regPassword && (
                <span style={{ fontSize: '11px', color: '#EF4444', fontWeight: 600, marginTop: '2px', display: 'block' }}>
                  ⚠️ Mật khẩu xác nhận chưa khớp!
                </span>
              )}
            </div>

            {/* Nút Submit Đăng Ký */}
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="btn-primary" 
              style={{ 
                padding: '14px', 
                fontSize: '15px', 
                fontWeight: 900, 
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                borderColor: '#047857',
                boxShadow: '0 8px 20px -4px rgba(16, 185, 129, 0.4)',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                opacity: isSubmitting ? 0.7 : 1,
                marginTop: '4px'
              }}
            >
              {isSubmitting ? '⏳ Đang ghi danh...' : '🎉 TẠO TÀI KHOẢN & NHẬN +100 XP'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

