# Database Design (Planned)

> **Source of Truth:** Derived from [implementation_plan.md](../implementation_plan.md).
> **Status:** **Planned for Phase 2.** No database tables, Drizzle schemas, or migrations exist in Phase 1.

## Technology

- **Database:** Google Cloud SQL (PostgreSQL)
- **ORM:** Drizzle ORM (parameterized queries, ACID transactions, reproducible migrations)

## Planned Entities & Constraints

| Table | Key Columns & Types | Constraints & Notes |
| --- | --- | --- |
| `users` | `id`, `uid` (unique), `email` (unique, lowercase), `full_name`, `role` (`owner` \| `manager`), `is_active`, timestamps | Supports pre-inviting emails before first Google sign-in; `uid` links on first login. |
| `farms` | `id`, `code` (unique), `name`, `location`, `farm_type` (default `broiler_breeder`), `is_active`, `notes`, timestamps | Multi-farm support. |
| `flock_batches` | `id`, `farm_id` (FK → `farms`), `batch_code`, `house_name`, `breed_strain`, `placement_date` (`DATE`), `starting_age_weeks` (`INTEGER >= 0`), `initial_hens` (`INTEGER >= 0`), `initial_roosters` (`INTEGER >= 0`), `status` (`active` \| `depleted` \| `closed`), `closed_date`, `version`, `notes`, timestamps | `batch_code` unique per farm; `version` for optimistic locking. |
| `employees` | `id`, `employee_code` (unique), `full_name`, `phone`, `designation`, `assigned_farm_id` (FK → `farms`, nullable), `joining_date`, `monthly_salary_inr` (`NUMERIC(12, 2)`), `status` (`active` \| `inactive`), `deactivated_at`, `version`, timestamps | `monthly_salary_inr` stripped from API payloads for `manager` role. Soft-deactivated when historical records exist. |
| `attendance_records` | `id`, `employee_id` (FK → `employees`), `farm_id` (FK → `farms`, nullable), `attendance_date` (`DATE`), `status` (`present` \| `half_day` \| `absent` \| `leave`), `notes`, `created_by`, `updated_by` (FK → `users`), `version`, timestamps | Enforces `UNIQUE (employee_id, attendance_date)`. |
| `egg_production_records` | `id`, `farm_id`, `batch_id` (FK → `flock_batches`), `collection_date` (`DATE`), `hatching_eggs` (`INTEGER >= 0`), `commercial_eggs` (`INTEGER >= 0`), `reject_eggs` (`INTEGER >= 0`), `notes`, `is_deleted`, `created_by`, `updated_by`, `version`, timestamps | Supports soft-delete/voiding with audit snapshot. |
| `feed_consumption_records` | `id`, `farm_id`, `batch_id`, `feed_date` (`DATE`), `feed_type`, `quantity` (`NUMERIC(10, 3) >= 0`), `unit` (`bags` \| `kg`), `notes`, `created_by`, `updated_by`, `version`, timestamps | Units `bags` and `kg` are strictly isolated and never auto-converted. |
| `mortality_records` | `id`, `farm_id`, `batch_id`, `mortality_date` (`DATE`), `hens_count` (`INTEGER >= 0`), `roosters_count` (`INTEGER >= 0`), `reason_category`, `notes`, `created_by`, `updated_by`, `version`, timestamps | Cumulative mortality cannot exceed initial placement counts. |
| `expenses` *(Owner-Only)* | `id`, `expense_date`, `farm_id` (nullable), `category`, `vendor_name`, `description`, `amount_inr` (`NUMERIC(12, 2) > 0`), `status` (`active` \| `voided`), `created_by`, `updated_by`, `version`, timestamps | Paid and outstanding totals derived strictly from non-reversed linked `payments`. |
| `salary_records` *(Owner-Only)* | `id`, `employee_id`, `salary_month` (`YYYY-MM`), `present_days`, `half_days`, `absent_days`, `leave_days`, `base_salary_inr` (`NUMERIC(12, 2)`), `adjustments_inr` (`NUMERIC(12, 2)`), `net_payable_inr` (`NUMERIC(12, 2) >= 0`), `status` (`active` \| `voided`), `notes`, `created_by`, `updated_by`, `version`, timestamps | Enforces `UNIQUE (employee_id, salary_month)` for active runs. |
| `payments` *(Owner-Only)* | `id`, `payment_date`, `direction` (`outflow` \| `inflow`), `target_type` (`expense` \| `salary` \| `other_income` \| `other_expense`), `expense_id` (FK nullable), `salary_record_id` (FK nullable), `amount_inr` (`NUMERIC(12, 2) > 0`), `payment_method` (`cash` \| `bank_transfer` \| `upi` \| `cheque`), `reference_no`, `notes`, `is_reversed`, `reversed_at`, `reversed_by`, `reversal_reason`, `created_by`, `version`, timestamps | Total active payments against an expense or salary cannot exceed the obligation amount. |
| `audit_logs` *(Owner-Only Read)* | `id`, `actor_user_id` (FK → `users`), `actor_email`, `actor_name`, `action` (`CREATE` \| `UPDATE` \| `DELETE` \| `VOID` \| `REVERSE` \| `DEACTIVATE`), `entity_type`, `entity_id`, `summary_text`, `previous_values` (`JSONB`), `updated_values` (`JSONB`), `reason`, `created_at` | Append-only; written inside the same ACID transaction as every mutation. |
