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

export const LessonModal = ({ isOpen, onClose, topic, lesson }) => {
  const { addXP, currentUser } = useAuth();
  const { recordLessonView } = useData();

  useEffect(() => {
    if (isOpen && topic && lesson) {
      recordLessonView(lesson.id, topic.grade, lesson.title, currentUser?.class, currentUser?.name);
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

  const handleComplete = () => {
    addXP(lesson.xp || 50, `Hoàn thành bài học: ${lesson.title}`);
    alert(`🎉 Chúc mừng! Em đã hoàn thành bài học "${lesson.title}" và nhận được +${lesson.xp || 50} XP!`);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target.className === 'modal-overlay' && onClose()}>
      <div className="modal-container" style={{ maxWidth: '700px', padding: '28px' }}>
        <button className="modal-close-btn" onClick={onClose}>✕</button>

        <div>
          <span className="hero-badge" style={{ background: topic.color || '#7C3AED', color: 'white' }}>
            📘 BÀI HỌC KHỐI {topic.grade}
          </span>
          <h2 style={{ fontSize: '24px', fontWeight: 900, color: '#1E293B', marginTop: '8px' }}>
            {lesson.title}
          </h2>
          <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '16px' }}>
            ⏱️ Thời lượng: {lesson.duration || '20 phút'} | 🎁 Thưởng: +{lesson.xp || 50} XP
          </p>

          {/* KHUNG PHÁT VIDEO BÀI GIẢNG TRỰC TIẾP */}
          {rawVideoUrl ? (
            <div style={{ marginBottom: '20px' }}>
              {embedVideoUrl ? (
                <div style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid #CBD5E1', background: '#000', boxShadow: '0 4px 14px rgba(0,0,0,0.15)' }}>
                  <iframe 
                    src={embedVideoUrl}
                    title={lesson.title}
                    width="100%"
                    height="360"
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
            <div style={{ marginBottom: '18px', background: '#F1F5F9', border: '1px solid #CBD5E1', padding: '16px', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '28px' }}>🎬</span>
              <div>
                <h5 style={{ fontWeight: 800, color: '#1E293B', fontSize: '14px' }}>Video Bài Giảng Trực Quan</h5>
                <p style={{ fontSize: '12.5px', color: '#64748B' }}>
                  Giáo viên có thể dán link YouTube hoặc Google Drive Video khi biên soạn bài giảng mới.
                </p>
              </div>
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

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button className="btn-secondary" onClick={onClose}>Đóng</button>
            <button className="btn-primary" onClick={handleComplete}>
              ✅ Đã Học Xong (+{lesson.xp || 50} XP)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
