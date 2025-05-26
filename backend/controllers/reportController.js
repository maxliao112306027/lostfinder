import db from '../config/db.js';

// ✅ 使用者提交檢舉
export const submitReport = async (req, res) => {
  const { item_id, reason } = req.body;
  const user_id = req.user.user_id;

  try {
    await db.query(`
      INSERT INTO report (item_id, user_id, reason, status)
      VALUES (?, ?, ?, 'pending')
    `, [item_id, user_id, reason]);

    res.status(201).json({ message: '檢舉已送出' });
  } catch (err) {
    console.error('❌ 檢舉送出失敗:', err);
    res.status(500).json({ error: '伺服器錯誤，無法送出檢舉' });
  }
};

// ✅ 管理員查詢待處理檢舉
export const getPendingReports = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        r.report_id,
        r.item_id,
        r.user_id,
        i.item_name,
        u.username,
        r.reason,
        r.status,
        r.admin_response,
        r.processed_by
      FROM report r
      JOIN user u ON r.user_id = u.user_id
      JOIN items i ON r.item_id = i.item_id
      WHERE r.status = 'pending'
      ORDER BY r.report_id DESC
    `);

    res.json(rows);
  } catch (err) {
    console.error('❌ 查詢檢舉失敗:', err);
    res.status(500).json({ error: '無法載入檢舉資料' });
  }
};

// ✅ 管理員通過檢舉
export const approveReport = async (req, res) => {
  const { admin_id } = req.body;
  const report_id = req.params.id;

  try {
    // 先更新報告狀態
    await db.query(`
      UPDATE report
      SET status = 'processed',
          processed_by = ?,
          admin_response = '✅ 檢舉成立'
      WHERE report_id = ?
    `, [admin_id, report_id]);

    // 🔍 根據 report_id 查出被檢舉的物品登記者（item.user_id）
    const [[itemRow]] = await db.query(`
      SELECT i.user_id
      FROM report r
      JOIN items i ON r.item_id = i.item_id
      WHERE r.report_id = ?
    `, [report_id]);

    const offender_id = itemRow?.user_id;

    // ✅ 對該使用者違規點數 +1
    if (offender_id) {
      await db.query(`
        UPDATE user
        SET violation_count = violation_count + 1
        WHERE user_id = ?
      `, [offender_id]);
    }

    res.json({ message: '✅ 檢舉已審核通過並記點' });
  } catch (err) {
    console.error('❌ 通過檢舉失敗:', err);
    res.status(500).json({ error: '無法審核檢舉' });
  }
};



// ✅ 管理員駁回檢舉
export const denyReport = async (req, res) => {
  const { admin_id } = req.body;
  const report_id = req.params.id;

  try {
    await db.query(`
      UPDATE report
      SET status = 'processed',
          processed_by = ?,
          admin_response = '❌ 檢舉不成立'
      WHERE report_id = ?
    `, [admin_id, report_id]);

    res.json({ message: '❌ 檢舉已駁回' });
  } catch (err) {
    console.error('❌ 駁回檢舉失敗:', err);
    res.status(500).json({ error: '無法駁回檢舉' });
  }
};
