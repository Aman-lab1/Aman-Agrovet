import type { Request, Response } from 'express';
import { env } from '../config/env.js';
import type { HealthCheckResponse } from '../types/index.js';

export function getHealth(_req: Request, res: Response): void {
  const payload: HealthCheckResponse = {
    status: 'ok',
    service: 'aman-agrovet-v3-api',
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString(),
  };

  res.status(200).json(payload);
}
