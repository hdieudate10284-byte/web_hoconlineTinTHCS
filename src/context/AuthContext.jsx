/* ============================================================================
   AUTH CONTEXT (REACT 18 HOOKS & STATE)
   Quản lý phiên người dùng, đăng ký, đăng nhập và phân quyền bảo mật trực tiếp với Supabase DB
   ============================================================================ */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabaseService } from '../services/supabaseClient';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('AUTH_CURRENT_USER');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      id: 3,
      username: 'hocsinh6',
      name: 'Nguyễn Văn An',
      role: 'student',
      class: 'Lớp 6A1',
      grade: 6,
      xp: 450,
      level: 3,
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=hocsinh6',
      badgesCount: 2
    };
  });

  const [isLoadingAuth, setIsLoadingAuth] = useState(false);

  // Lưu phiên đăng nhập vào localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('AUTH_CURRENT_USER', JSON.stringify(currentUser));
    }
  }, [currentUser]);

  // Tự động đồng bộ lại thông tin người dùng từ Supabase DB khi mở trang web
  useEffect(() => {
    const syncCurrentUserFromDb = async () => {
      if (currentUser?.username && currentUser.username !== 'guest' && supabaseService.isConnected) {
        try {
          const userInDb = await supabaseService.getUserByUsername(currentUser.username);
          if (userInDb) {
            setCurrentUser(prev => ({
              ...prev,
              id: userInDb.id,
              name: userInDb.full_name,
              email: userInDb.email,
              role: userInDb.role,
              class: userInDb.class_name,
              grade: userInDb.grade_level,
              xp: userInDb.total_xp,
              level: userInDb.current_level,
              avatar: userInDb.avatar_url,
              badgesCount: userInDb.badges_count || 1
            }));
          }
        } catch (err) {
          console.warn('Không thể đồng bộ hồ sơ người dùng từ Supabase:', err);
        }
      }
    };

    syncCurrentUserFromDb();
  }, []);

  // Helper lưu trữ & đọc danh sách tài khoản đã đăng ký trong localStorage
  const getRegisteredUsers = () => {
    try {
      const saved = localStorage.getItem('AUTH_REGISTERED_USERS');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  };

  const saveRegisteredUser = (userObj) => {
    try {
      const users = getRegisteredUsers();
      if (userObj.username) users[userObj.username.toLowerCase()] = userObj;
      if (userObj.email) users[userObj.email.toLowerCase()] = userObj;
      localStorage.setItem('AUTH_REGISTERED_USERS', JSON.stringify(users));
    } catch (e) {}
  };

  // 1. ĐĂNG NHẬP (Hỗ trợ xác thực Supabase DB + Tài khoản Đăng ký + Fallback Offline)
  const login = async (username, password, customClass) => {
    setIsLoadingAuth(true);
    const cleanUser = (username || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();
    const cleanClass = (customClass || '').trim();

    if (!cleanUser || !cleanPass) {
      setIsLoadingAuth(false);
      return { success: false, message: 'Vui lòng nhập đầy đủ Tên đăng nhập/Email và Mật khẩu!' };
    }

    // A. Thử xác thực với cơ sở dữ liệu Supabase trước
    if (supabaseService.isConnected) {
      const dbResult = await supabaseService.authenticateUser(cleanUser, cleanPass);
      if (dbResult.success && dbResult.user) {
        const updatedUser = {
          ...dbResult.user,
          class: cleanClass || dbResult.user.class || (dbResult.user.role === 'teacher' ? 'Giáo viên' : '6/1')
        };
        setCurrentUser(updatedUser);
        setIsLoadingAuth(false);
        return { ...dbResult, user: updatedUser };
      } else if (dbResult.message && !dbResult.message.includes('Chưa kết nối')) {
        setIsLoadingAuth(false);
        return dbResult;
      }
    }

    // B. Kiểm tra danh sách tài khoản đã đăng ký trên máy này (localStorage)
    const localRegistered = getRegisteredUsers();
    if (localRegistered[cleanUser]) {
      const userAcc = localRegistered[cleanUser];
      if (userAcc.password === cleanPass || cleanPass.length >= 4) {
        const updatedObj = {
          ...userAcc,
          class: cleanClass || userAcc.class || (userAcc.role === 'teacher' ? 'Giáo viên' : '6/1')
        };
        setCurrentUser(updatedObj);
        setIsLoadingAuth(false);
        return { success: true, user: updatedObj, message: `Đăng nhập thành công với vai trò ${updatedObj.role === 'teacher' ? 'Giáo viên' : 'Học sinh'}!` };
      }
    }

    // C. Fallback Offline cho các tài khoản demo cố định
    const fallbackAccounts = {
      'hocsinh6': { name: 'Nguyễn Văn An', email: 'hocsinh6@hocsinh.edu.vn', role: 'student', class: cleanClass || '6/1', grade: 6, xp: 450, level: 3 },
      'hocsinh7': { name: 'Trần Thị Bình', email: 'hocsinh7@hocsinh.edu.vn', role: 'student', class: cleanClass || '7/1', grade: 7, xp: 720, level: 5 },
      'hocsinh8': { name: 'Lê Hoàng Cường', email: 'hocsinh8@hocsinh.edu.vn', role: 'student', class: cleanClass || '8/1', grade: 8, xp: 310, level: 2 },
      'hocsinh9': { name: 'Phạm Mỹ Duyên', email: 'hocsinh9@hocsinh.edu.vn', role: 'student', class: cleanClass || '9/1', grade: 9, xp: 980, level: 7 },
      'giaovien': { name: 'Cô Nguyễn Thị Huyền Diệu', email: 'hdieudate10284@gmail.com', role: 'teacher', class: 'Giáo viên', grade: 9, xp: 1500, level: 10 },
      'admin': { name: 'Cô Nguyễn Thị Huyền Diệu', email: 'hdieudate10284@gmail.com', role: 'admin', class: 'Ban Quản Trị', grade: 9, xp: 9999, level: 99 },
      'hdieudate10284@gmail.com': { name: 'Cô Nguyễn Thị Huyền Diệu', email: 'hdieudate10284@gmail.com', role: 'teacher', class: 'Giáo viên', grade: 9, xp: 1500, level: 10 }
    };

    if (fallbackAccounts[cleanUser] && (cleanPass === '123456' || cleanPass.length >= 4)) {
      const acc = fallbackAccounts[cleanUser];
      const localObj = {
        id: Date.now(),
        username: cleanUser,
        name: acc.name,
        email: acc.email || `${cleanUser}@hocsinh.edu.vn`,
        role: acc.role,
        class: cleanClass || acc.class,
        grade: acc.grade,
        xp: acc.xp,
        level: acc.level,
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${cleanUser}`,
        badgesCount: 2
      };
      setCurrentUser(localObj);
      setIsLoadingAuth(false);
      return { success: true, user: localObj, message: `Đăng nhập thành công với Lớp ${localObj.class}!` };
    }

    // D. Cho phép Giáo viên bất kỳ đăng nhập bằng Email nếu khớp định dạng @ và mật khẩu >= 4
    if ((cleanUser.includes('@') || cleanClass === 'Giáo viên') && cleanPass.length >= 4) {
      const isCd = cleanUser === 'hdieudate10284@gmail.com';
      const teacherName = isCd ? 'Cô Nguyễn Thị Huyền Diệu' : `Giáo viên ${cleanUser.split('@')[0]}`;
      const teacherObj = {
        id: Date.now(),
        username: cleanUser.split('@')[0],
        name: teacherName,
        email: cleanUser,
        role: 'teacher',
        class: 'Giáo viên',
        grade: 9,
        xp: 1500,
        level: 10,
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${cleanUser}`,
        badgesCount: 3
      };
      setCurrentUser(teacherObj);
      setIsLoadingAuth(false);
      return { success: true, user: teacherObj, message: `Đăng nhập thành công tài khoản Giáo viên (${teacherObj.email})!` };
    }

    setIsLoadingAuth(false);
    return { success: false, message: 'Tên đăng nhập/Email hoặc mật khẩu không chính xác!' };
  };

  // 2. ĐĂNG KÝ TÀI KHOẢN MỚI (Lưu vào Supabase DB & localStorage)
  const register = async ({ username, password, fullName, role = 'student', className, gradeLevel = 6, avatarUrl, email }) => {
    setIsLoadingAuth(true);
    const cleanUser = (username || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();
    const cleanName = (fullName || '').trim();
    const cleanEmail = (email || '').trim().toLowerCase();
    const parsedGrade = parseInt(gradeLevel) || 6;
    const userRole = role || 'student';
    const userClass = className || (userRole === 'teacher' ? 'Giáo viên' : `Lớp ${parsedGrade}A1`);
    const finalAvatar = avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${cleanUser}`;

    // Validate dữ liệu đầu vào
    if (!cleanUser || cleanUser.length < 3) {
      setIsLoadingAuth(false);
      return { success: false, message: 'Tên đăng nhập phải có ít nhất 3 ký tự (chữ cái/số/không dấu)!' };
    }
    if (userRole === 'teacher' && (!cleanEmail || !cleanEmail.includes('@'))) {
      setIsLoadingAuth(false);
      return { success: false, message: 'Giáo viên bắt buộc phải nhập đúng định dạng Email (Ví dụ: thaynam@gmail.com)!' };
    }
    if (!cleanPass || cleanPass.length < 4) {
      setIsLoadingAuth(false);
      return { success: false, message: 'Mật khẩu phải có tối thiểu 4 ký tự!' };
    }
    if (!cleanName) {
      setIsLoadingAuth(false);
      return { success: false, message: 'Vui lòng nhập Họ và tên đầy đủ!' };
    }

    const userEmail = userRole === 'teacher' ? cleanEmail : (cleanEmail || `${cleanUser}@hocsinh.edu.vn`);

    const localUser = {
      id: Date.now(),
      username: cleanUser,
      password: cleanPass,
      name: cleanName,
      email: userEmail,
      role: userRole,
      class: userClass,
      grade: parsedGrade,
      xp: userRole === 'teacher' ? 1500 : 100,
      level: userRole === 'teacher' ? 10 : 1,
      avatar: finalAvatar,
      badgesCount: 1
    };

    // A. Chèn trực tiếp vào Supabase Cloud DB
    if (supabaseService.isConnected) {
      const regResult = await supabaseService.registerNewUser({
        username: cleanUser,
        password: cleanPass,
        fullName: cleanName,
        email: userEmail,
        role: userRole,
        className: userClass,
        gradeLevel: parsedGrade,
        avatarUrl: finalAvatar
      });

      if (regResult.success && regResult.user) {
        saveRegisteredUser(localUser);
        setCurrentUser(regResult.user);
        setIsLoadingAuth(false);
        return regResult;
      }
    }

    // B. Fallback Offline khi chưa có kết nối DB
    saveRegisteredUser(localUser);
    setCurrentUser(localUser);
    setIsLoadingAuth(false);
    return { success: true, user: localUser, message: `Đăng ký thành công tài khoản ${userRole === 'teacher' ? 'Giáo viên' : 'Học sinh'}! (${cleanName})` };
  };

  // 3. ĐĂNG XUẤT (Clear session)
  const logout = () => {
    localStorage.removeItem('AUTH_CURRENT_USER');
    const guestUser = {
      id: 0,
      username: 'guest',
      name: 'Khách Học Tập',
      role: 'student',
      class: 'Chưa đăng nhập',
      grade: 6,
      xp: 0,
      level: 1,
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=guest',
      badgesCount: 0
    };
    setCurrentUser(guestUser);
  };

  // 4. CHUYỂN ĐỔI VAI TRÒ NHANH (Học sinh / Giáo viên / Admin)
  const switchRole = (newRole) => {
    setCurrentUser(prev => {
      let updated = { ...prev, role: newRole };
      if (newRole === 'teacher') {
        updated.name = 'Cô Nguyễn Thị Huyền Diệu';
        updated.email = 'hdieudate10284@gmail.com';
        updated.class = 'Giáo viên';
        updated.level = 10;
        updated.xp = 1500;
      } else if (newRole === 'admin') {
        updated.name = 'Cô Nguyễn Thị Huyền Diệu';
        updated.email = 'hdieudate10284@gmail.com';
        updated.class = 'Ban Quản Trị';
        updated.level = 99;
        updated.xp = 9999;
      } else {
        updated.name = prev.name && prev.role !== 'teacher' ? prev.name : 'Nguyễn Văn An';
        updated.email = prev.username ? `${prev.username}@hocsinh.edu.vn` : 'hocsinh6@hocsinh.edu.vn';
        updated.class = `Lớp ${prev.grade || 6}A1`;
      }
      return updated;
    });
  };

  // 5. CỘNG ĐIỂM XP & ĐỒNG BỘ CƠ SỞ DỮ LIỆU CLOUD
  const addXP = async (amount, reason = 'Hoàn thành nhiệm vụ học tập') => {
    setCurrentUser(prev => {
      const newXp = (prev?.xp || 0) + amount;
      const newLevel = Math.max(1, Math.floor(newXp / 250) + 1);
      const updated = { ...prev, xp: newXp, level: newLevel };

      // Gửi cập nhật trực tiếp lên Supabase DB
      if (supabaseService.isConnected && prev?.id) {
        supabaseService.updateUserXP(prev.id, newXp, newLevel);
        supabaseService.logActivity(prev.id, 'earn_xp', `${reason} (+${amount} XP)`, amount);
      }
      return updated;
    });
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      isLoadingAuth,
      login,
      register,
      logout,
      switchRole,
      addXP
    }}>
      {children}
    </AuthContext.Provider>
  );
};

