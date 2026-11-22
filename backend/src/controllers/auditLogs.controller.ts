import { and, desc, eq } from 'drizzle-orm';
import type { NextFunction, Request, Response } from 'express';
import { db } from '../db/index.js';
import { auditLogs } from '../db/schema/index.js';

export async function listAuditLogs(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const entityType =
      typeof req.query.entityType === 'string' ? req.query.entityType.trim() : '';
    const action = typeof req.query.action === 'string' ? req.query.action.trim() : '';
    const rawLimit = Number(req.query.limit || 100);
    const limit = Number.isInteger(rawLimit) ? Math.min(Math.max(rawLimit, 1), 250) : 100;

    const conditions = [];
    if (entityType) {
      conditions.push(eq(auditLogs.entityType, entityType));
    }
    if (
      action === 'CREATE' ||
      action === 'UPDATE' ||
      action === 'DELETE' ||
      action === 'VOID' ||
      action === 'REVERSE' ||
      action === 'DEACTIVATE'
    ) {
      conditions.push(eq(auditLogs.action, action));
    }

    const rows = await db
      .select()
      .from(auditLogs)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(auditLogs.createdAt), desc(auditLogs.id))
      .limit(limit);

    res.status(200).json({ auditLogs: rows });
  } catch (err) {
    next(err);
  }
}
