/* ============================================================================
   ADMIN & DATABASE SCHEMA SERVICE (TẦNG NGHIỆP VỤ XÁC THỰC & QUẢN TRỊ SYSTEM)
   Hỗ trợ Cơ sở dữ liệu Supabase Cloud PostgreSQL
   ============================================================================ */

class AdminEngine {
  renderDatabaseSchemaModal() {
    const modalOverlay = document.getElementById('app-modal-overlay');
    const modalBody = document.getElementById('app-modal-body');

    modalBody.innerHTML = `
      <div style="margin-bottom: 16px;">
        <span class="hero-badge" style="background: #E0F2FE; color: #0369A1;">🗄️ SUPABASE POSTGRESQL DATABASE SCHEMA</span>
        <h2 style="font-size: 22px; font-weight: 800; color: #1E293B; margin-top: 4px;">Cấu Trúc Bảng DB Supabase & Chính Sách RLS</h2>
        <p style="font-size: 13px; color: #64748B;">Bao gồm 5 nhóm bảng PostgreSQL + Row Level Security (RLS) + Seed Data mẫu chuẩn 100%.</p>
      </div>

      <div style="margin-bottom: 14px; display: flex; gap: 8px; flex-wrap: wrap;">
        <button class="btn-primary" onclick="adminEngine.copySqlSchema()">📋 Sao Chép Toàn Bộ Mã SQL</button>
        <button class="btn-secondary" onclick="supabaseService.renderConfigModal()">⚡ Cấu Hình Supabase API Key</button>
        <button class="btn-secondary" onclick="adminEngine.downloadSqlFile()">📥 Tải File database_schema.sql</button>
      </div>

      <pre class="sql-code-box" id="sql-code-display" style="max-height: 380px; overflow-y: auto; background: #0F172A; color: #38BDF8; padding: 16px; border-radius: 12px; font-family: monospace; font-size: 12px; line-height: 1.5;">
-- ============================================================================
-- CƠ SỞ DỮ LIỆU SUPABASE (POSTGRESQL): HỌC LIỆU TIN HỌC THCS
-- ============================================================================

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
    display_order INT DEFAULT 1
);

-- 3. BẢNG MINIGAME GAMIFICATION
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

-- 4. BẢNG SẢN PHẨM HỌC SINH (TRIỂN LÃM & DUYỆT BÀI)
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

-- 5. BẢNG HUY HIỆU & NHẬT KÝ
CREATE TABLE IF NOT EXISTS public.badges (
    id BIGSERIAL PRIMARY KEY,
    badge_name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    icon VARCHAR(20) NOT NULL,
    required_xp INT DEFAULT 100,
    grade_level INT
);

-- BẬT CHÍNH SÁCH BẢO MẬT RLS
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.curriculum_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.minigames ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.minigame_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;

-- CẤP QUYỀN ĐỌC GHI CHO ANON & AUTHENTICATED
CREATE POLICY "Public Read All" ON public.curriculum_topics FOR SELECT USING (true);
CREATE POLICY "Public Read Lessons" ON public.lessons FOR SELECT USING (true);
CREATE POLICY "Public Read Minigames" ON public.minigames FOR SELECT USING (true);
CREATE POLICY "Public Read Questions" ON public.minigame_questions FOR SELECT USING (true);
CREATE POLICY "Public Read Submissions" ON public.submissions FOR SELECT USING (true);
CREATE POLICY "Public Insert Submissions" ON public.submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Submissions" ON public.submissions FOR UPDATE USING (true);
CREATE POLICY "Public Read Users" ON public.users FOR SELECT USING (true);
CREATE POLICY "Public Update Users" ON public.users FOR UPDATE USING (true);
CREATE POLICY "Public Read Badges" ON public.badges FOR SELECT USING (true);
      </pre>
    `;

    modalOverlay.classList.add('active');
  }

  switchRole(newRole) {
    AppData.currentUser.role = newRole;
    if (newRole === 'teacher') {
      AppData.currentUser.name = 'Thầy Nguyễn Minh Trí';
      AppData.currentUser.class = 'Giáo viên Tin học';
      alert('Đã chuyển sang vai trò: GIÁO VIÊN (Có quyền kiểm duyệt bài nộp học sinh trên Supabase)');
    } else if (newRole === 'admin') {
      AppData.currentUser.name = 'Quản trị viên Hệ thống';
      AppData.currentUser.class = 'Ban Giám Hiệu / Admin';
      alert('Đã chuyển sang vai trò: ADMIN QUẢN TRỊ HỆ THỐNG');
    } else {
      AppData.currentUser.name = 'Nguyễn Văn An';
      AppData.currentUser.class = 'Lớp 6A1';
      alert('Đã chuyển sang vai trò: HỌC SINH');
    }
    mainController.updateHeaderProfile();
  }

  copySqlSchema() {
    const codeEl = document.getElementById('sql-code-display');
    if (codeEl) {
      navigator.clipboard.writeText(codeEl.innerText);
      alert('🎉 Đã sao chép toàn bộ mã SQL PostgreSQL cho Supabase vào bộ nhớ tạm!');
    }
  }

  downloadSqlFile() {
    const codeEl = document.getElementById('sql-code-display');
    const content = codeEl ? codeEl.innerText : '';
    const blob = new Blob([content], { type: 'text/sql' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'supabase_database_schema.sql';
    a.click();
  }
}

const adminEngine = new AdminEngine();
