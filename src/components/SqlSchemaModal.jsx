/* ============================================================================
   SQL SCHEMA MODAL COMPONENT (REACT 18)
   ============================================================================ */

import React from 'react';

const SQL_TEXT = `-- CƠ SỞ DỮ LIỆU SUPABASE (POSTGRESQL): HỆ THỐNG HỌC LIỆU TIN HỌC THCS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. BẢNG LỚP HỌC & NGƯỜI DÙNG
CREATE TABLE IF NOT EXISTS public.classes (
    id BIGSERIAL PRIMARY KEY,
    class_name VARCHAR(50) NOT NULL UNIQUE,
    grade_level INT NOT NULL CHECK (grade_level BETWEEN 6 AND 9),
    school_year VARCHAR(20) DEFAULT '2025-2026',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE,
    password_hash TEXT NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    role VARCHAR(20) DEFAULT 'student' CHECK (role IN ('student', 'teacher', 'admin')),
    class_name VARCHAR(50) DEFAULT 'Lớp 6A1',
    grade_level INT DEFAULT 6,
    avatar_url TEXT DEFAULT 'https://api.dicebear.com/7.x/bottts/svg?seed=student1',
    total_xp INT DEFAULT 0,
    current_level INT DEFAULT 1,
    badges_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. BẢNG CHỦ ĐỀ KHỐI LỚP & BÀI HỌC
CREATE TABLE IF NOT EXISTS public.curriculum_topics (
    id BIGSERIAL PRIMARY KEY,
    grade_level INT NOT NULL UNIQUE CHECK (grade_level BETWEEN 6 AND 9),
    title VARCHAR(150) NOT NULL,
    badge_text VARCHAR(50) NOT NULL,
    theme_class VARCHAR(50) NOT NULL,
    theme_color VARCHAR(30) DEFAULT '#7C3AED',
    symbol VARCHAR(20) DEFAULT '📘',
    description TEXT,
    display_order INT DEFAULT 1
);

CREATE TABLE IF NOT EXISTS public.lessons (
    id BIGSERIAL PRIMARY KEY,
    grade_level INT NOT NULL REFERENCES public.curriculum_topics(grade_level) ON DELETE CASCADE,
    lesson_code VARCHAR(30) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    duration VARCHAR(50) DEFAULT '20 phút',
    xp_reward INT DEFAULT 50,
    summary TEXT,
    video_url TEXT,
    document_url TEXT,
    display_order INT DEFAULT 1
);

-- CÂU LỆNH CẬP NHẬT THÊM CỘT CHO BẢNG LESSONS NẾU ĐÃ TẠO BẢNG TRƯỚC ĐÓ:
ALTER TABLE public.lessons ADD COLUMN IF NOT EXISTS video_url TEXT;
ALTER TABLE public.lessons ADD COLUMN IF NOT EXISTS document_url TEXT;

-- 3. BẢNG MINIGAME TRẮC NGHIỆM
CREATE TABLE IF NOT EXISTS public.minigames (
    id BIGSERIAL PRIMARY KEY,
    grade_level INT NOT NULL UNIQUE REFERENCES public.curriculum_topics(grade_level) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    pass_score INT DEFAULT 80,
    xp_reward INT DEFAULT 100
);

CREATE TABLE IF NOT EXISTS public.minigame_questions (
    id BIGSERIAL PRIMARY KEY,
    minigame_id BIGINT NOT NULL REFERENCES public.minigames(id) ON DELETE CASCADE,
    question_order INT DEFAULT 1,
    question_text TEXT NOT NULL,
    options JSONB NOT NULL,
    correct_option INT NOT NULL,
    explanation TEXT
);

-- 4. BẢNG TRIỂN LÃM SẢN PHẨM HỌC SINH
CREATE TABLE IF NOT EXISTS public.submissions (
    id BIGSERIAL PRIMARY KEY,
    student_name VARCHAR(100) NOT NULL,
    student_class VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    submission_type VARCHAR(50) DEFAULT 'Infographic',
    file_url TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    teacher_feedback TEXT DEFAULT '',
    likes INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- BẬT CHÍNH SÁCH BẢO MẬT RLS
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.curriculum_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.minigames ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.minigame_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- CẤP QUYỀN ĐỌC GHI CÔNG KHAI CHO CLIENT (IDEMPOTENT SAFE)
DROP POLICY IF EXISTS "Public Read All" ON public.curriculum_topics;
DROP POLICY IF EXISTS "Public Read Curriculum" ON public.curriculum_topics;
DROP POLICY IF EXISTS "Public Insert Curriculum" ON public.curriculum_topics;
DROP POLICY IF EXISTS "Public Update Curriculum" ON public.curriculum_topics;

DROP POLICY IF EXISTS "Public Read Lessons" ON public.lessons;
DROP POLICY IF EXISTS "Public Insert Lessons" ON public.lessons;
DROP POLICY IF EXISTS "Public Update Lessons" ON public.lessons;

DROP POLICY IF EXISTS "Public Read Submissions" ON public.submissions;
DROP POLICY IF EXISTS "Public Insert Submissions" ON public.submissions;
DROP POLICY IF EXISTS "Public Update Submissions" ON public.submissions;

DROP POLICY IF EXISTS "Public Read Users" ON public.users;
DROP POLICY IF EXISTS "Public Update Users" ON public.users;

CREATE POLICY "Public Read Curriculum" ON public.curriculum_topics FOR SELECT USING (true);
CREATE POLICY "Public Insert Curriculum" ON public.curriculum_topics FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Curriculum" ON public.curriculum_topics FOR UPDATE USING (true);

CREATE POLICY "Public Read Lessons" ON public.lessons FOR SELECT USING (true);
CREATE POLICY "Public Insert Lessons" ON public.lessons FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Lessons" ON public.lessons FOR UPDATE USING (true);

CREATE POLICY "Public Read Submissions" ON public.submissions FOR SELECT USING (true);
CREATE POLICY "Public Insert Submissions" ON public.submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Submissions" ON public.submissions FOR UPDATE USING (true);

CREATE POLICY "Public Read Users" ON public.users FOR SELECT USING (true);
CREATE POLICY "Public Update Users" ON public.users FOR UPDATE USING (true);`;

export const SqlSchemaModal = ({ isOpen, onClose, onOpenSupabase }) => {
  if (!isOpen) return null;

  const copySql = () => {
    navigator.clipboard.writeText(SQL_TEXT);
    alert('🎉 Đã sao chép toàn bộ mã SQL PostgreSQL Supabase vào bộ nhớ tạm!');
  };

  const downloadSql = () => {
    const blob = new Blob([SQL_TEXT], { type: 'text/sql' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'supabase_database_schema.sql';
    a.click();
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target.className === 'modal-overlay' && onClose()}>
      <div className="modal-container">
        <button className="modal-close-btn" onClick={onClose}>✕</button>

        <div>
          <span className="hero-badge" style={{ background: '#E0F2FE', color: '#0369A1' }}>
            🗄️ SUPABASE POSTGRESQL SCHEMA
          </span>
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#1E293B', marginTop: '4px' }}>
            Cấu Trúc Bảng DB Supabase & RLS Policies
          </h2>
          <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '14px' }}>
            Bao gồm 5 nhóm bảng, mã hóa mật khẩu và phân quyền bảo mật hàng chuẩn PostgreSQL
          </p>

          <div style={{ marginBottom: '14px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button className="btn-primary" onClick={copySql}>📋 Sao Chép Toàn Bộ Mã SQL</button>
            <button className="btn-secondary" onClick={onOpenSupabase}>⚡ Cấu Hình Supabase API</button>
            <button className="btn-secondary" onClick={downloadSql}>📥 Tải File .sql</button>
          </div>

          <pre style={{
            maxHeight: '360px', overflowY: 'auto', background: '#0F172A', color: '#38BDF8',
            padding: '16px', borderRadius: '12px', fontFamily: 'monospace', fontSize: '12px', lineHeight: '1.5'
          }}>
            {SQL_TEXT}
          </pre>
        </div>
      </div>
    </div>
  );
};
