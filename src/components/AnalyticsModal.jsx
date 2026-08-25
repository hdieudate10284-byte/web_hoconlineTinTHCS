/* ============================================================================
   ANALYTICS & EXPORT EXCEL MODAL COMPONENT (REACT 18)
   Thống kê chi tiết từng Khối Lớp, Tên Lớp (6/1, 8/1...) & Tên Học Sinh Tham Gia
   ============================================================================ */

import React, { useState } from 'react';
import { useData } from '../context/DataContext';

export const AnalyticsModal = ({ isOpen, onClose }) => {
  const { analyticsStats } = useData();
  const [activeTab, setActiveTab] = useState('students'); // 'students' | 'classes' | 'overview' | 'lessons' | 'games'
  const [studentGradeFilter, setStudentGradeFilter] = useState('all'); // 'all' | '6' | '7' | '8' | '9'
  const [studentSearch, setStudentSearch] = useState('');

  if (!isOpen) return null;

  const { 
    gradeStats = {}, 
    lessonStats = {}, 
    gameStats = {}, 
    classStats = {}, 
    studentLogs = [] 
  } = analyticsStats || {};

  // Tính tổng lượt truy cập
  let totalLessonViews = 0;
  let totalGameViews = 0;
  const gradeList = [6, 7, 8, 9];

  gradeList.forEach(g => {
    totalLessonViews += (gradeStats[g]?.lessonViews || 0);
    totalGameViews += (gradeStats[g]?.gameViews || 0);
  });
  const grandTotal = totalLessonViews + totalGameViews;

  // Danh sách Bài giảng xem nhiều nhất
  const sortedLessons = Object.entries(lessonStats)
    .map(([id, item]) => ({ id, ...item }))
    .sort((a, b) => (b.views || 0) - (a.views || 0));

  // Danh sách Minigame chơi nhiều nhất
  const sortedGames = Object.entries(gameStats)
    .map(([id, item]) => ({ id, ...item }))
    .sort((a, b) => (b.views || 0) - (a.views || 0));

  // Danh sách Lớp cụ thể (6/1, 8/1...) sắp xếp theo lượt truy cập giảm dần
  const sortedClasses = Object.entries(classStats)
    .map(([className, item]) => ({
      className,
      grade: item.grade || (className.charAt(0) ? parseInt(className.charAt(0)) : 6),
      lessonViews: item.lessonViews || 0,
      gameViews: item.gameViews || 0,
      totalViews: (item.lessonViews || 0) + (item.gameViews || 0)
    }))
    .sort((a, b) => b.totalViews - a.totalViews);

  // Lọc và sắp xếp Danh sách Học Sinh tham gia
  const filteredStudents = (studentLogs || [])
    .filter(st => {
      const matchGrade = studentGradeFilter === 'all' || String(st.grade) === String(studentGradeFilter);
      const matchSearch = !studentSearch.trim() || 
        (st.name || '').toLowerCase().includes(studentSearch.toLowerCase()) ||
        (st.class || '').toLowerCase().includes(studentSearch.toLowerCase());
      return matchGrade && matchSearch;
    })
    .sort((a, b) => (b.xp || 0) - (a.xp || 0));

  const topLesson = sortedLessons[0];
  const topGame = sortedGames[0];
  const topClass = sortedClasses[0];

  // Hàm Xuất File Excel (.csv hỗ trợ UTF-8 cho Microsoft Excel)
  const handleExportExcel = () => {
    const today = new Date().toLocaleDateString('vi-VN');
    
    // Header & BOM cho UTF-8
    let csvContent = "\uFEFF";
    csvContent += `=== BÁO CÁO THỐNG KÊ CHI TIẾT HỌC LIỆU TIN HỌC THCS NGUYỄN HUỆ ===\n`;
    csvContent += `Ngày xuất báo cáo: ${today}\n`;
    csvContent += `Tác giả: Cô Nguyễn Thị Huyền Diệu (hdieudate10284@gmail.com)\n`;
    csvContent += `Chủ đề chung: Đạo đức; pháp luật và văn hóa trong môi trường số\n\n`;

    // Phần 1: Thống kê theo Khối Lớp
    csvContent += `1. THỐNG KÊ TỔNG HỢP THEO KHỐI LỚP\n`;
    csvContent += `Khối Lớp,Lượt Xem Bài Giảng,Lượt Xem Minigame,Tổng Lượt Tương Tác,Tỷ Lệ (%)\n`;
    
    gradeList.forEach(g => {
      const lViews = gradeStats[g]?.lessonViews || 0;
      const gViews = gradeStats[g]?.gameViews || 0;
      const tViews = lViews + gViews;
      const pct = grandTotal > 0 ? ((tViews / grandTotal) * 100).toFixed(1) : '0.0';
      csvContent += `Khối ${g},${lViews},${gViews},${tViews},${pct}%\n`;
    });

    csvContent += `TỔNG CỘNG,${totalLessonViews},${totalGameViews},${grandTotal},100%\n\n`;

    // Phần 2: Thống kê chi tiết theo Tên Lớp (6/1, 8/1...)
    csvContent += `2. THỐNG KÊ CHI TIẾT THEO TÊN LỚP HỌC (VD: 6/1; 8/1...)\n`;
    csvContent += `Thứ Hạng,Tên Lớp,Khối Lớp,Lượt Xem Bài Giảng,Lượt Xem Minigame,Tổng Lượt Tương Tác\n`;

    sortedClasses.forEach((item, idx) => {
      csvContent += `#${idx + 1},Lớp ${item.className},Khối ${item.grade},${item.lessonViews},${item.gameViews},${item.totalViews}\n`;
    });

    csvContent += `\n`;

    // Phần 3: DANH SÁCH CHI TIẾT TỪNG HỌC SINH THAM GIA HỌC TẬP
    csvContent += `3. DANH SÁCH CHI TIẾT HỌC SINH THAM GIA HỌC TẬP VÀ THI ĐUẢ (KÈM HỌ VÀ TÊN)\n`;
    csvContent += `STT,Họ Và Tên Học Sinh,Tên Lớp,Khối Lớp,Lượt Xem Bài Giảng,Lượt Chơi Minigame,Điểm XP Tích Lũy,Danh Hiệu Đạt Được,Hoạt Động Gần Nhất\n`;

    (studentLogs || []).forEach((st, idx) => {
      const cleanName = `"${(st.name || '').replace(/"/g, '""')}"`;
      csvContent += `${idx + 1},${cleanName},Lớp ${st.class},Khối ${st.grade},${st.lessonViews || 0},${st.gameViews || 0},${st.xp || 0},"${st.badge || 'Tân thủ'}",${st.lastActive || 'Gần đây'}\n`;
    });

    csvContent += `\n`;

    // Phần 4: Xếp hạng Bài giảng xem nhiều nhất
    csvContent += `4. XẾP HẠNG BÀI GIẢNG ĐƯỢC HỌC SINH XEM NHIỀU NHẤT\n`;
    csvContent += `Thứ Hạng,Tên Bài Giảng,Khối Lớp,Số Lượt Xem\n`;
    
    sortedLessons.forEach((item, idx) => {
      const cleanTitle = `"${(item.title || '').replace(/"/g, '""')}"`;
      csvContent += `#${idx + 1},${cleanTitle},Khối ${item.grade},${item.views || 0}\n`;
    });

    csvContent += `\n`;

    // Phần 5: Xếp hạng Minigame được chơi nhiều nhất
    csvContent += `5. XẾP HẠNG MINIGAME ĐƯỢC THAM GIA NHIỀU NHẤT\n`;
    csvContent += `Thứ Hạng,Tên Minigame,Khối Lớp,Số Lượt Chơi\n`;
    
    sortedGames.forEach((item, idx) => {
      const cleanTitle = `"${(item.title || '').replace(/"/g, '""')}"`;
      csvContent += `#${idx + 1},${cleanTitle},Khối ${item.grade},${item.views || 0}\n`;
    });

    // Tạo blob và tải về
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Bao_Cao_Chi_Tiet_HocSinh_TinHoc_THCS_NguyenHue_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target.className === 'modal-overlay' && onClose()}>
      <div className="modal-container" style={{ maxWidth: '920px', padding: '28px' }}>
        <button className="modal-close-btn" onClick={onClose}>✕</button>

        {/* HEADER MODAL */}
        <div style={{ borderBottom: '2px solid #E2E8F0', paddingBottom: '16px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <span className="hero-badge" style={{ background: '#7C3AED', color: 'white' }}>
                📊 BÁO CÁO THỐNG KÊ CHI TIẾT HỌC SINH THAM GIA
              </span>
              <h2 style={{ fontSize: '24px', fontWeight: 900, color: '#1E293B', marginTop: '6px' }}>
                Thống Kê Theo Khối Lớp, Tên Lớp &amp; Họ Tên Học Sinh
              </h2>
              <p style={{ fontSize: '13px', color: '#64748B' }}>
                Trường THCS Nguyễn Huệ • Tác giả: <strong>Cô Nguyễn Thị Huyền Diệu</strong>
              </p>
            </div>

            <button 
              className="btn-primary" 
              onClick={handleExportExcel}
              style={{ 
                background: 'linear-gradient(135deg, #10B981, #059669)', 
                borderColor: '#047857', 
                fontWeight: 800,
                padding: '10px 18px',
                fontSize: '14px'
              }}
            >
              📥 Xuất Báo Cáo Excel (.csv)
            </button>
          </div>
        </div>

        {/* 4 THẺ KPI TỔNG QUAN */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginBottom: '24px' }}>
          <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', padding: '14px 16px', borderRadius: '16px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#166534' }}>TỔNG HỌC SINH THAM GIA</span>
            <div style={{ fontSize: '28px', fontWeight: 900, color: '#15803D', marginTop: '2px' }}>{(studentLogs || []).length} em</div>
            <span style={{ fontSize: '11px', color: '#16A34A' }}>Khối 6, 7, 8, 9</span>
          </div>

          <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', padding: '14px 16px', borderRadius: '16px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#1E40AF' }}>🏫 LỚP TÍCH CỰC NHẤT</span>
            <div style={{ fontSize: '26px', fontWeight: 900, color: '#1D4ED8', marginTop: '2px' }}>
              {topClass ? `Lớp ${topClass.className}` : 'Lớp 8/1'}
            </div>
            <span style={{ fontSize: '11px', color: '#2563EB' }}>{topClass?.totalViews || 0} lượt tương tác</span>
          </div>

          <div style={{ background: '#FEF3C7', border: '1px solid #FDE68A', padding: '14px 16px', borderRadius: '16px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#92400E' }}>🔥 BÀI GIẢNG HOT NHẤT</span>
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#B45309', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {topLesson?.title || 'N/A'}
            </div>
            <span style={{ fontSize: '11px', color: '#D97706', fontWeight: 700 }}>{topLesson?.views || 0} lượt xem (Khối {topLesson?.grade})</span>
          </div>

          <div style={{ background: '#FCE7F3', border: '1px solid #FBCFE8', padding: '14px 16px', borderRadius: '16px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#9D174D' }}>🎮 GAME HOT NHẤT</span>
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#BE185D', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {topGame?.title || 'N/A'}
            </div>
            <span style={{ fontSize: '11px', color: '#DB2777', fontWeight: 700 }}>{topGame?.views || 0} lượt chơi (Khối {topGame?.grade})</span>
          </div>
        </div>

        {/* CHỌN TAB NỘI DUNG */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', borderBottom: '1px solid #E2E8F0', paddingBottom: '8px', flexWrap: 'wrap' }}>
          <button 
            style={{ padding: '8px 16px', borderRadius: '999px', border: 'none', background: activeTab === 'students' ? '#7C3AED' : '#F1F5F9', color: activeTab === 'students' ? 'white' : '#64748B', fontWeight: 700, cursor: 'pointer' }}
            onClick={() => setActiveTab('students')}
          >
            🎓 Chi Tiết Tên Học Sinh Tham Gia ({(studentLogs || []).length})
          </button>
          <button 
            style={{ padding: '8px 16px', borderRadius: '999px', border: 'none', background: activeTab === 'classes' ? '#7C3AED' : '#F1F5F9', color: activeTab === 'classes' ? 'white' : '#64748B', fontWeight: 700, cursor: 'pointer' }}
            onClick={() => setActiveTab('classes')}
          >
            🏫 Thống Kê Theo Tên Lớp ({sortedClasses.length})
          </button>
          <button 
            style={{ padding: '8px 16px', borderRadius: '999px', border: 'none', background: activeTab === 'overview' ? '#7C3AED' : '#F1F5F9', color: activeTab === 'overview' ? 'white' : '#64748B', fontWeight: 700, cursor: 'pointer' }}
            onClick={() => setActiveTab('overview')}
          >
            📊 Thống Kê Theo Khối Lớp
          </button>
          <button 
            style={{ padding: '8px 16px', borderRadius: '999px', border: 'none', background: activeTab === 'lessons' ? '#7C3AED' : '#F1F5F9', color: activeTab === 'lessons' ? 'white' : '#64748B', fontWeight: 700, cursor: 'pointer' }}
            onClick={() => setActiveTab('lessons')}
          >
            📘 Bài Giảng ({sortedLessons.length})
          </button>
          <button 
            style={{ padding: '8px 16px', borderRadius: '999px', border: 'none', background: activeTab === 'games' ? '#7C3AED' : '#F1F5F9', color: activeTab === 'games' ? 'white' : '#64748B', fontWeight: 700, cursor: 'pointer' }}
            onClick={() => setActiveTab('games')}
          >
            🎮 Minigame ({sortedGames.length})
          </button>
        </div>

        {/* TAB 1: THỐNG KÊ CHI TIẾT THEO TÊN HỌC SINH THAM GIA */}
        {activeTab === 'students' && (
          <div>
            {/* Thanh lọc theo Khối & Tìm kiếm Tên Học Sinh */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#334155' }}>Lọc Khối Lớp:</span>
                <select 
                  value={studentGradeFilter}
                  onChange={(e) => setStudentGradeFilter(e.target.value)}
                  style={{ padding: '6px 12px', borderRadius: '10px', border: '1.5px solid #CBD5E1', fontSize: '13px', fontWeight: 700, background: '#FFFFFF' }}
                >
                  <option value="all">🌟 Tất cả Khối 6, 7, 8, 9</option>
                  <option value="6">Khối 6</option>
                  <option value="7">Khối 7</option>
                  <option value="8">Khối 8</option>
                  <option value="9">Khối 9</option>
                </select>
              </div>

              <div style={{ flex: 1, minWidth: '200px' }}>
                <input 
                  type="text" 
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  placeholder="🔎 Tìm theo Họ tên học sinh hoặc Tên lớp (6/1, 8/1...)..."
                  style={{ width: '100%', padding: '7px 12px', borderRadius: '10px', border: '1.5px solid #CBD5E1', fontSize: '13px', outline: 'none' }}
                />
              </div>
            </div>

            {/* Bảng Danh sách Học sinh */}
            <div style={{ maxHeight: '340px', overflowY: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: '#F1F5F9', borderBottom: '2px solid #CBD5E1' }}>
                    <th style={{ padding: '10px' }}>STT</th>
                    <th style={{ padding: '10px' }}>Họ Và Tên Học Sinh</th>
                    <th style={{ padding: '10px' }}>Tên Lớp</th>
                    <th style={{ padding: '10px' }}>Khối</th>
                    <th style={{ padding: '10px', textAlign: 'center' }}>📘 Bài Đã Học</th>
                    <th style={{ padding: '10px', textAlign: 'center' }}>🎮 Game Đã Chơi</th>
                    <th style={{ padding: '10px', textAlign: 'center' }}>⭐ Điểm XP</th>
                    <th style={{ padding: '10px' }}>Danh Hiệu</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((st, idx) => (
                      <tr key={st.id || idx} style={{ borderBottom: '1px solid #E2E8F0' }}>
                        <td style={{ padding: '10px', fontWeight: 800, color: '#64748B' }}>#{idx + 1}</td>
                        <td style={{ padding: '10px', fontWeight: 900, color: '#1E293B', fontSize: '14px' }}>
                          👤 {st.name}
                        </td>
                        <td style={{ padding: '10px' }}>
                          <span style={{ background: '#EDE9FE', color: '#6D28D9', padding: '3px 8px', borderRadius: '999px', fontWeight: 800, fontSize: '12px' }}>
                            Lớp {st.class}
                          </span>
                        </td>
                        <td style={{ padding: '10px', fontWeight: 700, color: '#475569' }}>Khối {st.grade}</td>
                        <td style={{ padding: '10px', textAlign: 'center', fontWeight: 700, color: '#2563EB' }}>
                          {st.lessonViews || 0} bài
                        </td>
                        <td style={{ padding: '10px', textAlign: 'center', fontWeight: 700, color: '#D97706' }}>
                          {st.gameViews || 0} lần
                        </td>
                        <td style={{ padding: '10px', textAlign: 'center', fontWeight: 900, color: '#059669' }}>
                          {st.xp || 50} XP
                        </td>
                        <td style={{ padding: '10px', fontSize: '12px', fontWeight: 700, color: '#7C3AED' }}>
                          {st.badge || '🛡️ Vệ sĩ Số'}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" style={{ textAlign: 'center', padding: '20px', color: '#64748B' }}>
                        Không tìm thấy học sinh nào phù hợp với bộ lọc!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: THỐNG KÊ CHI TIẾT THEO TÊN LỚP (6/1, 8/1...) */}
        {activeTab === 'classes' && (
          <div style={{ maxHeight: '360px', overflowY: 'auto' }}>
            <h4 style={{ fontWeight: 800, color: '#1E293B', marginBottom: '12px' }}>
              Xếp hạng tổng lượt học &amp; tương tác theo Tên Lớp Học (Ví dụ: 6/1, 7/1, 8/1, 9/1...):
            </h4>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#F1F5F9', borderBottom: '2px solid #CBD5E1' }}>
                  <th style={{ padding: '10px' }}>Hạng</th>
                  <th style={{ padding: '10px' }}>Tên Lớp</th>
                  <th style={{ padding: '10px' }}>Khối Lớp</th>
                  <th style={{ padding: '10px', textAlign: 'center' }}>📘 Xem Bài Giảng</th>
                  <th style={{ padding: '10px', textAlign: 'center' }}>🎮 Chơi Minigame</th>
                  <th style={{ padding: '10px', textAlign: 'right' }}>🔥 Tổng Lượt Tương Tác</th>
                </tr>
              </thead>
              <tbody>
                {sortedClasses.map((item, idx) => (
                  <tr key={item.className} style={{ borderBottom: '1px solid #E2E8F0' }}>
                    <td style={{ padding: '10px', fontWeight: 800, color: idx < 3 ? '#D97706' : '#64748B' }}>
                      {idx === 0 ? '🥇 #1' : idx === 1 ? '🥈 #2' : idx === 2 ? '🥉 #3' : `#${idx + 1}`}
                    </td>
                    <td style={{ padding: '10px', fontWeight: 900, color: '#4F46E5', fontSize: '14px' }}>
                      Lớp {item.className}
                    </td>
                    <td style={{ padding: '10px' }}>
                      <span style={{ background: '#F1F5F9', color: '#334155', padding: '3px 8px', borderRadius: '999px', fontWeight: 700, fontSize: '11px' }}>
                        Khối {item.grade}
                      </span>
                    </td>
                    <td style={{ padding: '10px', textAlign: 'center', fontWeight: 700, color: '#2563EB' }}>
                      {item.lessonViews} lượt
                    </td>
                    <td style={{ padding: '10px', textAlign: 'center', fontWeight: 700, color: '#D97706' }}>
                      {item.gameViews} lượt
                    </td>
                    <td style={{ padding: '10px', textAlign: 'right', fontWeight: 900, color: '#059669', fontSize: '14px' }}>
                      {item.totalViews} lượt
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 3: THỐNG KÊ THEO KHỐI LỚP */}
        {activeTab === 'overview' && (
          <div>
            <h4 style={{ fontWeight: 800, color: '#1E293B', marginBottom: '14px' }}>Chi tiết Lượt xem &amp; Tương tác theo từng Khối:</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {gradeList.map(g => {
                const lViews = gradeStats[g]?.lessonViews || 0;
                const gViews = gradeStats[g]?.gameViews || 0;
                const totalG = lViews + gViews;
                const pct = grandTotal > 0 ? Math.round((totalG / grandTotal) * 100) : 0;

                const colors = { 6: '#7C3AED', 7: '#F59E0B', 8: '#0284C7', 9: '#EC4899' };

                return (
                  <div key={g} style={{ background: '#F8FAFC', padding: '14px 18px', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ fontWeight: 800, color: colors[g], fontSize: '15px' }}>
                        🎓 Khối {g} — Total: {totalG} lượt xem
                      </span>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#64748B' }}>
                        📘 Bài giảng: {lViews} | 🎮 Minigame: {gViews} ({pct}%)
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div style={{ width: '100%', height: '10px', background: '#E2E8F0', borderRadius: '999px', overflow: 'hidden' }}>
                      <div style={{ width: `${pct}%`, height: '100%', background: colors[g], borderRadius: '999px', transition: 'width 0.5s ease' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: XẾP HẠNG BÀI GIẢNG HOT NHẤT */}
        {activeTab === 'lessons' && (
          <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#F1F5F9', borderBottom: '2px solid #CBD5E1' }}>
                  <th style={{ padding: '10px' }}>Thứ hạng</th>
                  <th style={{ padding: '10px' }}>Tên Bài Giảng</th>
                  <th style={{ padding: '10px' }}>Khối</th>
                  <th style={{ padding: '10px', textAlign: 'right' }}>Lượt xem</th>
                </tr>
              </thead>
              <tbody>
                {sortedLessons.map((item, idx) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid #E2E8F0' }}>
                    <td style={{ padding: '10px', fontWeight: 800, color: idx < 3 ? '#D97706' : '#64748B' }}>
                      {idx === 0 ? '🥇 #1' : idx === 1 ? '🥈 #2' : idx === 2 ? '🥉 #3' : `#${idx + 1}`}
                    </td>
                    <td style={{ padding: '10px', fontWeight: 700, color: '#1E293B' }}>{item.title}</td>
                    <td style={{ padding: '10px' }}>
                      <span style={{ background: '#EEF2FF', color: '#4F46E5', padding: '3px 8px', borderRadius: '999px', fontWeight: 700, fontSize: '11px' }}>
                        Khối {item.grade}
                      </span>
                    </td>
                    <td style={{ padding: '10px', textAlign: 'right', fontWeight: 900, color: '#7C3AED' }}>
                      {item.views || 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 5: XẾP HẠNG MINIGAME */}
        {activeTab === 'games' && (
          <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#F1F5F9', borderBottom: '2px solid #CBD5E1' }}>
                  <th style={{ padding: '10px' }}>Thứ hạng</th>
                  <th style={{ padding: '10px' }}>Tên Minigame</th>
                  <th style={{ padding: '10px' }}>Khối</th>
                  <th style={{ padding: '10px', textAlign: 'right' }}>Lượt chơi</th>
                </tr>
              </thead>
              <tbody>
                {sortedGames.map((item, idx) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid #E2E8F0' }}>
                    <td style={{ padding: '10px', fontWeight: 800, color: idx < 3 ? '#D97706' : '#64748B' }}>
                      {idx === 0 ? '🥇 #1' : idx === 1 ? '🥈 #2' : idx === 2 ? '🥉 #3' : `#${idx + 1}`}
                    </td>
                    <td style={{ padding: '10px', fontWeight: 700, color: '#1E293B' }}>{item.title}</td>
                    <td style={{ padding: '10px' }}>
                      <span style={{ background: '#FEF3C7', color: '#92400E', padding: '3px 8px', borderRadius: '999px', fontWeight: 700, fontSize: '11px' }}>
                        Khối {item.grade}
                      </span>
                    </td>
                    <td style={{ padding: '10px', textAlign: 'right', fontWeight: 900, color: '#059669' }}>
                      {item.views || 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px', paddingTop: '12px', borderTop: '1px solid #E2E8F0' }}>
          <button className="btn-secondary" onClick={onClose}>Đóng Báo Cáo</button>
        </div>
      </div>
    </div>
  );
};
