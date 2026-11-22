# AMAN Agrovet Poultry Management System

A full-stack internal poultry business management web application for **AMAN Agrovet**, built for **Laying-Phase Broiler Breeder (Parent Stock)** operations on a live **Cloud SQL (PostgreSQL)** backend with **Firebase Authentication**, strict server-side role-based access control, exact INR financial accounting, and verifiable record-derived calculations.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The four core operational and infrastructure decisions confirmed during discovery are locked in below. Review the two remaining operational defaults before approving.

- **Confirmed — PostgreSQL Backend**: Provision built-in **Cloud SQL (PostgreSQL)** automatically in AI Studio with **Drizzle ORM** for type-safe queries and reproducible schema migrations, paired with **Firebase Authentication (Google Sign-In)** and server-side token verification.
- **Confirmed — Laying-Phase Broiler Breeder Operations**: Multi-farm management with per-house **Flock Batches** that capture **Starting Bird Age (Weeks)** at placement and calculate ongoing flock age forward (`Week X + Yd`), sex-wise bird population and mortality (**Hens vs. Roosters**), daily egg production split (**Fertile/Hatching vs. Commercial vs. Reject**), and daily feed consumption per batch.
- **Confirmed — Strict Feed Unit Separation**: Feed entries record either **Bags** or **Kilograms (kg)** and are always aggregated and reported in separate totals—never automatically converted or combined.
- **Confirmed — Attendance & Currency**: Daily attendance enforces **Present, Half-Day, Absent, and Leave** statuses (one record per employee per date), and all financial records operate in **INR (₹)** using exact decimal/paise arithmetic.
- **Recommended Default — Initial Business Owner Access**: The first authenticated account matching your Google email (`amanrajpura2307@gmail.com`) is bootstrapped as **Business Owner**. From inside the application, the Business Owner can pre-register additional team emails as either **Business Owner** or **Manager / Supervisor**—authorization is always checked against the PostgreSQL `users` table via verified Firebase UID, never hardcoded person names.
- **Recommended Default — Financial & Deletion Safety**: Financial records (expenses, salary runs, payments) are never silently erased; edits update totals via transactional reconciliation, cancelled items are marked **Voided**, and cancelled settlements create explicit **Payment Reversal** records that restore outstanding balances without inflating expenses. Employees with historical records are deactivated rather than permanently deleted.

---

## 1. Overview & Core Concept

- **What It Does**: Centralizes everyday farm operations and business finances for AMAN Agrovet across nine separated modules: **Dashboard**, **Employees**, **Attendance**, **Farms & Breeder Batches**, **Egg Production**, **Feed & Mortality**, **Finance (Owner-only)**, **Reports & Analytics**, and **Activity & Audit Logs (Owner-only)**.
- **Target Audience / Personas**:
  - **Business Owner**: Oversees all farms, live flock health, egg fertility yield, staff attendance, expenses, salaries, payment settlements, full reports, and immutable audit history.
  - **Managers / Supervisors**: Farm-floor staff using Android phones, tablets, or laptops to record and correct daily attendance, sex-wise mortality, egg collections (hatching/commercial/reject), and feed consumption—with zero backend or UI access to finance, salaries, or full audit logs.
- **Key Value**: Replaces error-prone spreadsheets and chat messages with a single PostgreSQL source of truth where every summary, mortality rate, hatching-egg percentage, live bird count, and INR balance reconciles automatically whenever a record is added, edited, corrected, voided, or reversed.

---

## 2. User Experience & Visual Design

### Key User Flows

1. **Authenticated Entry & Role Routing**: User signs in via Google Sign-In. The backend verifies the Firebase ID token, maps the user to their PostgreSQL role (`owner` or `manager`), and hydrates only authorized navigation items and data payloads. Unregistered accounts see a clear "Access Pending" screen instructing them to ask the Business Owner to authorize their email.
2. **Farm & Flock Batch Setup**: Business Owner (or authorized manager) creates a Farm (e.g., *Farm 1 — North Sheds*) and starts a Laying-Phase Breeder Batch by entering House/Batch Code, Placement Date, **Starting Bird Age (Weeks)** (e.g., Week 20), Initial Hens, Initial Roosters, and optional breed notes. From that moment onward, current flock age (`Week 24 + 3d`), opening/closing live hens and roosters, and male-to-female ratio compute dynamically for any date.
3. **Rapid Mobile Daily Logging (Supervisor Workflow)**: On an Android phone, a supervisor taps a thumb-zone bottom tab (Attendance, Eggs, Feed, or Mortality), selects the Farm, Batch, and Date, enters structured quantities (e.g., *3,420 Hatching · 185 Commercial · 42 Reject* or *4 Hens · 1 Rooster* with reason), and submits. The backend validates bounds, checks for duplicate/version conflicts, commits the record + audit entry in a single transaction, and immediately refreshes reconciled totals.
4. **Record Correction & Concurrency Safety**: When editing an existing attendance, egg, feed, or mortality record, a correction form captures the updated values and an optional/required correction reason. Optimistic version checking prevents two supervisors from silently overwriting each other's edits.
5. **Owner Finance & Settlement Flow**: Business Owner records an Expense (e.g., ₹48,500 feed purchase) or generates a Monthly Salary Run informed by verified attendance counts. Subsequent full or partial payments reduce the outstanding balance; a payment reversal restores the outstanding balance and logs the reversal reason without double-counting expenses.
6. **Date-Range Reporting & Audit Inspection**: Users filter operational reports by Daily, Weekly, Monthly, Custom Date Range, or Cumulative views and export reconciled CSVs. The Business Owner inspects the append-only Activity & Audit Log showing actor identity, timestamp, previous vs. updated JSON values, and correction reason.

### Visual Identity & Theme

- **Aesthetic Direction**: **Utilitarian Precision Agro-Operations** — calm, high-contrast, outdoor-daylight-legible enterprise workspace engineered for fast, mistake-free daily farm data entry and high-density financial auditing.
- **Color Palette & Mood (60-30-10 Light Theme)**:
  - *Canvas (60%)*: Crisp cool off-white `--background` (`#F8FAFC`) and pure white `--surface` (`#FFFFFF`) cards with 1px hairline borders (`#E2E8F0`), zero nested cards, single elevation.
  - *Structural Ink (30%)*: Deep slate `--foreground` (`#0F172A`), muted slate `--muted-foreground` (`#475569`), subtle table dividers (`#F1F5F9`).
  - *Primary Accent (10%)*: Deep agricultural forest emerald `--primary` (`#166534`, hover `#14532D`) reserved strictly for primary CTAs, active navigation indicators, and focused inputs.
  - *Semantic Data States (always paired with explicit text labels, never color alone)*: Nominal/Present/Paid (`#16A34A`), Warning/Half-Day/Partially Paid (`#D97706`), Alert/Mortality/Absent/Overdue (`#DC2626`).
- **Typography & Hierarchy (2+1 System)**:
  - *Display & Navigation*: `Plus Jakarta Sans` (SemiBold 600 / Bold 700, `text-wrap: balance` on page titles).
  - *Body & Dense Data Tables*: `Public Sans` (Regular 400 / Medium 500, 14px–15px body, 13px compact table rows).
  - *Numeric Telemetry & Financial Ledger*: `JetBrains Mono` with `font-variant-numeric: tabular-nums` enforced on all bird counts, flock ages, egg splits, feed bags/kg, percentages, and INR (`₹`) amounts so digits and decimals align cleanly.
- **Component Styling & Layout**:
  - *Desktop (1440px)*: Fixed `248px` left sidebar navigation + single-row `56px` top bar (breadcrumb on left, 1 contextual primary CTA + account menu on right) + full-width structured data workspace.
  - *Mobile (375px–430px)*: Compact `52px` top header + thumb-zone `60px` bottom navigation bar (combined fixed height strictly $\le 15\%$ of viewport height), minimum `44×44px` touch targets, and slide-up entry drawers.
  - *Visual Restraint*: Zero static pill badges (metadata rendered as quiet inline text separated by `·`), zero thick left accent borders, zero decorative pulsing dots, zero fake telemetry tickers.
- **Interactive Feedback & Motion**: Fast `150ms` tactile transitions (`cubic-bezier(0.16, 1, 0.3, 1)`), skeleton row loaders matching table geometry, explicit empty states with direct "Log First Entry" actions, confirmation modals before voiding/reversing/deactivating records, and crisp server-confirmed success/error banners (a record is never reported saved until PostgreSQL confirms commit).

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Cloud SQL (PostgreSQL) + Drizzle ORM + Express API over Frontend-Direct Database Access**
  - *Chosen Approach*: All database reads and writes flow through an Express TypeScript API verified with Firebase Admin ID tokens, executing Drizzle ORM queries and PostgreSQL transactions against the Cloud SQL instance.
  - *Why*: Guarantees rock-solid backend enforcement of Business Owner vs. Manager/Supervisor authorization, guarantees server-derived audit actor identity (`req.user.uid` → PostgreSQL `users` row), and allows multi-step financial settlements and optimistic locking inside ACID database transactions.
  - *Alternatives Considered*: Direct browser-to-Supabase client access with RLS. Passed over because you chose built-in Cloud SQL PostgreSQL for seamless automatic setup and zero external credential friction while preserving full PostgreSQL relational rigor and reproducible migrations.
- **Decision 2: Record-Derived Aggregates & Exact Integer Paise Arithmetic**
  - *Chosen Approach*: Never store manually incremented dashboard counters. All operational totals (live hens/roosters, cumulative mortality, egg production splits, separate feed bags & kg) and financial balances (expense totals, settled amount, outstanding liability) are calculated directly from underlying normalized rows using exact PostgreSQL `NUMERIC(12, 2)` columns and integer-paise arithmetic in TypeScript.
  - *Why*: Eliminates stale totals, double-counting on edits, and IEEE-754 floating-point drift (e.g., `₹0.1 + ₹0.2 ≠ ₹0.30000000000000004`).
  - *Alternatives Considered*: Cached rollup columns updated by application code. Rejected because partial failures or edits easily desynchronize cached totals from source records.
- **Decision 3: Explicit Breeder Flock Denominators & Strict Feed Unit Isolation**
  - *Chosen Approach*: Every derived breeder metric displays and documents its exact denominator:
    - *Flock Age on Date $D$*: $\text{starting\_age\_weeks} + \lfloor (D - \text{placement\_date}) / 7 \rfloor$ weeks plus remainder days.
    - *Opening Live Hens / Roosters on Date $D$*: $\text{initial\_count} - \sum \text{mortality strictly before } D$.
    - *Daily Mortality %*: $\text{daily\_deaths} / \text{opening\_live\_birds} \times 100$ (separately for hens, roosters, and total; omitted/marked `N/A` if denominator is 0).
    - *Cumulative Mortality %*: $\text{cumulative\_deaths} / \text{initial\_birds} \times 100$.
    - *Hatching Egg % (HEP)*: $\text{hatching\_eggs} / \text{total\_eggs} \times 100$.
    - *Hen-Day Egg Production % (HDEP)*: $\text{total\_eggs} / \text{opening\_live\_hens} \times 100$.
    - *Feed Totals*: Separate `SUM(quantity)` where `unit = 'bags'` and `SUM(quantity)` where `unit = 'kg'`.
  - *Why*: Directly satisfies the brief's rule against arbitrary denominators and silent unit mixing.
- **Decision 4: Straightforward Two-Role Model Without an Admin Portal**
  - *Chosen Approach*: Exactly two application roles (`owner`, `manager`) with a clean "Team Access" tab inside Employees visible only to the Business Owner to add/deactivate user email access.
  - *Why*: Matches the brief's explicit scope decision—no separate Aegis/System Admin portal or complex per-permission matrix.

---

## 4. Technical Architecture & Data Strategy *(Technical Reference)*

### Architecture & Component Diagram

```text
┌────────────────────────────────────────────────────────────────────────────┐
│                        Browser Client (React + Tailwind)                   │
│                                                                            │
│  ┌──────────────────────┐   ┌───────────────────────────────────────────┐  │
│  │  Firebase Auth SDK   │   │          Role-Aware App Shell             │  │
│  │  (Google Sign-In,    │   │  Desktop Sidebar (248px) / Mobile Bottom  │  │
│  │   In-Memory ID Token)│   │  Tab Bar + Top Contextual Bar             │  │
│  └──────────┬───────────┘   └─────────────────────┬─────────────────────┘  │
│             │ Bearer Token                        │                        │
│             │               ┌─────────────────────▼─────────────────────┐  │
│             │               │  Modules: Dashboard · Farms & Batches ·   │  │
│             │               │  Eggs · Feed · Mortality · Attendance ·   │  │
│             │               │  Employees · Finance* · Reports · Audit*  │  │
│             │               │  (*Owner-Only Views)                      │  │
│             │               └─────────────────────┬─────────────────────┘  │
└─────────────┼─────────────────────────────────────┼────────────────────────┘
              │ HTTPS JSON API + Authorization: Bearer <Firebase ID Token>
┌─────────────▼─────────────────────────────────────▼────────────────────────┐
│                      Express API Server (Node + TypeScript)                │
│                                                                            │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │ Auth & RBAC Middleware: Verify Firebase ID Token -> Load User Role   │  │
│  │ from PostgreSQL -> Attach Verified Actor Context (owner / manager)   │  │
│  └──────────────────────────┬───────────────────────────────────────────┘  │
│                             │                                              │
│  ┌──────────────────────────▼───────────────────────────────────────────┐  │
│  │ Domain Services & Shared Calculation Engine                          │  │
│  │ · Exact Paise Financial Math · Flock Age & Sex-Wise Population Math  │  │
│  │ · Input Validation · Optimistic Lock Checks · Audit Log Writer       │  │
│  └──────────────────────────┬───────────────────────────────────────────┘  │
│                             │ Drizzle ORM (Parameterized SQL + ACID Tx)    │
└─────────────────────────────┼──────────────────────────────────────────────┘
                              │ Unix Socket (Cloud SQL Auth Proxy)
┌─────────────────────────────▼──────────────────────────────────────────────┐
│                     Cloud SQL (PostgreSQL Database)                        │
│                                                                            │
│  users · farms · flock_batches · employees · attendance_records            │
│  egg_production_records · feed_consumption_records · mortality_records     │
│  expenses · salary_records · payments · audit_logs                         │
└────────────────────────────────────────────────────────────────────────────┘
```

### Data Model & Core Entities

- **Users (`users`)**: `id`, `uid` (Firebase Auth UID, unique), `email` (unique, normalized lowercase), `full_name`, `role` (`owner` | `manager`), `is_active`, timestamps. Supports pre-inviting a manager by email before their first sign-in so their UID links automatically upon first Google login.
- **Farms (`farms`)**: `id`, `code` (unique), `name`, `location`, `farm_type` (default `broiler_breeder`), `is_active`, `notes`, timestamps.
- **Flock Batches (`flock_batches`)**: `id`, `farm_id` (FK → `farms`), `batch_code` (unique per farm), `house_name`, `breed_strain`, `placement_date` (DATE), `starting_age_weeks` (INTEGER $\ge 0$), `initial_hens` (INTEGER $\ge 0$), `initial_roosters` (INTEGER $\ge 0$), `status` (`active` | `depleted` | `closed`), `closed_date`, `version` (optimistic lock), `notes`, timestamps.
- **Employees (`employees`)**: `id`, `employee_code` (unique), `full_name`, `phone`, `designation`, `assigned_farm_id` (FK → `farms`, nullable), `joining_date`, `monthly_salary_inr` (`NUMERIC(12, 2)`, stripped from API payloads for non-owners), `status` (`active` | `inactive`), `deactivated_at`, `version`, timestamps.
- **Attendance Records (`attendance_records`)**: `id`, `employee_id` (FK → `employees`), `farm_id` (FK → `farms`, nullable), `attendance_date` (DATE), `status` (`present` | `half_day` | `absent` | `leave`), `notes`, `created_by` (FK → `users`), `updated_by` (FK → `users`), `version`, timestamps. Enforces `UNIQUE (employee_id, attendance_date)`.
- **Egg Production Records (`egg_production_records`)**: `id`, `farm_id`, `batch_id` (FK → `flock_batches`), `collection_date` (DATE), `hatching_eggs` (INTEGER $\ge 0$), `commercial_eggs` (INTEGER $\ge 0$), `reject_eggs` (INTEGER $\ge 0$), `notes`, `is_deleted` (soft-delete flag for auditability or hard delete with audit snapshot—we will support clean deletion/voiding that immediately excludes the row from all totals while preserving the audit snapshot), `created_by`, `updated_by`, `version`, timestamps.
- **Feed Consumption Records (`feed_consumption_records`)**: `id`, `farm_id`, `batch_id`, `feed_date` (DATE), `feed_type` (e.g., `Breeder Female Feed`, `Breeder Male Feed`, `Pre-Lay`, `Supplement`), `quantity` (`NUMERIC(10, 3)` $\ge 0$), `unit` (`bags` | `kg`), `notes`, `created_by`, `updated_by`, `version`, timestamps.
- **Mortality Records (`mortality_records`)**: `id`, `farm_id`, `batch_id`, `mortality_date` (DATE), `hens_count` (INTEGER $\ge 0$), `roosters_count` (INTEGER $\ge 0$), `reason_category` (e.g., `Natural/Unknown`, `Heat Stress`, `Disease/Respiratory`, `Prolapse/Laying`, `Culling`, `Injury`), `notes`, `created_by`, `updated_by`, `version`, timestamps. Enforces DB/service check that cumulative mortality cannot exceed initial bird placement counts.
- **Expenses (`expenses`, Owner-Only)**: `id`, `expense_date`, `farm_id` (nullable for company-wide overhead), `category` (Feed Purchase, Medicine/Vaccine, Electricity/Water, Maintenance, Transport, Chicks/Stock, Misc), `vendor_name`, `description`, `amount_inr` (`NUMERIC(12, 2)` $> 0$), `status` (`active` | `voided`), `created_by`, `updated_by`, `version`, timestamps. Paid and outstanding totals are derived strictly from non-reversed linked `payments`.
- **Salary Records (`salary_records`, Owner-Only)**: `id`, `employee_id`, `salary_month` (`YYYY-MM`), `present_days`, `half_days`, `absent_days`, `leave_days`, `base_salary_inr` (`NUMERIC(12, 2)`), `adjustments_inr` (`NUMERIC(12, 2)`), `net_payable_inr` (`NUMERIC(12, 2)` $\ge 0$), `status` (`active` | `voided`), `notes`, `created_by`, `updated_by`, `version`, timestamps. Enforces `UNIQUE (employee_id, salary_month)` for active runs.
- **Payments (`payments`, Owner-Only)**: `id`, `payment_date`, `direction` (`outflow` | `inflow`), `target_type` (`expense` | `salary` | `other_income` | `other_expense`), `expense_id` (FK nullable), `salary_record_id` (FK nullable), `amount_inr` (`NUMERIC(12, 2)` $> 0$), `payment_method` (`cash` | `bank_transfer` | `upi` | `cheque`), `reference_no`, `notes`, `is_reversed` (BOOLEAN default false), `reversed_at`, `reversed_by`, `reversal_reason`, `created_by`, `version`, timestamps. Transactions enforce that total active payments against an expense or salary cannot exceed the obligation amount (preventing accidental overpayment/negative balance).
- **Audit Logs (`audit_logs`, Owner-Only Read, Append-Only)**: `id`, `actor_user_id` (FK → `users`), `actor_email`, `actor_name`, `action` (`CREATE` | `UPDATE` | `DELETE` | `VOID` | `REVERSE` | `DEACTIVATE`), `entity_type`, `entity_id`, `summary_text` (human-readable e.g., *"Anil updated egg production for Farm 1 Batch B-04"*), `previous_values` (JSONB), `updated_values` (JSONB), `reason`, `created_at`.

### Interactive Component & State Mapping

- **Dashboard View**: Fetches role-scoped live aggregates for selected date/period (`Today`, `Last 7 Days`, `This Month`, `Cumulative`), renders farm-wise breeder cards (current Week+Day age, live hens/roosters, male ratio, today's hatching/commercial/reject eggs, HEP %, HDEP %, separate feed bags & kg), attendance counts, operational alerts (e.g., missing today's log, mortality spike), and Owner-only INR financial strip.
- **Farms & Flock Batches View**: Farm directory + Batch creation/edit modal (with Starting Bird Age in Weeks, Initial Hens, Initial Roosters) + Batch Detail Timeline showing exact flock age progression and cumulative population reconciliation.
- **Daily Operations Views (Egg Production, Feed Consumption, Mortality)**: Consistent toolbar (Farm filter, Batch filter, Date Range filter, primary "Log Entry" button), mobile-optimized slide-up entry/edit drawer with client + server validation, live unit-safe summary bar above the table, edit modal capturing correction reason + optimistic lock `version`, and confirmed delete action that immediately reconciles summaries.
- **Attendance View**: Date picker + Farm filter + fast bulk/single daily marking grid (`Present`, `Half-Day`, `Absent`, `Leave`), employee attendance history view, edit modal with correction reason, and clear visual indicator of creator/editor and timestamp.
- **Employees & Team Access View**: Searchable employee roster with Active/Inactive filter, Add/Edit profile drawer, soft-deactivate confirmation (blocking permanent delete when historical records exist), Owner-only Salary column, and Owner-only "App User Access" tab to authorize Manager/Owner Google emails.
- **Finance View (Owner-Only)**: Three clean sub-tabs (*Expenses*, *Salaries*, *Payments & Transactions*) plus live reconciled summary strip (Total Expenses, Total Salaries Payable, Cash Paid Out, Cash Received, Total Outstanding Payable). Supports recording expenses, generating attendance-assisted monthly salary entries, applying partial/full payments with overpayment protection, editing expense amounts with balance guards, voiding entries, and reversing payments with mandatory reason.
- **Reports & Analytics View**: Date-range presets (Daily, Weekly, Monthly, Custom, Cumulative) + Farm selector across Attendance, Egg Production, Feed Consumption (Bags & kg separate), Mortality & Live Flock, and Owner-only Financial/Expense/Salary reports, with one-click CSV export of the exact reconciled table.
- **Activity & Audit Log View (Owner-Only)**: Filterable immutable timeline by entity type, action, user, and date range, with expandable before/after value diffs and correction reasons.

### Security, Validation & Verification Strategy

- **Verified Authentication & Backend RBAC**: Every `/api/*` endpoint requires a valid Firebase ID token verified server-side via `firebase-admin`. Role checks (`requireOwner` vs. `requireAuthenticatedUser`) execute strictly on the server; Manager/Supervisor tokens receive `403 Forbidden` on finance, salary, audit-log, and user-access routes, and salary fields are omitted from employee API payloads for non-owners.
- **Parameterized Queries, Transactions & Concurrency Guards**: All database operations use Drizzle ORM's parameterized query builder and PostgreSQL ACID transactions (pairing every mutation with its `audit_logs` insert in the same transaction). Version-checked updates (`WHERE id = $1 AND version = $2`) prevent concurrent overwrites with `409 Conflict` recovery prompts.
- **Secrets Isolation & Safe Input Handling**: Database credentials (`SQL_HOST`, `SQL_USER`, `SQL_PASSWORD`, `SQL_DB_NAME`) remain strictly server-side in runtime environment variables, never exposed to client bundles; all inputs are schema-validated on both client and server; all table/note content renders safely through React text bindings.
- **Automated Calculation & Integrity Test Suite**: A dedicated automated test suite executed before completion verifies all 17 brief scenarios—record add/edit/delete/correction reconciliation, payment partial/full/reversal math, duplicate attendance blocking, negative/zero/decimal validation, strict bags vs. kg isolation, flock age week+day math, sex-wise mortality denominators & population bounds, date-range boundaries, multi-farm isolation, optimistic concurrency conflict rejection, and exact INR paise rounding.
- **Essential Project Documentation**: Produces the five requested markdown documents (`README.md`, `REQUIREMENTS.md`, `DATABASE.md`, `CALCULATIONS.md`, and `SETUP.md`) tailored accurately to the implemented Cloud SQL + Drizzle + Firebase Auth architecture and AMAN Agrovet's laying-phase broiler breeder workflows.
