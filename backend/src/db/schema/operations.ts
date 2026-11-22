import {
  boolean,
  date,
  integer,
  numeric,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core';
import { flockBatches, houses } from './houses.js';
import { users } from './users.js';

export const employeeStatusEnum = pgEnum('employee_status', ['active', 'inactive']);
export const attendanceStatusEnum = pgEnum('attendance_status', [
  'present',
  'half_day',
  'absent',
  'leave',
]);
export const feedUnitEnum = pgEnum('feed_unit', ['bags', 'kg']);

export const employees = pgTable('employees', {
  id: serial('id').primaryKey(),
  employeeCode: varchar('employee_code', { length: 32 }).notNull().unique(),
  fullName: varchar('full_name', { length: 120 }).notNull(),
  phone: varchar('phone', { length: 24 }),
  designation: varchar('designation', { length: 80 }).notNull(),
  assignedHouseId: integer('assigned_house_id').references(() => houses.id, {
    onDelete: 'set null',
  }),
  joiningDate: date('joining_date').notNull(),
  monthlySalary: numeric('monthly_salary', { precision: 12, scale: 2 }).notNull(),
  status: employeeStatusEnum('status').notNull().default('active'),
  deactivatedAt: timestamp('deactivated_at', { withTimezone: true }),
  version: integer('version').notNull().default(1),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const attendanceRecords = pgTable(
  'attendance_records',
  {
    id: serial('id').primaryKey(),
    employeeId: integer('employee_id')
      .notNull()
      .references(() => employees.id, { onDelete: 'restrict' }),
    houseId: integer('house_id').references(() => houses.id, { onDelete: 'set null' }),
    recordDate: date('record_date').notNull(),
    status: attendanceStatusEnum('status').notNull(),
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
    uniqueIndex('attendance_employee_date_idx').on(table.employeeId, table.recordDate),
  ],
);

export const eggProductionRecords = pgTable('egg_production_records', {
  id: serial('id').primaryKey(),
  houseId: integer('house_id')
    .notNull()
    .references(() => houses.id, { onDelete: 'restrict' }),
  batchId: integer('batch_id')
    .notNull()
    .references(() => flockBatches.id, { onDelete: 'restrict' }),
  collectionDate: date('collection_date').notNull(),
  hatchingEggs: integer('hatching_eggs').notNull(),
  commercialEggs: integer('commercial_eggs').notNull(),
  rejectEggs: integer('reject_eggs').notNull(),
  notes: text('notes'),
  isDeleted: boolean('is_deleted').notNull().default(false),
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

export const feedConsumptionRecords = pgTable('feed_consumption_records', {
  id: serial('id').primaryKey(),
  houseId: integer('house_id')
    .notNull()
    .references(() => houses.id, { onDelete: 'restrict' }),
  batchId: integer('batch_id')
    .notNull()
    .references(() => flockBatches.id, { onDelete: 'restrict' }),
  feedDate: date('feed_date').notNull(),
  feedType: varchar('feed_type', { length: 80 }).notNull(),
  quantity: numeric('quantity', { precision: 10, scale: 2 }).notNull(),
  unit: feedUnitEnum('unit').notNull(),
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
});

export const mortalityRecords = pgTable('mortality_records', {
  id: serial('id').primaryKey(),
  houseId: integer('house_id')
    .notNull()
    .references(() => houses.id, { onDelete: 'restrict' }),
  batchId: integer('batch_id')
    .notNull()
    .references(() => flockBatches.id, { onDelete: 'restrict' }),
  mortalityDate: date('mortality_date').notNull(),
  femalesCount: integer('females_count').notNull(),
  malesCount: integer('males_count').notNull(),
  reasonCategory: varchar('reason_category', { length: 80 }).notNull(),
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
});
