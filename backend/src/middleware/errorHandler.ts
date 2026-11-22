import type { NextFunction, Request, Response } from 'express';
import { logger } from '../utils/logger.js';

export class HttpError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = 'HttpError';
  }
}

export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.originalUrl} does not exist`,
  });
}

export function errorHandler(
  err: Error & { code?: string },
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof HttpError) {
    res.status(err.statusCode).json({
      error: err.statusCode === 409 ? 'Conflict' : 'Request Error',
      message: err.message,
    });
    return;
  }

  if (err?.code === '23505') {
    res.status(409).json({
      error: 'Conflict',
      message: 'A record with the same unique identifier already exists.',
    });
    return;
  }

  logger.error('Unhandled API error', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' ? 'Unexpected error' : err.message,
  });
}
