import express from 'express';
import { createClaimRequest, getMyClaims } from '../controllers/claimController.js';
const router = express.Router();
router.post('/', createClaimRequest);
router.get('/my-claims', getMyClaims);
export default router;
