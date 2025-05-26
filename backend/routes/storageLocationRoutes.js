// backend/routes/storageLocationRoutes.js

import express from 'express';
import {
  getAllStorageLocations,
  createStorageLocation,
  updateStorageLocation,
  getLocationWithItems
} from '../controllers/storageLocationController.js';

const router = express.Router();

router.get('/storage-locations', getAllStorageLocations);
router.post('/storage-locations', createStorageLocation);
router.put('/storage-locations/:id', updateStorageLocation);
router.get('/storage-locations/:id', getLocationWithItems);

export default router;
