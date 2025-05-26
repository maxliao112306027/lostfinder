// backend/controllers/storageLocationController.js

import db from '../config/db.js';

// ✅ 取得所有存放地點
export const getAllStorageLocations = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM storage_location');
    res.json(rows);
  } catch (err) {
    console.error('❌ 無法取得存放地點：', err);
    res.status(500).json({ error: '伺服器錯誤' });
  }
};
