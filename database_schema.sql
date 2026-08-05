-- ============================================================================
-- CƠ SỞ DỮ LIỆU: HỆ THỐNG HỌC LIỆU TIN HỌC THCS (GAMIFICATION & AN TOÀN SỐ)
-- ============================================================================

-- 1. BẢNG NGƯỜI DÙNG VÀ LỚP HỌC (DB Users & Classes)
CREATE TABLE IF NOT EXISTS classes (
    class_id INT AUTO_INCREMENT PRIMARY KEY,
    class_name VARCHAR(50) NOT NULL, -- Ví dụ: Lớp 6A1, Lớp 7B, Lớp 8C, Lớp 9A
    grade_level INT NOT NULL, -- 6, 7, 8, 9
    school_year VARCHAR(20) DEFAULT '2025-2026',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('student', 'teacher', 'admin') DEFAULT 'student',
    avatar_url VARCHAR(255) DEFAULT 'https://api.dicebear.com/7.x/bottts/svg?seed=student',
    class_id INT,
    total_xp INT DEFAULT 0,
    current_level INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (class_id) REFERENCES classes(class_id) ON DELETE SET NULL
);

-- 2. BẢNG BÀI HỌC VÀ MINIGAME (DB Curriculum & Minigames)
CREATE TABLE IF NOT EXISTS curriculum_topics (
    topic_id INT AUTO_INCREMENT PRIMARY KEY,
    grade_level INT NOT NULL, -- 6: Ứng xử & An toàn số, 7: Tác quyền, 8: An ninh mạng, 9: Luật ANM
    title VARCHAR(150) NOT NULL,
    description TEXT,
    theme_color VARCHAR(20) DEFAULT '#7E22CE', -- Màu thẻ UI (Tím, Vàng, Xanh, Hồng)
    icon_code VARCHAR(50) DEFAULT 'book',
    display_order INT DEFAULT 1
);

CREATE TABLE IF NOT EXISTS lessons (
    lesson_id INT AUTO_INCREMENT PRIMARY KEY,
    topic_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    summary TEXT,
    content_body LONGTEXT,
    video_url VARCHAR(255),
    xp_reward INT DEFAULT 50,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (topic_id) REFERENCES curriculum_topics(topic_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS minigames (
    minigame_id INT AUTO_INCREMENT PRIMARY KEY,
    lesson_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    game_type ENUM('quiz', 'scenario', 'drag_drop') DEFAULT 'quiz',
    pass_score INT DEFAULT 80,
    xp_reward INT DEFAULT 100,
    FOREIGN KEY (lesson_id) REFERENCES lessons(lesson_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS minigame_questions (
    question_id INT AUTO_INCREMENT PRIMARY KEY,
    minigame_id INT NOT NULL,
    question_text TEXT NOT NULL,
    option_a VARCHAR(255) NOT NULL,
    option_b VARCHAR(255) NOT NULL,
    option_c VARCHAR(255) NOT NULL,
    option_d VARCHAR(255) NOT NULL,
    correct_option CHAR(1) NOT NULL, -- 'A', 'B', 'C', 'D'
    explanation TEXT,
    FOREIGN KEY (minigame_id) REFERENCES minigames(minigame_id) ON DELETE CASCADE
);

-- 3. BẢNG SẢN PHẨM HỌC SINH (DB Student Products)
CREATE TABLE IF NOT EXISTS submissions (
    submission_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    lesson_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    file_url VARCHAR(255) NOT NULL,
    file_type ENUM('image', 'document', 'video', 'slides') DEFAULT 'image',
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    teacher_feedback TEXT,
    teacher_id INT,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (lesson_id) REFERENCES lessons(lesson_id) ON DELETE CASCADE,
    FOREIGN KEY (teacher_id) REFERENCES users(user_id) ON DELETE SET NULL
);

-- 4. BẢNG ĐIỂM SỐ, HUY HIỆU & LOG (DB Scores, Badges & Activity Logs)
CREATE TABLE IF NOT EXISTS badges (
    badge_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    icon_name VARCHAR(50) NOT NULL,
    required_xp INT DEFAULT 100,
    unlocked_condition VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS user_badges (
    user_id INT NOT NULL,
    badge_id INT NOT NULL,
    unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, badge_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (badge_id) REFERENCES badges(badge_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS activity_logs (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    action_type VARCHAR(50) NOT NULL, -- 'COMPLETE_LESSON', 'PLAY_MINIGAME', 'SUBMIT_PRODUCT'
    description TEXT,
    xp_gained INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- ============================================================================
-- DỮ LIỆU MẪU BAN ĐẦU (SEED DATA)
-- ============================================================================

INSERT INTO classes (class_name, grade_level) VALUES 
('Lớp 6A1', 6), ('Lớp 7B2', 7), ('Lớp 8C3', 8), ('Lớp 9D1', 9);

INSERT INTO users (full_name, email, password_hash, role, class_id, total_xp, current_level) VALUES
('Nguyễn Văn An', 'an.nguyen@hocsinh.edu.vn', 'hash123', 'student', 1, 450, 3),
('Trần Thị Bình', 'binh.tran@hocsinh.edu.vn', 'hash123', 'student', 2, 720, 5),
('Lê Hoàng Cường', 'cuong.le@hocsinh.edu.vn', 'hash123', 'student', 3, 310, 2),
('Phạm Mỹ Duyên', 'duyen.pham@hocsinh.edu.vn', 'hash123', 'student', 4, 980, 7),
('Thầy Nguyễn Minh Trí (Giáo viên Tin học)', 'tri.nguyen@giaovien.edu.vn', 'hash123', 'teacher', NULL, 0, 99);

INSERT INTO curriculum_topics (grade_level, title, description, theme_color) VALUES
(6, 'Ứng xử & An toàn số', 'Chủ đề Khối 6: Quy tắc ứng xử văn minh, bảo vệ dữ liệu cá nhân & phòng chống cyberbullying.', '#7E22CE'),
(7, 'Bản quyền & Tác quyền số', 'Chủ đề Khối 7: Luật sở hữu trí tuệ, bản quyền phần mềm, trích dẫn hợp lệ & giấy phép CC.', '#EAB308'),
(8, 'Lừa đảo & An ninh mạng', 'Chủ đề Khối 8: Nhận diện chiêu trò lừa đảo Phishing, mật khẩu an toàn, 2FA & phòng tránh Malware.', '#0284C7'),
(9, 'Dữ liệu & Luật An ninh mạng', 'Chủ đề Khối 9: Luật An ninh mạng 2018, bảo mật dữ liệu đám mây & trách nhiệm công dân số.', '#EC4899');

INSERT INTO badges (name, description, icon_name, required_xp) VALUES
('🛡️ Vệ sĩ Số', 'Đã hoàn thành minigame An toàn số Khối 6', 'shield', 100),
('📜 Hiệp sĩ Tác quyền', 'Hiểu rõ luật sở hữu trí tuệ và trích dẫn chuẩn Khối 7', 'scroll', 300),
('🔒 Thần đồng An ninh', 'Nhận diện xuất sắc các chiêu trò lừa đảo mạng Khối 8', 'lock', 500),
('⚖️ Chuyên gia Luật Số', 'Nắm vững Luật An ninh mạng 2018 Khối 9', 'scale', 800);
