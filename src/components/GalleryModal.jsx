/* ============================================================================
   GALLERY MODAL COMPONENT (REACT 18 - TRIỂN LÃM & DUYỆT BÀI NỘP)
   ============================================================================ */

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

export const GalleryModal = ({ isOpen, onClose }) => {
  const { currentUser } = useAuth();
  const { submissions, submitProduct, approveSubmission, likeSubmission } = useData();

  const [showForm, setShowForm] = useState(false);
  const [subTitle, setSubTitle] = useState('');
  const [subType, setSubType] = useState('Infographic');
  const [subUrl, setSubUrl] = useState('https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=400&q=80');

  if (!isOpen) return null;

  const isTeacherOrAdmin = currentUser?.role === 'teacher' || currentUser?.role === 'admin';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subTitle) return alert('Vui lòng nhập tên sản phẩm!');

    await submitProduct({
      studentName: currentUser?.name || 'Học sinh',
      class: currentUser?.class || 'Lớp 6A1',
      title: subTitle,
      type: subType,
      fileUrl: subUrl
    });

    alert('🎉 Nộp bài thành công! Bài nộp đã được đồng bộ lên Supabase và chuyển tới giáo viên kiểm duyệt.');
    setShowForm(false);
    setSubTitle('');
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target.className === 'modal-overlay' && onClose()}>
      <div className="modal-container">
        <button className="modal-close-btn" onClick={onClose}>✕</button>

        <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <span className="hero-badge" style={{ background: '#EDE9FE', color: '#7C3AED' }}>
              🖼️ TRIỂN LÃM SẢN PHẨM HỌC SINH
            </span>
            <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#1E293B', marginTop: '4px' }}>
              Không gian Trưng bày & Duyệt Bài Nộp
            </h2>
          </div>
          <div>
            {!isTeacherOrAdmin ? (
              <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
                {showForm ? 'Đóng Form' : '📤 Nộp Sản Phẩm Mới'}
              </button>
            ) : (
              <span className="hero-badge" style={{ background: '#FEF3C7', color: '#92400E' }}>
                👨‍🏫 Chế độ Giáo viên: Có quyền duyệt bài
              </span>
            )}
          </div>
        </div>

        {/* Form nộp bài */}
        {showForm && (
          <form onSubmit={handleSubmit} style={{ background: '#F8FAFC', padding: '16px', borderRadius: '16px', border: '1px solid #CBD5E1', marginBottom: '20px' }}>
            <h4 style={{ fontSize: '15px', fontWeight: 800, marginBottom: '12px', color: '#1E293B' }}>Form Nộp Sản Phẩm An Toàn Số</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <input 
                type="text" 
                value={subTitle}
                onChange={(e) => setSubTitle(e.target.value)}
                placeholder="Tên sản phẩm (Ví dụ: Poster 5 Quy tắc Vàng An toàn Số)" 
                style={{ padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1' }} 
              />
              <select 
                value={subType}
                onChange={(e) => setSubType(e.target.value)}
                style={{ padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1' }}
              >
                <option value="Infographic">Infographic / Poster</option>
                <option value="Presentation">Slide Thuyết trình</option>
                <option value="Mindmap">Sơ đồ Tư duy</option>
                <option value="Video">Video Ngắn</option>
              </select>
              <input 
                type="text" 
                value={subUrl}
                onChange={(e) => setSubUrl(e.target.value)}
                placeholder="Link ảnh hoặc sản phẩm minh họa (URL)" 
                style={{ padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1' }} 
              />
              <div style={{ textAlign: 'right', marginTop: '8px', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Hủy</button>
                <button type="submit" className="btn-primary">Gửi Bài Nộp Ngay</button>
              </div>
            </div>
          </form>
        )}

        {/* Danh sách bài nộp */}
        <div className="gallery-grid">
          {submissions.map(item => (
            <div key={item.id} className="gallery-card">
              <img src={item.fileUrl} alt={item.title} onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80'} />
              <div className="gallery-card-body">
                <div className="gallery-card-title">{item.title}</div>
                <div className="gallery-card-author">👤 {item.studentName} ({item.class}) • {item.type}</div>

                <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="hero-badge" style={{
                    fontSize: '10px', padding: '2px 8px',
                    background: item.status === 'approved' ? '#D1FAE5' : '#FEF3C7',
                    color: item.status === 'approved' ? '#065F46' : '#92400E'
                  }}>
                    {item.status === 'approved' ? '✅ Đã Duyệt' : '⏳ Chờ Duyệt'}
                  </span>
                  <button className="btn-secondary" style={{ padding: '4px 10px', fontSize: '11px' }} onClick={() => likeSubmission(item.id)}>
                    ❤️ {item.likes || 0}
                  </button>
                </div>

                {isTeacherOrAdmin && item.status === 'pending' && (
                  <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px dashed #CBD5E1', display: 'flex', gap: '6px' }}>
                    <button className="btn-primary" style={{ flex: 1, fontSize: '11px', padding: '6px' }} onClick={() => approveSubmission(item.id)}>
                      Duyệt Bài (+100 XP)
                    </button>
                  </div>
                )}

                {item.teacherFeedback && (
                  <div style={{ marginTop: '8px', fontSize: '11px', background: '#EDE9FE', color: '#5B21B6', padding: '6px 10px', borderRadius: '6px' }}>
                    💬 <strong>Giáo viên:</strong> {item.teacherFeedback}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
