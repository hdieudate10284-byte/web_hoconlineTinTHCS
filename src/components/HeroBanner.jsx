/* ============================================================================
   HERO BANNER COMPONENT (REACT)
   ============================================================================ */

import React from 'react';

export const HeroBanner = () => {
  return (
    <header className="hero-banner-card">
      {/* 1. LOGO & BANNER TÊN TRƯỜNG THCS NGUYỄN HUỆ (PHÍA TRÊN CÙNG) */}
      <div className="school-logo-header" style={{ marginBottom: '22px', borderRadius: '16px', overflow: 'hidden', border: '2px solid #CBD5E1', boxShadow: '0 6px 18px rgba(0,0,0,0.1)', background: '#FFFFFF' }}>
        <img 
          src="/logo-banner-nguyen-hue.jpg" 
          alt="Trường THCS Nguyễn Huệ - Đà Nẵng" 
          style={{ width: '100%', height: 'auto', display: 'block', maxHeight: '180px', objectFit: 'contain', background: 'linear-gradient(180deg, #74AEDC 0%, #A4D1F3 100%)' }}
        />
      </div>

      {/* 2. TIÊU ĐỀ CHỦ ĐỀ CHUNG VÀ CÁC THẺ HỌC LIỆU (PHÍA DƯỚI) */}
      <div className="hero-banner-content">
        <div>
          <span className="hero-badge">
            🌟 CHỦ ĐỀ CHUNG TOÀN KHỐI (KHỐI 6, 7, 8, 9)
          </span>
          <h1 className="hero-title" style={{ fontSize: '30px', lineHeight: '1.3', marginTop: '8px' }}>
            ĐẠO ĐỨC, PHÁP LUẬT VÀ VĂN HÓA <br />
            <span>TRONG MÔI TRƯỜNG SỐ</span>
          </h1>
          <p className="hero-subtitle" style={{ marginTop: '10px' }}>
            Hệ thống học liệu Tin học THCS Trường THCS Nguyễn Huệ theo Chương trình GDPT 2018 — Gamification, An toàn số, Bản quyền tác giả &amp; Luật An ninh mạng cho Khối 6 đến Khối 9.
          </p>
          
          <div className="hero-features-row">
            <div className="hero-pill-tag">
              <div className="hero-pill-icon">🛡️</div>
              <span>Khối 6: Ứng Xử &amp; An Toàn Số</span>
            </div>
            <div className="hero-pill-tag">
              <div className="hero-pill-icon">📜</div>
              <span>Khối 7: Bản Quyền &amp; Tác Quyền</span>
            </div>
            <div className="hero-pill-tag">
              <div className="hero-pill-icon">🔒</div>
              <span>Khối 8: Lừa Đảo &amp; An Ninh Mạng</span>
            </div>
            <div className="hero-pill-tag">
              <div className="hero-pill-icon">⚖️</div>
              <span>Khối 9: Luật An Ninh Mạng 2018</span>
            </div>
          </div>
        </div>

        <div className="hero-illustration">
          <div className="hero-img-wrapper" style={{ borderRadius: '16px', overflow: 'hidden', border: '3px solid #FFF', boxShadow: '0 8px 20px rgba(0,0,0,0.12)' }}>
            <img 
              src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80" 
              alt="Học liệu Tin học THCS Nguyễn Huệ" 
            />
            <div className="hero-floating-note">
              THCS NGUYỄN HUỆ<br />VƯƠN TỚI ĐỈNH CAO SỐ! ❤️
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
