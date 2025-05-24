import db from '../config/db.js';

export const registerLostItem = (req, res) => {
  const { name, description, location, lost_date } = req.body;
  const image = req.file?.filename;

  const sql = `
    INSERT INTO lost_items (name, description, location, lost_date, image)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(sql, [name, description, location, lost_date, image], (err) => {
    if (err) return res.status(500).json({ message: '登記失物失敗', error: err });
    res.json({ message: '登記成功' });
  });
};
export const getAllLostItems = async (req, res) => {
    try {
      const [rows] = await db.query('SELECT * FROM lost_items ORDER BY created_at DESC');
      res.json(rows);
    } catch (err) {
      res.status(500).json({ message: '查詢失敗', error: err });
    }
  };
  
  