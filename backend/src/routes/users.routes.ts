import { Router } from 'express';
import { createUser, listUsers, updateUser } from '../controllers/users.controller.js';
import { requireAuth, requireOwner } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth, requireOwner);

router.get('/', listUsers);
router.post('/', createUser);
router.patch('/:id', updateUser);

export default router;
