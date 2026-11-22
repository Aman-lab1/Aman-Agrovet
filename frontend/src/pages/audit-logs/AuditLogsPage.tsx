import { RefreshCw } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { OwnerOnlyNotice } from '../../components/common/OwnerOnlyNotice';
import { useAuth } from '../../contexts/AuthContext';
import { fetchAuditLogs } from '../../services/apiClient';
import type { AuditLogEntry } from '../../types';

export function AuditLogsPage() {
  const { isOwner } = useAuth();
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [entityFilter, setEntityFilter] = useState('');
  const [actionFilter, setActionFilter] = useState('');

  const loadLogs = useCallback(async () => {
    if (!isOwner) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAuditLogs({
        entityType: entityFilter || undefined,
        action: actionFilter || undefined,
      });
      setLogs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load audit logs');
    } finally {
      setLoading(false);
    }
  }, [isOwner, entityFilter, actionFilter]);

  useEffect(() => {
    void loadLogs();
  }, [loadLogs]);

  if (!isOwner) {
    return <OwnerOnlyNotice moduleName="Activity & Audit Logs" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            Activity &amp; Audit Logs (Owner-Only)
          </h1>
          <p className="mt-1 text-sm text-muted">
            Append-only PostgreSQL audit trail recorded inside every mutation transaction
          </p>
        </div>

        <button
          type="button"
          onClick={() => void loadLogs()}
          className="inline-flex min-h-[44px] items-center gap-2 rounded-md border border-border bg-surface px-4 py-2 text-xs font-medium text-foreground transition-colors hover:border-primary/40"
        >
          <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Refresh</span>
        </button>
      </div>

      <div className="flex flex-wrap gap-3 rounded-lg border border-border bg-surface p-4">
        <select
          aria-label="Filter by entity type"
          value={entityFilter}
          onChange={(e) => setEntityFilter(e.target.value)}
          className="min-h-[44px] rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground sm:min-h-[38px]"
        >
          <option value="">All Entities</option>
          <option value="house">House</option>
          <option value="flock_batch">Flock Batch</option>
          <option value="employee">Employee</option>
          <option value="user">App User</option>
        </select>

        <select
          aria-label="Filter by action"
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          className="min-h-[44px] rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground sm:min-h-[38px]"
        >
          <option value="">All Actions</option>
          <option value="CREATE">CREATE</option>
          <option value="UPDATE">UPDATE</option>
          <option value="DEACTIVATE">DEACTIVATE</option>
        </select>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-lg border border-status-alert/40 bg-surface px-4 py-3 text-xs font-medium text-status-alert"
        >
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-lg border border-border bg-surface">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-[13px]">
            <thead>
              <tr className="border-b border-border bg-background text-xs font-semibold uppercase tracking-wide text-muted">
                <th className="whitespace-nowrap px-4 py-3">Timestamp</th>
                <th className="whitespace-nowrap px-4 py-3">Actor</th>
                <th className="whitespace-nowrap px-4 py-3">Action</th>
                <th className="whitespace-nowrap px-4 py-3">Entity</th>
                <th className="whitespace-nowrap px-4 py-3">Summary</th>
                <th className="whitespace-nowrap px-4 py-3">Details / Diff</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                Array.from({ length: 4 }).map((_, idx) => (
                  <tr key={idx}>
                    <td colSpan={6} className="px-4 py-4">
                      <div className="h-4 w-full animate-pulse rounded bg-background" />
                    </td>
                  </tr>
                ))
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-xs text-muted">
                    No audit log entries found. Create or update a House, Batch, Employee, or User to see live entries.
                  </td>
                </tr>
              ) : (
                logs.map((entry) => (
                  <tr key={entry.id} className="align-top hover:bg-background/60">
                    <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-muted">
                      {new Date(entry.createdAt).toLocaleString()}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <p className="font-medium text-foreground">{entry.actorName}</p>
                      <p className="font-mono text-[11px] text-muted">{entry.actorUsername}</p>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 font-mono text-xs font-semibold text-primary">
                      {entry.action}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-foreground">
                      {entry.entityType} #{entry.entityId}
                    </td>
                    <td className="px-4 py-3 text-xs text-foreground">
                      <p>{entry.summaryText}</p>
                      {entry.reason && (
                        <p className="mt-1 text-[11px] text-muted">Reason: {entry.reason}</p>
                      )}
                    </td>
                    <td className="px-4 py-3 font-mono text-[11px] text-muted">
                      {entry.updatedValues ? JSON.stringify(entry.updatedValues) : '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
