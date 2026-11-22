# Business Requirements

> **Source of Truth:** Derived from [implementation_plan.md](../implementation_plan.md).
> **Status:** Specification only. None of the nine business modules are implemented in Phase 1.

## 1. Operational Scope

AMAN Agrovet V3 centralizes daily farm operations and business finances for **Laying-Phase Broiler Breeder (Parent Stock)** farms.

### Core Confirmed Decisions

1. **PostgreSQL Backend:** Google Cloud SQL (PostgreSQL) with Drizzle ORM for type-safe queries and reproducible migrations.
2. **Authentication & RBAC:** Firebase Authentication (Google Sign-In) with server-side Firebase Admin SDK token verification and PostgreSQL `users` role lookup.
3. **Two Application Roles:**
   - **Business Owner (`owner`):** Full access across all farms, operations, employee salaries, expenses, salary runs, payments, reports, team access management, and immutable audit logs. Initial owner bootstrap matches `amanrajpura2307@gmail.com`.
   - **Manager / Supervisor (`manager`):** Farm-floor operational access (attendance, sex-wise mortality, egg collections, feed consumption) on mobile, tablet, or laptop. Zero backend or UI access to finance, salaries, or full audit logs.
4. **Laying-Phase Broiler Breeder Operations:**
   - Multi-farm management with per-house **Flock Batches**.
   - Captures **Starting Bird Age (Weeks)** at placement and calculates ongoing flock age forward (`Week X + Yd`).
   - Tracks sex-wise bird population and mortality (**Hens vs. Roosters**).
   - Tracks daily egg production split (**Hatching/Fertile vs. Commercial vs. Reject**).
5. **Strict Feed Unit Separation:** Feed entries record either `bags` or `kg` and are always aggregated and reported separately—never automatically converted or combined.
6. **Attendance:** Daily attendance enforces `present`, `half_day`, `absent`, and `leave` statuses with one record per employee per date.
7. **Currency & Financial Safety:** All financial records operate in **INR (₹)** using exact decimal (`NUMERIC(12, 2)`) / integer-paise arithmetic. Financial records are never silently erased: cancelled items are marked **Voided**, and cancelled settlements create explicit **Payment Reversal** records that restore outstanding balances without inflating expenses. Employees with historical records are deactivated rather than permanently deleted.

## 2. Nine Application Modules

1. **Dashboard:** Role-scoped live aggregates for selected periods (`Today`, `Last 7 Days`, `This Month`, `Cumulative`), farm-wise breeder cards, attendance counts, operational alerts, and Owner-only INR financial strip.
2. **Employees:** Searchable employee roster (Active/Inactive filter), Add/Edit profile drawer, soft deactivation, Owner-only salary column, and Owner-only "App User Access" tab to pre-register/manage `owner` and `manager` Google emails.
3. **Attendance:** Date picker and farm filter, single/bulk daily marking grid (`Present`, `Half-Day`, `Absent`, `Leave`), employee attendance history, edit modal with correction reason and optimistic locking.
4. **Farms & Breeder Batches:** Farm directory, batch creation/edit (House/Batch Code, Placement Date, Starting Bird Age in Weeks, Initial Hens, Initial Roosters, breed notes), and batch detail timeline.
5. **Egg Production:** Daily egg collection logging split into `hatching_eggs`, `commercial_eggs`, and `reject_eggs`, with farm/batch/date-range filtering, edit with correction reason, optimistic locking, and soft-delete/voiding.
6. **Feed & Mortality:**
   - Daily feed consumption per batch in `bags` or `kg` (strictly isolated).
   - Daily sex-wise mortality (`hens_count`, `roosters_count`) with reason category and population-bound enforcement.
7. **Finance *(Owner-Only)*:** Three sub-tabs (*Expenses*, *Salaries*, *Payments & Transactions*) with live reconciled totals, attendance-assisted monthly salary runs, partial/full payments with overpayment protection, voiding, and payment reversals.
8. **Reports & Analytics:** Date-range presets (`Daily`, `Weekly`, `Monthly`, `Custom`, `Cumulative`) and farm selector across Attendance, Egg Production, Feed Consumption, Mortality & Live Flock, and Owner-only Financial reports, with CSV export.
9. **Activity & Audit Logs *(Owner-Only)*:** Append-only, filterable timeline showing actor identity, timestamp, action, human-readable summary, previous vs. updated JSON values, and correction reason.
