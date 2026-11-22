import { useEffect, useState } from 'react';
import { PhaseNoticeBanner } from '../../components/common/PhaseNoticeBanner';
import { fetchBatches } from '../../services/apiClient';
import type { FlockBatch } from '../../types';
import { formatNumber, formatPercent, getTodayIsoDate } from '../../utils/flockMath';

export function EggProductionPage() {
  const [batches, setBatches] = useState<FlockBatch[]>([]);
  const [loadingBatches, setLoadingBatches] = useState(true);
  const [collectionDate, setCollectionDate] = useState<string>(getTodayIsoDate);
  const [selectedBatchId, setSelectedBatchId] = useState<string>('');
  const [hatchingInput, setHatchingInput] = useState<string>('0');
  const [commercialInput, setCommercialInput] = useState<string>('0');
  const [rejectInput, setRejectInput] = useState<string>('0');

  useEffect(() => {
    fetchBatches()
      .then((rows) => {
        const active = rows.filter((b) => b.status === 'active');
        setBatches(active);
        if (active.length > 0) {
          setSelectedBatchId(String(active[0].id));
        }
      })
      .catch(() => {
        setBatches([]);
      })
      .finally(() => {
        setLoadingBatches(false);
      });
  }, []);

  const selectedBatch = batches.find((b) => String(b.id) === selectedBatchId);
  const liveFemales = selectedBatch?.initialFemales ?? 0;

  const hatching = Math.max(0, Number.parseInt(hatchingInput || '0', 10) || 0);
  const commercial = Math.max(0, Number.parseInt(commercialInput || '0', 10) || 0);
  const reject = Math.max(0, Number.parseInt(rejectInput || '0', 10) || 0);
  const totalEggs = hatching + commercial + reject;

  return (
    <div className="space-y-6">
      <PhaseNoticeBanner
        title="Phase 5 Preview — Connected in Phase 5"
        description="House / Batch dropdown reads live PostgreSQL batches. Date defaults to Today and Total Eggs, HEP %, and HDEP % update live as you type. Saving is disabled until Phase 5."
      />

      <div>
        <h1 className="font-display text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          Egg Production
        </h1>
        <p className="mt-1 text-sm text-muted">
          Daily egg collection split strictly into Hatching / Fertile, Commercial, and Reject eggs
        </p>
      </div>

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
              className="mt-1 min-h-[48px] w-full rounded-md border border-border bg-background px-3 py-2 font-mono text-sm text-foreground"
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
              disabled={loadingBatches || batches.length === 0}
              className="mt-1 min-h-[48px] w-full rounded-md border border-border bg-background px-3 py-2 text-sm font-medium text-foreground"
            >
              {loadingBatches ? (
                <option value="">Loading batches...</option>
              ) : batches.length === 0 ? (
                <option value="">No active batches configured</option>
              ) : (
                batches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.houseName} — {b.batchCode} ({b.primarySupervisorName || 'Unassigned'})
                  </option>
                ))
              )}
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
              className="mt-1 min-h-[48px] w-full rounded-md border border-border bg-background px-3 py-2 font-mono text-base font-semibold text-foreground"
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
              className="mt-1 min-h-[48px] w-full rounded-md border border-border bg-background px-3 py-2 font-mono text-base font-semibold text-foreground"
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
              className="mt-1 min-h-[48px] w-full rounded-md border border-border bg-background px-3 py-2 font-mono text-base font-semibold text-status-alert"
            />
          </div>
        </div>

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
    </div>
  );
}
