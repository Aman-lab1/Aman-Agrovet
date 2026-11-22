# AMAN Agrovet V3

Internal poultry business management web application for **AMAN Agrovet**, designed for **Laying-Phase Broiler Breeder (Parent Stock)** operations.

> **Current Development Stage:** **Phase 1 — Project Skeleton & Scaffolding (Complete)**.
> Business modules, PostgreSQL/Drizzle schema migrations, Firebase authentication, and financial calculations are **not yet implemented** and are scheduled for upcoming phases.

## Technology Stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS
- **Backend:** Express, TypeScript, Node.js
- **Database (Planned — Phase 2+):** Google Cloud SQL (PostgreSQL) with Drizzle ORM
- **Authentication (Planned — Phase 3+):** Firebase Authentication (Google Sign-In) & Firebase Admin SDK
- **Version Control:** GitHub
- **Application Roles:** `owner` (Business Owner) and `manager` (Manager / Supervisor)

## Repository Structure

```text
aman-agrovet-v3/
├── frontend/               # React + TypeScript + Vite + Tailwind CSS client
├── backend/                # Express + TypeScript API server
├── docs/                   # Project requirements, architecture, schema, and setup docs
├── implementation_plan.md  # Primary product and architecture specification
├── .env.example            # Environment variable template
├── .gitignore              # Git ignore rules
├── package.json            # Root npm workspaces configuration
└── README.md               # Project overview
```

## Quick Start

See [docs/SETUP.md](./docs/SETUP.md) for full local setup instructions.

```bash
npm install
npm run dev:backend   # Starts Express API on http://localhost:4000
npm run dev:frontend  # Starts Vite dev server on http://localhost:5173
```

## Documentation

- [Requirements](./docs/REQUIREMENTS.md)
- [Architecture](./docs/ARCHITECTURE.md)
- [Database Design](./docs/DATABASE.md)
- [Calculations](./docs/CALCULATIONS.md)
- [Implementation Plan](./docs/IMPLEMENTATION_PLAN.md)
- [Local Setup](./docs/SETUP.md)
