/* ============================================================================
   LEADERBOARD & BADGES MODAL COMPONENT (REACT 18)
   ============================================================================ */

import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

export const LeaderboardModal = ({ isOpen, onClose }) => {
  const { currentUser } = useAuth();
  const { leaderboard, badgesCatalog } = useData();

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={(e) => e.target.className === 'modal-overlay' && onClose()}>
      <div className="modal-container">
        <button className="modal-close-btn" onClick={onClose}>✕</button>

        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <span className="hero-badge" style={{ background: '#FEF08A', color: '#854D0E' }}>
            🏆 BẢNG VINH DANH GAMIFICATION
          </span>
          <h2 style={{ fontSize: '24px', fontWeight: 900, color: '#1E293B', marginTop: '4px' }}>
            Top Học Sinh Xuất Sắc An Toàn Số
          </h2>
          <p style={{ fontSize: '13px', color: '#64748B' }}>
            Điểm thưởng XP & Huy hiệu danh dự lưu trữ trực tiếp trên Supabase Database
          </p>
        </div>

        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>Hạng</th>
              <th>Học Sinh</th>
              <th>Lớp</th>
              <th>Điểm XP</th>
              <th>Huy Hiệu</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map(item => (
              <tr key={item.rank} style={{ background: item.name === currentUser?.name ? '#EDE9FE' : 'transparent', fontWeight: item.name === currentUser?.name ? 800 : 500 }}>
                <td>
                  <span className={`rank-badge ${item.rank <= 3 ? 'rank-' + item.rank : ''}`}>
                    {item.rank === 1 ? '🥇' : item.rank === 2 ? '🥈' : item.rank === 3 ? '🥉' : item.rank}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img src={item.avatar} style={{ width: '32px', height: '32px', borderRadius: '50%' }} alt="" />
                    <span>{item.name} {item.name === currentUser?.name ? '(Bạn)' : ''}</span>
                  </div>
                </td>
                <td>{item.class}</td>
                <td style={{ color: '#7C3AED', fontWeight: 800 }}>{item.xp} XP</td>
                <td>⭐ {item.badgesCount} Huy hiệu</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ marginTop: '32px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#1E293B', marginBottom: '12px' }}>
            🎖️ Bộ Huy Hiệu Hệ Thống
          </h3>
          <div className="badge-collection-grid">
            {badgesCatalog.map((b, idx) => (
              <div key={idx} className="badge-item-card" style={{ borderColor: b.unlocked ? '#7C3AED' : '#E2E8F0', background: b.unlocked ? '#F3E8FF' : '#FFFFFF', opacity: b.unlocked ? 1 : 0.6 }}>
                <div className="badge-item-icon">{b.icon}</div>
                <div className="badge-item-name">{b.name}</div>
                <div style={{ fontSize: '10px', color: '#64748B', marginTop: '4px' }}>{b.desc}</div>
                <span className="hero-badge" style={{ fontSize: '9px', padding: '2px 6px', marginTop: '6px', background: b.unlocked ? '#7C3AED' : '#CBD5E1', color: b.unlocked ? 'white' : '#475569' }}>
                  {b.unlocked ? 'Đã Mở Khóa' : 'Chưa Mở Khóa'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
