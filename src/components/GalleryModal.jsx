/* ============================================================================
   GALLERY MODAL COMPONENT (REACT 18 - TRIỂN LÃM & DUYỆT BÀI NỘP THEO KHỐI LỚP)
   ============================================================================ */

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

export const GalleryModal = ({ isOpen, onClose }) => {
  const { currentUser } = useAuth();
  const { submissions, submitProduct, approveSubmission, likeSubmission } = useData();

  const [selectedGradeTab, setSelectedGradeTab] = useState('all'); // 'all', 6, 7, 8, 9
  const [showForm, setShowForm] = useState(false);
  const [subTitle, setSubTitle] = useState('');
  const [subGrade, setSubGrade] = useState(currentUser?.grade || 6);
  const [subClass, setSubClass] = useState(currentUser?.class || '6A1');
  const [subType, setSubType] = useState('Infographic');
  const [subUrl, setSubUrl] = useState('https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=400&q=80');

  if (!isOpen) return null;

  const isTeacherOrAdmin = currentUser?.role === 'teacher' || currentUser?.role === 'admin';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subTitle) return alert('Vui lòng nhập tên sản phẩm!');
    if (!subClass) return alert('Vui lòng nhập tên lớp của học sinh!');

    await submitProduct({
      studentName: currentUser?.name || 'Học sinh',
      grade: Number(subGrade),
      class: subClass,
      title: subTitle,
      type: subType,
      fileUrl: subUrl
    });

    alert('🎉 Nộp bài thành công! Bài nộp đã được lưu thuộc Khối ' + subGrade + ' (' + subClass + ') và chuyển tới giáo viên kiểm duyệt.');
    setShowForm(false);
    setSubTitle('');
  };

  // Lọc bài nộp theo khối
  const filteredSubmissions = submissions.filter(item => {
    if (selectedGradeTab === 'all') return true;
    const itemGrade = item.grade || (item.class ? parseInt(String(item.class).replace(/\D/g, '')) || 6 : 6);
    return itemGrade === Number(selectedGradeTab);
  });

  const getGradeBadgeStyle = (g) => {
    switch (Number(g)) {
      case 6: return { bg: '#EDE9FE', color: '#7C3AED', label: 'Khối 6' };
      case 7: return { bg: '#FEF3C7', color: '#D97706', label: 'Khối 7' };
      case 8: return { bg: '#E0F2FE', color: '#0284C7', label: 'Khối 8' };
      case 9: return { bg: '#FCE7F3', color: '#DB2777', label: 'Khối 9' };
      default: return { bg: '#F1F5F9', color: '#475569', label: `Khối ${g}` };
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target.className === 'modal-overlay' && onClose()}>
      <div className="modal-container" style={{ maxWidth: '900px' }}>
        <button className="modal-close-btn" onClick={onClose}>✕</button>

        <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <span className="hero-badge" style={{ background: '#EDE9FE', color: '#7C3AED' }}>
              📢 HÌNH ẢNH TUYÊN TRUYỀN &amp; TRIỂN LÃM AN TOÀN SỐ
            </span>
            <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#1E293B', marginTop: '4px' }}>
              Góc Tuyên Truyền Văn Hóa Mạng &amp; Duyệt Bài Nộp Theo Khối Lớp
            </h2>
          </div>
          <div>
            {!isTeacherOrAdmin ? (
              <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
                {showForm ? 'Đóng Form' : '📤 Nộp Poster / Bài Làm Mới'}
              </button>
            ) : (
              <span className="hero-badge" style={{ background: '#FEF3C7', color: '#92400E' }}>
                👨‍🏫 Chế độ Giáo viên: Có quyền duyệt bài
              </span>
            )}
          </div>
        </div>

        {/* Thanh chuyển đổi bộ lọc Khối lớp (Tabs) */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', overflowX: 'auto', paddingBottom: '4px' }}>
          {[
            { id: 'all', label: '🌈 Tất cả Khối' },
            { id: 6, label: '📘 Khối 6' },
            { id: 7, label: '📗 Khối 7' },
            { id: 8, label: '📙 Khối 8' },
            { id: 9, label: '📕 Khối 9' }
          ].map(tab => {
            const isActive = selectedGradeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedGradeTab(tab.id)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '12px',
                  border: isActive ? '2px solid #7C3AED' : '1px solid #CBD5E1',
                  background: isActive ? '#7C3AED' : '#FFFFFF',
                  color: isActive ? '#FFFFFF' : '#475569',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '13px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap'
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Form nộp bài */}
        {showForm && (
          <form onSubmit={handleSubmit} style={{ background: '#F8FAFC', padding: '18px', borderRadius: '16px', border: '1px solid #CBD5E1', marginBottom: '20px' }}>
            <h4 style={{ fontSize: '15px', fontWeight: 800, marginBottom: '12px', color: '#1E293B' }}>Form Nộp Sản Phẩm An Toàn Số</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input 
                type="text" 
                value={subTitle}
                onChange={(e) => setSubTitle(e.target.value)}
                placeholder="Tên sản phẩm (Ví dụ: Poster 5 Quy tắc Vàng An toàn Số)" 
                style={{ padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1' }} 
              />
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Khối lớp:</label>
                  <select 
                    value={subGrade}
                    onChange={(e) => setSubGrade(Number(e.target.value))}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1' }}
                  >
                    <option value={6}>📘 Khối 6</option>
                    <option value={7}>📗 Khối 7</option>
                    <option value={8}>📙 Khối 8</option>
                    <option value={9}>📕 Khối 9</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Lớp học:</label>
                  <input 
                    type="text" 
                    value={subClass}
                    onChange={(e) => setSubClass(e.target.value)}
                    placeholder="Ví dụ: 6A1, 7B2..." 
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1' }} 
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Loại sản phẩm:</label>
                  <select 
                    value={subType}
                    onChange={(e) => setSubType(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1' }}
                  >
                    <option value="Infographic">Infographic / Poster</option>
                    <option value="Presentation">Slide Thuyết trình</option>
                    <option value="Mindmap">Sơ đồ Tư duy</option>
                    <option value="Video">Video Ngắn</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Link minh họa (URL):</label>
                <input 
                  type="text" 
                  value={subUrl}
                  onChange={(e) => setSubUrl(e.target.value)}
                  placeholder="Link ảnh hoặc sản phẩm minh họa (URL)" 
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1' }} 
                />
              </div>

              <div style={{ textAlign: 'right', marginTop: '8px', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Hủy</button>
                <button type="submit" className="btn-primary">Gửi Bài Nộp Ngay</button>
              </div>
            </div>
          </form>
        )}

        {/* Danh sách bài nộp */}
        {filteredSubmissions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', background: '#F8FAFC', borderRadius: '16px', color: '#64748B' }}>
            🧩 Chưa có bài nộp nào cho khối này. Hãy là người đầu tiên nộp sản phẩm!
          </div>
        ) : (
          <div className="gallery-grid">
            {filteredSubmissions.map(item => {
              const itemGrade = item.grade || (item.class ? parseInt(String(item.class).replace(/\D/g, '')) || 6 : 6);
              const badgeStyle = getGradeBadgeStyle(itemGrade);

              return (
                <div key={item.id} className="gallery-card">
                  <img src={item.fileUrl} alt={item.title} onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80'} />
                  <div className="gallery-card-body">
                    <div style={{ display: 'flex', gap: '6px', marginBottom: '6px', flexWrap: 'wrap' }}>
                      <span className="hero-badge" style={{ fontSize: '10px', padding: '2px 8px', background: badgeStyle.bg, color: badgeStyle.color, fontWeight: 700 }}>
                        {badgeStyle.label} - {item.class}
                      </span>
                      <span className="hero-badge" style={{ fontSize: '10px', padding: '2px 8px', background: '#F1F5F9', color: '#475569' }}>
                        {item.type}
                      </span>
                    </div>

                    <div className="gallery-card-title">{item.title}</div>
                    <div className="gallery-card-author">👤 {item.studentName}</div>

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
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
