CREATE TYPE "public"."user_role" AS ENUM('owner', 'manager');--> statement-breakpoint
CREATE TYPE "public"."batch_status" AS ENUM('active', 'depleted', 'closed');--> statement-breakpoint
CREATE TYPE "public"."attendance_status" AS ENUM('present', 'half_day', 'absent', 'leave');--> statement-breakpoint
CREATE TYPE "public"."employee_status" AS ENUM('active', 'inactive');--> statement-breakpoint
CREATE TYPE "public"."feed_unit" AS ENUM('bags', 'kg');--> statement-breakpoint
CREATE TYPE "public"."audit_action" AS ENUM('CREATE', 'UPDATE', 'DELETE', 'VOID', 'REVERSE', 'DEACTIVATE');--> statement-breakpoint
CREATE TYPE "public"."finance_status" AS ENUM('active', 'voided');--> statement-breakpoint
CREATE TYPE "public"."payment_direction" AS ENUM('outflow', 'inflow');--> statement-breakpoint
CREATE TYPE "public"."payment_method" AS ENUM('cash', 'bank_transfer', 'upi', 'cheque');--> statement-breakpoint
CREATE TYPE "public"."payment_target" AS ENUM('expense', 'salary', 'other_income', 'other_expense');--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" varchar(64) NOT NULL,
	"full_name" varchar(120) NOT NULL,
	"passcode_hash" text NOT NULL,
	"role" "user_role" DEFAULT 'manager' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "flock_batches" (
	"id" serial PRIMARY KEY NOT NULL,
	"house_id" integer NOT NULL,
	"batch_code" varchar(48) NOT NULL,
	"placement_date" date NOT NULL,
	"starting_age_weeks" integer NOT NULL,
	"initial_females" integer NOT NULL,
	"initial_males" integer NOT NULL,
	"status" "batch_status" DEFAULT 'active' NOT NULL,
	"closed_date" date,
	"notes" text,
	"version" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "houses" (
	"id" serial PRIMARY KEY NOT NULL,
	"house_code" varchar(32) NOT NULL,
	"house_name" varchar(120) NOT NULL,
	"primary_supervisor_name" varchar(120),
	"is_active" boolean DEFAULT true NOT NULL,
	"notes" text,
	"version" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "houses_house_code_unique" UNIQUE("house_code")
);
--> statement-breakpoint
CREATE TABLE "attendance_records" (
	"id" serial PRIMARY KEY NOT NULL,
	"employee_id" integer NOT NULL,
	"house_id" integer,
	"record_date" date NOT NULL,
	"status" "attendance_status" NOT NULL,
	"notes" text,
	"created_by" integer NOT NULL,
	"updated_by" integer NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "egg_production_records" (
	"id" serial PRIMARY KEY NOT NULL,
	"house_id" integer NOT NULL,
	"batch_id" integer NOT NULL,
	"collection_date" date NOT NULL,
	"hatching_eggs" integer NOT NULL,
	"commercial_eggs" integer NOT NULL,
	"reject_eggs" integer NOT NULL,
	"notes" text,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"created_by" integer NOT NULL,
	"updated_by" integer NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "employees" (
	"id" serial PRIMARY KEY NOT NULL,
	"employee_code" varchar(32) NOT NULL,
	"full_name" varchar(120) NOT NULL,
	"phone" varchar(24),
	"designation" varchar(80) NOT NULL,
	"assigned_house_id" integer,
	"joining_date" date NOT NULL,
	"monthly_salary" numeric(12, 2) NOT NULL,
	"status" "employee_status" DEFAULT 'active' NOT NULL,
	"deactivated_at" timestamp with time zone,
	"version" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "employees_employee_code_unique" UNIQUE("employee_code")
);
--> statement-breakpoint
CREATE TABLE "feed_consumption_records" (
	"id" serial PRIMARY KEY NOT NULL,
	"house_id" integer NOT NULL,
	"batch_id" integer NOT NULL,
	"feed_date" date NOT NULL,
	"feed_type" varchar(80) NOT NULL,
	"quantity" numeric(10, 2) NOT NULL,
	"unit" "feed_unit" NOT NULL,
	"notes" text,
	"created_by" integer NOT NULL,
	"updated_by" integer NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "mortality_records" (
	"id" serial PRIMARY KEY NOT NULL,
	"house_id" integer NOT NULL,
	"batch_id" integer NOT NULL,
	"mortality_date" date NOT NULL,
	"females_count" integer NOT NULL,
	"males_count" integer NOT NULL,
	"reason_category" varchar(80) NOT NULL,
	"notes" text,
	"created_by" integer NOT NULL,
	"updated_by" integer NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"actor_user_id" integer NOT NULL,
	"actor_username" varchar(64) NOT NULL,
	"actor_name" varchar(120) NOT NULL,
	"action" "audit_action" NOT NULL,
	"entity_type" varchar(64) NOT NULL,
	"entity_id" integer NOT NULL,
	"summary_text" text NOT NULL,
	"previous_values" jsonb,
	"updated_values" jsonb,
	"reason" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "expenses" (
	"id" serial PRIMARY KEY NOT NULL,
	"expense_date" date NOT NULL,
	"house_id" integer,
	"category" varchar(80) NOT NULL,
	"vendor_name" varchar(120),
	"description" text NOT NULL,
	"amount_inr" numeric(12, 2) NOT NULL,
	"status" "finance_status" DEFAULT 'active' NOT NULL,
	"created_by" integer NOT NULL,
	"updated_by" integer NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" serial PRIMARY KEY NOT NULL,
	"payment_date" date NOT NULL,
	"direction" "payment_direction" NOT NULL,
	"target_type" "payment_target" NOT NULL,
	"expense_id" integer,
	"salary_record_id" integer,
	"amount_inr" numeric(12, 2) NOT NULL,
	"payment_method" "payment_method" NOT NULL,
	"reference_no" varchar(80),
	"notes" text,
	"is_reversed" boolean DEFAULT false NOT NULL,
	"reversed_at" timestamp with time zone,
	"reversed_by" integer,
	"reversal_reason" text,
	"created_by" integer NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "salary_records" (
	"id" serial PRIMARY KEY NOT NULL,
	"employee_id" integer NOT NULL,
	"salary_month" varchar(7) NOT NULL,
	"present_days" integer NOT NULL,
	"half_days" integer NOT NULL,
	"absent_days" integer NOT NULL,
	"leave_days" integer NOT NULL,
	"base_salary_inr" numeric(12, 2) NOT NULL,
	"adjustments_inr" numeric(12, 2) DEFAULT '0.00' NOT NULL,
	"net_payable_inr" numeric(12, 2) NOT NULL,
	"status" "finance_status" DEFAULT 'active' NOT NULL,
	"notes" text,
	"created_by" integer NOT NULL,
	"updated_by" integer NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "flock_batches" ADD CONSTRAINT "flock_batches_house_id_houses_id_fk" FOREIGN KEY ("house_id") REFERENCES "public"."houses"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attendance_records" ADD CONSTRAINT "attendance_records_employee_id_employees_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employees"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attendance_records" ADD CONSTRAINT "attendance_records_house_id_houses_id_fk" FOREIGN KEY ("house_id") REFERENCES "public"."houses"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attendance_records" ADD CONSTRAINT "attendance_records_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attendance_records" ADD CONSTRAINT "attendance_records_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "egg_production_records" ADD CONSTRAINT "egg_production_records_house_id_houses_id_fk" FOREIGN KEY ("house_id") REFERENCES "public"."houses"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "egg_production_records" ADD CONSTRAINT "egg_production_records_batch_id_flock_batches_id_fk" FOREIGN KEY ("batch_id") REFERENCES "public"."flock_batches"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "egg_production_records" ADD CONSTRAINT "egg_production_records_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "egg_production_records" ADD CONSTRAINT "egg_production_records_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "employees" ADD CONSTRAINT "employees_assigned_house_id_houses_id_fk" FOREIGN KEY ("assigned_house_id") REFERENCES "public"."houses"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "feed_consumption_records" ADD CONSTRAINT "feed_consumption_records_house_id_houses_id_fk" FOREIGN KEY ("house_id") REFERENCES "public"."houses"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "feed_consumption_records" ADD CONSTRAINT "feed_consumption_records_batch_id_flock_batches_id_fk" FOREIGN KEY ("batch_id") REFERENCES "public"."flock_batches"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "feed_consumption_records" ADD CONSTRAINT "feed_consumption_records_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "feed_consumption_records" ADD CONSTRAINT "feed_consumption_records_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mortality_records" ADD CONSTRAINT "mortality_records_house_id_houses_id_fk" FOREIGN KEY ("house_id") REFERENCES "public"."houses"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mortality_records" ADD CONSTRAINT "mortality_records_batch_id_flock_batches_id_fk" FOREIGN KEY ("batch_id") REFERENCES "public"."flock_batches"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mortality_records" ADD CONSTRAINT "mortality_records_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mortality_records" ADD CONSTRAINT "mortality_records_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_actor_user_id_users_id_fk" FOREIGN KEY ("actor_user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_house_id_houses_id_fk" FOREIGN KEY ("house_id") REFERENCES "public"."houses"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_expense_id_expenses_id_fk" FOREIGN KEY ("expense_id") REFERENCES "public"."expenses"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_salary_record_id_salary_records_id_fk" FOREIGN KEY ("salary_record_id") REFERENCES "public"."salary_records"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_reversed_by_users_id_fk" FOREIGN KEY ("reversed_by") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "salary_records" ADD CONSTRAINT "salary_records_employee_id_employees_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employees"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "salary_records" ADD CONSTRAINT "salary_records_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "salary_records" ADD CONSTRAINT "salary_records_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "flock_batches_house_batch_idx" ON "flock_batches" USING btree ("house_id","batch_code");--> statement-breakpoint
CREATE UNIQUE INDEX "attendance_employee_date_idx" ON "attendance_records" USING btree ("employee_id","record_date");--> statement-breakpoint
CREATE UNIQUE INDEX "salary_employee_month_idx" ON "salary_records" USING btree ("employee_id","salary_month");