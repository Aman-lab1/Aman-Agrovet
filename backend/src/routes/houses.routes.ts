import { Router } from 'express';
import {
  createHouse,
  deactivateHouse,
  listHouses,
  updateHouse,
} from '../controllers/houses.controller.js';
import { requireAuth, requireOwner } from '../middleware/auth.js';

const router = Router();

router.get('/', requireAuth, listHouses);
router.post('/', requireAuth, requireOwner, createHouse);
router.patch('/:id', requireAuth, requireOwner, updateHouse);
router.patch('/:id/deactivate', requireAuth, requireOwner, deactivateHouse);

export default router;
