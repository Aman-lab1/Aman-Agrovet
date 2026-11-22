import {
  boolean,
  date,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core';

export const batchStatusEnum = pgEnum('batch_status', ['active', 'depleted', 'closed']);

export const houses = pgTable('houses', {
  id: serial('id').primaryKey(),
  houseCode: varchar('house_code', { length: 32 }).notNull().unique(),
  houseName: varchar('house_name', { length: 120 }).notNull(),
  primarySupervisorName: varchar('primary_supervisor_name', { length: 120 }),
  isActive: boolean('is_active').notNull().default(true),
  notes: text('notes'),
  version: integer('version').notNull().default(1),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const flockBatches = pgTable(
  'flock_batches',
  {
    id: serial('id').primaryKey(),
    houseId: integer('house_id')
      .notNull()
      .references(() => houses.id, { onDelete: 'restrict' }),
    batchCode: varchar('batch_code', { length: 48 }).notNull(),
    placementDate: date('placement_date').notNull(),
    startingAgeWeeks: integer('starting_age_weeks').notNull(),
    initialFemales: integer('initial_females').notNull(),
    initialMales: integer('initial_males').notNull(),
    status: batchStatusEnum('status').notNull().default('active'),
    closedDate: date('closed_date'),
    notes: text('notes'),
    version: integer('version').notNull().default(1),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex('flock_batches_house_batch_idx').on(table.houseId, table.batchCode)],
);
