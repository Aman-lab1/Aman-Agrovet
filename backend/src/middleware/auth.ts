import { eq } from 'drizzle-orm';
import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { db } from '../db/index.js';
import { users } from '../db/schema/index.js';
import type { AuthUserProfile, UserRole } from '../types/index.js';

interface JwtPayload {
  sub: string;
  username: string;
  role: UserRole;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUserProfile;
    }
  }
}

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      error: 'Unauthorized',
      message: 'Missing or invalid Authorization Bearer token',
    });
    return;
  }

  const token = authHeader.slice('Bearer '.length).trim();
  if (!token) {
    res.status(401).json({
      error: 'Unauthorized',
      message: 'Authentication token is empty',
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    const userId = Number(decoded.sub);
    if (!Number.isInteger(userId) || userId <= 0) {
      res.status(401).json({ error: 'Unauthorized', message: 'Invalid token subject' });
      return;
    }

    const [dbUser] = await db
      .select({
        id: users.id,
        username: users.username,
        fullName: users.fullName,
        role: users.role,
        isActive: users.isActive,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!dbUser) {
      res.status(401).json({ error: 'Unauthorized', message: 'User account not found' });
      return;
    }

    if (!dbUser.isActive) {
      res.status(403).json({ error: 'Forbidden', message: 'User account is deactivated' });
      return;
    }

    req.user = {
      id: dbUser.id,
      username: dbUser.username,
      fullName: dbUser.fullName,
      role: dbUser.role,
    };

    next();
  } catch {
    res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid or expired authentication token',
    });
  }
}

export function requireOwner(req: Request, res: Response, next: NextFunction): void {
  if (!req.user) {
    res.status(401).json({ error: 'Unauthorized', message: 'Authentication required' });
    return;
  }

  if (req.user.role !== 'owner') {
    res.status(403).json({
      error: 'Forbidden',
      message: 'Business Owner role is required for this resource',
    });
    return;
  }

  next();
}
