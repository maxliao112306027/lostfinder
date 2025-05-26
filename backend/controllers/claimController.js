import db from '../config/db.js';


// ✅ 提出認領申請（含防止重複申請）
export const submitClaimRequest = async (req, res) => {
  const { item_id, user_id, reason } = req.body;

  if (!item_id || !user_id) {
    return res.status(400).json({ error: '缺少 item_id 或 user_id' });
  }

  try {
    // 檢查是否已有 pending 的申請
    const [existing] = await db.query(
      `SELECT * FROM claim_request
       WHERE item_id = ? AND user_id = ? AND status = 'pending'`,
      [item_id, user_id]
    );

    if (existing.length > 0) {
      return res.status(400).json({ error: '您已對此物品提出認領申請，請勿重複送出。' });
    }

    // 新增認領申請
    const [result] = await db.query(
      `INSERT INTO claim_request (item_id, user_id, reason, status, request_date)
       VALUES (?, ?, ?, 'pending', NOW())`,
      [item_id, user_id, reason || '']
    );

    // 將 item 狀態設為 pending_claim
    await db.query(
      `UPDATE items SET status = 'pending_claim' WHERE item_id = ?`,
      [item_id]
    );

    res.json({ message: '✅ 認領申請已送出', request_id: result.insertId });
  } catch (err) {
    console.error('❌ 認領申請失敗:', err);
    res.status(500).json({ error: '伺服器錯誤' });
  }
};

// ✅ 查詢個人申請紀錄
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

// ✅ 取消認領申請（限 pending 狀態）
export const deleteClaimRequest = async (req, res) => {
  const requestId = req.params.id;

  try {
    // 查詢申請紀錄與 item_id
    const [rows] = await db.query(
      `SELECT * FROM claim_request WHERE request_id = ? AND status = 'pending'`,
      [requestId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: '找不到待取消的認領申請' });
    }

    const itemId = rows[0].item_id;

    // 刪除該認領申請
    await db.query(`DELETE FROM claim_request WHERE request_id = ?`, [requestId]);

    // 檢查是否還有其他對同一物品的 pending 申請
    const [remaining] = await db.query(
      `SELECT * FROM claim_request WHERE item_id = ? AND status = 'pending'`,
      [itemId]
    );

    if (remaining.length === 0) {
      // 沒有其他 pending → 把 item 狀態改回 found
      await db.query(`UPDATE items SET status = 'found' WHERE item_id = ?`, [itemId]);
    }

    res.json({ message: '✅ 已成功取消認領申請' });
  } catch (err) {
    console.error('❌ 取消認領失敗:', err);
    res.status(500).json({ error: '伺服器錯誤' });
  }
};

// ✅ 取得所有待審核的認領申請（管理者用）
export const getPendingClaims = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT c.*, i.item_name, u.username
       FROM claim_request c
       JOIN items i ON c.item_id = i.item_id
       JOIN user u ON c.user_id = u.user_id
       WHERE c.status = 'pending'
       ORDER BY c.request_date ASC`
    );
    res.json(rows);
  } catch (err) {
    console.error('❌ 查詢待審核失敗:', err);
    res.status(500).json({ error: '伺服器錯誤' });
  }
};

// ✅ 管理者通過認領申請
export const approveClaim = async (req, res) => {
  const requestId = req.params.id;
  const adminId = req.body.admin_id;

  try {
    const [requests] = await db.query(
      `SELECT * FROM claim_request WHERE request_id = ? AND status = 'pending'`,
      [requestId]
    );

    if (requests.length === 0) {
      return res.status(404).json({ error: '申請不存在或已被處理' });
    }

    const { item_id, user_id } = requests[0];

    // 更新該申請為 approved
    await db.query(
      `UPDATE claim_request
       SET status = 'approved', approved_by = ?, request_date = NOW()
       WHERE request_id = ?`,
      [adminId, requestId]
    );

    // 將物品設為 claimed 並紀錄 claimed_by
    await db.query(
      `UPDATE items
       SET status = 'claimed', claimed_by = ?
       WHERE item_id = ?`,
      [user_id, item_id]
    );

    // 將其他同物品的 pending 申請改為 rejected
    await db.query(
      `UPDATE claim_request
       SET status = 'denied'
       WHERE item_id = ? AND status = 'pending' AND request_id != ?`,
      [item_id, requestId]
    );

    res.json({ message: '✅ 認領已通過' });
  } catch (err) {
    console.error('❌ 通過申請失敗:', err);
    res.status(500).json({ error: '伺服器錯誤' });
  }
};

// ✅ 管理者拒絕認領申請
export const denyClaim = async (req, res) => {
  const requestId = req.params.id;
  const adminId = req.body.admin_id;

  try {
    const [requests] = await db.query(
      `SELECT * FROM claim_request WHERE request_id = ? AND status = 'pending'`,
      [requestId]
    );

    if (requests.length === 0) {
      return res.status(404).json({ error: '申請不存在或已被處理' });
    }

    const itemId = requests[0].item_id;

    // 拒絕該筆申請
    await db.query(
      `UPDATE claim_request
       SET status = 'denied', approved_by = ?, request_date = NOW()
       WHERE request_id = ?`,
      [adminId, requestId]
    );

    // 檢查是否 item 還有其他 pending 申請，沒有就把 item 改回 found
    const [remaining] = await db.query(
      `SELECT * FROM claim_request
       WHERE item_id = ? AND status = 'pending'`,
      [itemId]
    );

    if (remaining.length === 0) {
      await db.query(
        `UPDATE items SET status = 'found' WHERE item_id = ?`,
        [itemId]
      );
    }

    res.json({ message: '❌ 已拒絕該認領申請' });
  } catch (err) {
    console.error('❌ 拒絕申請失敗:', err);
    res.status(500).json({ error: '伺服器錯誤' });
  }
};
