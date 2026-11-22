import { Router } from 'express';
import { listAuditLogs } from '../controllers/auditLogs.controller.js';
import { requireAuth, requireOwner } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth, requireOwner);
router.get('/', listAuditLogs);

export default router;
