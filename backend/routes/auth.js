// backend/routes/auth.js
import express from 'express';
import { signup, login } from '../controllers/authController.js';

const router = express.Router();

// 註冊路由

router.post('/signup', signup);

// 登入路由

router.post('/login', login);

export default router;
