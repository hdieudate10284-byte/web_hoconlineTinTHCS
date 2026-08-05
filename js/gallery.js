/* ============================================================================
   STUDENT GALLERY & SUBMISSION SERVICE (TẦNG NGHIỆP VỤ QUẢN LÝ NỘP BÀI & DUYỆT SẢN PHẨM)
   ============================================================================ */

class GalleryEngine {
  renderGalleryModal() {
    const modalOverlay = document.getElementById('app-modal-overlay');
    const modalBody = document.getElementById('app-modal-body');

    const isTeacher = AppData.currentUser.role === 'teacher';

    modalBody.innerHTML = `
      <div style="margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center;">
        <div>
          <span class="hero-badge" style="background: #EDE9FE; color: #7C3AED;">🖼️ TRIỂN LÃM SẢN PHẨM HỌC SINH</span>
          <h2 style="font-size: 22px; font-weight: 800; color: #1E293B; margin-top: 4px;">Không gian Trưng bày & Duyệt Bài Nộp</h2>
        </div>
        ${!isTeacher ? `
          <button class="btn-primary" onclick="galleryEngine.showUploadForm()">
            📤 Nộp Sản Phẩm Mới
          </button>
        ` : ''}
      </div>

      <div id="gallery-form-container" style="display: none; background: #F8FAFC; padding: 16px; border-radius: 16px; border: 1px solid #CBD5E1; margin-bottom: 20px;">
        <h4 style="font-size: 15px; font-weight: 800; margin-bottom: 12px;">Form Nộp Bài An Toàn Số</h4>
        <div style="display: flex; flex-direction: column; gap: 10px;">
          <input type="text" id="sub-title" placeholder="Tên sản phẩm (Ví dụ: Poster Quy tắc An toàn số)" style="padding: 10px; border-radius: 8px; border: 1px solid #CBD5E1;" />
          <select id="sub-type" style="padding: 10px; border-radius: 8px; border: 1px solid #CBD5E1;">
            <option value="Infographic">Infographic / Poster</option>
            <option value="Presentation">Slide Thuyết trình</option>
            <option value="Mindmap">Sơ đồ Tư duy</option>
            <option value="Video">Video Ngắn</option>
          </select>
          <input type="text" id="sub-url" placeholder="Link ảnh hoặc sản phẩm minh họa" value="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=400&q=80" style="padding: 10px; border-radius: 8px; border: 1px solid #CBD5E1;" />
          <div style="text-align: right; margin-top: 8px;">
            <button class="btn-secondary" onclick="document.getElementById('gallery-form-container').style.display='none'">Hủy</button>
            <button class="btn-primary" onclick="galleryEngine.submitProduct()">Gửi Bài Nộp</button>
          </div>
        </div>
      </div>

      <div class="gallery-grid">
        ${AppData.submissions.map(item => `
          <div class="gallery-card">
            <img src="${item.fileUrl}" alt="${item.title}" />
            <div class="gallery-card-body">
              <div class="gallery-card-title">${item.title}</div>
              <div class="gallery-card-author">👤 ${item.studentName} (${item.class}) • ${item.type}</div>
              
              <div style="margin-top: 8px; display: flex; justify-content: space-between; align-items: center;">
                <span class="hero-badge" style="font-size: 10px; padding: 2px 8px; ${
                  item.status === 'approved' ? 'background:#D1FAE5; color:#065F46;' : 'background:#FEF3C7; color:#92400E;'
                }">
                  ${item.status === 'approved' ? '✅ Đã Duyệt' : '⏳ Chờ Duyệt'}
                </span>
                <button class="btn-secondary" style="padding: 4px 10px; font-size: 11px;" onclick="galleryEngine.likeSubmission(${item.id})">
                  ❤️ ${item.likes}
                </button>
              </div>

              ${isTeacher && item.status === 'pending' ? `
                <div style="margin-top: 10px; padding-top: 8px; border-top: 1px dashed #CBD5E1; display: flex; gap: 6px;">
                  <button class="btn-primary" style="flex: 1; font-size: 11px; padding: 6px;" onclick="galleryEngine.approveSubmission(${item.id})">
                    Duyệt Bài (+100 XP)
                  </button>
                </div>
              ` : ''}

              ${item.teacherFeedback ? `
                <div style="margin-top: 8px; font-size: 11px; background: #EDE9FE; color: #5B21B6; padding: 6px 10px; border-radius: 6px;">
                  💬 <strong>Giáo viên:</strong> ${item.teacherFeedback}
                </div>
              ` : ''}
            </div>
          </div>
        `).join('')}
      </div>
    `;

    modalOverlay.classList.add('active');
  }

  showUploadForm() {
    document.getElementById('gallery-form-container').style.display = 'block';
  }

  submitProduct() {
    const title = document.getElementById('sub-title').value;
    const type = document.getElementById('sub-type').value;
    const url = document.getElementById('sub-url').value;

    if (!title) {
      alert('Vui lòng nhập tên sản phẩm!');
      return;
    }

    const newSub = {
      id: Date.now(),
      studentName: AppData.currentUser.name,
      class: AppData.currentUser.class,
      title: title,
      type: type,
      status: "pending",
      fileUrl: url || "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=400&q=80",
      teacherFeedback: "",
      likes: 1
    };

    AppData.submissions.unshift(newSub);
    alert('Nộp bài thành công! Bài nộp đã chuyển đến thầy cô để kiểm duyệt.');
    this.renderGalleryModal();
  }

  approveSubmission(id) {
    const sub = AppData.submissions.find(s => s.id === id);
    if (sub) {
      sub.status = 'approved';
      sub.teacherFeedback = 'Bài nộp xuất sắc! Đã cộng 100 XP cho học sinh.';
      alert(`Đã duyệt bài nộp "${sub.title}"!`);
      this.renderGalleryModal();
    }
  }

  likeSubmission(id) {
    const sub = AppData.submissions.find(s => s.id === id);
    if (sub) {
      sub.likes++;
      this.renderGalleryModal();
    }
  }
}

const galleryEngine = new GalleryEngine();
