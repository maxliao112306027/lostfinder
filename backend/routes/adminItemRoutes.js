import express from 'express';
import { getAllItemsWithLocation, updateItemByAdmin } from '../controllers/adminItemController.js';
import { verifyToken, verifyAdmin } from '../middleware/verifyToken.js';

const router = express.Router();

router.get('/', verifyToken, verifyAdmin, getAllItemsWithLocation);
router.put('/:id', verifyToken, verifyAdmin, updateItemByAdmin);

export default router;
