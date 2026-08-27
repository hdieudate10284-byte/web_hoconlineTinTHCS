/* ============================================================================
   SUPABASE SERVICE CLIENT (REACT & VERCEL EDITION)
   Tích hợp Auth, REST Fallback, SHA-256 Hashing và Đồng bộ Cơ sở Dữ liệu Cloud
   ============================================================================ */

import { createClient } from '@supabase/supabase-js';

const DEFAULT_URL = import.meta.env.VITE_SUPABASE_URL || 'https://wkkphkdaqigzmmnpqpik.supabase.co';
const DEFAULT_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indra3Boa2RhcWlnem1tbnBxcGlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYxMDAyNDksImV4cCI6MjEwMTY3NjI0OX0.cSNbUbxvWv8pBX7GCCZ9MveMD3vf0JirMTZnlOAKiDA';

// Hàm băm mật khẩu chuẩn SHA-256 Web Crypto API
export async function hashPassword(password) {
  if (!password) return '';
  const msgBuffer = new TextEncoder().encode(password + '_salt_thcs_2026');
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

class SupabaseService {
  constructor() {
    this.url = localStorage.getItem('SUPABASE_URL') || DEFAULT_URL;
    this.anonKey = localStorage.getItem('SUPABASE_ANON_KEY') || DEFAULT_KEY;
    this.client = null;
    this.isConnected = false;
    this.init();
  }

  init() {
    try {
      if (this.url && this.anonKey) {
        this.client = createClient(this.url, this.anonKey, {
          auth: {
            persistSession: true,
            autoRefreshToken: true
          }
        });
        this.isConnected = true;
      }
    } catch (e) {
      console.warn('Lỗi khởi tạo Supabase Client:', e);
      this.client = null;
      this.isConnected = false;
    }
  }

  saveConfig(url, key) {
    url = (url || '').trim();
    key = (key || '').trim();
    if (!url || !key) return false;

    localStorage.setItem('SUPABASE_URL', url);
    localStorage.setItem('SUPABASE_ANON_KEY', key);
    this.url = url;
    this.anonKey = key;
    this.init();
    return true;
  }

  resetConfig() {
    localStorage.removeItem('SUPABASE_URL');
    localStorage.removeItem('SUPABASE_ANON_KEY');
    this.url = DEFAULT_URL;
    this.anonKey = DEFAULT_KEY;
    this.init();
  }

  async testConnection() {
    if (!this.client) return { success: false, message: 'Chưa có thông tin Supabase API Key!' };
    try {
      const { data, error } = await this.client.from('users').select('id, username').limit(1);
      if (error) throw error;
      return { success: true, message: 'Kết nối Supabase Cloud thành công 100%!' };
    } catch (err) {
      return { success: false, message: 'Lỗi kết nối: ' + (err.message || 'Kiểm tra lại cấu hình DB') };
    }
  }

  // ==========================================
  // XÁC THỰC NGƯỜI DÙNG TRỰC TIẾP TRÊN SUPABASE DB
  // ==========================================

  // Tìm người dùng theo username
  async getUserByUsername(username) {
    if (!this.client) return null;
    try {
      const cleanUsername = username.trim().toLowerCase();
      const { data, error } = await this.client
        .from('users')
        .select('*')
        .ilike('username', cleanUsername)
        .maybeSingle();

      if (error) {
        console.warn('Lỗi truy vấn người dùng:', error);
        return null;
      }
      return data;
    } catch (e) {
      console.warn('Lỗi mạng khi tìm người dùng:', e);
      return null;
    }
  }

  // Đăng nhập xác thực mật khẩu
  async authenticateUser(username, password) {
    if (!this.client) {
      return { success: false, message: 'Chưa kết nối đến cơ sở dữ liệu Supabase!' };
    }

    try {
      const cleanUsername = (username || '').trim().toLowerCase();
      const cleanPassword = (password || '').trim();

      if (!cleanUsername || !cleanPassword) {
        return { success: false, message: 'Vui lòng nhập đầy đủ Tên đăng nhập và Mật khẩu!' };
      }

      // Truy vấn tài khoản trong DB
      const user = await this.getUserByUsername(cleanUsername);

      if (!user) {
        return { success: false, message: `Tài khoản "${cleanUsername}" không tồn tại trên hệ thống!` };
      }

      const inputHash = await hashPassword(cleanPassword);
      
      // Kiểm tra mật khẩu (hỗ trợ hash SHA-256, hash thuần hoặc mật khẩu mặc định 123456)
      const isPasswordValid = 
        user.password_hash === inputHash || 
        user.password_hash === cleanPassword || 
        (cleanPassword === '123456' && (user.password_hash === '123456' || !user.password_hash));

      if (!isPasswordValid) {
        return { success: false, message: 'Mật khẩu không chính xác! Vui lòng thử lại.' };
      }

      // Tự động nâng cấp mật khẩu lên dạng hash SHA-256 an toàn nếu đang lưu dạng cũ
      if (user.password_hash !== inputHash) {
        this.client
          .from('users')
          .update({ password_hash: inputHash })
          .eq('id', user.id)
          .then(() => {})
          .catch(() => {});
      }

      // Ghi nhật ký đăng nhập vào activity_logs
      this.logActivity(user.id, 'login', `Đăng nhập hệ thống lúc ${new Date().toLocaleTimeString('vi-VN')}`, 0);

      // Định dạng dữ liệu người dùng trả về cho Frontend
      const userProfile = {
        id: user.id,
        username: user.username,
        name: user.full_name,
        email: user.email || `${user.username}@hocsinh.edu.vn`,
        role: user.role || 'student',
        class: user.class_name || (user.role === 'teacher' ? 'Giáo viên' : `Lớp ${user.grade_level || 6}A1`),
        grade: user.grade_level || 6,
        xp: user.total_xp || 0,
        level: user.current_level || 1,
        avatar: user.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.username}`,
        badgesCount: user.badges_count || 1,
        createdAt: user.created_at
      };

      return { 
        success: true, 
        user: userProfile, 
        message: `Đăng nhập thành công! Chào mừng ${userProfile.name} đã quay trở lại.` 
      };
    } catch (err) {
      console.error('Lỗi khi xác thực đăng nhập:', err);
      return { success: false, message: 'Lỗi máy chủ cơ sở dữ liệu: ' + (err.message || 'Không thể kết nối') };
    }
  }

  // Đăng ký tài khoản mới lưu trực tiếp vào Supabase DB
  async registerNewUser({ username, password, fullName, role = 'student', className, gradeLevel = 6, avatarUrl }) {
    if (!this.client) {
      return { success: false, message: 'Chưa kết nối đến cơ sở dữ liệu Supabase!' };
    }

    try {
      const cleanUsername = (username || '').trim().toLowerCase();
      const cleanPassword = (password || '').trim();
      const cleanFullName = (fullName || '').trim();
      const parsedGrade = parseInt(gradeLevel) || 6;
      const userRole = role || 'student';
      const userClass = className || (userRole === 'teacher' ? 'Giáo viên' : `Lớp ${parsedGrade}A1`);
      const finalAvatar = avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${cleanUsername}`;

      // 1. Kiểm tra username đã tồn tại chưa
      const existingUser = await this.getUserByUsername(cleanUsername);
      if (existingUser) {
        return { 
          success: false, 
          message: `Tên đăng nhập "${cleanUsername}" đã được đăng ký trước đó. Vui lòng chọn tên khác!` 
        };
      }

      // 2. Băm mật khẩu
      const passwordHash = await hashPassword(cleanPassword);

      // 3. Chèn bản ghi mới vào bảng public.users
      const { data: newUser, error } = await this.client
        .from('users')
        .insert([{
          username: cleanUsername,
          password_hash: passwordHash,
          full_name: cleanFullName,
          email: `${cleanUsername}@hocsinh.edu.vn`,
          role: userRole,
          class_name: userClass,
          grade_level: parsedGrade,
          avatar_url: finalAvatar,
          total_xp: 100, // Điểm thưởng chào mừng thành viên mới
          current_level: 1,
          badges_count: 1
        }])
        .select()
        .single();

      if (error) {
        throw error;
      }

      // 4. Ghi nhận hoạt động chào mừng
      await this.logActivity(newUser.id, 'register', 'Đăng ký tài khoản mới và nhận 100 XP danh dự', 100);

      const userProfile = {
        id: newUser.id,
        username: newUser.username,
        name: newUser.full_name,
        email: newUser.email,
        role: newUser.role,
        class: newUser.class_name,
        grade: newUser.grade_level,
        xp: newUser.total_xp,
        level: newUser.current_level,
        avatar: newUser.avatar_url,
        badgesCount: 1,
        createdAt: newUser.created_at
      };

      return {
        success: true,
        user: userProfile,
        message: `Đăng ký thành công tài khoản "${cleanUsername}"! Em nhận được +100 XP khởi đầu.`
      };
    } catch (err) {
      console.error('Lỗi khi đăng ký người dùng mới:', err);
      return { 
        success: false, 
        message: 'Không thể đăng ký vào cơ sở dữ liệu Supabase: ' + (err.message || 'Lỗi không xác định') 
      };
    }
  }

  // Cập nhật điểm kinh nghiệm XP & Level của người dùng trong Supabase DB
  async updateUserXP(userId, newXp, newLevel) {
    if (!this.client || !userId) return;
    try {
      await this.client
        .from('users')
        .update({
          total_xp: newXp,
          current_level: newLevel
        })
        .eq('id', userId);
    } catch (e) {
      console.warn('Lỗi cập nhật XP lên Supabase:', e);
    }
  }

  // Ghi nhật ký hành động (Audit & Activity log)
  async logActivity(userId, actionType, description, xpGained = 0) {
    if (!this.client || !userId) return;
    try {
      await this.client
        .from('activity_logs')
        .insert([{
          user_id: userId,
          action_type: actionType,
          description: description,
          xp_gained: xpGained
        }]);
    } catch (e) {
      // Bỏ qua lỗi log không ảnh hưởng luồng chính
    }
  }
}

export const supabaseService = new SupabaseService();
export const supabase = supabaseService.client;

