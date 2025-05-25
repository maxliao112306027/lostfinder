import pool from '../config/db.js';

// 建立新使用者
export async function createUser({ username, password, email, phone, role, violation_count }) {
  const sql = `
    INSERT INTO user (username, password, email, phone, role, violation_count)
    VALUES (?, ?, ?, ?, ?, ?)`;
  const [result] = await pool.query(sql, [username, password, email, phone, role, violation_count]);
  return result.insertId;
}

// 根據帳號查詢使用者
export async function getUserByUsername(username) {
  const [rows] = await pool.query(
    'SELECT * FROM user WHERE username = ?',
    [username]
  );
  return rows[0];
}
