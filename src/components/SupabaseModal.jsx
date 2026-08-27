/* ============================================================================
   SUPABASE CONFIG MODAL COMPONENT (REACT 18)
   ============================================================================ */

import React, { useState } from 'react';
import { supabaseService } from '../services/supabaseClient';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';

export const SupabaseModal = ({ isOpen, onClose, onOpenSql }) => {
  const { syncSupabaseData } = useData();
  const { currentUser } = useAuth();
  const [url, setUrl] = useState(supabaseService.url);
  const [key, setKey] = useState(supabaseService.anonKey);
  const [statusResult, setStatusResult] = useState(null);

  if (!isOpen) return null;

  const isAdmin = currentUser?.role === 'admin' || (currentUser?.email || '').trim().toLowerCase() === 'hdieudate10284@gmail.com';

  const handleTest = async () => {
    if (!isAdmin) {
      alert('🔒 Chỉ tài khoản Admin QTV mới được phép thực thi lệnh trên Supabase DB!');
      return;
    }
    supabaseService.saveConfig(url, key);
    setStatusResult({ type: 'info', text: '⏳ Đang kiểm tra kết nối tới Supabase Cloud...' });
    const res = await supabaseService.testConnection();
    if (res.success) {
      setStatusResult({ type: 'success', text: '🎉 ' + res.message });
      syncSupabaseData();
    } else {
      setStatusResult({ type: 'error', text: '⚠️ ' + res.message });
    }
  };

  const handleReset = () => {
    if (!isAdmin) {
      alert('🔒 Chỉ tài khoản Admin QTV mới được phép khôi phục cấu hình!');
      return;
    }
    supabaseService.resetConfig();
    setUrl(supabaseService.url);
    setKey(supabaseService.anonKey);
    setStatusResult({ type: 'success', text: 'Đã khôi phục về cấu hình Supabase mặc định của dự án!' });
    syncSupabaseData();
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target.className === 'modal-overlay' && onClose()}>
      <div className="modal-container">
        <button className="modal-close-btn" onClick={onClose}>✕</button>

        <div>
          <span className="hero-badge" style={{ background: '#D1FAE5', color: '#065F46' }}>
            ⚡ SUPABASE POSTGRESQL CLOUD DATABASE
          </span>
          <h2 style={{ fontSize: '22px', fontWeight: 900, color: '#1E293B', margin: '6px 0 16px 0' }}>
            Cấu Hình Kết Nối Supabase Cloud
          </h2>

          {!isAdmin && (
            <div style={{ background: '#FEF2F2', border: '1.5px solid #FCA5A5', borderRadius: '14px', padding: '16px', marginBottom: '20px', color: '#991B1B' }}>
              <div style={{ fontWeight: 800, fontSize: '14px', marginBottom: '4px' }}>🔒 QUYỀN HẠN DÀNH RIÊNG CHO ADMIN QTV</div>
              <p style={{ fontSize: '13px', margin: 0, lineHeight: '1.5' }}>
                Chức năng Cấu hình & Quản trị ô Supabase DB chỉ dành riêng cho tài khoản <strong>Admin QTV</strong>.
              </p>
            </div>
          )}

          <div style={{ background: '#F8FAFC', border: '1px solid #CBD5E1', borderRadius: '16px', padding: '20px', marginBottom: '20px', opacity: isAdmin ? 1 : 0.65 }}>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                🔗 Supabase Project URL:
              </label>
              <input 
                type="text" 
                value={url}
                disabled={!isAdmin}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://xyz.supabase.co" 
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontFamily: 'monospace', fontSize: '13px', background: isAdmin ? '#FFFFFF' : '#F1F5F9' }} 
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                🔑 Supabase Anon / Public API Key (Client Safe):
              </label>
              <input 
                type="password" 
                value={key}
                disabled={!isAdmin}
                onChange={(e) => setKey(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." 
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontFamily: 'monospace', fontSize: '13px', background: isAdmin ? '#FFFFFF' : '#F1F5F9' }} 
              />
            </div>

            {statusResult && (
              <div style={{
                padding: '12px', borderRadius: '10px', fontSize: '13px', fontWeight: 600, marginBottom: '16px',
                background: statusResult.type === 'success' ? '#DCFCE7' : statusResult.type === 'error' ? '#FEE2E2' : '#EFF6FF',
                color: statusResult.type === 'success' ? '#15803D' : statusResult.type === 'error' ? '#991B1B' : '#1E40AF',
                border: `1px solid ${statusResult.type === 'success' ? '#86EFAC' : statusResult.type === 'error' ? '#FECACA' : '#BFDBFE'}`
              }}>
                {statusResult.text}
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button className="btn-primary" disabled={!isAdmin} onClick={handleTest} style={{ opacity: isAdmin ? 1 : 0.5, cursor: isAdmin ? 'pointer' : 'not-allowed' }}>
                🔍 Kiểm Tra & Đồng Bộ Ngay
              </button>
              <button className="btn-secondary" onClick={onOpenSql}>
                📋 Lấy Mã SQL Khởi Tạo Bảng
              </button>
              <button className="btn-secondary" disabled={!isAdmin} style={{ background: '#F1F5F9', opacity: isAdmin ? 1 : 0.5, cursor: isAdmin ? 'pointer' : 'not-allowed' }} onClick={handleReset}>
                🔄 Khôi Phục Mặc Định
              </button>
            </div>
          </div>

          <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '12px', padding: '14px', fontSize: '13px', color: '#1E40AF', lineHeight: '1.6' }}>
            <strong>💡 Hướng dẫn cấu hình Deploy Vercel:</strong><br />
            Khi đẩy code lên Vercel, Thầy/Cô vào mục <strong>Settings ➔ Environment Variables</strong> và thêm 2 biến:<br />
            • <code>VITE_SUPABASE_URL</code><br />
            • <code>VITE_SUPABASE_ANON_KEY</code>
          </div>
        </div>
      </div>
    </div>
  );
};
