/* ============================================================================
   ADMIN & DATABASE SCHEMA SERVICE (TẦNG NGHIỆP VỤ XÁC THỰC & QUẢN TRỊ SYSTEM)
   ============================================================================ */

class AdminEngine {
  renderDatabaseSchemaModal() {
    const modalOverlay = document.getElementById('app-modal-overlay');
    const modalBody = document.getElementById('app-modal-body');

    modalBody.innerHTML = `
      <div style="margin-bottom: 16px;">
        <span class="hero-badge" style="background: #E0F2FE; color: #0369A1;">🗄️ TẦNG CƠ SỞ DỮ LIỆU (DATABASE SCHEMA)</span>
        <h2 style="font-size: 22px; font-weight: 800; color: #1E293B; margin-top: 4px;">Kiến Trúc Cấu Trúc Bảng DB 3 Tầng SQL</h2>
        <p style="font-size: 13px; color: #64748B;">Bao gồm 4 nhóm DB: Users & Classes, Curriculum & Minigames, Student Products, Scores & Badges.</p>
      </div>

      <div style="margin-bottom: 12px; display: flex; gap: 8px;">
        <button class="btn-primary" onclick="adminEngine.copySqlSchema()">📋 Sao Chép Mã SQL Query</button>
        <button class="btn-secondary" onclick="adminEngine.downloadSqlFile()">📥 Tải File database_schema.sql</button>
      </div>

      <pre class="sql-code-box" id="sql-code-display">
-- CƠ SỞ DỮ LIỆU THCS (DATABASE SCHEMA)
-- 1. DB Users & Classes
CREATE TABLE classes (class_id INT PRIMARY KEY, class_name VARCHAR(50), grade_level INT);
CREATE TABLE users (user_id INT PRIMARY KEY, full_name VARCHAR(100), role ENUM('student', 'teacher', 'admin'), total_xp INT);

-- 2. DB Curriculum & Minigames
CREATE TABLE curriculum_topics (topic_id INT PRIMARY KEY, grade_level INT, title VARCHAR(150), theme_color VARCHAR(20));
CREATE TABLE lessons (lesson_id INT PRIMARY KEY, topic_id INT, title VARCHAR(200), xp_reward INT);
CREATE TABLE minigames (minigame_id INT PRIMARY KEY, lesson_id INT, title VARCHAR(200));

-- 3. DB Student Products
CREATE TABLE submissions (submission_id INT PRIMARY KEY, user_id INT, title VARCHAR(200), status ENUM('pending', 'approved'));

-- 4. DB Scores, Badges & Activity Logs
CREATE TABLE badges (badge_id INT PRIMARY KEY, name VARCHAR(100), required_xp INT);
CREATE TABLE user_badges (user_id INT, badge_id INT, PRIMARY KEY(user_id, badge_id));
      </pre>
    `;

    modalOverlay.classList.add('active');
  }

  switchRole(newRole) {
    AppData.currentUser.role = newRole;
    if (newRole === 'teacher') {
      AppData.currentUser.name = 'Thầy Nguyễn Minh Trí';
      AppData.currentUser.class = 'Giáo viên Tin học';
      alert('Đã chuyển sang vai trò: GIÁO VIÊN (Có quyền kiểm duyệt sản phẩm học sinh)');
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
    navigator.clipboard.writeText(document.getElementById('sql-code-display').innerText);
    alert('Đã sao chép toàn bộ mã SQL Query vào bộ nhớ tạm!');
  }

  downloadSqlFile() {
    const blob = new Blob([document.getElementById('sql-code-display').innerText], { type: 'text/sql' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'database_schema.sql';
    a.click();
  }
}

const adminEngine = new AdminEngine();
