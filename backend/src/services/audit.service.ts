import type { db } from '../db/index.js';
import { auditLogs } from '../db/schema/index.js';
import type { AuthUserProfile } from '../types/index.js';

type DbTransaction = Parameters<Parameters<typeof db.transaction>[0]>[0];

export type AuditAction = 'CREATE' | 'UPDATE' | 'DELETE' | 'VOID' | 'REVERSE' | 'DEACTIVATE';

export interface WriteAuditLogInput {
  actor: AuthUserProfile;
  action: AuditAction;
  entityType: string;
  entityId: number;
  summaryText: string;
  previousValues?: Record<string, unknown> | null;
  updatedValues?: Record<string, unknown> | null;
  reason?: string | null;
}

export async function writeAuditLog(
  tx: DbTransaction,
  input: WriteAuditLogInput,
): Promise<void> {
  await tx.insert(auditLogs).values({
    actorUserId: input.actor.id,
    actorUsername: input.actor.username,
    actorName: input.actor.fullName,
    action: input.action,
    entityType: input.entityType,
    entityId: input.entityId,
    summaryText: input.summaryText,
    previousValues: input.previousValues ?? null,
    updatedValues: input.updatedValues ?? null,
    reason: input.reason ?? null,
  });
}
