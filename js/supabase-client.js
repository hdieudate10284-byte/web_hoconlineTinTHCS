/* ============================================================================
   SUPABASE CLIENT & DATABASE SERVICE (TẦNG KẾT NỐI CƠ SỞ DỮ LIỆU ĐÁM MÂY)
   Đã cấu hình sẵn thông tin dự án Supabase của Thầy/Cô
   Hỗ trợ cơ chế Fallback (Tự động chuyển đổi mượt mà giữa Online DB & Local Mock)
   ============================================================================ */

// THÔNG TIN KẾT NỐI SUPABASE CHÍNH THỨC CỦA DỰ ÁN
const DEFAULT_SUPABASE_URL = 'https://wkkphkdaqigzmmnpqpik.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indra3Boa2RhcWlnem1tbnBxcGlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYxMDAyNDksImV4cCI6MjEwMTY3NjI0OX0.cSNbUbxvWv8pBX7GCCZ9MveMD3vf0JirMTZnlOAKiDA';

class SupabaseService {
  constructor() {
    this.client = null;
    this.isConnected = false;
    this.hasTables = false;
    this.config = {
      url: localStorage.getItem('SUPABASE_URL') || DEFAULT_SUPABASE_URL,
      anonKey: localStorage.getItem('SUPABASE_ANON_KEY') || DEFAULT_SUPABASE_ANON_KEY
    };

    this.initClient();
  }

  // Khởi tạo Supabase Client
  initClient() {
    if (this.config.url && this.config.anonKey && window.supabase) {
      try {
        this.client = window.supabase.createClient(this.config.url, this.config.anonKey);
        this.isConnected = true;
        console.log('⚡ [Supabase] Đã kết nối thành công với Dự án:', this.config.url);
      } catch (err) {
        console.warn('⚠️ [Supabase] Lỗi khởi tạo client:', err);
        this.isConnected = false;
        this.client = null;
      }
    } else {
      this.isConnected = false;
      this.client = null;
    }
  }

  // Lưu cấu hình Supabase từ giao diện Web
  saveConfig(url, anonKey) {
    url = (url || '').trim();
    anonKey = (anonKey || '').trim();

    if (!url || !anonKey) {
      alert('Vui lòng nhập đầy đủ Supabase Project URL và Public Anon Key!');
      return false;
    }

    localStorage.setItem('SUPABASE_URL', url);
    localStorage.setItem('SUPABASE_ANON_KEY', anonKey);
    this.config.url = url;
    this.config.anonKey = anonKey;

    this.initClient();
    this.updateConnectionUI();
    return true;
  }

  // Khôi phục về thông tin mặc định
  resetToDefault() {
    localStorage.removeItem('SUPABASE_URL');
    localStorage.removeItem('SUPABASE_ANON_KEY');
    this.config.url = DEFAULT_SUPABASE_URL;
    this.config.anonKey = DEFAULT_SUPABASE_ANON_KEY;
    this.initClient();
    this.updateConnectionUI();
  }

  // Kiểm tra kết nối thực tế tới Database
  async testConnection() {
    if (!this.isConnected || !this.client) {
      return { success: false, message: 'Chưa có thông tin Supabase URL hoặc Anon Key!' };
    }

    try {
      const { data, error } = await this.client.from('curriculum_topics').select('id, title').limit(1);
      if (error) {
        if (error.code === 'PGRST205' || error.message.includes('not find the table')) {
          this.hasTables = false;
          return { 
            success: true, 
            needsSchema: true,
            message: 'Đã kết nối API Supabase thành công! Tuy nhiên Thầy/Cô cần chạy file database_schema.sql trong mục SQL Editor để tạo bảng dữ liệu.' 
          };
        }
        throw error;
      }
      this.hasTables = true;
      return { success: true, needsSchema: false, message: 'Kết nối Supabase thành công 100%! Dữ liệu đám mây đã sẵn sàng hoạt động.' };
    } catch (err) {
      console.error('Lỗi kiểm tra kết nối Supabase:', err);
      return { 
        success: false, 
        message: 'Lỗi kết nối: ' + (err.message || 'Kiểm tra lại URL, Anon Key hoặc kết nối mạng.') 
      };
    }
  }

  // Cập nhật trạng thái hiển thị trên giao diện người dùng
  async updateConnectionUI() {
    const statusPill = document.getElementById('supabase-status-pill');
    if (!statusPill) return;

    if (this.isConnected && this.client) {
      const testRes = await this.testConnection();
      if (testRes.needsSchema) {
        statusPill.innerHTML = '⚡ <strong>Supabase: Đã nối API (Cần nạp SQL)</strong>';
        statusPill.style.background = '#FEF3C7';
        statusPill.style.color = '#92400E';
        statusPill.style.borderColor = '#FCD34D';
      } else if (testRes.success) {
        statusPill.innerHTML = '🟢 <strong>Supabase Cloud: Đã kết nối 100%</strong>';
        statusPill.style.background = '#DCFCE7';
        statusPill.style.color = '#15803D';
        statusPill.style.borderColor = '#86EFAC';
      } else {
        statusPill.innerHTML = '🟡 <strong>Supabase: Chế độ Mock Data</strong>';
        statusPill.style.background = '#FEF9C3';
        statusPill.style.color = '#A16207';
        statusPill.style.borderColor = '#FDE047';
      }
    } else {
      statusPill.innerHTML = '🟡 <strong>Supabase: Chế độ Mock Data</strong>';
      statusPill.style.background = '#FEF9C3';
      statusPill.style.color = '#A16207';
      statusPill.style.borderColor = '#FDE047';
    }
  }

  // ============================================================================
  // CÁC HÀM TRUY VẤN VÀ ĐỒNG BỘ DỮ LIỆU THỰC TẾ VỚI SUPABASE
  // ============================================================================

  // 1. Tải danh mục Chủ đề học liệu và Bài học
  async fetchCurriculum() {
    if (!this.isConnected || !this.client) return AppData.curriculum;

    try {
      const { data: topics, error: topicErr } = await this.client
        .from('curriculum_topics')
        .select('*')
        .order('display_order', { ascending: true });

      if (topicErr || !topics || topics.length === 0) return AppData.curriculum;

      const { data: lessons, error: lessonErr } = await this.client
        .from('lessons')
        .select('*')
        .order('display_order', { ascending: true });

      const mergedCurriculum = topics.map(t => {
        const gradeLessons = (lessons || [])
          .filter(l => l.grade_level === t.grade_level)
          .map(l => ({
            id: l.lesson_code,
            title: l.title,
            duration: l.duration,
            xp: l.xp_reward,
            summary: l.summary
          }));

        const localMatch = AppData.curriculum.find(c => c.grade === t.grade_level);

        return {
          id: `grade-${t.grade_level}`,
          grade: t.grade_level,
          title: t.title,
          badgeText: t.badge_text || `CHỦ ĐỀ KHỐI ${t.grade_level}`,
          themeClass: t.theme_class || `card-grade-${t.grade_level}`,
          color: t.theme_color || '#7C3AED',
          symbol: t.symbol || '📘',
          description: t.description,
          lessons: gradeLessons.length > 0 ? gradeLessons : (localMatch ? localMatch.lessons : []),
          minigame: localMatch ? localMatch.minigame : null
        };
      });

      AppData.curriculum = mergedCurriculum;
      return mergedCurriculum;
    } catch (e) {
      console.warn('Đang sử dụng dữ liệu học liệu nội bộ:', e);
      return AppData.curriculum;
    }
  }

  // 2. Tải danh sách Sản phẩm Triển lãm của học sinh
  async fetchSubmissions() {
    if (!this.isConnected || !this.client) return AppData.submissions;

    try {
      const { data, error } = await this.client
        .from('submissions')
        .select('*')
        .order('id', { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        AppData.submissions = data.map(item => ({
          id: item.id,
          studentName: item.student_name,
          class: item.student_class,
          title: item.title,
          type: item.submission_type,
          fileUrl: item.file_url,
          status: item.status,
          teacherFeedback: item.teacher_feedback || '',
          likes: item.likes || 0
        }));
      }
      return AppData.submissions;
    } catch (e) {
      console.warn('Đang sử dụng danh sách sản phẩm nội bộ:', e);
      return AppData.submissions;
    }
  }

  // 3. Nộp sản phẩm mới lên Supabase
  async insertSubmission(subData) {
    if (!this.isConnected || !this.client) {
      AppData.submissions.unshift(subData);
      return { success: true, data: subData, isLocal: true };
    }

    try {
      const { data, error } = await this.client
        .from('submissions')
        .insert([{
          student_name: subData.studentName,
          student_class: subData.class,
          title: subData.title,
          submission_type: subData.type,
          file_url: subData.fileUrl,
          status: 'pending',
          teacher_feedback: '',
          likes: 1
        }])
        .select()
        .single();

      if (error) throw error;

      const formatted = {
        id: data.id,
        studentName: data.student_name,
        class: data.student_class,
        title: data.title,
        type: data.submission_type,
        fileUrl: data.file_url,
        status: data.status,
        teacherFeedback: data.teacher_feedback || '',
        likes: data.likes || 1
      };

      AppData.submissions.unshift(formatted);
      return { success: true, data: formatted, isLocal: false };
    } catch (e) {
      console.warn('Lưu tạm vào bộ nhớ do bảng Supabase chưa sẵn sàng:', e);
      AppData.submissions.unshift(subData);
      return { success: true, data: subData, isLocal: true, error: e.message };
    }
  }

  // 4. Giáo viên duyệt bài nộp trên Supabase
  async approveSubmission(submissionId, feedback) {
    if (this.isConnected && this.client) {
      try {
        await this.client
          .from('submissions')
          .update({
            status: 'approved',
            teacher_feedback: feedback || 'Bài nộp xuất sắc! Đã cộng 100 XP cho học sinh.'
          })
          .eq('id', submissionId);
      } catch (e) {
        console.warn('Lỗi cập nhật duyệt bài trên Supabase:', e);
      }
    }

    const sub = AppData.submissions.find(s => s.id === submissionId);
    if (sub) {
      sub.status = 'approved';
      sub.teacherFeedback = feedback || 'Bài nộp xuất sắc! Đã cộng 100 XP cho học sinh.';
    }
  }

  // 5. Thả tim tương tác Sản phẩm học sinh
  async likeSubmission(submissionId) {
    const sub = AppData.submissions.find(s => s.id === submissionId);
    if (!sub) return;

    sub.likes = (sub.likes || 0) + 1;

    if (this.isConnected && this.client) {
      try {
        await this.client
          .from('submissions')
          .update({ likes: sub.likes })
          .eq('id', submissionId);
      } catch (e) {
        console.warn('Lỗi cập nhật lượt like trên Supabase:', e);
      }
    }
  }

  // 6. Tải bảng vinh danh Leaderboard từ Supabase
  async fetchLeaderboard() {
    if (!this.isConnected || !this.client) return AppData.leaderboard;

    try {
      const { data, error } = await this.client
        .from('users')
        .select('*')
        .order('total_xp', { ascending: false })
        .limit(10);

      if (error || !data || data.length === 0) return AppData.leaderboard;

      AppData.leaderboard = data.map((u, idx) => ({
        rank: idx + 1,
        name: u.full_name,
        class: u.class_name,
        xp: u.total_xp,
        badgesCount: u.badges_count || 1,
        avatar: u.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=student${u.id}`
      }));

      return AppData.leaderboard;
    } catch (e) {
      console.warn('Đang hiển thị bảng xếp hạng nội bộ:', e);
      return AppData.leaderboard;
    }
  }

  // 7. Cập nhật điểm XP người dùng lên Supabase
  async addXp(addedXp, reason = 'Hoàn thành bài học / Minigame') {
    AppData.currentUser.xp += addedXp;
    if (AppData.currentUser.xp >= AppData.currentUser.level * 200) {
      AppData.currentUser.level += 1;
    }

    if (this.isConnected && this.client) {
      try {
        await this.client
          .from('users')
          .update({
            total_xp: AppData.currentUser.xp,
            current_level: AppData.currentUser.level
          })
          .eq('id', AppData.currentUser.id);

        await this.client
          .from('activity_logs')
          .insert([{
            user_id: AppData.currentUser.id,
            action_type: 'XP_GAIN',
            description: `${reason} (+${addedXp} XP)`,
            xp_gained: addedXp
          }]);
      } catch (e) {
        console.warn('Không thể đồng bộ điểm XP lên Supabase:', e);
      }
    }
  }

  // ============================================================================
  // GIAO DIỆN HỘP THOẠI CẤU HÌNH SUPABASE TRÊN GIAO DIỆN
  // ============================================================================
  renderConfigModal() {
    const modalOverlay = document.getElementById('app-modal-overlay');
    const modalBody = document.getElementById('app-modal-body');

    modalBody.innerHTML = `
      <div>
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
          <span class="hero-badge" style="background: #D1FAE5; color: #065F46; border-color: #A7F3D0;">
            ⚡ SUPABASE POSTGRESQL CLOUD DATABASE
          </span>
        </div>

        <h2 style="font-size: 22px; font-weight: 900; color: #1E293B; margin-bottom: 6px;">
          Thông Tin Dự Án Supabase Của Thầy/Cô
        </h2>
        <p style="font-size: 13px; color: #64748B; margin-bottom: 20px;">
          Hệ thống đã tự động liên kết với Project <strong>https://wkkphkdaqigzmmnpqpik.supabase.co</strong>
        </p>

        <div style="background: #F8FAFC; border: 1px solid #CBD5E1; border-radius: 16px; padding: 20px; margin-bottom: 20px;">
          <div style="margin-bottom: 14px;">
            <label style="display: block; font-size: 13px; font-weight: 700; color: #334155; margin-bottom: 6px;">
              🔗 Supabase Project URL:
            </label>
            <input type="text" id="supabase-url-input" 
              value="${this.config.url}" 
              placeholder="https://xyzabcdefghijklmno.supabase.co" 
              style="width: 100%; padding: 10px 14px; border-radius: 10px; border: 1px solid #CBD5E1; font-family: monospace; font-size: 13px;" />
          </div>

          <div style="margin-bottom: 16px;">
            <label style="display: block; font-size: 13px; font-weight: 700; color: #334155; margin-bottom: 6px;">
              🔑 Supabase Anon / Public API Key (Client Safe):
            </label>
            <input type="password" id="supabase-key-input" 
              value="${this.config.anonKey}" 
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." 
              style="width: 100%; padding: 10px 14px; border-radius: 10px; border: 1px solid #CBD5E1; font-family: monospace; font-size: 13px;" />
          </div>

          <div id="connection-test-result" style="display: none; padding: 12px; border-radius: 10px; font-size: 13px; font-weight: 600; margin-bottom: 16px;"></div>

          <div style="display: flex; gap: 10px; flex-wrap: wrap;">
            <button class="btn-primary" onclick="supabaseService.handleTestModalConnection()">
              🔍 Kiểm Tra Kết Nối
            </button>
            <button class="btn-secondary" onclick="adminEngine.renderDatabaseSchemaModal()">
              📋 Lấy Mã SQL Khởi Tạo Bảng
            </button>
            <button class="btn-secondary" style="background: #F1F5F9; color: #475569;" onclick="supabaseService.handleResetDefault()">
              🔄 Khôi Phục Mặc Định
            </button>
          </div>
        </div>

        <div style="background: #EFF6FF; border: 1px solid #BFDBFE; border-radius: 12px; padding: 14px; font-size: 13px; color: #1E40AF; line-height: 1.6;">
          <strong>💡 Hướng dẫn tạo bảng tự động chỉ trong 3 giây:</strong><br>
          1. Nhấp vào nút <strong>"Lấy Mã SQL Khởi Tạo Bảng"</strong> ở trên hoặc xem file <code>database_schema.sql</code>.<br>
          2. Mở <strong>Supabase Dashboard ➔ SQL Editor</strong> trên trình duyệt của Thầy/Cô.<br>
          3. Dán toàn bộ mã và nhấn <strong>RUN</strong>. Website sẽ tự động nhận diện dữ liệu thời gian thực!
        </div>
      </div>
    `;

    modalOverlay.classList.add('active');
  }

  // Xử lý kiểm tra kết nối từ Modal
  async handleTestModalConnection() {
    const url = document.getElementById('supabase-url-input').value;
    const key = document.getElementById('supabase-key-input').value;
    this.saveConfig(url, key);

    const testRes = await this.testConnection();
    const resultBox = document.getElementById('connection-test-result');
    resultBox.style.display = 'block';

    if (testRes.needsSchema) {
      resultBox.style.background = '#FEF3C7';
      resultBox.style.color = '#92400E';
      resultBox.style.border = '1px solid #FCD34D';
      resultBox.innerHTML = '⚡ ' + testRes.message;
    } else if (testRes.success) {
      resultBox.style.background = '#DCFCE7';
      resultBox.style.color = '#15803D';
      resultBox.style.border = '1px solid #86EFAC';
      resultBox.innerHTML = '🎉 ' + testRes.message;

      // Đồng bộ lại giao diện
      await this.syncAllData();
    } else {
      resultBox.style.background = '#FEE2E2';
      resultBox.style.color = '#991B1B';
      resultBox.style.border = '1px solid #FECACA';
      resultBox.innerHTML = '⚠️ ' + testRes.message;
    }
  }

  handleResetDefault() {
    this.resetToDefault();
    alert('Đã khôi phục cài đặt kết nối về Dự án Supabase chính thức!');
    this.renderConfigModal();
  }

  // Tải lại toàn bộ dữ liệu từ Supabase lên giao diện
  async syncAllData() {
    await this.fetchCurriculum();
    await this.fetchSubmissions();
    await this.fetchLeaderboard();
    mainController.renderGradeCards();
    mainController.updateHeaderProfile();
    this.updateConnectionUI();
  }
}

const supabaseService = new SupabaseService();
