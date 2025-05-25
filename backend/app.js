// backend/app.js
import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import pool from './config/db.js';
import authRoutes from './routes/auth.js';
import lostItemRoutes from './routes/lostItem.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ API 路由（掛在 /api）
app.use('/api', authRoutes);
app.use('/api', lostItemRoutes); // 若你想讓 /items 這種路徑直接出現，可以保留這樣設計

// ✅ 提供 frontend/public 作為靜態檔案路徑
app.use(express.static(path.join(__dirname, '../frontend/public')));

// ✅ 預設首頁導向 login.html
app.get('/', (req, res) => {
  console.log('🔁 導向 login.html');
  res.redirect('/login.html');
});

// ✅ 測試路由
app.get('/test', (req, res) => {
  res.send('Server is working!');
});

// ✅ 啟動伺服器與測試資料庫連線
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ 資料庫連線成功！');
    connection.release();

    app.listen(PORT, () => {
      console.log(`✅ Server running at http://localhost:${PORT}`);
      openBrowser(`http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ 資料庫連線失敗：', error);
  }
})();

// ✅ 自動開啟瀏覽器（跨平台）
function openBrowser(url) {
  const start =
    process.platform === 'darwin' ? 'open' :
    process.platform === 'win32' ? 'start' :
    'xdg-open';
  import('child_process').then(({ exec }) => exec(`${start} ${url}`));
}
