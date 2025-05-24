import express from 'express';
import multer from 'multer';
import { registerLostItem } from '../controllers/lostItemController.js';

const router = express.Router();
const upload = multer({ dest: 'backend/uploads/' });
import { getAllLostItems } from '../controllers/lostItemController.js';

router.get('/lostitems', getAllLostItems);

router.post('/lostitems', upload.single('image'), registerLostItem);

export default router;

