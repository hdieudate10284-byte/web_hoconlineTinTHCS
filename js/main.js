/* ============================================================================
   MAIN APPLICATION CONTROLLER (HỆ THỐNG HỌC LIỆU TIN HỌC THCS)
   Tích hợp Supabase Cloud Database + Gamification + Multi-role Engine + Auth
   ============================================================================ */

class MainController {
  async init() {
    this.renderGradeCards();
    this.updateHeaderProfile();
    this.setupEventListeners();

    // Khởi động đồng bộ cơ sở dữ liệu Supabase nếu đã có cấu hình
    if (typeof supabaseService !== 'undefined') {
      supabaseService.updateConnectionUI();
      if (supabaseService.isConnected) {
        await supabaseService.syncAllData();
      }
    }
  }

  // Cập nhật thông tin Profile trên thanh Header
  updateHeaderProfile() {
    const u = AppData.currentUser;
    const nameEl = document.getElementById('user-display-name');
    const classEl = document.getElementById('user-display-class');
    const xpEl = document.getElementById('user-xp-count');
    const avatarEl = document.getElementById('user-avatar-img');
    const roleEl = document.getElementById('role-select-box');
    const btnAuth = document.getElementById('btn-auth-action');

    if (nameEl) nameEl.innerText = u.name;
    if (classEl) classEl.innerText = `${u.class} • Level ${u.level}`;
    if (xpEl) xpEl.innerText = `${u.xp} XP`;
    if (avatarEl) avatarEl.src = u.avatar;
    if (roleEl) roleEl.value = u.role;

    // Cập nhật nút Đăng Nhập / Đăng Xuất thông minh
    if (btnAuth) {
      if (u.username && u.username !== 'guest') {
        btnAuth.innerHTML = `🚪 Đăng Xuất (${u.username})`;
        btnAuth.style.background = '#FEE2E2';
        btnAuth.style.color = '#991B1B';
        btnAuth.style.borderColor = '#FECACA';
        btnAuth.onclick = () => authEngine.logout();
      } else {
        btnAuth.innerHTML = `🔐 Đăng Nhập / Đăng Ký`;
        btnAuth.style.background = 'linear-gradient(135deg, #7C3AED, #4F46E5)';
        btnAuth.style.color = '#FFFFFF';
        btnAuth.style.borderColor = '#6D28D9';
        btnAuth.onclick = () => authEngine.renderAuthModal('login');
      }
    }
  }

  // Render 4 Thẻ Khối Lớp 6, 7, 8, 9
  renderGradeCards() {
    const gridContainer = document.getElementById('grade-cards-container');
    if (!gridContainer) return;

    gridContainer.innerHTML = AppData.curriculum.map(c => `
      <div class="grade-card ${c.themeClass}">
        <div class="grade-card-header">
          <h4>${c.badgeText}</h4>
          <h3>${c.title}</h3>
          <span class="grade-badge-tag">Môn Tin học Khối ${c.grade}</span>
        </div>

        <ul class="grade-subtopics-list">
          ${c.lessons.map(l => `
            <li onclick="mainController.showLessonDetail('${c.id}', '${l.id}')" style="cursor: pointer;">
              📌 ${l.title}
            </li>
          `).join('')}
        </ul>

        <div class="grade-card-footer">
          <div class="grade-graphic-symbol">${c.symbol}</div>
          <button class="btn-card-action" onclick="minigameEngine.startMinigame(${c.grade})">
            🎮 Chơi Minigame +100 XP
          </button>
        </div>
      </div>
    `).join('');
  }

  // Hiển thị chi tiết bài học
  showLessonDetail(gradeId, lessonId) {
    const topic = AppData.curriculum.find(c => c.id === gradeId);
    if (!topic) return;

    const lesson = topic.lessons.find(l => l.id === lessonId);
    if (!lesson) return;

    const modalOverlay = document.getElementById('app-modal-overlay');
    const modalBody = document.getElementById('app-modal-body');

    modalBody.innerHTML = `
      <div>
        <span class="hero-badge" style="background: ${topic.color}; color: white;">
          📘 BÀI HỌC KHỐI ${topic.grade}
        </span>
        <h2 style="font-size: 24px; font-weight: 900; color: #1E293B; margin-top: 8px;">${lesson.title}</h2>
        <p style="font-size: 13px; color: #64748B; margin-bottom: 16px;">⏱️ Thời lượng: ${lesson.duration} | 🎁 Thưởng: +${lesson.xp} XP</p>

        <div style="background: #F8FAFC; padding: 20px; border-radius: 16px; border: 1px solid #CBD5E1; margin-bottom: 20px; font-size: 14px; line-height: 1.6; color: #334155;">
          <h4 style="font-weight: 800; color: #1E293B; margin-bottom: 8px;">Nội dung cốt lõi:</h4>
          <p>${lesson.summary || topic.description}</p>
          <ul style="margin-top: 12px; padding-left: 20px;">
            <li>Nắm vững quy tắc an toàn và đạo đức không gian mạng.</li>
            <li>Thực hành kỹ năng nhận biết và xử lý tình huống thực tế.</li>
            <li>Sử dụng các công cụ bảo mật để bảo vệ bản thân và dữ liệu.</li>
          </ul>
        </div>

        <div style="display: flex; gap: 12px; justify-content: flex-end;">
          <button class="btn-secondary" onclick="mainController.closeModal()">Đóng</button>
          <button class="btn-primary" onclick="mainController.completeLesson('${lesson.title}', ${lesson.xp})">
            ✅ Đã Học Xong (+${lesson.xp} XP)
          </button>
        </div>
      </div>
    `;

    modalOverlay.classList.add('active');
  }

  // Hoàn thành bài học và cộng điểm XP
  async completeLesson(title, xp) {
    if (typeof supabaseService !== 'undefined') {
      await supabaseService.addXp(xp, `Hoàn thành bài học: ${title}`);
    } else {
      AppData.currentUser.xp += xp;
    }

    this.updateHeaderProfile();
    alert(`Chúc mừng! Em đã hoàn thành bài học "${title}" và nhận được +${xp} XP!`);
    this.closeModal();
  }

  // Đóng Modal chung
  closeModal() {
    const modalOverlay = document.getElementById('app-modal-overlay');
    if (modalOverlay) {
      modalOverlay.classList.remove('active');
    }
  }

  // Thiết lập phím tắt ESC và click ngoài để đóng popup
  setupEventListeners() {
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeModal();
      }
    });

    const overlay = document.getElementById('app-modal-overlay');
    if (overlay) {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          this.closeModal();
        }
      });
    }
  }
}

const mainController = new MainController();
window.addEventListener('DOMContentLoaded', () => {
  mainController.init();
});
