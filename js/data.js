/* ============================================================================
   DATA STORE & MOCK DATA (HỌC LIỆU TIN HỌC THCS 3 TẦNG)
   ============================================================================ */

const AppData = {
  // Current active user state
  currentUser: {
    id: 1,
    name: "Nguyễn Văn An",
    role: "student", // student, teacher, admin
    class: "Lớp 6A1",
    grade: 6,
    xp: 450,
    level: 3,
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=student1",
    badges: ["🛡️ Vệ sĩ Số", "📜 Hiệp sĩ Tác quyền"]
  },

  // Curriculum Topics (Matching Frontend Architecture)
  curriculum: [
    {
      id: "grade-6",
      grade: 6,
      title: "Ứng xử & An toàn số",
      badgeText: "CHỦ ĐỀ KHỐI 6",
      themeClass: "card-grade-6",
      color: "#7C3AED",
      symbol: "Aá",
      description: "Quy tắc ứng xử văn minh trên không gian mạng, bảo vệ thông tin cá nhân & phòng chống bắt nạt trực tuyến.",
      lessons: [
        { id: "l6-1", title: "Quy tắc ứng xử văn minh trên mạng (Netiquette)", duration: "15 phút", xp: 50 },
        { id: "l6-2", title: "Bảo vệ bí mật thông tin cá nhân", duration: "20 phút", xp: 60 },
        { id: "l6-3", title: "Nhận diện & Phòng chống Cyberbullying", duration: "25 phút", xp: 80 }
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
        { id: "l7-1", title: "Khái niệm Bản quyền & Tác quyền số", duration: "15 phút", xp: 50 },
        { id: "l7-2", title: "Cách trích dẫn tài liệu & hình ảnh chuẩn", duration: "20 phút", xp: 60 },
        { id: "l7-3", title: "Phần mềm thương mại vs Phần mềm nguồn mở", duration: "25 phút", xp: 80 },
        { id: "l7-4", title: "Giấy phép Creative Commons (CC) phổ biến", duration: "20 phút", xp: 70 }
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
        { id: "l8-1", title: "Nhận diện chiêu trò lừa đảo giả mạo Phishing", duration: "20 phút", xp: 70 },
        { id: "l8-2", title: "Tạo lập mật khẩu mạnh & Xác thực 2 lớp (2FA)", duration: "20 phút", xp: 70 },
        { id: "l8-3", title: "Phòng tránh Virus, Mã độc & Phần mềm độc hại", duration: "25 phút", xp: 80 },
        { id: "l8-4", title: "An toàn khi sử dụng Wi-Fi công cộng", duration: "15 phút", xp: 60 }
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
        { id: "l9-1", title: "Nội dung cơ bản Luật An ninh mạng 2018", duration: "25 phút", xp: 80 },
        { id: "l9-2", title: "Bảo vệ dữ liệu cá nhân & Quyền riêng tư số", duration: "20 phút", xp: 70 },
        { id: "l9-3", title: "Mã hóa dữ liệu & An toàn lưu trữ Đám mây", duration: "25 phút", xp: 80 },
        { id: "l9-4", title: "Trách nhiệm công dân trong kỷ nguyên số", duration: "20 phút", xp: 70 }
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
  ],

  // Student Submissions Gallery (DB Student Products)
  submissions: [
    {
      id: 101,
      studentName: "Nguyễn Văn An",
      class: "6A1",
      title: "Poster: 5 Quy tắc Vàng An toàn Số",
      type: "Infographic",
      status: "approved", // pending, approved, rejected
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
  ],

  // Gamification Leaderboard
  leaderboard: [
    { rank: 1, name: "Phạm Mỹ Duyên", class: "9D1", xp: 980, badgesCount: 5, avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=duyen" },
    { rank: 2, name: "Trần Thị Bình", class: "7B2", xp: 720, badgesCount: 4, avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=binh" },
    { rank: 3, name: "Nguyễn Văn An", class: "6A1", xp: 450, badgesCount: 2, avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=student1" },
    { rank: 4, name: "Lê Hoàng Cường", class: "8C3", xp: 310, badgesCount: 1, avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=cuong" }
  ],

  // Badges catalog
  badgesCatalog: [
    { name: "🛡️ Vệ sĩ Số", desc: "Hoàn thành bài học & minigame Khối 6", icon: "🛡️", unlocked: true },
    { name: "📜 Hiệp sĩ Tác quyền", desc: "Nắm vững luật sở hữu trí tuệ Khối 7", icon: "📜", unlocked: true },
    { name: "🔒 Thần đồng An ninh", desc: "Vượt qua thử thách nhận diện lừa đảo Khối 8", icon: "🔒", unlocked: false },
    { name: "⚖️ Chuyên gia Luật Số", desc: "Thành thạo Luật An ninh mạng Khối 9", icon: "⚖️", unlocked: false }
  ]
};
