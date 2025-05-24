import bcrypt from 'bcrypt';
import db from '../config/db.js'; // 使用 mysql2/promise

// ✅ 註冊：密碼加密後寫入資料庫
export const signup = async (req, res) => {
  const { username, password, email, phone, role = 'lost_user' } = req.body;
  const violation_count = 0;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = `
      INSERT INTO user (username, password, email, phone, role, violation_count)
      VALUES (?, ?, ?, ?, ?, ?)`;
    
    await db.execute(sql, [username, hashedPassword, email, phone, role, violation_count]);

    res.status(201).json({ message: '註冊成功' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: '帳號或信箱已存在' });
    }
    console.error('❌ 註冊錯誤：', err);
    res.status(500).json({ message: '伺服器錯誤' });
  }
};

// ✅ 登入：比對密碼 + 回傳使用者資料
export const login = async (req, res) => {
  const { username, password } = req.body;
  console.log('🛂 收到登入請求：', { username });

  try {
    const [rows] = await db.execute(
      'SELECT * FROM user WHERE username = ?',
      [username]
    );

    if (rows.length === 0) {
      console.log('⚠️ 帳號不存在');
      return res.status(401).json({ message: '帳號不存在' });
    }

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      console.log('❌ 密碼錯誤');
      return res.status(401).json({ message: '密碼錯誤' });
    }

    console.log('✅ 登入成功');
    res.status(200).json({
      message: '登入成功',
      user: {
        user_id: user.user_id,
        username: user.username,
        role: user.role
      }
    });
  } catch (err) {
    console.error('❌ 登入流程錯誤：', err);
    res.status(500).json({ message: '伺服器錯誤' });
  }
};
