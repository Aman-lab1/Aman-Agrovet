import type { ReactNode } from 'react';
import { PhaseNoticeBanner } from './PhaseNoticeBanner';

export interface ModuleTab {
  id: string;
  label: string;
  ownerOnly?: boolean;
}

interface ModuleShellProps {
  title: string;
  subtitle: string;
  connectedPhase: string;
  primaryActionLabel: string;
  filters?: string[];
  columns: string[];
  emptyStateTitle: string;
  emptyStateDescription: string;
  tabs?: ModuleTab[];
  activeTabId?: string;
  onTabChange?: (tabId: string) => void;
  summaryStrip?: ReactNode;
}

export function ModuleShell({
  title,
  subtitle,
  connectedPhase,
  primaryActionLabel,
  filters = [],
  columns,
  emptyStateTitle,
  emptyStateDescription,
  tabs,
  activeTabId,
  onTabChange,
  summaryStrip,
}: ModuleShellProps) {
  return (
    <div className="space-y-4">
      <PhaseNoticeBanner
        title={`Phase 2 UI Shell — Connected in ${connectedPhase}`}
        description="This module layout previews the planned structure, filters, and table columns. Database persistence, API endpoints, and form submissions are intentionally disabled until later phases."
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-xl font-bold text-foreground">{title}</h1>
          <p className="mt-0.5 text-sm text-muted">{subtitle}</p>
        </div>
        <button
          type="button"
          disabled
          title={`Enabled in ${connectedPhase}`}
          className="inline-flex min-h-[44px] cursor-not-allowed items-center justify-center rounded-md bg-primary/50 px-4 py-2 text-sm font-medium text-white"
        >
          {primaryActionLabel}
        </button>
      </div>

      {tabs && tabs.length > 0 && (
        <div className="flex flex-wrap gap-1 border-b border-border">
          {tabs.map((tab) => {
            const isActive = tab.id === activeTabId;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange?.(tab.id)}
                className={`min-h-[44px] border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted hover:text-foreground'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      )}

      {summaryStrip}

      {filters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-surface p-3">
          <span className="text-xs font-medium uppercase tracking-wide text-muted">
            Planned Filters:
          </span>
          {filters.map((filterLabel) => (
            <span
              key={filterLabel}
              className="inline-flex min-h-[36px] items-center rounded-md border border-border bg-background px-3 py-1 text-xs text-muted"
            >
              {filterLabel}
            </span>
          ))}
        </div>
      )}

      <div className="overflow-hidden rounded-lg border border-border bg-surface">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-[13px]">
            <thead>
              <tr className="border-b border-border bg-background text-xs font-semibold uppercase tracking-wide text-muted">
                {columns.map((col) => (
                  <th key={col} className="whitespace-nowrap px-4 py-3">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center">
                  <p className="font-display text-sm font-semibold text-foreground">
                    {emptyStateTitle}
                  </p>
                  <p className="mx-auto mt-1 max-w-md text-xs text-muted">
                    {emptyStateDescription}
                  </p>
                  <span className="mt-3 inline-block rounded border border-border bg-background px-2.5 py-1 font-mono text-[11px] text-muted">
                    Status: Connected in {connectedPhase}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
