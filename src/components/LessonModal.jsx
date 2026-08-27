/* ============================================================================
   LESSON DETAIL MODAL COMPONENT (REACT 18)
   Hỗ trợ phát Video YouTube, nhúng Video Google Drive và nút mở trực tiếp linh hoạt
   ============================================================================ */

import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

// Chuyển đổi linh hoạt link YouTube / Google Drive sang URL nhúng iframe
const getEmbedVideoUrl = (url) => {
  if (!url || typeof url !== 'string') return null;
  const cleanUrl = url.trim();
  if (!cleanUrl) return null;
  
  // 1. YouTube Shorts, watch, embed, v, live, m.youtube, youtu.be
  const ytRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts|live)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const ytMatch = cleanUrl.match(ytRegex);
  if (ytMatch && ytMatch[1]) {
    return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=0&rel=0`;
  }

  // 2. Google Drive video file/d/ID/view, preview, open?id=ID
  const driveFileMatch = cleanUrl.match(/drive\.google\.com\/file\/d\/([^\/\?&#]+)/);
  if (driveFileMatch && driveFileMatch[1]) {
    return `https://drive.google.com/file/d/${driveFileMatch[1]}/preview`;
  }

  const driveIdMatch = cleanUrl.match(/drive\.google\.com\/open\?id=([^\/\?&#]+)/);
  if (driveIdMatch && driveIdMatch[1]) {
    return `https://drive.google.com/file/d/${driveIdMatch[1]}/preview`;
  }

  const driveUcMatch = cleanUrl.match(/drive\.google\.com\/uc\?.*id=([^\/\?&#]+)/);
  if (driveUcMatch && driveUcMatch[1]) {
    return `https://drive.google.com/file/d/${driveUcMatch[1]}/preview`;
  }

  // 3. Link video trực tiếp
  if (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://')) {
    return cleanUrl;
  }

  return null;
};

export const LessonModal = ({ isOpen, onClose, topic, lesson, onOpenChatbot }) => {
  const { addXP, currentUser } = useAuth();
  const { recordLessonView, updateLessonLink } = useData();

  const isTeacherOrAdmin = currentUser?.role === 'teacher' || currentUser?.role === 'admin';

  const [isEditingLink, setIsEditingLink] = React.useState(false);
  const [editVideoUrl, setEditVideoUrl] = React.useState('');
  const [editDocUrl, setEditDocUrl] = React.useState('');
  const [isSaving, setIsSaving] = React.useState(false);

  useEffect(() => {
    if (isOpen && topic && lesson) {
      recordLessonView(lesson.id, topic.grade, lesson.title, currentUser?.class, currentUser?.name);
      setEditVideoUrl(lesson.videoUrl || lesson.video_url || lesson.video || lesson.url || lesson.link || '');
      setEditDocUrl(lesson.documentUrl || lesson.document_url || lesson.docUrl || lesson.doc_url || lesson.document || '');
      setIsEditingLink(false);
    }
  }, [isOpen, topic, lesson, currentUser?.class, currentUser?.name]);

  if (!isOpen || !topic || !lesson) return null;

  // Trích xuất linh hoạt tên thuộc tính đường dẫn video & tài liệu
  let rawVideoUrl = lesson.videoUrl || lesson.video_url || lesson.video || lesson.url || lesson.link || '';
  let rawDocUrl = lesson.documentUrl || lesson.document_url || lesson.docUrl || lesson.doc_url || lesson.document || '';

  // Trường hợp người dùng lỡ dán URL vào phần tóm tắt bài học (summary)
  if (!rawVideoUrl && lesson.summary) {
    const foundUrlMatch = lesson.summary.match(/(https?:\/\/[^\s<"']+)/gi);
    if (foundUrlMatch && foundUrlMatch.length > 0) {
      const u = foundUrlMatch[0];
      if (u.includes('youtube') || u.includes('youtu.be') || u.includes('drive.google')) {
        rawVideoUrl = u;
      } else if (!rawDocUrl) {
        rawDocUrl = u;
      }
    }
  }

  const embedVideoUrl = getEmbedVideoUrl(rawVideoUrl);

  const handleSaveLinks = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    const res = await updateLessonLink({
      lessonId: lesson.id,
      videoUrl: editVideoUrl,
      documentUrl: editDocUrl
    });
    setIsSaving(false);
    if (res.success) {
      setIsEditingLink(false);
      alert(`✅ Đã cập nhật thành công link bài học cho bài "${lesson.title}"!`);
    }
  };

  const handleComplete = () => {
    addXP(lesson.xp || 50, `Hoàn thành bài học: ${lesson.title}`);
    alert(`🎉 Chúc mừng! Em đã hoàn thành bài học "${lesson.title}" và nhận được +${lesson.xp || 50} XP!`);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target.className === 'modal-overlay' && onClose()}>
      <div className="modal-container" style={{ maxWidth: '720px', padding: '28px' }}>
        <button className="modal-close-btn" onClick={onClose}>✕</button>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <span className="hero-badge" style={{ background: topic.color || '#7C3AED', color: 'white' }}>
              📘 BÀI HỌC KHỐI {topic.grade}
            </span>

            {/* Nút dành cho Giáo viên để bật form sửa link */}
            {isTeacherOrAdmin && (
              <button 
                onClick={() => setIsEditingLink(!isEditingLink)}
                style={{ 
                  background: isEditingLink ? '#EF4444' : '#FEF3C7', 
                  color: isEditingLink ? 'white' : '#92400E',
                  border: '1px solid #FCD34D',
                  padding: '6px 14px',
                  borderRadius: '10px',
                  fontSize: '12.5px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                {isEditingLink ? '✖️ Hủy chỉnh sửa' : '👨‍🏫 ✏️ Sửa / Cập nhật Link Bài Học'}
              </button>
            )}
          </div>

          <h2 style={{ fontSize: '24px', fontWeight: 900, color: '#1E293B', marginTop: '10px' }}>
            {lesson.title}
          </h2>
          <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '16px' }}>
            ⏱️ Thời lượng: {lesson.duration || '20 phút'} | 🎁 Thưởng: +{lesson.xp || 50} XP
          </p>

          {/* FORM CHỈNH SỬA DÀNH CHO GIÁO VIÊN */}
          {isEditingLink && (
            <form onSubmit={handleSaveLinks} style={{ background: '#FFFBEB', border: '2px dashed #F59E0B', padding: '18px', borderRadius: '16px', marginBottom: '20px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#92400E', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                👨‍🏫 DÀNH CHO GIÁO VIÊN: CẬP NHẬT ĐƯỜNG DẪN BÀI HỌC
              </h4>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#451A03', marginBottom: '4px' }}>
                  🎬 Link Video Bài Giảng (YouTube / Google Drive Video):
                </label>
                <input 
                  type="url"
                  value={editVideoUrl}
                  onChange={(e) => setEditVideoUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=... hoặc link Google Drive..."
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #FCD34D', fontSize: '13px', outline: 'none' }}
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#451A03', marginBottom: '4px' }}>
                  📂 Link Slide Tài Liệu / Bài Tập (Google Drive / OneDrive):
                </label>
                <input 
                  type="url"
                  value={editDocUrl}
                  onChange={(e) => setEditDocUrl(e.target.value)}
                  placeholder="https://drive.google.com/file/d/..."
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #FCD34D', fontSize: '13px', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button type="button" className="btn-secondary" style={{ padding: '8px 14px', fontSize: '12.5px' }} onClick={() => setIsEditingLink(false)}>Hủy</button>
                <button type="submit" disabled={isSaving} className="btn-primary" style={{ background: '#D97706', padding: '8px 18px', fontSize: '12.5px', fontWeight: 800 }}>
                  {isSaving ? '⏳ Đang lưu...' : '💾 Lưu Link Bài Học'}
                </button>
              </div>
            </form>
          )}

          {/* KHUNG PHÁT VIDEO BÀI GIẢNG TRỰC TIẾP */}
          {rawVideoUrl ? (
            <div style={{ marginBottom: '20px' }}>
              {embedVideoUrl ? (
                <div style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid #CBD5E1', background: '#000', boxShadow: '0 4px 14px rgba(0,0,0,0.15)' }}>
                  <iframe 
                    src={embedVideoUrl}
                    title={lesson.title}
                    width="100%"
                    height="380"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    style={{ display: 'block' }}
                  />
                </div>
              ) : null}

              {/* Nút bấm dự phòng mở trực tiếp video trên tab mới */}
              <div style={{ marginTop: '10px', textAlign: 'center', background: '#F8FAFC', padding: '10px 14px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                <a 
                  href={rawVideoUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  style={{ 
                    fontSize: '13.5px', 
                    fontWeight: 800, 
                    color: '#7C3AED', 
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  🚀 Bấm vào đây để mở trực tiếp Video (YouTube / Google Drive) trên cửa sổ mới ↗
                </a>
              </div>
            </div>
          ) : (
            <div style={{ marginBottom: '18px', background: '#F8FAFC', border: '2px dashed #CBD5E1', padding: '20px', borderRadius: '16px', textContent: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: isTeacherOrAdmin ? '12px' : '0' }}>
                <span style={{ fontSize: '32px' }}>🎬</span>
                <div>
                  <h5 style={{ fontWeight: 800, color: '#1E293B', fontSize: '14.5px' }}>Video Bài Giảng Trực Quan</h5>
                  <p style={{ fontSize: '12.5px', color: '#64748B', marginTop: '2px' }}>
                    Giáo viên có thể dán link YouTube hoặc Google Drive Video để học sinh theo dõi trực tiếp.
                  </p>
                </div>
              </div>

              {isTeacherOrAdmin && !isEditingLink && (
                <button 
                  onClick={() => setIsEditingLink(true)}
                  style={{ 
                    marginTop: '8px',
                    width: '100%',
                    padding: '10px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #7C3AED, #4F46E5)',
                    color: 'white',
                    fontWeight: 800,
                    fontSize: '13px',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  ➕ Dán Link Video YouTube / Google Drive Ngay Tại Đây
                </button>
              )}
            </div>
          )}

          {/* KHUNG TÀI LIỆU & SLIDE BÀI HỌC GOOGLE DRIVE */}
          {rawDocUrl && (
            <div style={{ marginBottom: '20px' }}>
              <a 
                href={rawDocUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  padding: '12px 20px', 
                  background: 'linear-gradient(135deg, #0284C7, #0369A1)', 
                  color: 'white', 
                  borderRadius: '12px', 
                  fontWeight: 800, 
                  fontSize: '13.5px', 
                  textDecoration: 'none',
                  boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)'
                }}
              >
                📂 Mở Slide Tài Liệu &amp; Bài Tập (Google Drive / OneDrive) ↗
              </a>
            </div>
          )}

          {/* NỘI DUNG CỐT LÕI */}
          <div style={{ background: '#F8FAFC', padding: '20px', borderRadius: '16px', border: '1px solid #CBD5E1', marginBottom: '20px', fontSize: '14px', lineHeight: '1.6', color: '#334155' }}>
            <h4 style={{ fontWeight: 800, color: '#1E293B', marginBottom: '8px' }}>Nội dung cốt lõi:</h4>
            <p>{lesson.summary || topic.description}</p>
            <ul style={{ marginTop: '12px', paddingLeft: '20px' }}>
              <li>Nắm vững quy tắc an toàn và đạo đức không gian mạng.</li>
              <li>Thực hành kỹ năng nhận biết và xử lý tình huống thực tế.</li>
              <li>Sử dụng các công cụ bảo mật để bảo vệ bản thân và dữ liệu.</li>
            </ul>
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
            <button 
              className="btn-secondary" 
              style={{ background: '#F3E8FF', color: '#6B21A8', borderColor: '#E9D5FF', fontWeight: 800, cursor: 'pointer' }}
              onClick={() => {
                onClose();
                if (onOpenChatbot) onOpenChatbot();
              }}
            >
              💬 Có Thắc Mắc Bài Học? Hỏi Trợ Lý AI ↗
            </button>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="btn-secondary" onClick={onClose}>Đóng</button>
              <button className="btn-primary" onClick={handleComplete}>
                ✅ Đã Học Xong (+{lesson.xp || 50} XP)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
