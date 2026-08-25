/* ============================================================================
   ADD LESSON MODAL COMPONENT (REACT 18 - DÀNH RIÊNG CHO GIÁO VIÊN)
   Cho phép Giáo viên biên soạn và thêm Bài giảng mới vào Khối 6, 7, 8, 9
   ============================================================================ */

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

export const AddLessonModal = ({ isOpen, onClose }) => {
  const { currentUser } = useAuth();
  const { addLesson } = useData();

  const [gradeLevel, setGradeLevel] = useState('6');
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState('20 phút');
  const [xp, setXp] = useState('50');
  const [videoUrl, setVideoUrl] = useState('');
  const [documentUrl, setDocumentUrl] = useState('');
  const [summary, setSummary] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const isTeacherOrAdmin = currentUser?.role === 'teacher' || currentUser?.role === 'admin';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isTeacherOrAdmin) {
      alert('⚠️ Quyền truy cập bị từ chối! Chỉ có Giáo viên mới được thêm bài giảng.');
      return;
    }

    if (!title.trim()) {
      alert('⚠️ Vui lòng nhập Tên Bài Giảng!');
      return;
    }

    setIsSubmitting(true);
    const res = await addLesson({
      gradeLevel,
      title: title.trim(),
      duration: duration.trim() || '20 phút',
      xp: parseInt(xp) || 50,
      videoUrl: videoUrl.trim(),
      documentUrl: documentUrl.trim(),
      summary: summary.trim() || 'Nội dung kiến thức cốt lõi về Đạo đức, pháp luật và văn hóa trong môi trường số.'
    });

    setIsSubmitting(false);

    if (res.success) {
      alert(res.message);
      setTitle('');
      setVideoUrl('');
      setDocumentUrl('');
      setSummary('');
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target.className === 'modal-overlay' && onClose()}>
      <div className="modal-container" style={{ maxWidth: '560px', padding: '28px' }}>
        <button className="modal-close-btn" onClick={onClose}>✕</button>

        <div style={{ marginBottom: '20px', borderBottom: '2px solid #E2E8F0', paddingBottom: '14px' }}>
          <span className="hero-badge" style={{ background: '#FEF3C7', color: '#92400E' }}>
            👨‍🏫 TÍNH NĂNG QUẢN TRỊ DÀNH CHO GIÁO VIÊN
          </span>
          <h2 style={{ fontSize: '22px', fontWeight: 900, color: '#1E293B', marginTop: '6px' }}>
            ➕ Thêm Học Liệu &amp; Bài Giảng Mới
          </h2>
          <p style={{ fontSize: '13px', color: '#64748B' }}>
            Biên soạn và bổ sung bài học mới cho học sinh Khối 6, 7, 8, 9
          </p>
        </div>

        {!isTeacherOrAdmin ? (
          <div style={{ background: '#FEE2E2', border: '1px solid #FECACA', padding: '20px', borderRadius: '16px', color: '#991B1B', textAlign: 'center' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800 }}>🔒 QUYỀN TRUY CẬP BỊ TỪ CHỐI</h3>
            <p style={{ marginTop: '8px', fontSize: '14px', lineHeight: '1.5' }}>
              Tính năng Thêm Học Liệu &amp; Bài Giảng Mới chỉ dành riêng cho tài khoản <strong>Giáo viên</strong> hoặc <strong>Admin</strong>.
            </p>
            <p style={{ marginTop: '6px', fontSize: '13px', color: '#7F1D1D' }}>
              Vui lòng chuyển vai trò sang <strong>"👨‍🏫 Giáo viên"</strong> ở thanh menu phía trên để biên soạn bài giảng!
            </p>
            <button className="btn-secondary" style={{ marginTop: '14px' }} onClick={onClose}>Đóng</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                🏫 Chọn Khối Lớp Học:
              </label>
              <select 
                value={gradeLevel}
                onChange={(e) => setGradeLevel(e.target.value)}
                style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1.5px solid #CBD5E1', fontSize: '14px', fontWeight: 700, background: '#FFFFFF' }}
              >
                <option value="6">Khối 6 — Chủ đề D (GDPT 2018)</option>
                <option value="7">Khối 7 — Chủ đề D (GDPT 2018)</option>
                <option value="8">Khối 8 — Chủ đề D (GDPT 2018)</option>
                <option value="9">Khối 9 — Chủ đề D (GDPT 2018)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                📘 Tên Bài Giảng Mới:
              </label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ví dụ: Kỹ năng quản lý thời gian sử dụng thiết bị số..."
                required
                style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1.5px solid #CBD5E1', fontSize: '14px', outline: 'none' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  ⏱️ Thời lượng dự kiến:
                </label>
                <input 
                  type="text" 
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="20 phút"
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1.5px solid #CBD5E1', fontSize: '14px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  🎁 Điểm XP thưởng khi học xong:
                </label>
                <input 
                  type="number" 
                  value={xp}
                  onChange={(e) => setXp(e.target.value)}
                  placeholder="50"
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1.5px solid #CBD5E1', fontSize: '14px' }}
                />
              </div>
            </div>

            {/* Đường dẫn Video YouTube hoặc Google Drive */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                🎬 Link Video Bài Giảng (YouTube / Google Drive Video):
              </label>
              <input 
                type="url" 
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="Dán link YouTube (https://youtu.be/... hoặc https://youtube.com/watch?v=...) hoặc Google Drive..."
                style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1.5px solid #CBD5E1', fontSize: '13px', outline: 'none' }}
              />
              <span style={{ fontSize: '11px', color: '#64748B', marginTop: '4px', display: 'block' }}>
                💡 Hệ thống sẽ tự động phát Video trực tiếp cho học sinh xem ngay trong khung bài học.
              </span>
            </div>

            {/* Đường dẫn Tài Liệu / Slide Google Drive */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                📄 Link Tài Liệu / Slide Bài Tập (Google Drive / OneDrive / PDF):
              </label>
              <input 
                type="url" 
                value={documentUrl}
                onChange={(e) => setDocumentUrl(e.target.value)}
                placeholder="Dán link Google Drive chia sẻ tài liệu, slide bài giảng hoặc tệp PDF..."
                style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1.5px solid #CBD5E1', fontSize: '13px', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                📝 Tóm tắt Nội dung Cốt lõi &amp; Hướng dẫn Học sinh:
              </label>
              <textarea 
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                rows={4}
                placeholder="Nhập tóm tắt kiến thức cốt lõi, mục tiêu bài học và bài tập vận dụng cho học sinh..."
                style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1.5px solid #CBD5E1', fontSize: '13px', outline: 'none', lineHeight: '1.5' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
              <button type="button" className="btn-secondary" onClick={onClose}>Hủy</button>
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="btn-primary" 
                style={{ background: 'linear-gradient(135deg, #7C3AED, #4F46E5)', fontWeight: 800 }}
              >
                {isSubmitting ? '⏳ Đang lưu bài giảng...' : '💾 Lưu &amp; Xuất Bản Bài Giảng'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
