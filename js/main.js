/* ============================================================================
   MAIN APPLICATION CONTROLLER (HỆ THỐNG HỌC LIỆU TIN HỌC THCS)
   ============================================================================ */

class MainController {
  init() {
    this.renderGradeCards();
    this.updateHeaderProfile();
    this.setupEventListeners();
  }

  // Update header profile display
  updateHeaderProfile() {
    const u = AppData.currentUser;
    document.getElementById('user-display-name').innerText = u.name;
    document.getElementById('user-display-class').innerText = `${u.class} • Level ${u.level}`;
    document.getElementById('user-xp-count').innerText = `${u.xp} XP`;
    document.getElementById('user-avatar-img').src = u.avatar;
    document.getElementById('role-select-box').value = u.role;
  }

  // Render 4 Grade Cards matching Image 2 Layout
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

  // Show detailed lesson modal
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
          <p>${topic.description}</p>
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

  completeLesson(title, xp) {
    AppData.currentUser.xp += xp;
    this.updateHeaderProfile();
    alert(`Chúc mừng! Em đã hoàn thành bài học "${title}" và nhận được +${xp} XP!`);
    this.closeModal();
  }

  closeModal() {
    document.getElementById('app-modal-overlay').classList.remove('active');
  }

  setupEventListeners() {
    // Close modal on click outside
    const overlay = document.getElementById('app-modal-overlay');
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        this.closeModal();
      }
    });
  }
}

const mainController = new MainController();

// Initialize app when DOM loaded
document.addEventListener('DOMContentLoaded', () => {
  mainController.init();
});
