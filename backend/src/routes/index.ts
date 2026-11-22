import { Router } from 'express';
import auditLogsRoutes from './auditLogs.routes.js';
import authRoutes from './auth.routes.js';
import batchesRoutes from './batches.routes.js';
import employeesRoutes from './employees.routes.js';
import healthRoutes from './health.routes.js';
import housesRoutes from './houses.routes.js';
import usersRoutes from './users.routes.js';

const router = Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/houses', housesRoutes);
router.use('/batches', batchesRoutes);
router.use('/employees', employeesRoutes);
router.use('/users', usersRoutes);
router.use('/audit-logs', auditLogsRoutes);

export default router;
