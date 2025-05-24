import bcrypt from 'bcrypt';
import db from '../config/db.js'; // 使用 mysql2 callback 版本連線

// ✅ 使用者註冊
export const signup = async (req, res) => {
  const { username, password, email, phone, role = 'lost_user' } = req.body;
  const violation_count = 0;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = `
      INSERT INTO user (username, password, email, phone, role, violation_count)
      VALUES (?, ?, ?, ?, ?, ?)`;

    db.query(sql, [username, hashedPassword, email, phone, role, violation_count], (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(400).json({ message: '帳號或信箱已存在' });
        }
        console.error('❌ 資料庫錯誤（註冊）：', err);
        return res.status(500).json({ message: '伺服器錯誤' });
      }
      res.status(201).json({ message: '註冊成功' });
    });
  } catch (error) {
    console.error('❌ 密碼加密錯誤：', error);
    res.status(500).json({ message: '加密失敗' });
  }
};

// ✅ 使用者登入
export const login = (req, res) => {
  const { username, password } = req.body;

  console.log('🛂 收到登入請求：', { username, password });

  const sql = `SELECT * FROM user WHERE username = ?`;

  try {
    db.query(sql, [username], async (err, results) => {
      if (err) {
        console.error('❌ 查詢錯誤（登入）：', err);
        return res.status(500).json({ message: '伺服器錯誤' });
      }

      if (results.length === 0) {
        console.log('⚠️ 帳號不存在');
        return res.status(401).json({ message: '帳號不存在' });
      }

      const user = results[0];
      console.log('🔐 準備比對密碼');

      try {
        const match = await bcrypt.compare(password, user.password);

        if (!match) {
          console.log('❌ 密碼錯誤');
          return res.status(401).json({ message: '密碼錯誤' });
        }

        console.log('✅ 密碼正確，登入成功');
        res.status(200).json({
          message: '登入成功',
          user: {
            user_id: user.user_id,
            username: user.username,
            role: user.role
          }
        });
      } catch (compareErr) {
        console.error('❌ bcrypt 錯誤：', compareErr);
        res.status(500).json({ message: '密碼驗證失敗' });
      }
    });
  } catch (outerErr) {
    console.error('❌ 外層錯誤：', outerErr);
    res.status(500).json({ message: '登入流程錯誤' });
  }
};
