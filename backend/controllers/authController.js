import db from '../config/db.js';  // 注意要加 .js 副檔名，ESM 規定

export const signup = (req, res) => {
  const { username, password, email, phone } = req.body;

  const role = 'user'; // 固定只能註冊 user
  const violation_count = 0;

  const sql = `
    INSERT INTO user (username, password, email, phone, role, violation_count)
    VALUES (?, ?, ?, ?, ?, ?)`;

  db.query(sql, [username, password, email, phone, role, violation_count], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ message: '帳號或信箱已存在' });
      }
      return res.status(500).json({ message: '伺服器錯誤' });
    }
    res.status(201).json({ message: '註冊成功' });
  });
};

export const login = (req, res) => {
  const { username, password } = req.body;

  const sql = `SELECT * FROM user WHERE username = ? AND password = ?`;

  db.query(sql, [username, password], (err, results) => {
    if (err) return res.status(500).json({ message: '伺服器錯誤' });
    if (results.length === 0) return res.status(401).json({ message: '帳號或密碼錯誤' });

    res.status(200).json({ message: '登入成功', user: results[0] });
  });
};
