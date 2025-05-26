import jwt from 'jsonwebtoken';

export function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ error: '缺少授權標頭' });
  // 格式：Bearer tokenstring
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: '未提供 token，請重新登入' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // ✅ 存入 req.user 供後續使用
    next();
  } catch (err) {
    console.error('❌ token 驗證失敗：', err.message);
    return res.status(403).json({ message: '無效的 token，請重新登入' });
  }
}

export function verifyAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: '需要管理者權限' });
  }
  next();
}