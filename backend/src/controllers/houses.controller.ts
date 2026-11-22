import { and, asc, eq } from 'drizzle-orm';
import type { NextFunction, Request, Response } from 'express';
import { db } from '../db/index.js';
import { houses } from '../db/schema/index.js';
import { HttpError } from '../middleware/errorHandler.js';
import { writeAuditLog } from '../services/audit.service.js';

export async function listHouses(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const rows = await db.select().from(houses).orderBy(asc(houses.houseCode), asc(houses.id));
    res.status(200).json({ houses: rows });
  } catch (err) {
    next(err);
  }
}

export async function createHouse(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const actor = req.user!;
    const houseCode = typeof req.body?.houseCode === 'string' ? req.body.houseCode.trim() : '';
    const houseName = typeof req.body?.houseName === 'string' ? req.body.houseName.trim() : '';
    const primarySupervisorName =
      typeof req.body?.primarySupervisorName === 'string'
        ? req.body.primarySupervisorName.trim() || null
        : null;
    const notes = typeof req.body?.notes === 'string' ? req.body.notes.trim() || null : null;

    if (!houseCode || !houseName) {
      throw new HttpError(400, 'House code and house name are required.');
    }

    const created = await db.transaction(async (tx) => {
      const [row] = await tx
        .insert(houses)
        .values({
          houseCode,
          houseName,
          primarySupervisorName,
          isActive: true,
          notes,
          version: 1,
        })
        .returning();

      await writeAuditLog(tx, {
        actor,
        action: 'CREATE',
        entityType: 'house',
        entityId: row.id,
        summaryText: `${actor.fullName} created house ${row.houseName} (${row.houseCode})`,
        previousValues: null,
        updatedValues: {
          houseCode: row.houseCode,
          houseName: row.houseName,
          primarySupervisorName: row.primarySupervisorName,
          isActive: row.isActive,
        },
      });

      return row;
    });

    res.status(201).json({ house: created });
  } catch (err) {
    next(err);
  }
}

export async function updateHouse(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const actor = req.user!;
    const id = Number(req.params.id);
    const version = Number(req.body?.version);

    if (!Number.isInteger(id) || id <= 0) {
      throw new HttpError(400, 'Invalid house ID.');
    }
    if (!Number.isInteger(version) || version < 1) {
      throw new HttpError(400, 'Valid record version is required for optimistic concurrency.');
    }

    const houseCode = typeof req.body?.houseCode === 'string' ? req.body.houseCode.trim() : '';
    const houseName = typeof req.body?.houseName === 'string' ? req.body.houseName.trim() : '';
    const primarySupervisorName =
      typeof req.body?.primarySupervisorName === 'string'
        ? req.body.primarySupervisorName.trim() || null
        : null;
    const notes = typeof req.body?.notes === 'string' ? req.body.notes.trim() || null : null;
    const isActive = typeof req.body?.isActive === 'boolean' ? req.body.isActive : undefined;
    const reason = typeof req.body?.reason === 'string' ? req.body.reason.trim() || null : null;

    if (!houseCode || !houseName) {
      throw new HttpError(400, 'House code and house name are required.');
    }

    const updated = await db.transaction(async (tx) => {
      const [existing] = await tx.select().from(houses).where(eq(houses.id, id)).limit(1);
      if (!existing) {
        throw new HttpError(404, 'House not found.');
      }

      const [row] = await tx
        .update(houses)
        .set({
          houseCode,
          houseName,
          primarySupervisorName,
          notes,
          ...(isActive !== undefined ? { isActive } : {}),
          version: existing.version + 1,
          updatedAt: new Date(),
        })
        .where(and(eq(houses.id, id), eq(houses.version, version)))
        .returning();

      if (!row) {
        throw new HttpError(
          409,
          'House was modified by another user. Refresh and try again.',
        );
      }

      await writeAuditLog(tx, {
        actor,
        action: 'UPDATE',
        entityType: 'house',
        entityId: row.id,
        summaryText: `${actor.fullName} updated house ${row.houseName} (${row.houseCode})`,
        previousValues: {
          houseCode: existing.houseCode,
          houseName: existing.houseName,
          primarySupervisorName: existing.primarySupervisorName,
          isActive: existing.isActive,
          notes: existing.notes,
        },
        updatedValues: {
          houseCode: row.houseCode,
          houseName: row.houseName,
          primarySupervisorName: row.primarySupervisorName,
          isActive: row.isActive,
          notes: row.notes,
        },
        reason,
      });

      return row;
    });

    res.status(200).json({ house: updated });
  } catch (err) {
    next(err);
  }
}

export async function deactivateHouse(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const actor = req.user!;
    const id = Number(req.params.id);
    const version = Number(req.body?.version);
    const reason = typeof req.body?.reason === 'string' ? req.body.reason.trim() || null : null;

    if (!Number.isInteger(id) || id <= 0) {
      throw new HttpError(400, 'Invalid house ID.');
    }
    if (!Number.isInteger(version) || version < 1) {
      throw new HttpError(400, 'Valid record version is required.');
    }

    const updated = await db.transaction(async (tx) => {
      const [existing] = await tx.select().from(houses).where(eq(houses.id, id)).limit(1);
      if (!existing) {
        throw new HttpError(404, 'House not found.');
      }

      const [row] = await tx
        .update(houses)
        .set({
          isActive: false,
          version: existing.version + 1,
          updatedAt: new Date(),
        })
        .where(and(eq(houses.id, id), eq(houses.version, version)))
        .returning();

      if (!row) {
        throw new HttpError(409, 'House was modified concurrently. Please refresh.');
      }

      await writeAuditLog(tx, {
        actor,
        action: 'DEACTIVATE',
        entityType: 'house',
        entityId: row.id,
        summaryText: `${actor.fullName} deactivated house ${row.houseName} (${row.houseCode})`,
        previousValues: { isActive: existing.isActive },
        updatedValues: { isActive: row.isActive },
        reason,
      });

      return row;
    });

    res.status(200).json({ house: updated });
  } catch (err) {
    next(err);
  }
}
