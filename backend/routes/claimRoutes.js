import express from 'express';
import {
  submitClaimRequest,
  getMyClaims,
  deleteClaimRequest,
  getPendingClaims,   // ✅ 新增
  approveClaim,       // ✅ 新增
  denyClaim           // ✅ 新增
} from '../controllers/claimController.js';

const router = express.Router();

// 使用者功能
router.post('/', submitClaimRequest);
router.get('/my-claims', getMyClaims);
router.delete('/:id', deleteClaimRequest);

// 管理者功能
router.get('/pending', getPendingClaims);              // ✅ 查詢所有待審核申請
router.patch('/:id/approve', approveClaim);            // ✅ 審核通過
router.patch('/:id/deny', denyClaim);                  // ✅ 審核拒絕

export default router;
