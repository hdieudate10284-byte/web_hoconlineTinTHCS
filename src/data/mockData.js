/* ============================================================================
   DEFAULT CURRICULUM & MOCK STORE (HỌC LIỆU TIN HỌC THCS)
   ============================================================================ */

export const INITIAL_CURRICULUM = [
  {
    id: "grade-6",
    grade: 6,
    title: "An toàn thông tin trên internet",
    badgeText: "CHỦ ĐỀ KHỐI 6",
    themeClass: "card-grade-6",
    color: "#7C3AED",
    symbol: "Aá",
    description: "Quy tắc ứng xử văn minh trên không gian mạng, bảo vệ thông tin cá nhân & phòng chống bắt nạt trực tuyến.",
    lessons: [
      { id: "l6-1", title: "Tầm quan trọng của An toàn thông tin trên Internet", duration: "15 phút", xp: 50, summary: "Nhận thức về tầm quan trọng của việc bảo vệ thông tin và dữ liệu khi sử dụng Internet.", videoUrl: "https://www.youtube.com/watch?v=yrnF4i3D33w", documentUrl: "https://drive.google.com" },
      { id: "l6-2", title: "Bảo vệ thông tin & dữ liệu cá nhân", duration: "20 phút", xp: 60, summary: "Không tiết lộ số điện thoại, địa chỉ nhà, mật khẩu cho người lạ trên internet.", videoUrl: "https://www.youtube.com/watch?v=yrnF4i3D33w", documentUrl: "https://drive.google.com" },
      { id: "l6-3", title: "Thiết lập mật khẩu an toàn & Bảo mật tài khoản", duration: "20 phút", xp: 70, summary: "Phương pháp tạo mật khẩu mạnh và bảo vệ tài khoản cá nhân trực tuyến.", videoUrl: "https://www.youtube.com/watch?v=yrnF4i3D33w", documentUrl: "https://drive.google.com" },
      { id: "l6-4", title: "Nhận diện các rủi ro & Nguy cơ mất an toàn trên Internet", duration: "25 phút", xp: 80, summary: "Kỹ năng nhận diện các nguy cơ lừa đảo, mã độc và phòng chống mất an toàn thông tin trên mạng.", videoUrl: "https://www.youtube.com/watch?v=yrnF4i3D33w", documentUrl: "https://drive.google.com" }
    ],
    minigame: {
      id: "mg-6",
      title: "Minigame Khối 6: Thử thách Vệ sĩ An toàn số",
      questions: [
        {
          id: 1,
          text: "Khi nhận được tin nhắn từ người lạ yêu cầu gửi thông tin cá nhân & mật khẩu tài khoản, em nên làm gì?",
          options: [
            "A. Gửi ngay lập tức để nhận quà",
            "B. Báo cho bố mẹ/thầy cô và chặn người lạ",
            "C. Chia sẻ thông tin này cho các bạn trong lớp",
            "D. Nhắn tin nói chuyện làm quen thêm"
          ],
          correct: 1,
          explanation: "Tuyệt đối không chia sẻ thông tin cá nhân hay mật khẩu cho người lạ. Hãy báo ngay cho người lớn tin cậy!"
        },
        {
          id: 2,
          text: "Đâu là hành vi ứng xử văn minh trên môi trường mạng internet?",
          options: [
            "A. Sử dụng từ ngữ thô tục khi bình luận",
            "B. Tôn trọng ý kiến người khác và dùng ngôn ngữ lịch sự",
            "C. Đăng tải hình ảnh riêng tư của bạn bè mà chưa xin phép",
            "D. Công kích và thóa mạ người khác"
          ],
          correct: 1,
          explanation: "Ứng xử lịch sự, tôn trọng người khác là nét đẹp văn hóa số của học sinh THCS!"
        }
      ]
    }
  },
  {
    id: "grade-7",
    grade: 7,
    title: "Bản quyền & Tác quyền số",
    badgeText: "CHỦ ĐỀ KHỐI 7",
    themeClass: "card-grade-7",
    color: "#F59E0B",
    symbol: "📖",
    description: "Luật sở hữu trí tuệ, bản quyền tác giả, trích dẫn tài liệu hợp lệ & phần mềm nguồn mở.",
    lessons: [
      { id: "l7-1", title: "Sử dụng mạng xã hội an toàn", duration: "20 phút", xp: 60, summary: "Các nguyên tắc và kĩ năng sử dụng mạng xã hội an toàn, văn hóa và hiệu quả cho học sinh.", videoUrl: "https://www.youtube.com/watch?v=yrnF4i3D33w", documentUrl: "https://drive.google.com" },
      { id: "l7-2", title: "Tác hại và cách phòng tránh bệnh nghiện internet", duration: "25 phút", xp: 80, summary: "Nhận biết các dấu hiệu nghiện internet, game online và giải pháp cân bằng cuộc sống thực.", videoUrl: "https://www.youtube.com/watch?v=yrnF4i3D33w", documentUrl: "https://drive.google.com" }
    ],
    minigame: {
      id: "mg-7",
      title: "Minigame Khối 7: Đố vui Hiệp sĩ Tác quyền",
      questions: [
        {
          id: 1,
          text: "Khi sử dụng hình ảnh từ Internet vào bài thuyết trình học tập, em cần tuân thủ quy tắc nào?",
          options: [
            "A. Tự nhận là ảnh do mình tự chụp",
            "B. Trích dẫn rõ nguồn tác giả hoặc chọn ảnh có giấy phép CC",
            "C. Chỉnh sửa xóa logo tác giả",
            "D. Dùng thoải mái không cần quan tâm tác quyền"
          ],
          correct: 1,
          explanation: "Trích dẫn nguồn hoặc dùng tài nguyên Creative Commons thể hiện sự tôn trọng bản quyền tác giả."
        }
      ]
    }
  },
  {
    id: "grade-8",
    grade: 8,
    title: "Lừa đảo & An ninh mạng",
    badgeText: "CHỦ ĐỀ KHỐI 8",
    themeClass: "card-grade-8",
    color: "#0284C7",
    symbol: "💡",
    description: "Nhận diện tin nhắn lừa đảo Phishing, nguyên tắc đặt mật khẩu mạnh, 2FA & phòng tránh Virus/Malware.",
    lessons: [
      { id: "l8-1", title: "Biểu hiện vi phạm khi sử dụng công nghệ kĩ thuật số.", duration: "20 phút", xp: 70, summary: "Nhận biết các biểu hiện vi phạm đạo đức, pháp luật và văn hóa khi sử dụng công nghệ kỹ thuật số.", videoUrl: "https://www.youtube.com/watch?v=yrnF4i3D33w", documentUrl: "https://drive.google.com" },
      { id: "l8-2", title: "Tuân thủ những quy định về đạo đức, văn hóa và pháp luật khi tạo ra sản phẫm số", duration: "20 phút", xp: 70, summary: "Nắm vững các quy định về đạo đức, văn hóa và pháp luật khi sáng tạo và chia sẻ sản phẩm số.", videoUrl: "https://www.youtube.com/watch?v=yrnF4i3D33w", documentUrl: "https://drive.google.com" },
      { id: "l8-3", title: "Phòng tránh Virus, Mã độc & Phần mềm độc hại", duration: "25 phút", xp: 80, summary: "Cài đặt phần mềm diệt virus và không tải file từ các trang web không rõ nguồn gốc.", videoUrl: "https://www.youtube.com/watch?v=yrnF4i3D33w", documentUrl: "https://drive.google.com" },
      { id: "l8-4", title: "An toàn khi sử dụng Wi-Fi công cộng", duration: "15 phút", xp: 60, summary: "Tránh giao dịch quan trọng trên mạng Wi-Fi mở tại quán cà phê, nơi công cộng.", videoUrl: "https://www.youtube.com/watch?v=yrnF4i3D33w", documentUrl: "https://drive.google.com" }
    ],
    minigame: {
      id: "mg-8",
      title: "Minigame Khối 8: Thách thức Thần đồng An ninh mạng",
      questions: [
        {
          id: 1,
          text: "Đâu là mật khẩu an toàn và khó bị bẻ khóa nhất?",
          options: [
            "A. 12345678",
            "B. nguyenvanan2010",
            "C. An@AnNinh#2026!Sec",
            "D. password"
          ],
          correct: 2,
          explanation: "Mật khẩu mạnh cần bao gồm chữ hoa, chữ thường, chữ số và ký tự đặc biệt!"
        }
      ]
    }
  },
  {
    id: "grade-9",
    grade: 9,
    title: "Dữ liệu & Luật An ninh mạng",
    badgeText: "CHỦ ĐỀ KHỐI 9",
    themeClass: "card-grade-9",
    color: "#EC4899",
    symbol: "🎓",
    description: "Luật An ninh mạng 2018, bảo vệ dữ liệu cá nhân, mã hóa dữ liệu & trách nhiệm của công dân số.",
    lessons: [
      { id: "l9-1", title: "Một số tác động tiêu cực của công nghệ số", duration: "25 phút", xp: 80, summary: "Nhận biết các tác động tiêu cực của công nghệ số đối với đời sống, sức khỏe và xã hội.", videoUrl: "https://www.youtube.com/watch?v=yrnF4i3D33w", documentUrl: "https://drive.google.com" },
      { id: "l9-2", title: "Sử dụng dịch vụ internet đúng luật", duration: "20 phút", xp: 70, summary: "Các quy định pháp luật và trách nhiệm công dân khi tham gia và sử dụng các dịch vụ Internet.", videoUrl: "https://www.youtube.com/watch?v=yrnF4i3D33w", documentUrl: "https://drive.google.com" },
      { id: "l9-3", title: "Mã hóa dữ liệu & An toàn lưu trữ Đám mây", duration: "25 phút", xp: 80, summary: "Ứng dụng công nghệ mã hóa đầu cuối và sao lưu dữ liệu an toàn trên Google Drive / OneDrive.", videoUrl: "https://www.youtube.com/watch?v=yrnF4i3D33w", documentUrl: "https://drive.google.com" },
      { id: "l9-4", title: "Trách nhiệm công dân trong kỷ nguyên số", duration: "20 phút", xp: 70, summary: "Xây dựng môi trường mạng lành mạnh, chia sẻ kiến thức tích cực cho cộng đồng.", videoUrl: "https://www.youtube.com/watch?v=yrnF4i3D33w", documentUrl: "https://drive.google.com" }
    ],
    minigame: {
      id: "mg-9",
      title: "Minigame Khối 9: Chuyên gia Luật An ninh mạng",
      questions: [
        {
          id: 1,
          text: "Luật An ninh mạng 2018 nghiêm cấm những hành vi nào sau đây?",
          options: [
            "A. Học tập và tra cứu thông tin chính thống",
            "B. Phát tán thông tin sai sự thật, xuyên tạc, xúc phạm danh dự tổ chức/cá nhân",
            "C. Chia sẻ bài học hữu ích cho bạn bè",
            "D. Nộp bài tập tin học qua hệ thống trực tuyến"
          ],
          correct: 1,
          explanation: "Tung tin giả, xuyên tạc thông tin là hành vi vi phạm nghiêm trọng Luật An ninh mạng."
        }
      ]
    }
  }
];

export const INITIAL_SUBMISSIONS = [
  {
    id: 101,
    studentName: "Nguyễn Văn An",
    class: "6A1",
    title: "Poster: 5 Quy tắc Vàng An toàn Số",
    type: "Infographic",
    status: "approved",
    fileUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80",
    teacherFeedback: "Poster thiết kế rất sinh động, bố cục nét và ý tưởng xuất sắc!",
    likes: 24
  },
  {
    id: 102,
    studentName: "Trần Thị Bình",
    class: "7B2",
    title: "Slide Thuyết trình: Bản quyền Phần mềm Nguồn mở",
    type: "Presentation",
    status: "approved",
    fileUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80",
    teacherFeedback: "Trích dẫn tài nguyên chuẩn xác. Đạt điểm A+!",
    likes: 18
  },
  {
    id: 103,
    studentName: "Lê Hoàng Cường",
    class: "8C3",
    title: "Sơ đồ Tư duy: Cách phòng chống Phishing Email",
    type: "Mindmap",
    status: "pending",
    fileUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=400&q=80",
    teacherFeedback: "",
    likes: 5
  }
];

export const INITIAL_LEADERBOARD = [
  { rank: 1, name: "Phạm Mỹ Duyên", class: "9D1", xp: 980, badgesCount: 5, avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=duyen" },
  { rank: 2, name: "Trần Thị Bình", class: "7B2", xp: 720, badgesCount: 4, avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=binh" },
  { rank: 3, name: "Nguyễn Văn An", class: "6A1", xp: 450, badgesCount: 2, avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=student1" },
  { rank: 4, name: "Lê Hoàng Cường", class: "8C3", xp: 310, badgesCount: 1, avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=cuong" }
];

export const BADGES_CATALOG = [
  { name: "🛡️ Vệ sĩ Số", desc: "Hoàn thành bài học & minigame Khối 6", icon: "🛡️", unlocked: true },
  { name: "📜 Hiệp sĩ Tác quyền", desc: "Nắm vững luật sở hữu trí tuệ Khối 7", icon: "📜", unlocked: true },
  { name: "🔒 Thần đồng An ninh", desc: "Vượt qua thử thách nhận diện lừa đảo Khối 8", icon: "🔒", unlocked: false },
  { name: "⚖️ Chuyên gia Luật Số", desc: "Thành thạo Luật An ninh mạng Khối 9", icon: "⚖️", unlocked: false }
];

export const INITIAL_ANALYTICS_STATS = {
  gradeStats: {
    6: { lessonViews: 142, gameViews: 98 },
    7: { lessonViews: 115, gameViews: 76 },
    8: { lessonViews: 189, gameViews: 134 },
    9: { lessonViews: 164, gameViews: 112 }
  },
  lessonStats: {
    "l6-1": { title: "Quy tắc ứng xử văn minh trên mạng (Netiquette)", grade: 6, views: 58 },
    "l6-2": { title: "Bảo vệ bí mật thông tin cá nhân", grade: 6, views: 42 },
    "l6-3": { title: "Nhận diện & Phòng chống Cyberbullying", grade: 6, views: 76 },
    "l6-4": { title: "Phân biệt tin thật & tin giả (Fake News)", grade: 6, views: 64 },
    "l7-1": { title: "Sử dụng mạng xã hội an toàn", grade: 7, views: 35 },
    "l7-2": { title: "Cách trích dẫn tài liệu & hình ảnh chuẩn", grade: 7, views: 48 },
    "l7-3": { title: "Phần mềm thương mại vs Phần mềm nguồn mở", grade: 7, views: 29 },
    "l7-4": { title: "Giấy phép Creative Commons (CC) phổ biến", grade: 7, views: 31 },
    "l8-1": { title: "Biểu hiện vi phạm khi sử dụng công nghệ kĩ thuật số.", grade: 8, views: 92 },
    "l8-2": { title: "Tuân thủ những quy định về đạo đức, văn hóa và pháp luật khi tạo ra sản phẫm số", grade: 8, views: 85 },
    "l8-3": { title: "Phòng tránh Virus, Mã độc & Phần mềm độc hại", grade: 8, views: 67 },
    "l8-4": { title: "An toàn khi sử dụng Wi-Fi công cộng", grade: 8, views: 44 },
    "l9-1": { title: "Một số tác động tiêu cực của công nghệ số", grade: 9, views: 78 },
    "l9-2": { title: "Sử dụng dịch vụ internet đúng luật", grade: 9, views: 65 },
    "l9-3": { title: "Mã hóa dữ liệu & An toàn lưu trữ Đám mây", grade: 9, views: 52 },
    "l9-4": { title: "Trách nhiệm công dân trong kỷ nguyên số", grade: 9, views: 41 }
  },
  gameStats: {
    "mg-6": { title: "Minigame Khối 6: Thử thách Vệ sĩ An toàn số", grade: 6, views: 98 },
    "mg-7": { title: "Minigame Khối 7: Đố vui Hiệp sĩ Tác quyền", grade: 7, views: 76 },
    "mg-8": { title: "Minigame Khối 8: Thách thức Thần đồng An ninh mạng", grade: 8, views: 134 },
    "mg-9": { title: "Minigame Khối 9: Chuyên gia Luật An ninh mạng", grade: 9, views: 112 }
  },
  classStats: {
    "6/1": { grade: 6, lessonViews: 85, gameViews: 58 },
    "6/2": { grade: 6, lessonViews: 57, gameViews: 40 },
    "7/1": { grade: 7, lessonViews: 68, gameViews: 42 },
    "7/2": { grade: 7, lessonViews: 47, gameViews: 34 },
    "8/1": { grade: 8, lessonViews: 112, gameViews: 78 },
    "8/2": { grade: 8, lessonViews: 77, gameViews: 56 },
    "9/1": { grade: 9, lessonViews: 95, gameViews: 64 },
    "9/2": { grade: 9, lessonViews: 69, gameViews: 48 }
  },
  studentLogs: [
    { id: "st-1", name: "Nguyễn Văn An", class: "6/1", grade: 6, lessonViews: 12, gameViews: 8, xp: 450, badge: "🛡️ Vệ sĩ Số", lastActive: "Vừa xong" },
    { id: "st-2", name: "Trần Bảo Ngọc", class: "6/1", grade: 6, lessonViews: 10, gameViews: 6, xp: 380, badge: "🛡️ Vệ sĩ Số", lastActive: "5 phút trước" },
    { id: "st-3", name: "Lê Minh Trí", class: "6/2", grade: 6, lessonViews: 8, gameViews: 5, xp: 290, badge: "🛡️ Vệ sĩ Số", lastActive: "15 phút trước" },
    { id: "st-4", name: "Phạm Gia Hưng", class: "6/2", grade: 6, lessonViews: 7, gameViews: 4, xp: 250, badge: "Tân thủ", lastActive: "1 giờ trước" },
    { id: "st-5", name: "Hoàng Thu Thảo", class: "6/3", grade: 6, lessonViews: 9, gameViews: 7, xp: 340, badge: "🛡️ Vệ sĩ Số", lastActive: "30 phút trước" },
    { id: "st-6", name: "Trần Thị Bình", class: "7/1", grade: 7, lessonViews: 14, gameViews: 9, xp: 720, badge: "📜 Hiệp sĩ Tác quyền", lastActive: "Hôm nay" },
    { id: "st-7", name: "Nguyễn Hoàng Nam", class: "7/1", grade: 7, lessonViews: 11, gameViews: 7, xp: 510, badge: "📜 Hiệp sĩ Tác quyền", lastActive: "Hôm nay" },
    { id: "st-8", name: "Võ Thanh Tùng", class: "7/2", grade: 7, lessonViews: 9, gameViews: 6, xp: 410, badge: "📜 Hiệp sĩ Tác quyền", lastActive: "Hôm qua" },
    { id: "st-9", name: "Đỗ Thị Mai", class: "7/2", grade: 7, lessonViews: 8, gameViews: 4, xp: 330, badge: "Tân thủ", lastActive: "2 ngày trước" },
    { id: "st-10", name: "Lê Hoàng Cường", class: "8/1", grade: 8, lessonViews: 16, gameViews: 11, xp: 850, badge: "🔒 Thần đồng An ninh", lastActive: "Vừa xong" },
    { id: "st-11", name: "Ngô Khánh Linh", class: "8/1", grade: 8, lessonViews: 15, gameViews: 10, xp: 790, badge: "🔒 Thần đồng An ninh", lastActive: "10 phút trước" },
    { id: "st-12", name: "Phan Quốc Bảo", class: "8/2", grade: 8, lessonViews: 12, gameViews: 8, xp: 620, badge: "🔒 Thần đồng An ninh", lastActive: "Hôm nay" },
    { id: "st-13", name: "Đặng Phương Thảo", class: "8/3", grade: 8, lessonViews: 10, gameViews: 7, xp: 480, badge: "Tân thủ", lastActive: "Hôm qua" },
    { id: "st-14", name: "Phạm Mỹ Duyên", class: "9/1", grade: 9, lessonViews: 18, gameViews: 14, xp: 980, badge: "⚖️ Chuyên gia Luật Số", lastActive: "Vừa xong" },
    { id: "st-15", name: "Bùi Anh Tuấn", class: "9/1", grade: 9, lessonViews: 16, gameViews: 12, xp: 890, badge: "⚖️ Chuyên gia Luật Số", lastActive: "20 phút trước" },
    { id: "st-16", name: "Trịnh Hoàng Yến", class: "9/2", grade: 9, lessonViews: 13, gameViews: 9, xp: 670, badge: "⚖️ Chuyên gia Luật Số", lastActive: "Hôm nay" },
    { id: "st-17", name: "Dương Quang Vinh", class: "9/2", grade: 9, lessonViews: 11, gameViews: 8, xp: 550, badge: "Tân thủ", lastActive: "Hôm qua" }
  ]
};
