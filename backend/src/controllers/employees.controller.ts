import { and, asc, eq } from 'drizzle-orm';
import type { NextFunction, Request, Response } from 'express';
import { db } from '../db/index.js';
import { employees, houses } from '../db/schema/index.js';
import { HttpError } from '../middleware/errorHandler.js';
import { writeAuditLog } from '../services/audit.service.js';

function normalizeMoneyString(value: unknown): string {
  const num = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(num) || num < 0) {
    throw new HttpError(400, 'Monthly salary must be a valid non-negative number.');
  }
  return num.toFixed(2);
}

export async function listEmployees(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const rows = await db
      .select({
        id: employees.id,
        employeeCode: employees.employeeCode,
        fullName: employees.fullName,
        phone: employees.phone,
        designation: employees.designation,
        assignedHouseId: employees.assignedHouseId,
        assignedHouseName: houses.houseName,
        joiningDate: employees.joiningDate,
        monthlySalary: employees.monthlySalary,
        status: employees.status,
        deactivatedAt: employees.deactivatedAt,
        version: employees.version,
        createdAt: employees.createdAt,
        updatedAt: employees.updatedAt,
      })
      .from(employees)
      .leftJoin(houses, eq(employees.assignedHouseId, houses.id))
      .orderBy(asc(employees.employeeCode), asc(employees.id));

    res.status(200).json({ employees: rows });
  } catch (err) {
    next(err);
  }
}

export async function createEmployee(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const actor = req.user!;
    const employeeCode =
      typeof req.body?.employeeCode === 'string' ? req.body.employeeCode.trim() : '';
    const fullName = typeof req.body?.fullName === 'string' ? req.body.fullName.trim() : '';
    const phone = typeof req.body?.phone === 'string' ? req.body.phone.trim() || null : null;
    const designation =
      typeof req.body?.designation === 'string' ? req.body.designation.trim() : '';
    const rawHouseId = req.body?.assignedHouseId;
    const assignedHouseId =
      rawHouseId === null || rawHouseId === undefined || rawHouseId === ''
        ? null
        : Number(rawHouseId);
    const joiningDate =
      typeof req.body?.joiningDate === 'string' ? req.body.joiningDate.trim() : '';
    const monthlySalary = normalizeMoneyString(req.body?.monthlySalary);

    if (!employeeCode || !fullName || !designation || !joiningDate) {
      throw new HttpError(
        400,
        'Employee code, full name, designation, and joining date are required.',
      );
    }
    if (assignedHouseId !== null && (!Number.isInteger(assignedHouseId) || assignedHouseId <= 0)) {
      throw new HttpError(400, 'Invalid assigned house.');
    }

    const created = await db.transaction(async (tx) => {
      if (assignedHouseId !== null) {
        const [house] = await tx
          .select({ id: houses.id })
          .from(houses)
          .where(eq(houses.id, assignedHouseId))
          .limit(1);
        if (!house) {
          throw new HttpError(404, 'Assigned house not found.');
        }
      }

      const [row] = await tx
        .insert(employees)
        .values({
          employeeCode,
          fullName,
          phone,
          designation,
          assignedHouseId,
          joiningDate,
          monthlySalary,
          status: 'active',
          version: 1,
        })
        .returning();

      await writeAuditLog(tx, {
        actor,
        action: 'CREATE',
        entityType: 'employee',
        entityId: row.id,
        summaryText: `${actor.fullName} added employee ${row.fullName} (${row.employeeCode})`,
        previousValues: null,
        updatedValues: {
          employeeCode: row.employeeCode,
          fullName: row.fullName,
          designation: row.designation,
          assignedHouseId: row.assignedHouseId,
          monthlySalary: row.monthlySalary,
          status: row.status,
        },
      });

      return row;
    });

    res.status(201).json({ employee: created });
  } catch (err) {
    next(err);
  }
}

export async function updateEmployee(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const actor = req.user!;
    const id = Number(req.params.id);
    const version = Number(req.body?.version);

    if (!Number.isInteger(id) || id <= 0) {
      throw new HttpError(400, 'Invalid employee ID.');
    }
    if (!Number.isInteger(version) || version < 1) {
      throw new HttpError(400, 'Valid record version is required.');
    }

    const employeeCode =
      typeof req.body?.employeeCode === 'string' ? req.body.employeeCode.trim() : '';
    const fullName = typeof req.body?.fullName === 'string' ? req.body.fullName.trim() : '';
    const phone = typeof req.body?.phone === 'string' ? req.body.phone.trim() || null : null;
    const designation =
      typeof req.body?.designation === 'string' ? req.body.designation.trim() : '';
    const rawHouseId = req.body?.assignedHouseId;
    const assignedHouseId =
      rawHouseId === null || rawHouseId === undefined || rawHouseId === ''
        ? null
        : Number(rawHouseId);
    const joiningDate =
      typeof req.body?.joiningDate === 'string' ? req.body.joiningDate.trim() : '';
    const monthlySalary = normalizeMoneyString(req.body?.monthlySalary);
    const reason = typeof req.body?.reason === 'string' ? req.body.reason.trim() || null : null;

    if (!employeeCode || !fullName || !designation || !joiningDate) {
      throw new HttpError(
        400,
        'Employee code, full name, designation, and joining date are required.',
      );
    }

    const updated = await db.transaction(async (tx) => {
      const [existing] = await tx.select().from(employees).where(eq(employees.id, id)).limit(1);
      if (!existing) {
        throw new HttpError(404, 'Employee not found.');
      }

      const [row] = await tx
        .update(employees)
        .set({
          employeeCode,
          fullName,
          phone,
          designation,
          assignedHouseId,
          joiningDate,
          monthlySalary,
          version: existing.version + 1,
          updatedAt: new Date(),
        })
        .where(and(eq(employees.id, id), eq(employees.version, version)))
        .returning();

      if (!row) {
        throw new HttpError(409, 'Employee was modified by another user. Please refresh.');
      }

      await writeAuditLog(tx, {
        actor,
        action: 'UPDATE',
        entityType: 'employee',
        entityId: row.id,
        summaryText: `${actor.fullName} updated employee ${row.fullName} (${row.employeeCode})`,
        previousValues: {
          employeeCode: existing.employeeCode,
          fullName: existing.fullName,
          phone: existing.phone,
          designation: existing.designation,
          assignedHouseId: existing.assignedHouseId,
          monthlySalary: existing.monthlySalary,
        },
        updatedValues: {
          employeeCode: row.employeeCode,
          fullName: row.fullName,
          phone: row.phone,
          designation: row.designation,
          assignedHouseId: row.assignedHouseId,
          monthlySalary: row.monthlySalary,
        },
        reason,
      });

      return row;
    });

    res.status(200).json({ employee: updated });
  } catch (err) {
    next(err);
  }
}

export async function deactivateEmployee(
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
      throw new HttpError(400, 'Invalid employee ID.');
    }
    if (!Number.isInteger(version) || version < 1) {
      throw new HttpError(400, 'Valid record version is required.');
    }

    const updated = await db.transaction(async (tx) => {
      const [existing] = await tx.select().from(employees).where(eq(employees.id, id)).limit(1);
      if (!existing) {
        throw new HttpError(404, 'Employee not found.');
      }

      const [row] = await tx
        .update(employees)
        .set({
          status: 'inactive',
          deactivatedAt: new Date(),
          version: existing.version + 1,
          updatedAt: new Date(),
        })
        .where(and(eq(employees.id, id), eq(employees.version, version)))
        .returning();

      if (!row) {
        throw new HttpError(409, 'Employee was modified concurrently. Please refresh.');
      }

      await writeAuditLog(tx, {
        actor,
        action: 'DEACTIVATE',
        entityType: 'employee',
        entityId: row.id,
        summaryText: `${actor.fullName} deactivated employee ${row.fullName} (${row.employeeCode})`,
        previousValues: { status: existing.status },
        updatedValues: { status: row.status },
        reason,
      });

      return row;
    });

    res.status(200).json({ employee: updated });
  } catch (err) {
    next(err);
  }
}
