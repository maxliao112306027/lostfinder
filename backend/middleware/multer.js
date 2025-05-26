// backend/middleware/multer.js
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

// 處理 __dirname 用於 ES Module 模式
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 設定 multer 儲存邏輯
const storage = multer.diskStorage({
  // 圖片存放目錄
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/'));
  },
  // 檔名處理（避免重名）
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const randomNum = Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase();
    const safeName = `${file.fieldname}-${timestamp}-${randomNum}${ext}`;
    cb(null, safeName);
  }
});

// 匯出 middleware
export const upload = multer({ storage });
