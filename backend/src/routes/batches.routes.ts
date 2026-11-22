import { Router } from 'express';
import {
  closeBatch,
  createBatch,
  listBatches,
  updateBatch,
} from '../controllers/batches.controller.js';
import { requireAuth, requireOwner } from '../middleware/auth.js';

const router = Router();

router.get('/', requireAuth, listBatches);
router.post('/', requireAuth, requireOwner, createBatch);
router.patch('/:id', requireAuth, requireOwner, updateBatch);
router.patch('/:id/close', requireAuth, requireOwner, closeBatch);

export default router;
