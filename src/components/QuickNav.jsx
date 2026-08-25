/* ============================================================================
   QUICK NAVIGATION ICONS BAR COMPONENT (REACT)
   ============================================================================ */

import React from 'react';

export const QuickNav = ({ onStartMinigame, onOpenLeaderboard }) => {
  return (
    <nav className="quick-nav-bar">
      <div className="quick-nav-item" onClick={() => document.getElementById('side-about-widget')?.scrollIntoView({ behavior: 'smooth' })}>
        <div className="quick-nav-icon qnav-purple">👤</div>
        <span className="quick-nav-label">Giới Thiệu</span>
      </div>
      <div className="quick-nav-item" onClick={() => onStartMinigame(6)}>
        <div className="quick-nav-icon qnav-purple">📖</div>
        <span className="quick-nav-label">Khối 6</span>
      </div>
      <div className="quick-nav-item" onClick={() => onStartMinigame(7)}>
        <div className="quick-nav-icon qnav-yellow">📜</div>
        <span className="quick-nav-label">Khối 7</span>
      </div>
      <div className="quick-nav-item" onClick={() => onStartMinigame(8)}>
        <div className="quick-nav-icon qnav-blue">💡</div>
        <span className="quick-nav-label">Khối 8</span>
      </div>
      <div className="quick-nav-item" onClick={() => onStartMinigame(9)}>
        <div className="quick-nav-icon qnav-pink">🎓</div>
        <span className="quick-nav-label">Khối 9</span>
      </div>
      <div className="quick-nav-item" onClick={onOpenLeaderboard}>
        <div className="quick-nav-icon qnav-indigo">❓</div>
        <span className="quick-nav-label">Thắc Mắc</span>
      </div>
    </nav>
  );
};
