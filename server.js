// ============================================================================
// LOCAL DEVELOPMENT SERVER (MÁY CHỦ THỬ NGHIỆM NỘI BỘ)
// Không cần cài thêm thư viện (Zero-dependency), chạy trực tiếp bằng Node.js
// ============================================================================

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const HOST = '127.0.0.1';
const ROOT_DIR = __dirname;

// Bảng ánh xạ MIME types (định dạng tệp trình duyệt hiểu được)
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.sql': 'text/plain; charset=utf-8',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.txt': 'text/plain; charset=utf-8'
};

const server = http.createServer((req, res) => {
  // CORS & Security Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Phân tích URL và làm sạch đường dẫn tránh path traversal (tấn công vượt cấp thư mục)
  let safePath = decodeURI(req.url.split('?')[0]);
  if (safePath === '/' || safePath === '') {
    safePath = '/index.html';
  }

  const filePath = path.normalize(path.join(ROOT_DIR, safePath));

  // Đảm bảo không truy cập ngoài thư mục gốc
  if (!filePath.startsWith(ROOT_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('403 Forbidden: Không có quyền truy cập');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err) {
      // Nếu không tìm thấy file
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(`
        <!DOCTYPE html>
        <html lang="vi">
        <head><meta charset="utf-8"><title>404 - Không tìm thấy</title></head>
        <body style="font-family: sans-serif; text-align: center; padding: 50px;">
          <h2>❌ 404 - Không tìm thấy tệp yêu cầu</h2>
          <p>Đường dẫn: <code>${safePath}</code></p>
          <a href="/">⬅️ Quay về trang chủ</a>
        </body>
        </html>
      `);
      console.log(`[404 NOT FOUND] ${req.method} ${safePath}`);
      return;
    }

    // Nếu là thư mục, thử tìm index.html bên trong
    let targetPath = filePath;
    if (stats.isDirectory()) {
      targetPath = path.join(filePath, 'index.html');
    }

    const ext = path.extname(targetPath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(targetPath, (readErr, content) => {
      if (readErr) {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('500 Internal Server Error: Lỗi đọc tệp máy chủ');
        console.error(`[500 ERROR] ${targetPath}:`, readErr);
        return;
      }

      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      });
      res.end(content);
      console.log(`[200 OK] ${req.method} ${safePath} (${contentType})`);
    });
  });
});

// Khởi động lắng nghe
server.listen(PORT, HOST, () => {
  console.log(`\n==================================================`);
  console.log(`🚀 Máy chủ Localhost Tin học THCS đang hoạt động!`);
  console.log(`📍 Địa chỉ truy cập: http://${HOST}:${PORT}`);
  console.log(`📍 Hoặc:            http://localhost:${PORT}`);
  console.log(`📁 Thư mục gốc:    ${ROOT_DIR}`);
  console.log(`==================================================\n`);
});

server.on('error', (e) => {
  if (e.code === 'EADDRINUSE') {
    const nextPort = PORT + 1;
    console.log(`⚠️ Cổng ${PORT} đang bận, tự động chuyển sang cổng ${nextPort}...`);
    server.listen(nextPort, HOST);
  } else {
    console.error('Lỗi máy chủ:', e);
  }
});
