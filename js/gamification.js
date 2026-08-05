/* ============================================================================
   GAMIFICATION & LEADERBOARD ENGINE (TẦNG NGHIỆP VỤ GAMIFICATION)
   ============================================================================ */

class GamificationEngine {
  renderLeaderboardModal() {
    const modalOverlay = document.getElementById('app-modal-overlay');
    const modalBody = document.getElementById('app-modal-body');

    modalBody.innerHTML = `
      <div style="text-align: center; margin-bottom: 20px;">
        <span class="hero-badge" style="background: #FEF08A; color: #854D0E;">🏆 BẢNG VINH DANH GAMIFICATION</span>
        <h2 style="font-size: 24px; font-weight: 900; color: #1E293B; margin-top: 4px;">Top Học Sinh Xuất Sắc An Toàn Số</h2>
        <p style="font-size: 13px; color: #64748B;">Điểm thưởng XP & Huy hiệu danh dự đạt được qua các bài học & minigame</p>
      </div>

      <table class="leaderboard-table">
        <thead>
          <tr>
            <th>Hạng</th>
            <th>Học Sinh</th>
            <th>Lớp</th>
            <th>Điểm XP</th>
            <th>Huy Hiệu</th>
          </tr>
        </thead>
        <tbody>
          ${AppData.leaderboard.map(item => `
            <tr style="${item.name === AppData.currentUser.name ? 'background: #EDE9FE; font-weight: 800;' : ''}">
              <td>
                <span class="rank-badge ${item.rank <= 3 ? 'rank-' + item.rank : ''}">
                  ${item.rank === 1 ? '🥇' : item.rank === 2 ? '🥈' : item.rank === 3 ? '🥉' : item.rank}
                </span>
              </td>
              <td>
                <div style="display: flex; align-items: center; gap: 10px;">
                  <img src="${item.avatar}" style="width: 32px; height: 32px; border-radius: 50%;" />
                  <span>${item.name} ${item.name === AppData.currentUser.name ? '(Bạn)' : ''}</span>
                </div>
              </td>
              <td>${item.class}</td>
              <td style="color: #7C3AED; font-weight: 800;">${item.xp} XP</td>
              <td>⭐ ${item.badgesCount} Huy hiệu</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div style="margin-top: 32px;">
        <h3 style="font-size: 16px; font-weight: 800; color: #1E293B; margin-bottom: 12px;">🎖️ Bộ Bộ Bộ Huy Hiệu Hệ Thống</h3>
        <div class="badge-collection-grid">
          ${AppData.badgesCatalog.map(b => `
            <div class="badge-item-card" style="${b.unlocked ? 'border-color: #7C3AED; background: #F3E8FF;' : 'opacity: 0.6;'}">
              <div class="badge-item-icon">${b.icon}</div>
              <div class="badge-item-name">${b.name}</div>
              <div style="font-size: 10px; color: #64748B; margin-top: 4px;">${b.desc}</div>
              <span class="hero-badge" style="font-size: 9px; padding: 2px 6px; margin-top: 6px; ${b.unlocked ? 'background:#7C3AED; color:white;' : 'background:#CBD5E1; color:#475569;'}">
                ${b.unlocked ? 'Đã Mở Khóa' : 'Chưa Mở Khóa'}
              </span>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    modalOverlay.classList.add('active');
  }
}

const gamificationEngine = new GamificationEngine();
