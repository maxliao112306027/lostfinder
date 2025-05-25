import bcrypt from 'bcrypt';
import * as userModel from '../models/userModel.js';

export async function registerUser({ username, password, email, phone }) {
  const existing = await userModel.getUserByUsername(username);
  if (existing) {
    throw new Error('帳號已存在');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const userId = await userModel.createUser({
    username,
    password: hashedPassword,
    email,
    phone,
    role: 'user',        // 強制指定角色為一般使用者
    violation_count: 0        // 初始違規點數為 0
  });

  return { userId, username };
}

export async function loginUser(username, password) {
  const user = await userModel.getUserByUsername(username);
  if (!user) throw new Error('帳號不存在');

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error('密碼錯誤');

  return user;
}
