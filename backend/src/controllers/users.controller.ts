import { asc, eq } from 'drizzle-orm';
import type { NextFunction, Request, Response } from 'express';
import { db } from '../db/index.js';
import { users } from '../db/schema/index.js';
import { HttpError } from '../middleware/errorHandler.js';
import { writeAuditLog } from '../services/audit.service.js';
import { hashPasscode } from '../utils/passcode.js';

export async function listUsers(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const rows = await db
      .select({
        id: users.id,
        username: users.username,
        fullName: users.fullName,
        role: users.role,
        isActive: users.isActive,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .orderBy(asc(users.id));

    res.status(200).json({ users: rows });
  } catch (err) {
    next(err);
  }
}

export async function createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const actor = req.user!;
    const username =
      typeof req.body?.username === 'string' ? req.body.username.trim().toLowerCase() : '';
    const fullName = typeof req.body?.fullName === 'string' ? req.body.fullName.trim() : '';
    const passcode = typeof req.body?.passcode === 'string' ? req.body.passcode : '';
    const role = req.body?.role === 'owner' ? 'owner' : req.body?.role === 'manager' ? 'manager' : null;

    if (!username || !fullName || !passcode || !role) {
      throw new HttpError(400, 'Username, full name, passcode, and valid role are required.');
    }
    if (passcode.length < 4) {
      throw new HttpError(400, 'Passcode must be at least 4 characters.');
    }

    const passcodeHash = hashPasscode(passcode);

    const created = await db.transaction(async (tx) => {
      const [row] = await tx
        .insert(users)
        .values({
          username,
          fullName,
          passcodeHash,
          role,
          isActive: true,
        })
        .returning({
          id: users.id,
          username: users.username,
          fullName: users.fullName,
          role: users.role,
          isActive: users.isActive,
          createdAt: users.createdAt,
          updatedAt: users.updatedAt,
        });

      await writeAuditLog(tx, {
        actor,
        action: 'CREATE',
        entityType: 'user',
        entityId: row.id,
        summaryText: `${actor.fullName} created ${row.role} login "${row.username}"`,
        previousValues: null,
        updatedValues: {
          username: row.username,
          fullName: row.fullName,
          role: row.role,
          isActive: row.isActive,
        },
      });

      return row;
    });

    res.status(201).json({ user: created });
  } catch (err) {
    next(err);
  }
}

export async function updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const actor = req.user!;
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      throw new HttpError(400, 'Invalid user ID.');
    }

    const fullName =
      typeof req.body?.fullName === 'string' ? req.body.fullName.trim() : undefined;
    const role =
      req.body?.role === 'owner' || req.body?.role === 'manager' ? req.body.role : undefined;
    const isActive = typeof req.body?.isActive === 'boolean' ? req.body.isActive : undefined;
    const newPasscode =
      typeof req.body?.passcode === 'string' && req.body.passcode.length > 0
        ? req.body.passcode
        : undefined;
    const reason = typeof req.body?.reason === 'string' ? req.body.reason.trim() || null : null;

    if (id === actor.id && isActive === false) {
      throw new HttpError(400, 'You cannot deactivate your own active Business Owner account.');
    }
    if (newPasscode !== undefined && newPasscode.length < 4) {
      throw new HttpError(400, 'New passcode must be at least 4 characters.');
    }

    const updated = await db.transaction(async (tx) => {
      const [existing] = await tx.select().from(users).where(eq(users.id, id)).limit(1);
      if (!existing) {
        throw new HttpError(404, 'User not found.');
      }

      const [row] = await tx
        .update(users)
        .set({
          ...(fullName ? { fullName } : {}),
          ...(role ? { role } : {}),
          ...(isActive !== undefined ? { isActive } : {}),
          ...(newPasscode ? { passcodeHash: hashPasscode(newPasscode) } : {}),
          updatedAt: new Date(),
        })
        .where(eq(users.id, id))
        .returning({
          id: users.id,
          username: users.username,
          fullName: users.fullName,
          role: users.role,
          isActive: users.isActive,
          createdAt: users.createdAt,
          updatedAt: users.updatedAt,
        });

      const action = isActive === false && existing.isActive ? 'DEACTIVATE' : 'UPDATE';

      await writeAuditLog(tx, {
        actor,
        action,
        entityType: 'user',
        entityId: row.id,
        summaryText: newPasscode
          ? `${actor.fullName} updated / reset passcode for user "${row.username}"`
          : `${actor.fullName} updated user "${row.username}"`,
        previousValues: {
          fullName: existing.fullName,
          role: existing.role,
          isActive: existing.isActive,
        },
        updatedValues: {
          fullName: row.fullName,
          role: row.role,
          isActive: row.isActive,
          passcodeReset: Boolean(newPasscode),
        },
        reason,
      });

      return row;
    });

    res.status(200).json({ user: updated });
  } catch (err) {
    next(err);
  }
}
