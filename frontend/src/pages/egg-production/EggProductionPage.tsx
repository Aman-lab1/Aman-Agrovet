import { useState } from 'react';
import { PhaseNoticeBanner } from '../../components/common/PhaseNoticeBanner';
import { DEMO_DASHBOARD_BY_RANGE } from '../../data/demoDashboardData';
import { formatNumber, formatPercent, getTodayIsoDate } from '../../utils/flockMath';

export function EggProductionPage() {
  const batches = DEMO_DASHBOARD_BY_RANGE.today.batches;
  const [collectionDate, setCollectionDate] = useState<string>(getTodayIsoDate);
  const [selectedBatchId, setSelectedBatchId] = useState<string>(batches[0].id);
  const [hatchingInput, setHatchingInput] = useState<string>('3180');
  const [commercialInput, setCommercialInput] = useState<string>('195');
  const [rejectInput, setRejectInput] = useState<string>('48');

  const selectedBatch = batches.find((b) => b.id === selectedBatchId) ?? batches[0];
  const liveFemales = selectedBatch.initialFemales - selectedBatch.cumulativeFemaleDeaths;

  const hatching = Math.max(0, Number.parseInt(hatchingInput || '0', 10) || 0);
  const commercial = Math.max(0, Number.parseInt(commercialInput || '0', 10) || 0);
  const reject = Math.max(0, Number.parseInt(rejectInput || '0', 10) || 0);
  const totalEggs = hatching + commercial + reject;

  return (
    <div className="space-y-6">
      <PhaseNoticeBanner
        title="Phase 2 Mobile-First Entry Preview — Connected in Phase 5"
        description="Date defaults to Today and any active house can be selected for leave coverage. Total Eggs, HEP %, and HDEP % update live as you type. Saving is disabled until Phase 5."
      />

      <div>
        <h1 className="font-display text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          Egg Production
        </h1>
        <p className="mt-1 text-sm text-muted">
          Daily egg collection split strictly into Hatching / Fertile, Commercial, and Reject eggs
        </p>
      </div>

      {/* Mobile-First Thumb-Friendly Entry Preview */}
      <section className="rounded-lg border border-border bg-surface p-5">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
          <h2 className="font-display text-base font-bold text-foreground">
            Daily Egg Log Entry
          </h2>
          <span className="font-mono text-xs text-muted">
            Live Female Birds: {formatNumber(liveFemales)}
          </span>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="egg-date" className="block text-xs font-medium text-foreground">
              Collection Date
            </label>
            <input
              id="egg-date"
              type="date"
              value={collectionDate}
              onChange={(e) => setCollectionDate(e.target.value)}
              className="mt-1 min-h-[48px] w-full rounded-md border border-border bg-background px-3 py-2 font-mono text-sm text-foreground transition-all duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label htmlFor="egg-house-batch" className="block text-xs font-medium text-foreground">
              House / Active Batch (Any House)
            </label>
            <select
              id="egg-house-batch"
              value={selectedBatchId}
              onChange={(e) => setSelectedBatchId(e.target.value)}
              className="mt-1 min-h-[48px] w-full rounded-md border border-border bg-background px-3 py-2 text-sm font-medium text-foreground transition-all duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              {batches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.houseName} — {b.batchCode} ({b.primarySupervisor})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="egg-hatching" className="block text-xs font-medium text-foreground">
              Hatching / Fertile Eggs
            </label>
            <input
              id="egg-hatching"
              type="number"
              inputMode="numeric"
              min={0}
              value={hatchingInput}
              onChange={(e) => setHatchingInput(e.target.value)}
              className="mt-1 min-h-[48px] w-full rounded-md border border-border bg-background px-3 py-2 font-mono text-base font-semibold text-foreground transition-all duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label htmlFor="egg-commercial" className="block text-xs font-medium text-foreground">
              Commercial Eggs
            </label>
            <input
              id="egg-commercial"
              type="number"
              inputMode="numeric"
              min={0}
              value={commercialInput}
              onChange={(e) => setCommercialInput(e.target.value)}
              className="mt-1 min-h-[48px] w-full rounded-md border border-border bg-background px-3 py-2 font-mono text-base font-semibold text-foreground transition-all duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label htmlFor="egg-reject" className="block text-xs font-medium text-foreground">
              Reject Eggs
            </label>
            <input
              id="egg-reject"
              type="number"
              inputMode="numeric"
              min={0}
              value={rejectInput}
              onChange={(e) => setRejectInput(e.target.value)}
              className="mt-1 min-h-[48px] w-full rounded-md border border-border bg-background px-3 py-2 font-mono text-base font-semibold text-status-alert transition-all duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        {/* Live Calculated Totals */}
        <div className="mt-5 grid grid-cols-3 gap-3 rounded-lg border border-border bg-background p-4">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wide text-muted">Total Eggs</p>
            <p className="mt-1 font-mono text-lg font-semibold text-foreground">
              {formatNumber(totalEggs)}
            </p>
          </div>
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wide text-muted">HEP %</p>
            <p className="mt-1 font-mono text-lg font-semibold text-primary">
              {formatPercent(hatching, totalEggs)}
            </p>
          </div>
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wide text-muted">HDEP %</p>
            <p className="mt-1 font-mono text-lg font-semibold text-foreground">
              {formatPercent(totalEggs, liveFemales)}
            </p>
          </div>
        </div>

        <button
          type="button"
          disabled
          className="mt-5 min-h-[48px] w-full cursor-not-allowed rounded-md bg-primary/50 px-5 py-2.5 text-sm font-medium text-white sm:w-auto"
        >
          Save Egg Log (Connected in Phase 5)
        </button>
      </section>

      {/* Planned Ledger Table */}
      <section className="overflow-hidden rounded-lg border border-border bg-surface">
        <div className="border-b border-border px-5 py-3.5">
          <h2 className="font-display text-sm font-bold text-foreground">
            Egg Production Ledger (Connected in Phase 5)
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-[13px]">
            <thead>
              <tr className="border-b border-border bg-background text-xs font-semibold uppercase tracking-wide text-muted">
                <th className="whitespace-nowrap px-4 py-3">Date</th>
                <th className="whitespace-nowrap px-4 py-3">House / Batch</th>
                <th className="whitespace-nowrap px-4 py-3">Hatching</th>
                <th className="whitespace-nowrap px-4 py-3">Commercial</th>
                <th className="whitespace-nowrap px-4 py-3">Reject</th>
                <th className="whitespace-nowrap px-4 py-3">Total</th>
                <th className="whitespace-nowrap px-4 py-3">HEP % · HDEP %</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-xs text-muted">
                  Committed PostgreSQL egg collection records will appear here in Phase 5.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
