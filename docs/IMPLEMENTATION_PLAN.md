# Implementation Plan

> **Source of Truth:** Derived from [implementation_plan.md](../implementation_plan.md).
> **Current Phase:** **Phase 1 (Complete)**. Phases 2–8 are planned and require explicit approval before starting.

## Phase Overview

| Phase | Name | Key Deliverables | Status |
| --- | --- | --- | --- |
| **Phase 1** | Project Skeleton & Scaffolding | Monorepo workspace (`frontend/` + `backend/`), Vite + React + Tailwind CSS, Express + TypeScript, `GET /api/health`, `.env.example`, `.gitignore`, and core documentation. | **Complete** |
| **Phase 2** | Database Schema & Migrations | Drizzle ORM setup, PostgreSQL connection (Cloud SQL / local), all 12 tables, constraints, and reproducible migrations. | Planned |
| **Phase 3** | Authentication & RBAC | Firebase Auth (Google Sign-In) on frontend, Firebase Admin SDK verification middleware, `users` role lookup (`owner` / `manager`), owner bootstrap & team access endpoints. | Planned |
| **Phase 4** | Farms, Flock Batches & Employees | Farm & Breeder Batch CRUD (with Starting Bird Age, Initial Hens/Roosters), Employee roster, soft-deactivation, and Owner-only salary field filtering. | Planned |
| **Phase 5** | Daily Operations Modules | Attendance (unique per employee/date), Egg Production (hatching/commercial/reject), Feed Consumption (strict `bags` vs `kg`), Sex-wise Mortality, optimistic locking (`409 Conflict`), and audit log writes. | Planned |
| **Phase 6** | Finance & Settlements *(Owner-Only)* | Expenses, attendance-assisted Monthly Salary Runs, Payments (partial/full with overpayment guard), Voiding, Payment Reversals, and exact integer-paise arithmetic. | Planned |
| **Phase 7** | Dashboard, Reports & Audit Logs | Role-scoped Dashboard aggregates, Date-Range Reports (`Daily`, `Weekly`, `Monthly`, `Custom`, `Cumulative`) with CSV export, and Owner-only Audit Log viewer. | Planned |
| **Phase 8** | Testing, Verification & Deployment | Automated calculation & integrity test suite (17 scenarios), end-to-end verification, and production deployment configuration. | Planned |
