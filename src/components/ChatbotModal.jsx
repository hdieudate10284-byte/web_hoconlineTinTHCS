/* ============================================================================
   CHATBOT & XỬ LÝ TÌNH HUỐNG AN TOÀN SỐ (REACT 18 COMPONENT)
   Nhúng trực tiếp Cutebot AI: https://home.aiphocap.vn/chat/cutebot-xu-ly-tinh-huong-2358
   ============================================================================ */

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export const CUTEBOT_EXTERNAL_URL = 'https://home.aiphocap.vn/chat/cutebot-xu-ly-tinh-huong-2358';

// Ngân hàng tình huống mẫu & câu trả lời chuẩn kiến thức Tin học THCS (Chủ đề D)
const SITUATION_PRESETS = [
  {
    id: 1,
    category: 'Khối 6 — An toàn số',
    icon: '🚨',
    title: 'Người lạ hỏi xin mật khẩu & OTP nhận quà',
    question: 'Có người lạ nhắn tin bảo em trúng thưởng iPhone và yêu cầu đưa mật khẩu tài khoản + mã OTP, em nên làm gì?',
    answer: `⚠️ **CẢNH BÁO LỪA ĐẢO NGHIÊM TRỌNG!**

Em tuyệt đối **KHÔNG** cung cấp mật khẩu, mã OTP hay thông tin cá nhân cho người lạ!

**3 Bước xử lý an toàn ngay lập tức:**
1. **Không tin & Không làm theo:** Không nhấn vào bất kỳ đường link lạ nào được gửi kèm.
2. **Chụp màn hình & Báo cho người lớn:** Báo ngay cho Bố Mẹ, Thầy Cô giáo chủ nhiệm hoặc Thầy Cô Tin học.
3. **Chặn tài khoản:** Bấm chặn *(Block)* và báo cáo *(Report)* tài khoản lừa đảo đó trên mạng xã hội.

💡 *Ghi nhớ:* Mật khẩu và mã OTP giống như chìa khóa nhà em, tuyệt đối không đưa cho người lạ!`
  },
  {
    id: 2,
    category: 'Khối 6 — Ứng xử mạng',
    icon: '🛡️',
    title: 'Bị bạn bè đăng ảnh chế giễu trên Facebook/Zalo',
    question: 'Em phát hiện có bạn trong trường lấy ảnh em rồi chỉnh sửa chế giễu đăng lên nhóm mạng xã hội, em xử lý sao?',
    answer: `🤝 **HƯỚNG DẪN XỬ LÝ HÀNH VI BẮT NẠT MẠNG (CYBERBULLYING):**

Hành vi tự ý dùng ảnh người khác để chế giễu là vi phạm văn hóa ứng xử và quyền riêng tư!

**Các bước em cần thực hiện:**
1. **Giữ bình tĩnh & Lưu bằng chứng:** Chụp ảnh màn hình các tin nhắn, bài đăng chế giễu làm bằng chứng (không đáp trả bằng từ ngữ thô tục).
2. **Yêu cầu gỡ bài:** Nhắn tin lịch sự yêu cầu bạn gỡ bài đăng và ảnh chế.
3. **Báo cáo Thầy Cô & Nhà trường:** Nếu bạn không gỡ, hãy gửi bằng chứng cho Thầy Cô giáo hoặc Ban Giám Hiệu để nhà trường hỗ trợ giải quyết hòa nhã.
4. **Báo cáo bài viết trên MXH:** Bấm nút *Báo cáo vi phạm (Report)* bài viết đó.`
  },
  {
    id: 3,
    category: 'Khối 7 — Bản quyền số',
    icon: '📜',
    title: 'Lấy hình ảnh Google làm bài thuyết trình',
    question: 'Khi tải ảnh trên Google Images về làm Slide bài tập Tin học trình chiếu cho lớp, em có bị vi phạm bản quyền không?',
    answer: `📖 **QUY TẮC BẢN QUYỀN & TRÍCH DẪN CHUẨN HỌC THUẬT:**

Theo Luật Sở hữu trí tuệ và kiến thức Tin học Khối 7:

**1. Trường hợp hợp lệ:**
- Em được phép sử dụng hình ảnh cho mục đích **Học tập & Nghiên cứu phi thương mại**.
- **Bắt buộc phải trích dẫn nguồn:** Ghi rõ đường link gốc hoặc tên tác giả phía dưới hình ảnh (Ví dụ: *Nguồn: Wikipedia / Photo by Unsplash*).

**2. Khuyên dùng:**
- Nên tìm ảnh có giấy phép mở **Creative Commons (CC)** hoặc chọn công cụ lọc *"Giấy phép Creative Commons"* trên Google Images để đảm bảo 100% hợp pháp!`
  },
  {
    id: 4,
    category: 'Khối 8 — An ninh mạng',
    icon: '🔑',
    title: 'Cách tạo mật khẩu mạnh không lo hacker dò',
    question: 'Làm thế nào để tạo một mật khẩu vừa mạnh, vừa khó bị bẻ khóa mà bản thân em lại dễ nhớ?',
    answer: `💡 **BÍ QUYẾT TẠO MẬT KHẨU MẠNH (STRONG PASSWORD):**

Mật khẩu yếu như \`123456\` hay \`nguyenvanan\` chỉ mất 1 giây để hacker bẻ khóa!

**Quy tắc "Mật khẩu 4 thành phần":**
- Đủ ít nhất **12 ký tự**.
- Kết hợp: **Chữ hoa** + **Chữ thường** + **Chữ số** + **Ký tự đặc biệt** (\`@\`, \`#\`, \`!\`, \`$\`).

👉 **Mẹo tạo cụm mật khẩu dễ nhớ cho em:**
Lấy chữ cái đầu của 1 câu thơ/câu hát em thích + Năm sinh + Ký tự đặc biệt.
*Ví dụ câu:* "Trường THCS Nguyễn Huệ Đà Nẵng 2026!" ➡️ \`TTHCSNH@DN2026!\``
  },
  {
    id: 5,
    category: 'Khối 9 — Luật An ninh mạng',
    icon: '⚖️',
    title: 'Tung tin đồn thất thiệt trên TikTok/Facebook',
    question: 'Thấy tin đồn lạ trên mạng chưa rõ thật giả, nếu em đăng lại lên TikTok hoặc Facebook có bị phạt không?',
    answer: `🎓 **NỘI DUNG LUẬT AN NINH MẠNG 2018 (KHỐI 9):**

CÓ! Đăng tải hoặc chia sẻ thông tin sai sự thật là **VI PHẠM PHÁP LUẬT**!

**Theo Nghị định 15/2020/NĐ-CP & Luật An ninh mạng 2018:**
- Hành vi cung cấp, chia sẻ thông tin giả mạo, sai sự thật, xuyên tạc, vu khống có thể bị xử phạt hành chính từ **10.000.000đ đến 20.000.000đ** hoặc xử lý hình sự tùy mức độ hậu quả.

**Quy tắc "3 giây suy ngẫm" cho Học sinh:**
1. **Kiểm chứng nguồn tin:** Tin có từ Báo chính thống (Chính phủ, VTV, Báo Mới...) không?
2. **Không chia sẻ cảm tính:** Không bấm Like/Share khi chưa biết rõ sự thật.
3. **Lan tỏa điều tích cực:** Hãy là công dân số có trách nhiệm!`
  }
];

export const ChatbotModal = ({ isOpen, onClose }) => {
  const { currentUser, addXP } = useAuth();
  const [activeTab, setActiveTab] = useState('cutebot'); // 'cutebot' | 'internal'
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: `Xin chào **${currentUser?.name || 'em'}**! 🤖 Em đang gặp thắc mắc hoặc tình huống nào trên môi trường mạng cần **Trợ lý AI An Toàn Số** tư vấn xử lý không?`,
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatBottomRef = useRef(null);

  useEffect(() => {
    if (isOpen && activeTab === 'internal') {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, activeTab]);

  if (!isOpen) return null;

  // Xử lý gửi tin nhắn mới
  const handleSend = (textToSend) => {
    const query = (textToSend || inputText).trim();
    if (!query) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      let botResponseText = '';
      const lowerQ = query.toLowerCase();

      if (lowerQ.includes('chào') || lowerQ.includes('hi') || lowerQ.includes('hello')) {
        botResponseText = `👋 Xin chào em! Em cần Trợ lý AI hỗ trợ giải đáp bài học Tin học hay tư vấn cách xử lý tình huống an toàn số nào hôm nay? Em hãy nhập câu hỏi hoặc chọn các tình huống mẫu bên trên nhé! 🤖`;
      } else if (lowerQ.includes('nộp bài') || lowerQ.includes('bài tập') || lowerQ.includes('triển lãm') || lowerQ.includes('sản phẩm')) {
        botResponseText = `🖼️ **HƯỚNG DẪN NỘP BÀI TẬP & SẢN PHẨM HỌC SINH:**

1. **Bước 1:** Bấm vào nút **"🖼️ Triển Lãm (Nộp Bài)"** trên thanh menu phía trên.
2. **Bước 2:** Chọn loại sản phẩm *(Infographic Poster / Slide Thuyết trình / Sơ đồ tư duy Mindmap)*.
3. **Bước 3:** Dán đường dẫn file hoặc tải ảnh sản phẩm lên và bấm **"Gửi bài nộp"**.
4. **Bước 4:** Bài nộp sẽ được Cô Nguyễn Thị Huyền Diệu duyệt và thưởng ngay +100 XP danh dự! 🌟`;
      } else if (lowerQ.includes('xp') || lowerQ.includes('điểm') || lowerQ.includes('danh hiệu') || lowerQ.includes('huy hiệu') || lowerQ.includes('vinh danh')) {
        botResponseText = `⭐ **BÍ QUYẾT TÍCH LŨY ĐIỂM XP & MỞ KHÓA HUY HIỆU:**

- **Xem xong 1 bài học:** Nhận ngay **+50 XP**.
- **Hoàn thành Minigame trắc nghiệm:** Nhận ngay **+100 XP**.
- **Nộp sản phẩm bài tập được duyệt:** Nhận ngay **+100 XP**.
- **Hỏi đáp tình huống cùng Chatbot AI:** Nhận ngay **+10 XP**.

🏆 Tích lũy đủ XP em sẽ được leo lên **Bảng Vinh Danh Top Học Sinh** và nhận các Huy hiệu quý giá: *🛡️ Vệ sĩ Số, 📜 Hiệp sĩ Tác quyền, 🔒 Thần đồng An ninh!*`;
      } else {
        const matchedPreset = SITUATION_PRESETS.find(p => 
          lowerQ.includes(p.title.toLowerCase()) || 
          lowerQ.includes(p.question.toLowerCase())
        );

        if (matchedPreset) {
          botResponseText = matchedPreset.answer;
        } else {
          botResponseText = `🤖 **TRỢ LÝ AI ĐÃ GHI NHẬN CÂU HỎI THẮC MẮC CỦA EM:**

Nội dung thắc mắc: *"${query}"*

👉 Em cũng có thể sử dụng **Cutebot AI Xử Lý Tình Huống** trực tiếp tại đường link: 
🔗 [https://home.aiphocap.vn/chat/cutebot-xu-ly-tinh-huong-2358](${CUTEBOT_EXTERNAL_URL})`;
        }
      }

      const botMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: botResponseText,
        time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
      addXP(10, 'Hỏi đáp & Xử lý tình huống An toàn số');
    }, 500);
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target.className === 'modal-overlay' && onClose()}>
      <div 
        className="modal-container" 
        style={{ 
          maxWidth: '960px', 
          width: '95%',
          height: '85vh', 
          maxHeight: '780px', 
          display: 'flex', 
          flexDirection: 'column', 
          padding: '0', 
          overflow: 'hidden', 
          borderRadius: '24px',
          boxShadow: '0 20px 50px rgba(79, 70, 229, 0.35)'
        }}
      >
        
        {/* HEADER CHATBOX */}
        <div style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)', color: 'white', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '44px', height: '44px', background: '#FFFFFF', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', boxShadow: '0 4px 10px rgba(0,0,0,0.15)' }}>
              🤖
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 900, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                GIẢI ĐÁP THẮC MẮC &amp; TRỢ GIÚP — CUTEBOT AI
              </h3>
              <p style={{ fontSize: '12.5px', color: '#C7D2FE', margin: '2px 0 0 0' }}>
                Hệ thống Cutebot AI • Hỗ trợ học sinh THCS Nguyễn Huệ An Toàn Số 24/7
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <a 
              href={CUTEBOT_EXTERNAL_URL} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                background: '#F59E0B',
                color: '#78350F',
                padding: '7px 16px',
                borderRadius: '999px',
                fontSize: '12.5px',
                fontWeight: 900,
                textDecoration: 'none',
                boxShadow: '0 4px 12px rgba(245, 158, 11, 0.4)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span>🚀</span> Mở trang Cutebot gốc ↗
            </a>
            <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', width: '36px', height: '36px', borderRadius: '50%', fontSize: '18px', cursor: 'pointer', fontWeight: 'bold' }}>✕</button>
          </div>
        </div>

        {/* TAB CHUYỂN ĐỔI CHẾ ĐỘ CHAT */}
        <div style={{ background: '#EEF2FF', padding: '10px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #C7D2FE', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => setActiveTab('cutebot')}
              style={{
                padding: '8px 18px',
                borderRadius: '12px',
                fontWeight: 900,
                fontSize: '13px',
                border: 'none',
                cursor: 'pointer',
                background: activeTab === 'cutebot' ? 'linear-gradient(135deg, #4F46E5, #7C3AED)' : '#FFFFFF',
                color: activeTab === 'cutebot' ? 'white' : '#475569',
                boxShadow: activeTab === 'cutebot' ? '0 4px 12px rgba(79, 70, 229, 0.3)' : '0 2px 4px rgba(0,0,0,0.05)',
                transition: 'all 0.2s'
              }}
            >
              🌐 Cutebot AI Trực Tuyến (Trực Tiếp)
            </button>
            <button
              onClick={() => setActiveTab('internal')}
              style={{
                padding: '8px 18px',
                borderRadius: '12px',
                fontWeight: 900,
                fontSize: '13px',
                border: 'none',
                cursor: 'pointer',
                background: activeTab === 'internal' ? 'linear-gradient(135deg, #4F46E5, #7C3AED)' : '#FFFFFF',
                color: activeTab === 'internal' ? 'white' : '#475569',
                boxShadow: activeTab === 'internal' ? '0 4px 12px rgba(79, 70, 229, 0.3)' : '0 2px 4px rgba(0,0,0,0.05)',
                transition: 'all 0.2s'
              }}
            >
              💡 Ngân Hàng Tình Huống Mẫu
            </button>
          </div>

          <div style={{ fontSize: '12px', color: '#6366F1', fontWeight: 700 }}>
            🔗 Link Cutebot: <a href={CUTEBOT_EXTERNAL_URL} target="_blank" rel="noopener noreferrer" style={{ color: '#4F46E5', fontWeight: 800 }}>home.aiphocap.vn/.../cutebot-2358</a>
          </div>
        </div>

        {/* PHẦN NỘI DUNG CHÍNH */}
        {activeTab === 'cutebot' ? (
          <div style={{ flex: 1, position: 'relative', width: '100%', height: '100%', background: '#FFFFFF' }}>
            <iframe
              src={CUTEBOT_EXTERNAL_URL}
              title="Cutebot AI Xử Lý Tình Huống - THCS Nguyễn Huệ"
              style={{
                width: '100%',
                height: '100%',
                border: 'none'
              }}
              allow="microphone; camera; clipboard-write; autoplay; geolocation"
            />
          </div>
        ) : (
          <div style={{ flex: 1, padding: '20px', overflowY: 'auto', background: '#F8FAFC', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* BANNER GỢI Ý CÁC TÌNH HUỐNG THƯỜNG GẶP */}
            <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', padding: '14px', borderRadius: '16px', marginBottom: '8px' }}>
              <span style={{ fontSize: '12.5px', fontWeight: 800, color: '#1E40AF', display: 'block', marginBottom: '8px' }}>
                💡 THẮC MẮC &amp; TÌNH HUỐNG MẪU (Bấm để trợ lý giải đáp ngay):
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {SITUATION_PRESETS.map(preset => (
                  <button
                    key={preset.id}
                    onClick={() => handleSend(preset.question)}
                    style={{
                      background: '#FFFFFF',
                      border: '1px solid #93C5FD',
                      color: '#1E3A8A',
                      padding: '6px 12px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.04)',
                      transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = '#E0F2FE'}
                    onMouseOut={(e) => e.currentTarget.style.background = '#FFFFFF'}
                  >
                    <span>{preset.icon}</span>
                    <span>{preset.title}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* DANH SÁCH TIN NHẮN CHAT */}
            {messages.map(msg => (
              <div 
                key={msg.id} 
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start'
                }}
              >
                <div 
                  style={{ 
                    maxWidth: '85%', 
                    padding: '14px 18px', 
                    borderRadius: msg.sender === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                    background: msg.sender === 'user' ? 'linear-gradient(135deg, #4F46E5, #7C3AED)' : '#FFFFFF',
                    color: msg.sender === 'user' ? '#FFFFFF' : '#1E293B',
                    border: msg.sender === 'user' ? 'none' : '1px solid #E2E8F0',
                    boxShadow: '0 3px 10px rgba(0,0,0,0.05)',
                    fontSize: '13.5px',
                    lineHeight: '1.6',
                    whiteSpace: 'pre-wrap'
                  }}
                >
                  {msg.text}
                </div>
                <span style={{ fontSize: '11px', color: '#94A3B8', marginTop: '4px', padding: '0 6px' }}>
                  {msg.sender === 'user' ? 'Bạn' : 'Trợ lý AI'} • {msg.time}
                </span>
              </div>
            ))}

            {isTyping && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748B', fontSize: '13px', padding: '8px 12px' }}>
                <span>🤖 Trợ lý AI đang suy nghĩ câu trả lời...</span>
              </div>
            )}

            <div ref={chatBottomRef} />

            {/* KHUNG NHẬP CÂU HỎI / TÌNH HUỐNG */}
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              style={{ background: '#FFFFFF', padding: '14px 20px', borderRadius: '16px', border: '1px solid #E2E8F0', display: 'flex', gap: '10px', alignItems: 'center', marginTop: 'auto' }}
            >
              <input 
                type="text" 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Nhập thắc mắc hoặc mô tả tình huống an toàn số của em ở đây..."
                style={{ flex: 1, padding: '12px 18px', borderRadius: '14px', border: '1.5px solid #CBD5E1', fontSize: '14px', outline: 'none' }}
              />
              <button 
                type="submit" 
                className="btn-primary" 
                style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)', padding: '12px 20px', borderRadius: '14px', fontWeight: 800, fontSize: '14px' }}
              >
                Gửi 🚀
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
