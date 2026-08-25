/* ============================================================================
   MAIN REACT APP ROOT (CỔNG HỌC LIỆU TIN HỌC THCS)
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

  const handleOpenLesson = (topic, lesson) => {
    setLessonModal({ open: true, topic, lesson });
  };

  const handleStartMinigame = (grade) => {
    setMinigameModal({ open: true, grade });
  };

  return (
    <div className="container">
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
      />

      {/* 3. QUICK NAV 6 ICONS */}
      <QuickNav 
        onStartMinigame={handleStartMinigame}
        onOpenLeaderboard={() => setLeaderboardModal(true)}
      />

      {/* 4. MAIN LAYOUT GRID (4-COLUMN GRADE CARDS + SIDEBAR) */}
      <div className="main-layout-grid">
        <GradeCardsGrid 
          onOpenLesson={handleOpenLesson}
          onStartMinigame={handleStartMinigame}
          onOpenAddLesson={() => setAddLessonModal(true)}
        />
        <SidebarWidgets />
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

      {/* FOOTER */}
      <footer style={{ marginTop: '36px', textAlign: 'center', fontSize: '13px', color: '#64748B', paddingTop: '20px', borderTop: '1px solid #CBD5E1', lineHeight: '1.7' }}>
        <p>🏫 <strong>TRƯỜNG THCS NGUYỄN HUỆ</strong> • Chủ đề D: <em>Đạo đức, pháp luật và văn hóa trong môi trường số</em> (Khối 6, 7, 8, 9)</p>
        <p style={{ marginTop: '4px', fontSize: '12.5px', color: '#475569' }}>
          👩‍🏫 Tác giả: <strong>Cô Nguyễn Thị Huyền Diệu</strong> | ✉️ Email: <a href="mailto:hdieudate10284@gmail.com" style={{ color: '#4F46E5', textDecoration: 'none', fontWeight: '600' }}>hdieudate10284@gmail.com</a>
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
