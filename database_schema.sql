-- ============================================================================
-- CƠ SỞ DỮ LIỆU SUPABASE (POSTGRESQL): HỆ THỐNG HỌC LIỆU TIN HỌC THCS
-- GAMIFICATION, AN TOÀN SỐ, TÁC QUYỀN, LUẬT ANM & HỆ THỐNG AUTHENTICATION
-- Hỗ trợ chạy lại nhiều lần an toàn 100% (Idempotent Safe - Không lỗi trùng Policy)
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- TẦNG 1: BẢNG LỚP HỌC VÀ HỒ SƠ TÀI KHOẢN NGƯỜI DÙNG (CLASSES & USERS)
-- ============================================================================

-- Bảng Lớp học
CREATE TABLE IF NOT EXISTS public.classes (
    id BIGSERIAL PRIMARY KEY,
    class_name VARCHAR(50) NOT NULL UNIQUE,
    grade_level INT NOT NULL CHECK (grade_level BETWEEN 6 AND 9),
    school_year VARCHAR(20) DEFAULT '2025-2026',
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Bảng Người dùng & Hồ sơ Học sinh / Giáo viên / Quản trị viên (Hỗ trợ Auth Username & Password)
CREATE TABLE IF NOT EXISTS public.users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE,
    password_hash TEXT NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    role VARCHAR(20) DEFAULT 'student' CHECK (role IN ('student', 'teacher', 'admin')),
    class_name VARCHAR(50) DEFAULT 'Lớp 6A1',
    grade_level INT DEFAULT 6 CHECK (grade_level BETWEEN 6 AND 9),
    avatar_url TEXT DEFAULT 'https://api.dicebear.com/7.x/bottts/svg?seed=student1',
    total_xp INT DEFAULT 0 CHECK (total_xp >= 0),
    current_level INT DEFAULT 1 CHECK (current_level >= 1),
    badges_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Bổ sung cột nếu bảng đã tạo từ trước
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS username VARCHAR(50) UNIQUE;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS password_hash TEXT DEFAULT '123456';

-- ============================================================================
-- TẦNG 2: BẢNG CHƯƠNG TRÌNH HỌC LIỆU & BÀI HỌC (CURRICULUM & LESSONS)
-- ============================================================================

-- Bảng Chủ đề Khối lớp (Khối 6, 7, 8, 9)
CREATE TABLE IF NOT EXISTS public.curriculum_topics (
    id BIGSERIAL PRIMARY KEY,
    grade_level INT NOT NULL UNIQUE CHECK (grade_level BETWEEN 6 AND 9),
    title VARCHAR(150) NOT NULL,
    badge_text VARCHAR(50) NOT NULL,
    theme_class VARCHAR(50) NOT NULL,
    theme_color VARCHAR(30) DEFAULT '#7C3AED',
    symbol VARCHAR(20) DEFAULT '📘',
    description TEXT,
    display_order INT DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Bảng Chi tiết Bài học từng khối
CREATE TABLE IF NOT EXISTS public.lessons (
    id BIGSERIAL PRIMARY KEY,
    grade_level INT NOT NULL REFERENCES public.curriculum_topics(grade_level) ON DELETE CASCADE,
    lesson_code VARCHAR(30) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    duration VARCHAR(50) DEFAULT '20 phút',
    xp_reward INT DEFAULT 50 CHECK (xp_reward >= 0),
    summary TEXT,
    content_body TEXT,
<<<<<<< HEAD
=======
    video_url TEXT,
    document_url TEXT,
>>>>>>> 3370f4b (Cập nhật hệ thống Web Học Online Tin THCS: Xây dựng file .gitignore chuẩn, cho phép Giáo viên đăng ký/đăng nhập Tên & Email riêng, phân quyền Admin ô Supabase DB và tự động đồng bộ bài giảng mới lên Cloud Database)
    display_order INT DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

<<<<<<< HEAD
=======
-- Bổ sung cột nếu đã tạo bảng trước đó:
ALTER TABLE public.lessons ADD COLUMN IF NOT EXISTS video_url TEXT;
ALTER TABLE public.lessons ADD COLUMN IF NOT EXISTS document_url TEXT;

>>>>>>> 3370f4b (Cập nhật hệ thống Web Học Online Tin THCS: Xây dựng file .gitignore chuẩn, cho phép Giáo viên đăng ký/đăng nhập Tên & Email riêng, phân quyền Admin ô Supabase DB và tự động đồng bộ bài giảng mới lên Cloud Database)
-- ============================================================================
-- TẦNG 3: BẢNG MINIGAME TRẮC NGHIỆM GAMIFICATION (MINIGAMES & QUESTIONS)
-- ============================================================================

-- Bảng Minigame theo từng Khối
CREATE TABLE IF NOT EXISTS public.minigames (
    id BIGSERIAL PRIMARY KEY,
    grade_level INT NOT NULL UNIQUE REFERENCES public.curriculum_topics(grade_level) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    pass_score INT DEFAULT 80,
    xp_reward INT DEFAULT 100,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Bảng Câu hỏi trắc nghiệm Minigame
CREATE TABLE IF NOT EXISTS public.minigame_questions (
    id BIGSERIAL PRIMARY KEY,
    minigame_id BIGINT NOT NULL REFERENCES public.minigames(id) ON DELETE CASCADE,
    question_order INT DEFAULT 1,
    question_text TEXT NOT NULL,
    options JSONB NOT NULL,
    correct_option INT NOT NULL CHECK (correct_option BETWEEN 0 AND 3),
    explanation TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ============================================================================
-- TẦNG 4: BẢNG TRIỂN LÃM SẢN PHẨM HỌC SINH & DUYỆT BÀI (SUBMISSIONS GALLERY)
-- ============================================================================

-- Bảng Bài nộp / Sản phẩm học sinh
CREATE TABLE IF NOT EXISTS public.submissions (
    id BIGSERIAL PRIMARY KEY,
    student_name VARCHAR(100) NOT NULL,
    student_class VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    submission_type VARCHAR(50) DEFAULT 'Infographic',
    file_url TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    teacher_feedback TEXT DEFAULT '',
    likes INT DEFAULT 0 CHECK (likes >= 0),
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ============================================================================
-- TẦNG 5: BẢNG HUY HIỆU DANH DỰ & NHẬT KÝ HOẠT ĐỘNG (BADGES & ACTIVITY LOGS)
-- ============================================================================

-- Bảng Danh mục Huy hiệu
CREATE TABLE IF NOT EXISTS public.badges (
    id BIGSERIAL PRIMARY KEY,
    badge_name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    icon VARCHAR(20) NOT NULL,
    required_xp INT DEFAULT 100,
    grade_level INT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Bảng Huy hiệu đã mở khóa của người dùng
CREATE TABLE IF NOT EXISTS public.user_badges (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES public.users(id) ON DELETE CASCADE,
    badge_id BIGINT REFERENCES public.badges(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    CONSTRAINT unique_user_badge UNIQUE (user_id, badge_id)
);

-- Bảng Nhật ký Hoạt động (Audit & Gamification Logs)
CREATE TABLE IF NOT EXISTS public.activity_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES public.users(id) ON DELETE CASCADE,
    action_type VARCHAR(50) NOT NULL,
    description TEXT,
    xp_gained INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ============================================================================
-- CHÍNH SÁCH BẢO MẬT HÀNG (ROW LEVEL SECURITY - RLS)
-- ============================================================================

ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.curriculum_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.minigames ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.minigame_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Xóa Policy cũ nếu có
DROP POLICY IF EXISTS "Public Read Classes" ON public.classes;
DROP POLICY IF EXISTS "Public Read Users" ON public.users;
DROP POLICY IF EXISTS "Public Read Curriculum" ON public.curriculum_topics;
DROP POLICY IF EXISTS "Public Read Lessons" ON public.lessons;
DROP POLICY IF EXISTS "Public Insert Curriculum" ON public.curriculum_topics;
DROP POLICY IF EXISTS "Public Update Curriculum" ON public.curriculum_topics;
DROP POLICY IF EXISTS "Public Insert Lessons" ON public.lessons;
DROP POLICY IF EXISTS "Public Update Lessons" ON public.lessons;
DROP POLICY IF EXISTS "Public Read Minigames" ON public.minigames;
DROP POLICY IF EXISTS "Public Read Questions" ON public.minigame_questions;
DROP POLICY IF EXISTS "Public Read Submissions" ON public.submissions;
DROP POLICY IF EXISTS "Public Read Badges" ON public.badges;
DROP POLICY IF EXISTS "Public Read User Badges" ON public.user_badges;
DROP POLICY IF EXISTS "Public Read Activity Logs" ON public.activity_logs;
DROP POLICY IF EXISTS "Public Insert Submissions" ON public.submissions;
DROP POLICY IF EXISTS "Public Update Submissions" ON public.submissions;
DROP POLICY IF EXISTS "Public Insert Users" ON public.users;
DROP POLICY IF EXISTS "Public Update Users" ON public.users;
DROP POLICY IF EXISTS "Public Insert Activity Logs" ON public.activity_logs;
DROP POLICY IF EXISTS "Public Insert User Badges" ON public.user_badges;

-- Tạo lại các Policy mới
CREATE POLICY "Public Read Classes" ON public.classes FOR SELECT USING (true);
CREATE POLICY "Public Read Users" ON public.users FOR SELECT USING (true);
CREATE POLICY "Public Read Curriculum" ON public.curriculum_topics FOR SELECT USING (true);
CREATE POLICY "Public Insert Curriculum" ON public.curriculum_topics FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Curriculum" ON public.curriculum_topics FOR UPDATE USING (true);
CREATE POLICY "Public Read Lessons" ON public.lessons FOR SELECT USING (true);
CREATE POLICY "Public Insert Lessons" ON public.lessons FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Lessons" ON public.lessons FOR UPDATE USING (true);
CREATE POLICY "Public Read Minigames" ON public.minigames FOR SELECT USING (true);
CREATE POLICY "Public Read Questions" ON public.minigame_questions FOR SELECT USING (true);
CREATE POLICY "Public Read Submissions" ON public.submissions FOR SELECT USING (true);
CREATE POLICY "Public Read Badges" ON public.badges FOR SELECT USING (true);
CREATE POLICY "Public Read User Badges" ON public.user_badges FOR SELECT USING (true);
CREATE POLICY "Public Read Activity Logs" ON public.activity_logs FOR SELECT USING (true);

CREATE POLICY "Public Insert Submissions" ON public.submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Submissions" ON public.submissions FOR UPDATE USING (true);
CREATE POLICY "Public Insert Users" ON public.users FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Users" ON public.users FOR UPDATE USING (true);
CREATE POLICY "Public Insert Activity Logs" ON public.activity_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Insert User Badges" ON public.user_badges FOR INSERT WITH CHECK (true);

-- ============================================================================
-- CHỈ MỤC TỐI ƯU HIỆU NĂNG TRUY VẤN (INDEXES)
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_users_username ON public.users(username);
CREATE INDEX IF NOT EXISTS idx_users_total_xp ON public.users(total_xp DESC);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON public.activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_submissions_student ON public.submissions(student_name);

-- ============================================================================
-- DỮ LIỆU KHỞI TẠO TÀI KHOẢN MẪU (AUTH SEED DATA)
-- ============================================================================

INSERT INTO public.classes (class_name, grade_level, school_year) VALUES
('Lớp 6A1', 6, '2025-2026'),
('Lớp 7B2', 7, '2025-2026'),
('Lớp 8C3', 8, '2025-2026'),
('Lớp 9D1', 9, '2025-2026')
ON CONFLICT (class_name) DO NOTHING;

-- Thêm tài khoản mẫu có Username & Password sẵn sàng để đăng nhập
INSERT INTO public.users (id, username, password_hash, full_name, email, role, class_name, grade_level, avatar_url, total_xp, current_level, badges_count) VALUES
(1, 'hocsinh9', '123456', 'Phạm Mỹ Duyên', 'duyen.pham@hocsinh.edu.vn', 'student', 'Lớp 9D1', 9, 'https://api.dicebear.com/7.x/bottts/svg?seed=duyen', 980, 7, 5),
(2, 'hocsinh7', '123456', 'Trần Thị Bình', 'binh.tran@hocsinh.edu.vn', 'student', 'Lớp 7B2', 7, 'https://api.dicebear.com/7.x/bottts/svg?seed=binh', 720, 5, 4),
(3, 'hocsinh6', '123456', 'Nguyễn Văn An', 'an.nguyen@hocsinh.edu.vn', 'student', 'Lớp 6A1', 6, 'https://api.dicebear.com/7.x/bottts/svg?seed=student1', 450, 3, 2),
(4, 'hocsinh8', '123456', 'Lê Hoàng Cường', 'cuong.le@hocsinh.edu.vn', 'student', 'Lớp 8C3', 8, 'https://api.dicebear.com/7.x/bottts/svg?seed=cuong', 310, 2, 1),
(5, 'giaovien', '123456', 'Thầy Nguyễn Minh Trí', 'tri.nguyen@giaovien.edu.vn', 'teacher', 'Giáo viên Tin học', 9, 'https://api.dicebear.com/7.x/bottts/svg?seed=teacher', 1500, 10, 8),
(6, 'admin', '123456', 'Quản trị viên Hệ thống', 'admin@tinhoc.edu.vn', 'admin', 'Ban Giám Hiệu', 9, 'https://api.dicebear.com/7.x/bottts/svg?seed=admin', 9999, 99, 10)
ON CONFLICT (id) DO UPDATE SET
username = EXCLUDED.username,
password_hash = EXCLUDED.password_hash,
full_name = EXCLUDED.full_name,
role = EXCLUDED.role;

SELECT setval('public.classes_id_seq', (SELECT COALESCE(MAX(id), 1) FROM public.classes));
SELECT setval('public.users_id_seq', (SELECT COALESCE(MAX(id), 1) FROM public.users));

