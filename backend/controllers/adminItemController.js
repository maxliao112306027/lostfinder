import db from '../config/db.js';

// ✅ 取得所有物品（含地點名稱）
export const getAllItemsWithLocation = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT items.*, storage_location.location_name
      FROM items
      LEFT JOIN storage_location ON items.storage_location_id = storage_location.storage_location_id
    `);
    res.json(rows);
  } catch (err) {
    console.error('❌ 無法取得物品清單：', err);
    res.status(500).json({ error: '伺服器錯誤' });
  }
};

// ✅ 更新物品狀態與地點
export const updateItemByAdmin = async (req, res) => {
  const itemId = req.params.id;
  const { status, location_name } = req.body;

  try {
    let locationId = null;
    if (location_name) {
      const [locRows] = await db.query(
        'SELECT storage_location_id FROM storage_location WHERE location_name = ?',
        [location_name]
      );
      if (locRows.length) {
        locationId = locRows[0].storage_location_id;
      } else {
        return res.status(400).json({ error: '找不到此存放地點' });
      }
    }

    await db.query(
      'UPDATE items SET status = ?, storage_location_id = ? WHERE item_id = ?',
      [status, locationId, itemId]
    );
    res.json({ message: '更新成功' });
  } catch (err) {
    console.error('❌ 更新失敗：', err);
    res.status(500).json({ error: '伺服器錯誤' });
  }
};
