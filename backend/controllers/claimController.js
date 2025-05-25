export const submitClaimRequest = async (req, res) => {
    const { item_id, user_id, reason } = req.body;
  
    if (!item_id || !user_id) {
      return res.status(400).json({ error: '缺少 item_id 或 user_id' });
    }
  
    try {
      const [result] = await db.query(
        `INSERT INTO claim_request (item_id, user_id, status, request_date)
         VALUES (?, ?, 'pending', NOW())`,
        [item_id, user_id]
      );
  
      res.json({ message: '認領申請已送出', request_id: result.insertId });
    } catch (err) {
      console.error('❌ 認領申請失敗:', err);
      res.status(500).json({ error: '伺服器錯誤' });
    }
  };
  export const getMyClaims = async (req, res) => {
    const { user_id } = req.query;
  
    if (!user_id) {
      return res.status(400).json({ error: '缺少 user_id' });
    }
  
    try {
      const [rows] = await db.query(
        `SELECT c.*, i.item_name
         FROM claim_request c
         JOIN items i ON c.item_id = i.item_id
         WHERE c.user_id = ?
         ORDER BY c.request_date DESC`,
        [user_id]
      );
  
      res.json(rows);
    } catch (err) {
      console.error('❌ 查詢認領失敗:', err);
      res.status(500).json({ error: '伺服器錯誤' });
    }
  };
    