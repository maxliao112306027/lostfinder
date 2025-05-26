import express from 'express';
import { registerLostItem, getAllLostItems } from '../controllers/lostItemController.js';
import { verifyToken } from '../middleware/verifyToken.js';
import { upload } from '../middleware/multer.js'; // ✅ 使用自訂 multer 設定

const router = express.Router();

// 公開路由：取得所有遺失物
router.get('/lostitems', getAllLostItems);

// 保護路由：新增遺失物（需 JWT 登入 + 上傳圖片）
router.post('/lostitems', verifyToken, upload.single('image'), registerLostItem);

export default router;
