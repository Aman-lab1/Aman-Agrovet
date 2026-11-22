import {
  boolean,
  date,
  integer,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core';
import { houses } from './houses.js';
import { employees } from './operations.js';
import { users } from './users.js';

export const financeStatusEnum = pgEnum('finance_status', ['active', 'voided']);
export const paymentDirectionEnum = pgEnum('payment_direction', ['outflow', 'inflow']);
export const paymentTargetEnum = pgEnum('payment_target', [
  'expense',
  'salary',
  'other_income',
  'other_expense',
]);
export const paymentMethodEnum = pgEnum('payment_method', [
  'cash',
  'bank_transfer',
  'upi',
  'cheque',
]);
export const auditActionEnum = pgEnum('audit_action', [
  'CREATE',
  'UPDATE',
  'DELETE',
  'VOID',
  'REVERSE',
  'DEACTIVATE',
]);

export const expenses = pgTable('expenses', {
  id: serial('id').primaryKey(),
  expenseDate: date('expense_date').notNull(),
  houseId: integer('house_id').references(() => houses.id, { onDelete: 'set null' }),
  category: varchar('category', { length: 80 }).notNull(),
  vendorName: varchar('vendor_name', { length: 120 }),
  description: text('description').notNull(),
  amountInr: numeric('amount_inr', { precision: 12, scale: 2 }).notNull(),
  status: financeStatusEnum('status').notNull().default('active'),
  createdBy: integer('created_by')
    .notNull()
    .references(() => users.id, { onDelete: 'restrict' }),
  updatedBy: integer('updated_by')
    .notNull()
    .references(() => users.id, { onDelete: 'restrict' }),
  version: integer('version').notNull().default(1),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const salaryRecords = pgTable(
  'salary_records',
  {
    id: serial('id').primaryKey(),
    employeeId: integer('employee_id')
      .notNull()
      .references(() => employees.id, { onDelete: 'restrict' }),
    salaryMonth: varchar('salary_month', { length: 7 }).notNull(),
    presentDays: integer('present_days').notNull(),
    halfDays: integer('half_days').notNull(),
    absentDays: integer('absent_days').notNull(),
    leaveDays: integer('leave_days').notNull(),
    baseSalaryInr: numeric('base_salary_inr', { precision: 12, scale: 2 }).notNull(),
    adjustmentsInr: numeric('adjustments_inr', { precision: 12, scale: 2 }).notNull().default('0.00'),
    netPayableInr: numeric('net_payable_inr', { precision: 12, scale: 2 }).notNull(),
    status: financeStatusEnum('status').notNull().default('active'),
    notes: text('notes'),
    createdBy: integer('created_by')
      .notNull()
      .references(() => users.id, { onDelete: 'restrict' }),
    updatedBy: integer('updated_by')
      .notNull()
      .references(() => users.id, { onDelete: 'restrict' }),
    version: integer('version').notNull().default(1),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex('salary_employee_month_idx').on(table.employeeId, table.salaryMonth),
  ],
);

export const payments = pgTable('payments', {
  id: serial('id').primaryKey(),
  paymentDate: date('payment_date').notNull(),
  direction: paymentDirectionEnum('direction').notNull(),
  targetType: paymentTargetEnum('target_type').notNull(),
  expenseId: integer('expense_id').references(() => expenses.id, { onDelete: 'restrict' }),
  salaryRecordId: integer('salary_record_id').references(() => salaryRecords.id, {
    onDelete: 'restrict',
  }),
  amountInr: numeric('amount_inr', { precision: 12, scale: 2 }).notNull(),
  paymentMethod: paymentMethodEnum('payment_method').notNull(),
  referenceNo: varchar('reference_no', { length: 80 }),
  notes: text('notes'),
  isReversed: boolean('is_reversed').notNull().default(false),
  reversedAt: timestamp('reversed_at', { withTimezone: true }),
  reversedBy: integer('reversed_by').references(() => users.id, { onDelete: 'restrict' }),
  reversalReason: text('reversal_reason'),
  createdBy: integer('created_by')
    .notNull()
    .references(() => users.id, { onDelete: 'restrict' }),
  version: integer('version').notNull().default(1),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const auditLogs = pgTable('audit_logs', {
  id: serial('id').primaryKey(),
  actorUserId: integer('actor_user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'restrict' }),
  actorUsername: varchar('actor_username', { length: 64 }).notNull(),
  actorName: varchar('actor_name', { length: 120 }).notNull(),
  action: auditActionEnum('action').notNull(),
  entityType: varchar('entity_type', { length: 64 }).notNull(),
  entityId: integer('entity_id').notNull(),
  summaryText: text('summary_text').notNull(),
  previousValues: jsonb('previous_values'),
  updatedValues: jsonb('updated_values'),
  reason: text('reason'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});
