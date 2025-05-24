import express from 'express';
import { signup, login } from '../controllers/authController.js';

const router = express.Router();

// 註冊 API
router.post('/signup', signup);

// 登入 API
router.post('/login', login);

export default router;
