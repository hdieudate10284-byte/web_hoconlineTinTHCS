/* ============================================================================
   DATA CONTEXT (REACT 18 HOOKS & STATE)
   Quản lý dữ liệu học liệu, bài nộp học sinh, leaderboard và Supabase Realtime
   ============================================================================ */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabaseService } from '../services/supabaseClient';
import { 
  INITIAL_CURRICULUM, 
  INITIAL_SUBMISSIONS, 
  INITIAL_LEADERBOARD, 
  BADGES_CATALOG,
  INITIAL_ANALYTICS_STATS
} from '../data/mockData';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const [curriculum, setCurriculum] = useState(() => {
    try {
      const saved = localStorage.getItem('thcs_curriculum');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map(c => {
            if (c.grade === 6 || c.id === 'grade-6') {
              const standardG6 = INITIAL_CURRICULUM[0].lessons;
              const extraLessons = (c.lessons || []).filter(l => 
                !['l6-1', 'l6-2', 'l6-3', 'l6-4'].includes(l.id) &&
                l.title.trim().toLowerCase() !== 'bài 4'
              );
              return {
                ...c,
                title: 'Chủ đề D: An toàn thông tin internet',
                lessons: [...standardG6, ...extraLessons]
              };
            }
            return c;
          });
        }
      }
    } catch (e) {
      console.warn('Lỗi đọc curriculum từ localStorage:', e);
    }
    return INITIAL_CURRICULUM;
  });
  const [submissions, setSubmissions] = useState(INITIAL_SUBMISSIONS);
  const [leaderboard, setLeaderboard] = useState(INITIAL_LEADERBOARD);
  const [badgesCatalog, setBadgesCatalog] = useState(BADGES_CATALOG);
  const [analyticsStats, setAnalyticsStats] = useState(() => {
    const saved = localStorage.getItem('thcs_analytics_stats');
    return saved ? JSON.parse(saved) : INITIAL_ANALYTICS_STATS;
  });
  const [isDbConnected, setIsDbConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Tự động lưu curriculum vào localStorage mỗi khi có bài học mới được thêm
  useEffect(() => {
    try {
      localStorage.setItem('thcs_curriculum', JSON.stringify(curriculum));
    } catch (e) {
      console.warn('Lỗi lưu curriculum vào localStorage:', e);
    }
  }, [curriculum]);

  // Lưu analyticsStats vào localStorage mỗi khi có thay đổi
  useEffect(() => {
    try {
      localStorage.setItem('thcs_analytics_stats', JSON.stringify(analyticsStats));
    } catch (e) {
      console.warn('Không thể lưu analytics vào localStorage:', e);
    }
  }, [analyticsStats]);

  // Tải dữ liệu từ Supabase khi mount
  const syncSupabaseData = async () => {
    setIsLoading(true);
    if (supabaseService.isConnected && supabaseService.client) {
      try {
        // 1. Tải Chủ đề & Bài học
        const { data: topics } = await supabaseService.client
          .from('curriculum_topics')
          .select('*')
          .order('display_order', { ascending: true });

        const { data: lessons } = await supabaseService.client
          .from('lessons')
          .select('*')
          .order('display_order', { ascending: true });

        // Lấy danh sách bài học đang lưu cục bộ trong localStorage (bao gồm bài mới do Giáo viên thêm)
        let savedLocalCurriculum = INITIAL_CURRICULUM;
        try {
          const savedStr = localStorage.getItem('thcs_curriculum');
          if (savedStr) {
            const parsed = JSON.parse(savedStr);
            if (Array.isArray(parsed) && parsed.length > 0) {
              savedLocalCurriculum = parsed;
            }
          }
        } catch (e) {
          console.warn('Lỗi đọc local curriculum:', e);
        }

        if (topics && topics.length > 0) {
          const merged = topics.map(t => {
            const dbLessons = (lessons || [])
              .filter(l => l.grade_level === t.grade_level)
              .map(l => ({
                id: l.lesson_code,
                title: l.title,
                duration: l.duration,
                xp: l.xp_reward,
                summary: l.summary,
                videoUrl: l.video_url || l.videoUrl || '',
                documentUrl: l.document_url || l.documentUrl || ''
              }));

            const localMatch = savedLocalCurriculum.find(c => c.grade === t.grade_level);
            const localLessons = localMatch ? localMatch.lessons : [];

            // Hợp nhất các bài học từ DB và các bài mới tạo từ local
            const combinedLessons = [...dbLessons];
            localLessons.forEach(ll => {
              const existsInDb = combinedLessons.some(
                dbl => dbl.id === ll.id || dbl.title.trim().toLowerCase() === ll.title.trim().toLowerCase()
              );
              if (!existsInDb) {
                combinedLessons.push(ll);
              }
            });

            const topicTitle = t.grade_level === 6 ? 'Chủ đề D: An toàn thông tin internet' : t.title;

            let cleanLessons = combinedLessons.length > 0 ? combinedLessons : localLessons;

            if (t.grade_level === 6) {
              const standardG6 = INITIAL_CURRICULUM[0].lessons;
              const extraLessons = cleanLessons.filter(l => 
                !['l6-1', 'l6-2', 'l6-3', 'l6-4'].includes(l.id) &&
                l.title.trim().toLowerCase() !== 'bài 4'
              );
              cleanLessons = [...standardG6, ...extraLessons];
            } else {
              cleanLessons = cleanLessons.filter(l => l.title.trim().toLowerCase() !== 'bài 4');
            }

            return {
              id: `grade-${t.grade_level}`,
              grade: t.grade_level,
              title: topicTitle,
              badgeText: t.badge_text || `CHỦ ĐỀ KHỐI ${t.grade_level}`,
              themeClass: t.theme_class || `card-grade-${t.grade_level}`,
              color: t.theme_color || '#7C3AED',
              symbol: t.symbol || '📘',
              description: t.description,
              lessons: cleanLessons,
              minigame: localMatch ? localMatch.minigame : null
            };
          });
          setCurriculum(merged);

          // Tự động xóa bài thừa 'Bài 4', cập nhật 4 bài học chuẩn Khối 6 và cập nhật tiêu đề Khối 6 trên Supabase Cloud DB
          supabaseService.client
            .from('lessons')
            .delete()
            .ilike('title', 'bài 4')
            .then(() => {})
            .catch(() => {});

          const g6StandardDb = INITIAL_CURRICULUM[0].lessons.map((l, index) => ({
            lesson_code: l.id,
            grade_level: 6,
            display_order: index + 1,
            title: l.title,
            duration: l.duration,
            xp_reward: l.xp,
            summary: l.summary
          }));

          supabaseService.client
            .from('lessons')
            .upsert(g6StandardDb, { onConflict: 'lesson_code' })
            .then(() => {})
            .catch(() => {});

          supabaseService.client
            .from('curriculum_topics')
            .update({ title: 'Chủ đề D: An toàn thông tin internet' })
            .eq('grade_level', 6)
            .then(() => {})
            .catch(() => {});
        }

        // 2. Tải Bài nộp học sinh
        const { data: subs } = await supabaseService.client
          .from('submissions')
          .select('*')
          .order('id', { ascending: false });

        if (subs && subs.length > 0) {
          setSubmissions(subs.map(s => ({
            id: s.id,
            studentName: s.student_name,
            class: s.student_class,
            title: s.title,
            type: s.submission_type,
            fileUrl: s.file_url,
            status: s.status,
            teacherFeedback: s.teacher_feedback || '',
            likes: s.likes || 0
          })));
        }

        // 3. Tải Leaderboard
        const { data: users } = await supabaseService.client
          .from('users')
          .select('*')
          .order('total_xp', { ascending: false })
          .limit(10);

        if (users && users.length > 0) {
          setLeaderboard(users.map((u, idx) => ({
            rank: idx + 1,
            name: u.full_name,
            class: u.class_name,
            xp: u.total_xp,
            badgesCount: u.badges_count || 1,
            avatar: u.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=student${u.id}`
          })));
        }

        setIsDbConnected(true);
      } catch (err) {
        console.warn('Đang sử dụng dữ liệu nội bộ:', err);
        setIsDbConnected(false);
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    syncSupabaseData();
  }, []);

  // Nộp sản phẩm mới
  const submitProduct = async (subData) => {
    if (supabaseService.isConnected && supabaseService.client) {
      try {
        const { data, error } = await supabaseService.client
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

        const newFormatted = {
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
        setSubmissions(prev => [newFormatted, ...prev]);
        return { success: true, data: newFormatted };
      } catch (e) {
        console.warn('Lỗi nộp bài lên Supabase, lưu local:', e);
      }
    }

    const localSub = {
      id: Date.now(),
      ...subData,
      status: 'pending',
      teacherFeedback: '',
      likes: 1
    };
    setSubmissions(prev => [localSub, ...prev]);
    return { success: true, data: localSub };
  };

  // Giáo viên duyệt bài nộp
  const approveSubmission = async (id, feedback = 'Bài nộp xuất sắc! Đã cộng 100 XP danh dự.') => {
    setSubmissions(prev => prev.map(s => s.id === id ? { ...s, status: 'approved', teacherFeedback: feedback } : s));

    if (supabaseService.isConnected && supabaseService.client) {
      try {
        await supabaseService.client
          .from('submissions')
          .update({ status: 'approved', teacher_feedback: feedback })
          .eq('id', id);
      } catch (e) {
        console.warn('Lỗi duyệt bài Supabase:', e);
      }
    }
  };

  // Thả tim sản phẩm
  const likeSubmission = async (id) => {
    setSubmissions(prev => prev.map(s => {
      if (s.id === id) {
        const newLikes = (s.likes || 0) + 1;
        if (supabaseService.isConnected && supabaseService.client) {
          supabaseService.client.from('submissions').update({ likes: newLikes }).eq('id', id).then(() => {});
        }
        return { ...s, likes: newLikes };
      }
      return s;
    }));
  };

  // Ghi nhận lượt xem Bài giảng theo khối & tên lớp & tên học sinh
  const recordLessonView = (lessonId, gradeLevel, lessonTitle, className, studentName) => {
    setAnalyticsStats(prev => {
      const g = gradeLevel || 6;
      const rawClass = className || `6/1`;
      const cls = rawClass.replace(/^Lớp\s+/i, '');
      const currentGradeStats = prev.gradeStats[g] || { lessonViews: 0, gameViews: 0 };
      const currentLesson = prev.lessonStats[lessonId] || { title: lessonTitle || `Bài học ${lessonId}`, grade: g, views: 0 };

      const classStats = prev.classStats || {};
      const currentClassStats = classStats[cls] || { grade: g, lessonViews: 0, gameViews: 0 };

      let studentLogs = [...(prev.studentLogs || [])];
      if (studentName && studentName !== 'Khách' && studentName !== 'Chưa đăng nhập') {
        const existingIdx = studentLogs.findIndex(s => s.name.toLowerCase() === studentName.toLowerCase());
        if (existingIdx >= 0) {
          studentLogs[existingIdx] = {
            ...studentLogs[existingIdx],
            class: cls,
            grade: g,
            lessonViews: (studentLogs[existingIdx].lessonViews || 0) + 1,
            lastActive: 'Vừa xong'
          };
        } else {
          studentLogs.push({
            id: `st-${Date.now()}`,
            name: studentName,
            class: cls,
            grade: g,
            lessonViews: 1,
            gameViews: 0,
            xp: 50,
            badge: 'Tân thủ',
            lastActive: 'Vừa xong'
          });
        }
      }

      return {
        ...prev,
        gradeStats: {
          ...prev.gradeStats,
          [g]: {
            ...currentGradeStats,
            lessonViews: (currentGradeStats.lessonViews || 0) + 1
          }
        },
        lessonStats: {
          ...prev.lessonStats,
          [lessonId]: {
            ...currentLesson,
            views: (currentLesson.views || 0) + 1
          }
        },
        classStats: {
          ...classStats,
          [cls]: {
            ...currentClassStats,
            grade: g,
            lessonViews: (currentClassStats.lessonViews || 0) + 1
          }
        },
        studentLogs
      };
    });
  };

  // Ghi nhận lượt xem/chơi Minigame theo khối & tên lớp & tên học sinh
  const recordMinigameView = (gameId, gradeLevel, gameTitle, className, studentName) => {
    setAnalyticsStats(prev => {
      const g = gradeLevel || 6;
      const rawClass = className || `6/1`;
      const cls = rawClass.replace(/^Lớp\s+/i, '');
      const currentGradeStats = prev.gradeStats[g] || { lessonViews: 0, gameViews: 0 };
      const currentGame = prev.gameStats[gameId] || { title: gameTitle || `Minigame Khối ${g}`, grade: g, views: 0 };

      const classStats = prev.classStats || {};
      const currentClassStats = classStats[cls] || { grade: g, lessonViews: 0, gameViews: 0 };

      let studentLogs = [...(prev.studentLogs || [])];
      if (studentName && studentName !== 'Khách' && studentName !== 'Chưa đăng nhập') {
        const existingIdx = studentLogs.findIndex(s => s.name.toLowerCase() === studentName.toLowerCase());
        if (existingIdx >= 0) {
          studentLogs[existingIdx] = {
            ...studentLogs[existingIdx],
            class: cls,
            grade: g,
            gameViews: (studentLogs[existingIdx].gameViews || 0) + 1,
            lastActive: 'Vừa xong'
          };
        } else {
          studentLogs.push({
            id: `st-${Date.now()}`,
            name: studentName,
            class: cls,
            grade: g,
            lessonViews: 0,
            gameViews: 1,
            xp: 50,
            badge: 'Tân thủ',
            lastActive: 'Vừa xong'
          });
        }
      }

      return {
        ...prev,
        gradeStats: {
          ...prev.gradeStats,
          [g]: {
            ...currentGradeStats,
            gameViews: (currentGradeStats.gameViews || 0) + 1
          }
        },
        gameStats: {
          ...prev.gameStats,
          [gameId]: {
            ...currentGame,
            views: (currentGame.views || 0) + 1
          }
        },
        classStats: {
          ...classStats,
          [cls]: {
            ...currentClassStats,
            grade: g,
            gameViews: (currentClassStats.gameViews || 0) + 1
          }
        },
        studentLogs
      };
    });
  };

  // Thêm bài giảng học liệu mới (Dành riêng cho Giáo viên)
  const addLesson = async ({ gradeLevel, title, duration = '20 phút', xp = 50, summary, videoUrl = '', documentUrl = '' }) => {
    const gradeNum = parseInt(gradeLevel) || 6;
    const lessonId = `l${gradeNum}-${Date.now().toString().slice(-4)}`;

    const newLessonObj = {
      id: lessonId,
      title: title.trim(),
      duration: duration.trim() || '20 phút',
      xp: parseInt(xp) || 50,
      summary: summary.trim(),
      videoUrl: (videoUrl || '').trim(),
      documentUrl: (documentUrl || '').trim()
    };

    setCurriculum(prev => {
      const updated = prev.map(topic => {
        if (topic.grade === gradeNum) {
          return {
            ...topic,
            lessons: [...topic.lessons, newLessonObj]
          };
        }
        return topic;
      });

      try {
        localStorage.setItem('thcs_curriculum', JSON.stringify(updated));
      } catch (e) {
        console.warn('Lỗi lưu curriculum vào localStorage:', e);
      }

      return updated;
    });

    let dbSaved = false;
    let dbErrorMsg = '';

    if (supabaseService.isConnected && supabaseService.client) {
      try {
        // 1. Tự động kiểm tra/khởi tạo chủ đề khối trong curriculum_topics để tránh lỗi Foreign Key
        const topicTitles = {
          6: 'Chủ đề D: An toàn thông tin internet',
          7: 'Chủ đề D: Ứng xử trên mạng và An toàn thông tin',
          8: 'Chủ đề D: Đạo đức, pháp luật và văn hóa trong môi trường số',
          9: 'Chủ đề D: Tác quyền, an toàn thông tin và văn hóa số'
        };

        await supabaseService.client
          .from('curriculum_topics')
          .upsert([{
            grade_level: gradeNum,
            title: topicTitles[gradeNum] || `Chủ đề Khối ${gradeNum}`,
            badge_text: `CHỦ ĐỀ KHỐI ${gradeNum}`,
            theme_class: `card-grade-${gradeNum}`,
            theme_color: gradeNum === 6 ? '#7C3AED' : gradeNum === 7 ? '#059669' : gradeNum === 8 ? '#D97706' : '#DC2626',
            symbol: '📘',
            description: 'Ứng xử có văn hóa, tuân thủ pháp luật và an toàn thông tin'
          }], { onConflict: 'grade_level' });

        // 2. Chèn bài học mới vào bảng lessons
        let { error } = await supabaseService.client
          .from('lessons')
          .insert([{
            lesson_code: lessonId,
            grade_level: gradeNum,
            title: title.trim(),
            duration: duration.trim() || '20 phút',
            xp_reward: parseInt(xp) || 50,
            summary: summary.trim(),
            video_url: (videoUrl || '').trim(),
            document_url: (documentUrl || '').trim()
          }]);

        // Nếu bảng cũ chưa có 2 cột video_url / document_url, thử chèn dự phòng 6 trường mặc định
        if (error && (error.message?.includes('video_url') || error.code === '42703')) {
          console.warn('Cột video_url chưa tồn tại trên Supabase, thử chèn dự phòng 6 trường...');
          const fallback = await supabaseService.client
            .from('lessons')
            .insert([{
              lesson_code: lessonId,
              grade_level: gradeNum,
              title: title.trim(),
              duration: duration.trim() || '20 phút',
              xp_reward: parseInt(xp) || 50,
              summary: summary.trim()
            }]);
          error = fallback.error;
        }

        if (!error) {
          dbSaved = true;
          // Tải lại dữ liệu mới từ Supabase để đồng bộ ngay lập tức
          await syncSupabaseData();
        } else {
          dbErrorMsg = error.message || error.details || 'Lỗi phân quyền RLS';
          console.warn('Lỗi chèn bài học vào Supabase:', error);
        }
      } catch (err) {
        dbErrorMsg = err.message || 'Lỗi kết nối mạng DB';
        console.warn('Không thể lưu bài học mới lên Supabase:', err);
      }
    }

    const notice = dbSaved 
      ? 'và đã đồng bộ trực tiếp lên Cloud Supabase DB!' 
      : (dbErrorMsg ? `(Lưu ý Supabase DB: ${dbErrorMsg}. Đã lưu an toàn 100% trên trình duyệt!)` : '(Đã lưu an toàn 100% trên bộ nhớ trình duyệt!)');

    return { success: true, message: `🎉 Đã thêm thành công bài giảng "${title}" vào Khối ${gradeNum}\n\n${notice}` };
  };

  // Cập nhật đường dẫn Video & Tài liệu cho Bài học có sẵn (Dành cho Giáo viên)
  const updateLessonLink = async ({ lessonId, videoUrl, documentUrl, summary }) => {
    let updatedLessonObj = null;

    setCurriculum(prev => {
      const updated = prev.map(topic => {
        const updatedLessons = topic.lessons.map(l => {
          if (l.id === lessonId) {
            updatedLessonObj = {
              ...l,
              videoUrl: videoUrl !== undefined ? videoUrl.trim() : l.videoUrl || '',
              documentUrl: documentUrl !== undefined ? documentUrl.trim() : l.documentUrl || '',
              summary: summary !== undefined ? summary.trim() : l.summary
            };
            return updatedLessonObj;
          }
          return l;
        });
        return { ...topic, lessons: updatedLessons };
      });

      try {
        localStorage.setItem('thcs_curriculum', JSON.stringify(updated));
      } catch (e) {
        console.warn('Lỗi lưu curriculum vào localStorage:', e);
      }
      return updated;
    });

    if (supabaseService.isConnected && supabaseService.client) {
      try {
        const updateData = {};
        if (videoUrl !== undefined) updateData.video_url = videoUrl.trim();
        if (documentUrl !== undefined) updateData.document_url = documentUrl.trim();
        if (summary !== undefined) updateData.summary = summary.trim();

        await supabaseService.client
          .from('lessons')
          .update(updateData)
          .eq('lesson_code', lessonId);
      } catch (err) {
        console.warn('Lỗi cập nhật link bài học trên Supabase:', err);
      }
    }

    return { success: true, updatedLesson: updatedLessonObj };
  };

  return (
    <DataContext.Provider value={{
      curriculum,
      submissions,
      leaderboard,
      badgesCatalog,
      analyticsStats,
      isDbConnected,
      isLoading,
      syncSupabaseData,
      submitProduct,
      approveSubmission,
      likeSubmission,
      recordLessonView,
      recordMinigameView,
      addLesson,
      updateLessonLink
    }}>
      {children}
    </DataContext.Provider>
  );
};
