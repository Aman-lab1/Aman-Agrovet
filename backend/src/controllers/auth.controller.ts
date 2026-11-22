import { eq } from 'drizzle-orm';
import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { db } from '../db/index.js';
import { users } from '../db/schema/index.js';
import { verifyPasscode } from '../utils/passcode.js';

export async function login(req: Request, res: Response): Promise<void> {
  const rawUsername = typeof req.body?.username === 'string' ? req.body.username : '';
  const passcode = typeof req.body?.passcode === 'string' ? req.body.passcode : '';

  const username = rawUsername.trim().toLowerCase();

  if (!username || !passcode) {
    res.status(400).json({
      error: 'Bad Request',
      message: 'Username and passcode are required',
    });
    return;
  }

  const [user] = await db
    .select({
      id: users.id,
      username: users.username,
      fullName: users.fullName,
      passcodeHash: users.passcodeHash,
      role: users.role,
      isActive: users.isActive,
    })
    .from(users)
    .where(eq(users.username, username))
    .limit(1);

  if (!user || !verifyPasscode(passcode, user.passcodeHash)) {
    res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid username or passcode',
    });
    return;
  }

  if (!user.isActive) {
    res.status(403).json({
      error: 'Forbidden',
      message: 'Account is deactivated. Contact the Business Owner.',
    });
    return;
  }

  const token = jwt.sign(
    {
      sub: String(user.id),
      username: user.username,
      role: user.role,
    },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'] },
  );

  res.status(200).json({
    token,
    user: {
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      role: user.role,
    },
  });
}

export function getMe(req: Request, res: Response): void {
  if (!req.user) {
    res.status(401).json({ error: 'Unauthorized', message: 'Authentication required' });
    return;
  }

  res.status(200).json({ user: req.user });
}
