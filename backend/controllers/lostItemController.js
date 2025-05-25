import db from '../config/db.js';

// ✅ 新增遺失物：POST /api/lostitems
export const registerLostItem = async (req, res) => {
  const { item_name, description, lost_location, lost_date } = req.body;
  const image = req.file?.filename || null; // ✅ multer 上傳後的圖片檔名（已儲存在 backend/uploads）
  const user_id = req.user.user_id;         // ✅ JWT 驗證後解析出的使用者 ID

  try {
    // ✅ Step 1：先插入 item 主資料
    const insertItemSQL = `
      INSERT INTO items (item_name, description, lost_location, lost_date, user_id)
      VALUES (?, ?, ?, ?, ?)
    `;
    const [itemResult] = await db.query(insertItemSQL, [
      item_name,
      description,
      lost_location,
      lost_date,
      user_id
    ]);

    const item_id = itemResult.insertId;

    // ✅ Step 2：若有圖片，插入 image 表（支援一對多）
    if (image) {
      const imagePath = `uploads/${image}`; // 📂 儲存在 backend/uploads/xxx.jpg
      await db.query(
        `INSERT INTO image (item_id, image_url) VALUES (?, ?)`,
        [item_id, imagePath]
      );
    }

    res.status(201).json({
      message: '遺失物登記成功',
      item_id
    });
  } catch (err) {
    console.error('❌ DB Insert Error:', err);
    res.status(500).json({ message: '登記失物失敗', error: err });
  }
};


// ✅ 查詢所有遺失物：GET /api/lostitems
export const getAllLostItems = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM items ORDER BY created_at DESC');
    res.status(200).json(rows);
  } catch (err) {
    console.error('❌ DB Select Error:', err);
    res.status(500).json({ message: '查詢失敗', error: err });
  }
};
