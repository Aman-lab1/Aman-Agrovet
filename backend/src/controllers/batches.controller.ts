import { and, desc, eq } from 'drizzle-orm';
import type { NextFunction, Request, Response } from 'express';
import { db } from '../db/index.js';
import { flockBatches, houses } from '../db/schema/index.js';
import { HttpError } from '../middleware/errorHandler.js';
import { writeAuditLog } from '../services/audit.service.js';

export async function listBatches(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const rows = await db
      .select({
        id: flockBatches.id,
        houseId: flockBatches.houseId,
        houseCode: houses.houseCode,
        houseName: houses.houseName,
        primarySupervisorName: houses.primarySupervisorName,
        batchCode: flockBatches.batchCode,
        placementDate: flockBatches.placementDate,
        startingAgeWeeks: flockBatches.startingAgeWeeks,
        initialFemales: flockBatches.initialFemales,
        initialMales: flockBatches.initialMales,
        status: flockBatches.status,
        closedDate: flockBatches.closedDate,
        notes: flockBatches.notes,
        version: flockBatches.version,
        createdAt: flockBatches.createdAt,
        updatedAt: flockBatches.updatedAt,
      })
      .from(flockBatches)
      .innerJoin(houses, eq(flockBatches.houseId, houses.id))
      .orderBy(desc(flockBatches.placementDate), desc(flockBatches.id));

    res.status(200).json({ batches: rows });
  } catch (err) {
    next(err);
  }
}

export async function createBatch(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const actor = req.user!;
    const houseId = Number(req.body?.houseId);
    const batchCode = typeof req.body?.batchCode === 'string' ? req.body.batchCode.trim() : '';
    const placementDate =
      typeof req.body?.placementDate === 'string' ? req.body.placementDate.trim() : '';
    const rawStartingAge = req.body?.startingAgeWeeks;
    const startingAgeWeeks =
      rawStartingAge === undefined || rawStartingAge === null || rawStartingAge === ''
        ? NaN
        : Number(rawStartingAge);
    const initialFemales = Number(req.body?.initialFemales);
    const initialMales = Number(req.body?.initialMales);
    const notes = typeof req.body?.notes === 'string' ? req.body.notes.trim() || null : null;

    if (!Number.isInteger(houseId) || houseId <= 0) {
      throw new HttpError(400, 'Valid house is required.');
    }
    if (!batchCode || !placementDate) {
      throw new HttpError(400, 'Batch code and placement date are required.');
    }
    if (!Number.isInteger(startingAgeWeeks) || startingAgeWeeks < 0) {
      throw new HttpError(400, 'Starting bird age (weeks) is required and must be >= 0.');
    }
    if (!Number.isInteger(initialFemales) || initialFemales < 0) {
      throw new HttpError(400, 'Initial female birds must be an integer >= 0.');
    }
    if (!Number.isInteger(initialMales) || initialMales < 0) {
      throw new HttpError(400, 'Initial male birds must be an integer >= 0.');
    }

    const created = await db.transaction(async (tx) => {
      const [house] = await tx.select().from(houses).where(eq(houses.id, houseId)).limit(1);
      if (!house) {
        throw new HttpError(404, 'Selected house not found.');
      }

      const [row] = await tx
        .insert(flockBatches)
        .values({
          houseId,
          batchCode,
          placementDate,
          startingAgeWeeks,
          initialFemales,
          initialMales,
          status: 'active',
          notes,
          version: 1,
        })
        .returning();

      await writeAuditLog(tx, {
        actor,
        action: 'CREATE',
        entityType: 'flock_batch',
        entityId: row.id,
        summaryText: `${actor.fullName} started batch ${row.batchCode} in ${house.houseName}`,
        previousValues: null,
        updatedValues: {
          houseId: row.houseId,
          batchCode: row.batchCode,
          placementDate: row.placementDate,
          startingAgeWeeks: row.startingAgeWeeks,
          initialFemales: row.initialFemales,
          initialMales: row.initialMales,
          status: row.status,
        },
      });

      return row;
    });

    res.status(201).json({ batch: created });
  } catch (err) {
    next(err);
  }
}

export async function updateBatch(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const actor = req.user!;
    const id = Number(req.params.id);
    const version = Number(req.body?.version);

    if (!Number.isInteger(id) || id <= 0) {
      throw new HttpError(400, 'Invalid batch ID.');
    }
    if (!Number.isInteger(version) || version < 1) {
      throw new HttpError(400, 'Valid record version is required.');
    }

    const batchCode = typeof req.body?.batchCode === 'string' ? req.body.batchCode.trim() : '';
    const placementDate =
      typeof req.body?.placementDate === 'string' ? req.body.placementDate.trim() : '';
    const startingAgeWeeks = Number(req.body?.startingAgeWeeks);
    const initialFemales = Number(req.body?.initialFemales);
    const initialMales = Number(req.body?.initialMales);
    const notes = typeof req.body?.notes === 'string' ? req.body.notes.trim() || null : null;
    const reason = typeof req.body?.reason === 'string' ? req.body.reason.trim() || null : null;

    if (!batchCode || !placementDate) {
      throw new HttpError(400, 'Batch code and placement date are required.');
    }
    if (!Number.isInteger(startingAgeWeeks) || startingAgeWeeks < 0) {
      throw new HttpError(400, 'Starting bird age (weeks) must be >= 0.');
    }
    if (!Number.isInteger(initialFemales) || initialFemales < 0) {
      throw new HttpError(400, 'Initial female birds must be >= 0.');
    }
    if (!Number.isInteger(initialMales) || initialMales < 0) {
      throw new HttpError(400, 'Initial male birds must be >= 0.');
    }

    const updated = await db.transaction(async (tx) => {
      const [existing] = await tx
        .select()
        .from(flockBatches)
        .where(eq(flockBatches.id, id))
        .limit(1);
      if (!existing) {
        throw new HttpError(404, 'Flock batch not found.');
      }

      const [row] = await tx
        .update(flockBatches)
        .set({
          batchCode,
          placementDate,
          startingAgeWeeks,
          initialFemales,
          initialMales,
          notes,
          version: existing.version + 1,
          updatedAt: new Date(),
        })
        .where(and(eq(flockBatches.id, id), eq(flockBatches.version, version)))
        .returning();

      if (!row) {
        throw new HttpError(409, 'Batch was modified by another user. Please refresh.');
      }

      await writeAuditLog(tx, {
        actor,
        action: 'UPDATE',
        entityType: 'flock_batch',
        entityId: row.id,
        summaryText: `${actor.fullName} updated batch ${row.batchCode}`,
        previousValues: {
          batchCode: existing.batchCode,
          placementDate: existing.placementDate,
          startingAgeWeeks: existing.startingAgeWeeks,
          initialFemales: existing.initialFemales,
          initialMales: existing.initialMales,
          notes: existing.notes,
        },
        updatedValues: {
          batchCode: row.batchCode,
          placementDate: row.placementDate,
          startingAgeWeeks: row.startingAgeWeeks,
          initialFemales: row.initialFemales,
          initialMales: row.initialMales,
          notes: row.notes,
        },
        reason,
      });

      return row;
    });

    res.status(200).json({ batch: updated });
  } catch (err) {
    next(err);
  }
}

export async function closeBatch(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const actor = req.user!;
    const id = Number(req.params.id);
    const version = Number(req.body?.version);
    const closedDate =
      typeof req.body?.closedDate === 'string' && req.body.closedDate.trim()
        ? req.body.closedDate.trim()
        : new Date().toISOString().slice(0, 10);
    const reason = typeof req.body?.reason === 'string' ? req.body.reason.trim() || null : null;

    if (!Number.isInteger(id) || id <= 0) {
      throw new HttpError(400, 'Invalid batch ID.');
    }
    if (!Number.isInteger(version) || version < 1) {
      throw new HttpError(400, 'Valid record version is required.');
    }

    const updated = await db.transaction(async (tx) => {
      const [existing] = await tx
        .select()
        .from(flockBatches)
        .where(eq(flockBatches.id, id))
        .limit(1);
      if (!existing) {
        throw new HttpError(404, 'Flock batch not found.');
      }

      const [row] = await tx
        .update(flockBatches)
        .set({
          status: 'closed',
          closedDate,
          version: existing.version + 1,
          updatedAt: new Date(),
        })
        .where(and(eq(flockBatches.id, id), eq(flockBatches.version, version)))
        .returning();

      if (!row) {
        throw new HttpError(409, 'Batch was modified concurrently. Please refresh.');
      }

      await writeAuditLog(tx, {
        actor,
        action: 'UPDATE',
        entityType: 'flock_batch',
        entityId: row.id,
        summaryText: `${actor.fullName} closed batch ${row.batchCode}`,
        previousValues: { status: existing.status, closedDate: existing.closedDate },
        updatedValues: { status: row.status, closedDate: row.closedDate },
        reason,
      });

      return row;
    });

    res.status(200).json({ batch: updated });
  } catch (err) {
    next(err);
  }
}
