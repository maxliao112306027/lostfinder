import express from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import {
  submitReport,
  getPendingReports,
  approveReport,
  denyReport
} from '../controllers/reportController.js';

const router = express.Router();

router.post('/', verifyToken, submitReport);
router.get('/pending', verifyToken, getPendingReports);
router.patch('/:id/approve', verifyToken, approveReport);
router.patch('/:id/deny', verifyToken, denyReport);

export default router;
