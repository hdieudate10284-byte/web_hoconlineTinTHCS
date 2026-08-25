/* ============================================================================
   MINIGAME INTERACTIVE ENGINE (TẦNG NGHIỆP VỤ MINIGAME & GAMIFICATION)
   Tích hợp âm thanh Web Audio API & Lưu điểm thưởng Supabase
   ============================================================================ */

class MinigameEngine {
  constructor() {
    this.currentMinigame = null;
    this.currentQuestionIndex = 0;
    this.score = 0;
    this.userAnswers = [];
  }

  // Phát hiệu ứng âm thanh bằng Web Audio API
  playSound(type) {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (type === 'correct') {
        osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
        osc.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.1); // E5
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
      } else if (type === 'wrong') {
        osc.frequency.setValueAtTime(220, audioCtx.currentTime); // A3
        osc.frequency.setValueAtTime(196, audioCtx.currentTime + 0.15); // G3
        gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.35);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.35);
      }
    } catch (e) {
      console.log('Audio Context không khả dụng trên trình duyệt:', e);
    }
  }

  // Bắt đầu Minigame theo Khối
  startMinigame(gradeNumber) {
    const topic = AppData.curriculum.find(c => c.grade === gradeNumber);
    if (!topic || !topic.minigame) {
      alert('Chưa có minigame cho khối này!');
      return;
    }

    this.currentMinigame = topic.minigame;
    this.currentQuestionIndex = 0;
    this.score = 0;
    this.userAnswers = [];

    this.renderQuizModal();
  }

  renderQuizModal() {
    const mg = this.currentMinigame;
    const q = mg.questions[this.currentQuestionIndex];

    const modalOverlay = document.getElementById('app-modal-overlay');
    const modalBody = document.getElementById('app-modal-body');

    modalBody.innerHTML = `
      <div style="text-align: center; margin-bottom: 20px;">
        <span class="hero-badge" style="background: #EDE9FE; color: #7C3AED; border-color: #C4B5FD;">
          🎮 MINIGAME TƯƠNG TÁC GAMIFICATION
        </span>
        <h2 style="font-size: 22px; font-weight: 800; color: #1E293B; margin-top: 8px;">${mg.title}</h2>
        <p style="font-size: 13px; color: #64748B;">Câu hỏi ${this.currentQuestionIndex + 1} / ${mg.questions.length}</p>
      </div>

      <div class="quiz-box">
        <div class="quiz-question-text">❓ ${q.text}</div>
        <div class="quiz-options-list" id="quiz-options-container">
          ${q.options.map((opt, idx) => `
            <button class="quiz-option-btn" onclick="minigameEngine.selectAnswer(${idx})">
              <span>${opt}</span>
            </button>
          `).join('')}
        </div>
      </div>

      <div id="quiz-feedback-box" style="margin-top: 16px; display: none;"></div>

      <div style="margin-top: 24px; text-align: right;">
        <button id="btn-next-question" class="btn-primary" style="display: none;" onclick="minigameEngine.nextQuestion()">
          Câu kế tiếp ➔
        </button>
      </div>
    `;

    modalOverlay.classList.add('active');
  }

  selectAnswer(selectedIdx) {
    const q = this.currentMinigame.questions[this.currentQuestionIndex];
    const isCorrect = selectedIdx === q.correct;

    const buttons = document.querySelectorAll('.quiz-option-btn');
    buttons.forEach((btn, idx) => {
      btn.disabled = true;
      if (idx === q.correct) {
        btn.classList.add('correct');
      } else if (idx === selectedIdx && !isCorrect) {
        btn.classList.add('wrong');
      }
    });

    const feedbackBox = document.getElementById('quiz-feedback-box');
    feedbackBox.style.display = 'block';

    if (isCorrect) {
      this.score += 50;
      this.playSound('correct');
      feedbackBox.innerHTML = `
        <div style="background: #D1FAE5; color: #065F46; border: 1px solid #34D399; padding: 14px; border-radius: 12px; font-weight: 700; font-size: 14px;">
          🎉 CHÍNH XÁC! +50 XP điểm thưởng!<br>
          <span style="font-size: 13px; font-weight: 500;">${q.explanation}</span>
        </div>
      `;
    } else {
      this.playSound('wrong');
      feedbackBox.innerHTML = `
        <div style="background: #FEE2E2; color: #991B1B; border: 1px solid #F87171; padding: 14px; border-radius: 12px; font-weight: 700; font-size: 14px;">
          ❌ CHƯA CHÍNH XÁC!<br>
          <span style="font-size: 13px; font-weight: 500;">${q.explanation}</span>
        </div>
      `;
    }

    document.getElementById('btn-next-question').style.display = 'inline-block';
  }

  nextQuestion() {
    this.currentQuestionIndex++;
    if (this.currentQuestionIndex < this.currentMinigame.questions.length) {
      this.renderQuizModal();
    } else {
      this.finishMinigame();
    }
  }

  async finishMinigame() {
    // Cộng điểm XP vào Supabase hoặc Local AppData
    if (typeof supabaseService !== 'undefined') {
      await supabaseService.addXp(this.score, `Hoàn thành minigame: ${this.currentMinigame.title}`);
    } else {
      AppData.currentUser.xp += this.score;
      if (AppData.currentUser.xp >= AppData.currentUser.level * 200) {
        AppData.currentUser.level += 1;
      }
    }

    const modalBody = document.getElementById('app-modal-body');
    modalBody.innerHTML = `
      <div style="text-align: center; padding: 20px;">
        <div style="font-size: 64px; margin-bottom: 12px;">🏆</div>
        <h2 style="font-size: 26px; font-weight: 900; color: #7C3AED;">CHÚC MỪNG HOÀN THÀNH!</h2>
        <p style="font-size: 16px; color: #334155; margin-top: 8px;">Em đã xuất sắc giành được <strong>+${this.score} XP</strong> điểm thưởng Gamification!</p>
        
        <div style="background: #FEF08A; border: 2px dashed #CA8A04; border-radius: 16px; padding: 16px; margin: 20px 0; color: #713F12;">
          <div style="font-size: 32px;">🛡️</div>
          <strong style="font-size: 16px;">MỞ KHÓA HUY HIỆU DANH DỰ!</strong>
          <p style="font-size: 13px; margin-top: 4px;">Huy hiệu An toàn số đã được cập nhật vào Hồ sơ cá nhân của em.</p>
        </div>

        <button class="btn-primary" onclick="mainController.closeModal(); mainController.updateHeaderProfile();">
          Về Trang Chủ & Cập Nhật Hồ Sơ
        </button>
      </div>
    `;
  }
}

const minigameEngine = new MinigameEngine();
