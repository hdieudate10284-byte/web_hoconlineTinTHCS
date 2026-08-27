/* ============================================================================
   MAIN REACT APP ROOT (CỔNG HỌC LIỆU TIN HỌC THCS)
   Hỗ trợ Trợ lý AI Chatbot Xử lý Tình huống An toàn số & Thắc mắc học tập
   ============================================================================ */

import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';

import { HeaderProfile } from './components/HeaderProfile';
import { HeroBanner } from './components/HeroBanner';
import { QuickNav } from './components/QuickNav';
import { GradeCardsGrid } from './components/GradeCardsGrid';
import { SidebarWidgets } from './components/SidebarWidgets';

import { AuthModal } from './components/AuthModal';
import { LessonModal } from './components/LessonModal';
import { MinigameModal } from './components/MinigameModal';
import { GalleryModal } from './components/GalleryModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import { SupabaseModal } from './components/SupabaseModal';
import { SqlSchemaModal } from './components/SqlSchemaModal';
import { AnalyticsModal } from './components/AnalyticsModal';
import { AddLessonModal } from './components/AddLessonModal';
import { ChatbotModal } from './components/ChatbotModal';

export function AppContent() {
  // Modal states
  const [authModal, setAuthModal] = useState({ open: false, tab: 'login' });
  const [lessonModal, setLessonModal] = useState({ open: false, topic: null, lesson: null });
  const [minigameModal, setMinigameModal] = useState({ open: false, grade: 6 });
  const [galleryModal, setGalleryModal] = useState(false);
  const [leaderboardModal, setLeaderboardModal] = useState(false);
  const [supabaseModal, setSupabaseModal] = useState(false);
  const [sqlModal, setSqlModal] = useState(false);
  const [analyticsModal, setAnalyticsModal] = useState(false);
  const [addLessonModal, setAddLessonModal] = useState(false);
  const [chatbotModal, setChatbotModal] = useState(false);

  const handleOpenLesson = (topic, lesson) => {
    setLessonModal({ open: true, topic, lesson });
  };

  const handleStartMinigame = (grade) => {
    setMinigameModal({ open: true, grade });
  };

  return (
    <div className="container">
      {/* 0. TOP NAVIGATION BAR */}
      <nav style={{
        background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
        borderRadius: '16px',
        padding: '10px 20px',
        marginTop: '12px',
        marginBottom: '12px',
        boxShadow: '0 4px 16px rgba(79, 70, 229, 0.25)',
        display: 'flex',
        justify: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px',
        color: 'white'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 900, fontSize: '15px' }}>
          🏫 THCS NGUYỄN HUỆ — CHỦ ĐỀ D: ĐẠO ĐỨC, PHÁP LUẬT &amp; VĂN HÓA SỐ
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <button 
            style={{ 
              background: 'rgba(255,255,255,0.18)', 
              color: 'white', 
              border: '1px solid rgba(255,255,255,0.3)', 
              padding: '6px 14px', 
              borderRadius: '999px', 
              fontWeight: 700, 
              fontSize: '12.5px',
              cursor: 'pointer' 
            }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            🏠 Trang Chủ
          </button>
          <a 
            href="https://home.aiphocap.vn/chat/cutebot-xu-ly-tinh-huong-2358" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ 
              background: '#F59E0B', 
              color: '#78350F', 
              border: '1.5px solid #FCD34D', 
              padding: '6px 16px', 
              borderRadius: '999px', 
              fontWeight: 900, 
              fontSize: '13px',
              cursor: 'pointer',
              boxShadow: '0 4px 10px rgba(245, 158, 11, 0.4)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              textDecoration: 'none'
            }}
            onClick={() => setChatbotModal(true)}
          >
            💬 GIẢI ĐÁP THẮC MẮC &amp; TRỢ GIÚP 🤖
          </a>
        </div>
      </nav>

      {/* 1. HERO BANNER */}
      <HeroBanner />

      {/* 2. PROFILE HEADER & ROLE SWITCHER */}
      <HeaderProfile 
        onOpenAuth={(tab) => setAuthModal({ open: true, tab })}
        onOpenLeaderboard={() => setLeaderboardModal(true)}
        onOpenGallery={() => setGalleryModal(true)}
        onOpenSql={() => setSqlModal(true)}
        onOpenSupabase={() => setSupabaseModal(true)}
        onOpenAnalytics={() => setAnalyticsModal(true)}
        onOpenAddLesson={() => setAddLessonModal(true)}
        onOpenChatbot={() => setChatbotModal(true)}
      />

      {/* 3. QUICK NAV 6 ICONS */}
      <QuickNav 
        onStartMinigame={handleStartMinigame}
        onOpenLeaderboard={() => setLeaderboardModal(true)}
        onOpenGallery={() => setGalleryModal(true)}
        onOpenChatbot={() => setChatbotModal(true)}
      />

      {/* 4. MAIN LAYOUT GRID (4-COLUMN GRADE CARDS + SIDEBAR) */}
      <div className="main-layout-grid">
        <GradeCardsGrid 
          onOpenLesson={handleOpenLesson}
          onStartMinigame={handleStartMinigame}
          onOpenAddLesson={() => setAddLessonModal(true)}
        />
        <SidebarWidgets 
          onOpenAnalytics={() => setAnalyticsModal(true)} 
          onOpenChatbot={() => setChatbotModal(true)}
        />
      </div>

      {/* 5. BOTTOM ROCKET BANNER */}
      <section className="bottom-rocket-banner">
        <div className="bottom-banner-text">
          <h3>TỪNG BƯỚC NHỎ HÔM NAY — BỨC PHÁ LỚN NGÀY MAI</h3>
          <p>Bắt đầu hành trình chinh phục Tin học &amp; An toàn số ngay bây giờ!</p>
        </div>
        <button className="btn-rocket-cta" onClick={() => handleStartMinigame(6)}>
          BẮT ĐẦU CHƠI NGÀY 🚀
        </button>
      </section>

      {/* FLOATING CHATBOT BUTTON */}
      <a
        href="https://home.aiphocap.vn/chat/cutebot-xu-ly-tinh-huong-2358" 
        target="_blank" 
        rel="noopener noreferrer"
        onClick={() => setChatbotModal(true)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 999,
          background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
          color: 'white',
          border: '2px solid #FFFFFF',
          borderRadius: '999px',
          padding: '12px 20px',
          fontSize: '14px',
          fontWeight: 900,
          boxShadow: '0 8px 24px rgba(124, 58, 237, 0.4)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          textDecoration: 'none',
          transition: 'transform 0.2s'
        }}
        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        <span style={{ fontSize: '20px' }}>💬</span>
        <span>GIẢI ĐÁP THẮC MẮC &amp; TRỢ GIÚP</span>
      </a>

      {/* FOOTER */}
      <footer style={{ marginTop: '36px', textAlign: 'center', fontSize: '13px', color: '#64748B', paddingTop: '20px', borderTop: '1px solid #CBD5E1', lineHeight: '1.7' }}>
        <p>🏫 <strong>TRƯỜNG THCS NGUYỄN HUỆ</strong> • Chủ đề D: <em>Đạo đức, pháp luật và văn hóa trong môi trường số</em> (Khối 6, 7, 8, 9)</p>
        <p style={{ marginTop: '4px', fontSize: '12.5px', color: '#475569' }}>
          👩‍🏫 Tác giả: <strong>Cô Nguyễn Thị Huyền Diệu</strong> | ✉️ Email: <a href="mailto:hdieudate10284@gmail.com" style={{ color: '#4F46E5', textDecoration: 'none', fontWeight: '600' }}>hdieudate10284@gmail.com</a>
        </p>
        <p style={{ marginTop: '8px' }}>
          <a 
            href="https://home.aiphocap.vn/chat/cutebot-xu-ly-tinh-huong-2358" 
            target="_blank" 
            rel="noopener noreferrer"
            onClick={() => setChatbotModal(true)} 
            style={{ 
              background: '#EEF2FF', 
              color: '#4F46E5', 
              border: '1px solid #C7D2FE', 
              padding: '6px 16px', 
              borderRadius: '999px', 
              fontWeight: 800, 
              cursor: 'pointer', 
              fontSize: '12.5px',
              textDecoration: 'none',
              display: 'inline-block'
            }}
          >
            💬 Gửi thắc mắc học tập &amp; mở Cutebot AI ngay ➔
          </a>
        </p>
      </footer>

      {/* ALL INTERACTIVE MODALS */}
      <AuthModal 
        isOpen={authModal.open} 
        initialTab={authModal.tab}
        onClose={() => setAuthModal({ open: false, tab: 'login' })} 
      />

      <LessonModal 
        isOpen={lessonModal.open}
        topic={lessonModal.topic}
        lesson={lessonModal.lesson}
        onClose={() => setLessonModal({ open: false, topic: null, lesson: null })}
        onOpenChatbot={() => setChatbotModal(true)}
      />

      <MinigameModal 
        isOpen={minigameModal.open}
        gradeNumber={minigameModal.grade}
        onClose={() => setMinigameModal({ open: false, grade: 6 })}
      />

      <GalleryModal 
        isOpen={galleryModal}
        onClose={() => setGalleryModal(false)}
      />

      <LeaderboardModal 
        isOpen={leaderboardModal}
        onClose={() => setLeaderboardModal(false)}
      />

      <SupabaseModal 
        isOpen={supabaseModal}
        onClose={() => setSupabaseModal(false)}
        onOpenSql={() => { setSupabaseModal(false); setSqlModal(true); }}
      />

      <SqlSchemaModal 
        isOpen={sqlModal}
        onClose={() => setSqlModal(false)}
        onOpenSupabase={() => { setSqlModal(false); setSupabaseModal(true); }}
      />

      <AnalyticsModal 
        isOpen={analyticsModal}
        onClose={() => setAnalyticsModal(false)}
      />

      <AddLessonModal 
        isOpen={addLessonModal}
        onClose={() => setAddLessonModal(false)}
      />

      <ChatbotModal
        isOpen={chatbotModal}
        onClose={() => setChatbotModal(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </AuthProvider>
  );
}
