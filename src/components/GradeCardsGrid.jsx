/* ============================================================================
   GRADE CARDS GRID COMPONENT (REACT)
   ============================================================================ */

import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

export const GradeCardsGrid = ({ onOpenLesson, onStartMinigame, onOpenAddLesson }) => {
  const { curriculum } = useData();
  const { currentUser } = useAuth();

  const isTeacherOrAdmin = currentUser?.role === 'teacher' || currentUser?.role === 'admin';

  return (
    <section>
      <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#1E293B' }}>CHƯƠNG TRÌNH HỌC THEO KHỐI LỚP</h2>
          {isTeacherOrAdmin && (
            <button 
              className="btn-primary" 
              style={{ fontSize: '12px', padding: '6px 12px', background: 'linear-gradient(135deg, #F59E0B, #D97706)', borderColor: '#B45309', fontWeight: 800 }}
              onClick={onOpenAddLesson}
            >
              ➕ Thêm Học Liệu / Bài Giảng
            </button>
          )}
        </div>
        <span style={{ fontSize: '13px', color: '#64748B', fontWeight: 600 }}>
          {isTeacherOrAdmin ? '👨‍🏫 Chế độ Giáo viên: Có thể bấm Thêm Học Liệu Mới' : '🎓 Bấm vào bài học để học hoặc chơi minigame đố vui'}
        </span>
      </div>

      <div className="grade-cards-grid">
        {curriculum.map(c => (
          <div key={c.id} className={`grade-card ${c.themeClass}`}>
            <div className="grade-card-header">
              <h4>{c.badgeText}</h4>
              <h3>{c.title}</h3>
              <span className="grade-badge-tag">Môn Tin học Khối {c.grade}</span>
            </div>

            <ul className="grade-subtopics-list">
              {c.lessons.map(l => (
                <li 
                  key={l.id} 
                  onClick={() => onOpenLesson(c, l)}
                  style={{ cursor: 'pointer' }}
                >
                  📌 {l.title}
                </li>
              ))}
            </ul>

            <div className="grade-card-footer">
              <div className="grade-graphic-symbol">{c.symbol}</div>
              <button 
                className="btn-card-action" 
                onClick={() => onStartMinigame(c.grade)}
              >
                🎮 Chơi Minigame +100 XP
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
