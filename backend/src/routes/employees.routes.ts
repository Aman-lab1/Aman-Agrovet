import { Router } from 'express';
import {
  createEmployee,
  deactivateEmployee,
  listEmployees,
  updateEmployee,
} from '../controllers/employees.controller.js';
import { requireAuth, requireOwner } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth, requireOwner);

router.get('/', listEmployees);
router.post('/', createEmployee);
router.patch('/:id', updateEmployee);
router.patch('/:id/deactivate', deactivateEmployee);

export default router;
