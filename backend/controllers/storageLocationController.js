// backend/controllers/storageLocationController.js

import db from '../config/db.js';

// ✅ 1. 取得所有地點
export const getAllStorageLocations = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM storage_location');
    res.json(rows);
  } catch (err) {
    console.error('❌ 無法取得存放地點：', err);
    res.status(500).json({ error: '伺服器錯誤' });
  }
};

// ✅ 2. 新增地點
export const createStorageLocation = async (req, res) => {
  const { location_name, description } = req.body;
  if (!location_name) return res.status(400).json({ error: '缺少地點名稱' });

  try {
    await db.query('INSERT INTO storage_location (location_name, description) VALUES (?, ?)', [location_name, description]);
    res.status(201).json({ message: '✅ 新增成功' });
  } catch (err) {
    console.error('❌ 新增失敗:', err);
    res.status(500).json({ error: '伺服器錯誤' });
  }
};

// ✅ 3. 修改地點
export const updateStorageLocation = async (req, res) => {
  const { id } = req.params;
  const { location_name, description } = req.body;
  if (!location_name) return res.status(400).json({ error: '缺少地點名稱' });

  try {
    const [result] = await db.query(
      'UPDATE storage_location SET location_name = ?, description = ? WHERE storage_location_id = ?',
      [location_name, description, id]
    );
    res.json({ message: '✅ 修改成功', affectedRows: result.affectedRows });
  } catch (err) {
    console.error('❌ 修改失敗:', err);
    res.status(500).json({ error: '伺服器錯誤' });
  }
};

// ✅ 4. 取得某地點與物品清單
export const getLocationWithItems = async (req, res) => {
  const { id } = req.params;
  try {
    const [[location]] = await db.query('SELECT * FROM storage_location WHERE storage_location_id = ?', [id]);
    if (!location) return res.status(404).json({ error: '找不到該地點' });

    const [items] = await db.query(
      `SELECT item_id, item_name, status FROM items WHERE storage_location_id = ?`,
      [id]
    );

    res.json({ ...location, items });
  } catch (err) {
    console.error('❌ 查詢失敗:', err);
    res.status(500).json({ error: '伺服器錯誤' });
  }
};
