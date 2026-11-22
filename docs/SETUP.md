# Local Setup Guide

> **Current Scope:** Phase 1 scaffolding (frontend + backend health check). PostgreSQL and Firebase credentials are not required to run Phase 1.

## Prerequisites

- **Node.js:** v20+ (verified on v22.22.0)
- **npm:** v10+ (verified on v10.9.4)
- **Git**

## 1. Install Dependencies

From the repository root:

```bash
npm install
```

This installs dependencies for both `frontend/` and `backend/` via npm workspaces.

## 2. Environment Configuration

Copy `.env.example` to `.env` at the repository root (optional for Phase 1 defaults, required in Phase 2+):

```bash
cp .env.example .env
```

> Never commit `.env` or any real credentials to Git.

## 3. Run Development Servers

Start the backend API (`http://localhost:4000`):

```bash
npm run dev:backend
```

In a separate terminal, start the frontend Vite dev server (`http://localhost:5173`):

```bash
npm run dev:frontend
```

Vite proxies `/api/*` requests to `http://localhost:4000`.

## 4. Verify Health Check

With the backend running, request:

```bash
curl http://localhost:4000/api/health
```

Expected response (`200 OK`):

```json
{
  "status": "ok",
  "service": "aman-agrovet-v3-api",
  "environment": "development",
  "timestamp": "..."
}
```

## 5. Typecheck & Build

```bash
npm run typecheck
npm run build
```
