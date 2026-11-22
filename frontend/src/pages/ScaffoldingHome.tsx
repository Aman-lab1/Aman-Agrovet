import { useHealthCheck } from '../hooks/useHealthCheck';

export function ScaffoldingHome() {
  const { loading, data, error, refresh } = useHealthCheck();

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-border bg-surface p-6">
        <h1 className="font-display text-xl font-bold text-foreground">
          Project Skeleton &amp; Scaffolding
        </h1>
        <p className="mt-2 text-sm text-muted">
          AMAN Agrovet V3 internal poultry farm management system. Phase 1 establishes the
          separated React + Tailwind frontend and Express + TypeScript backend foundation.
        </p>
      </section>

      <section className="rounded-lg border border-border bg-surface p-6">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-display text-base font-semibold text-foreground">
            Backend API Health Check
          </h2>
          <button
            type="button"
            onClick={refresh}
            className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-primary-hover"
          >
            Re-check
          </button>
        </div>

        <div className="mt-4 rounded-md border border-border bg-background p-4 font-mono text-xs">
          {loading && <p className="text-muted">Checking /api/health...</p>}
          {!loading && error && (
            <p className="text-status-alert">
              Offline / Unreachable: {error}
            </p>
          )}
          {!loading && data && (
            <dl className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <div>
                <dt className="text-muted">Status</dt>
                <dd className="font-semibold text-status-nominal">{data.status.toUpperCase()}</dd>
              </div>
              <div>
                <dt className="text-muted">Service</dt>
                <dd>{data.service}</dd>
              </div>
              <div>
                <dt className="text-muted">Environment</dt>
                <dd>{data.environment}</dd>
              </div>
              <div>
                <dt className="text-muted">Timestamp</dt>
                <dd>{data.timestamp}</dd>
              </div>
            </dl>
          )}
        </div>
      </section>
    </div>
  );
}
