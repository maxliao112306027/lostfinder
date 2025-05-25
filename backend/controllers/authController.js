import * as authService from '../services/authService.js';

// ✅ 註冊
export const register = async (req, res) => {
  const { username, password, email, phone, role = 'lost_user' } = req.body;

  // 密碼格式驗證（至少8碼、含英文字母與數字）
  const passwordValid =
    typeof password === 'string' &&
    password.length >= 8 &&
    /[a-zA-Z]/.test(password) &&
    /\d/.test(password);

  if (!username || !passwordValid) {
    return res.status(400).json({
      message: '密碼需至少8碼並包含英文字母與數字',
    });
  }

  try {
    const result = await authService.registerUser({
      username,
      password,
      email,
      phone,
      role,
    });
    res.status(201).json({ message: '註冊成功', user: result });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: '帳號或信箱已存在' });
    }
    console.error('❌ 註冊錯誤：', err);
    res.status(500).json({ message: '伺服器錯誤' });
  }
};

// ✅ 登入
export const login = async (req, res) => {
  const { username, password } = req.body;

  // 基本輸入檢查
  if (!username || !password) {
    return res.status(400).json({ message: '請輸入帳號與密碼' });
  }

  try {
    const user = await authService.loginUser(username, password);
    res.status(200).json({
      message: '登入成功',
      user: {
        user_id: user.user_id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('❌ 登入錯誤：', err.message);
    res.status(401).json({ message: err.message });
  }
};
