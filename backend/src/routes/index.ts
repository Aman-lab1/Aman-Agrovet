import { Router } from 'express';
import healthRoutes from './health.routes.js';

const router = Router();

// Phase 1: Health-check endpoint only. Business module routes will be added in later phases.
router.use('/health', healthRoutes);

export default router;
