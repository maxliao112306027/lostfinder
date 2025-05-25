import db from '../config/db.js';

export const registerLostItem = async (req, res) => {
  try {
    const { name, description, location, lost_date, user_id } = req.body;
    const image = req.file ? req.file.filename : null;

    await db.query(`
      INSERT INTO lost_items (name, description, location, lost_date, image)
      VALUES (?, ?, ?, ?, ?)
    `, [name, description, location, lost_date, image, user_id]);

    res.json({ message: '遺失物登記成功' }); // ✅ 一定要有這行
  } catch (err) {
    console.error('❌ 登記失敗:', err);
    res.status(500).json({ error: '伺服器錯誤' });
  }
};

export const getAllLostItems = async (req, res) => {
    try {
      const [rows] = await db.query('SELECT * FROM lost_items ORDER BY created_at DESC');
      res.json(rows);
    } catch (err) {
      res.status(500).json({ message: '查詢失敗', error: err });
    }
  };
  
  