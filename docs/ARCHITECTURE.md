# System Architecture

> **Source of Truth:** Derived from [implementation_plan.md](../implementation_plan.md).
> **Current State (Phase 1):** Separated `frontend/` and `backend/` workspaces with a single `GET /api/health` endpoint. Database, Drizzle ORM, and Firebase Authentication are planned for Phases 2–3.

## 1. High-Level Architecture

```text
Browser Client (React + TypeScript + Tailwind CSS)
  │
  │  HTTPS JSON API + Authorization: Bearer <Firebase ID Token> (Phase 3+)
  ▼
Express API Server (Node.js + TypeScript)
  ├── Auth & RBAC Middleware (Phase 3+): Firebase Admin SDK token verification -> PostgreSQL users role lookup
  ├── Domain Services & Calculation Engine (Phases 4–7): Exact paise math, flock age & population math, optimistic locks, audit writer
  └── Drizzle ORM (Phase 2+): Parameterized SQL + ACID transactions
  │
  │  Unix Socket (Cloud SQL Auth Proxy) / Local PostgreSQL
  ▼
Google Cloud SQL (PostgreSQL)
```

## 2. Frontend Architecture (`frontend/`)

- **Framework:** React + TypeScript bundled with Vite.
- **Styling:** Tailwind CSS configured with the **Utilitarian Precision Agro-Operations** 60-30-10 light theme (`#F8FAFC` canvas, `#FFFFFF` surface, `#0F172A` foreground, `#166534` primary accent) and typography (`Plus Jakarta Sans`, `Public Sans`, `JetBrains Mono` with `tabular-nums`).
- **Authentication (Planned):** Firebase Auth SDK (Google Sign-In) holding an in-memory ID token sent as a `Bearer` token to the Express API.
- **Role-Aware Shell (Planned):** Desktop `248px` left sidebar + `56px` top bar; Mobile `52px` top header + `60px` thumb-zone bottom navigation bar.

## 3. Backend Architecture (`backend/`)

- **Runtime & Framework:** Node.js + Express + TypeScript (`NodeNext` ESM).
- **API Boundary:** All database reads and writes flow through the Express API—no direct browser-to-database access.
- **Security & Concurrency (Planned):**
  - Server-side Firebase ID token verification on every `/api/*` business route.
  - Strict server-side RBAC (`requireAuthenticatedUser` and `requireOwner`); managers receive `403 Forbidden` on finance, salary, audit-log, and user-access routes, and salary fields are stripped from employee payloads for non-owners.
  - Optimistic locking (`version` column check returning `409 Conflict` on stale updates).
  - ACID transactions pairing every mutation with an `audit_logs` insert.
  - Database credentials (`SQL_HOST`, `SQL_USER`, `SQL_PASSWORD`, `SQL_DB_NAME`) kept strictly server-side.

## 4. Phase 1 Scaffolding Status

- **Implemented:** Workspace layout, Vite + React + Tailwind frontend, Express + TypeScript backend, `GET /api/health` endpoint, environment templates, and documentation.
- **Not Yet Implemented:** Database connection, Drizzle schema/migrations, Firebase Auth/Admin SDK, and all nine business modules.
