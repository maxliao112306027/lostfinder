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
import claimRoutes from './routes/claimRoutes.js';


dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('backend/uploads'));
app.use('/api/claim_requests', claimRoutes);
app.use('/api', lostItemRoutes);

app.get('/api/items', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT * FROM items
       WHERE status != 'claimed'
       ORDER BY lost_date DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error('❌ 查詢失物清單失敗:', err);
    res.status(500).json({ error: '伺服器錯誤' });
  }
});


app.get('/api/my-claims', async (req, res) => {
  const { user_id } = req.query;
  if (!user_id) return res.status(400).json({ error: '缺少 user_id' });

  try {
    const [rows] = await pool.query(`
      SELECT c.*,item_name
      FROM claim_request c
      JOIN items i ON c.item_id = i.item_id
      WHERE c.user_id = ?
    `, [user_id]);

    res.json(rows);
  } catch (err) {
    console.error('❌ 查詢認領紀錄失敗:', err);
    res.status(500).json({ error: '伺服器錯誤' });
  }
});
app.post('/api/claims', async (req, res) => {
  const { item_id, user_id, reason } = req.body;
  if (!item_id || !user_id) {
    return res.status(400).json({ error: '缺少必要欄位' });
  }

  try {
    await pool.query(`
      INSERT INTO claim_request (item_id, user_id, reason, status)
      VALUES (?, ?, ?, 'pending')
    `, [item_id, user_id, reason || '']);

    res.json({ message: '認領申請已提交' });
  } catch (err) {
    console.error('❌ 認領錯誤:', err);
    res.status(500).json({ error: '伺服器錯誤' });
  }
});

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
