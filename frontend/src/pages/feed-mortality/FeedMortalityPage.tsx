import { useState } from 'react';
import { PhaseNoticeBanner } from '../../components/common/PhaseNoticeBanner';
import { DEMO_DASHBOARD_BY_RANGE } from '../../data/demoDashboardData';
import { formatNumber, formatPercent, getTodayIsoDate } from '../../utils/flockMath';

export function FeedMortalityPage() {
  const batches = DEMO_DASHBOARD_BY_RANGE.today.batches;
  const [activeTab, setActiveTab] = useState<'feed' | 'mortality'>('feed');
  const [entryDate, setEntryDate] = useState<string>(getTodayIsoDate);
  const [selectedBatchId, setSelectedBatchId] = useState<string>(batches[0].id);

  // Feed state
  const [feedType, setFeedType] = useState<string>('Breeder Female Feed');
  const [feedQty, setFeedQty] = useState<string>('14');
  const [feedUnit, setFeedUnit] = useState<'bags' | 'kg'>('bags');

  // Mortality state
  const [femaleDeathsInput, setFemaleDeathsInput] = useState<string>('3');
  const [maleDeathsInput, setMaleDeathsInput] = useState<string>('1');
  const [reasonCategory, setReasonCategory] = useState<string>('Natural/Unknown');

  const selectedBatch = batches.find((b) => b.id === selectedBatchId) ?? batches[0];
  const liveFemales = selectedBatch.initialFemales - selectedBatch.cumulativeFemaleDeaths;
  const liveMales = selectedBatch.initialMales - selectedBatch.cumulativeMaleDeaths;

  const femaleDeaths = Math.max(0, Number.parseInt(femaleDeathsInput || '0', 10) || 0);
  const maleDeaths = Math.max(0, Number.parseInt(maleDeathsInput || '0', 10) || 0);
  const totalDeaths = femaleDeaths + maleDeaths;
  const parsedFeedQty = Math.max(0, Number.parseFloat(feedQty || '0') || 0);

  return (
    <div className="space-y-6">
      <PhaseNoticeBanner
        title="Phase 2 Mobile-First Entry Preview — Connected in Phase 5"
        description="Date defaults to Today and any active house can be selected for leave coverage. Feed units (bags vs. kg) remain strictly isolated, and mortality % calculates live."
      />

      <div>
        <h1 className="font-display text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          Feed &amp; Mortality
        </h1>
        <p className="mt-1 text-sm text-muted">
          Daily feed consumption (bags / kg isolated) and Female / Male mortality tracking
        </p>
      </div>

      <div className="flex flex-wrap gap-1 border-b border-border">
        <button
          type="button"
          onClick={() => setActiveTab('feed')}
          className={`min-h-[44px] border-b-2 px-4 py-2 text-sm font-medium transition-all duration-200 ${
            activeTab === 'feed'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted hover:text-foreground'
          }`}
        >
          Feed Consumption (Bags / kg)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('mortality')}
          className={`min-h-[44px] border-b-2 px-4 py-2 text-sm font-medium transition-all duration-200 ${
            activeTab === 'mortality'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted hover:text-foreground'
          }`}
        >
          Mortality (Female &amp; Male)
        </button>
      </div>

      <section className="rounded-lg border border-border bg-surface p-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="fm-date" className="block text-xs font-medium text-foreground">
              Entry Date
            </label>
            <input
              id="fm-date"
              type="date"
              value={entryDate}
              onChange={(e) => setEntryDate(e.target.value)}
              className="mt-1 min-h-[48px] w-full rounded-md border border-border bg-background px-3 py-2 font-mono text-sm text-foreground transition-all duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label htmlFor="fm-house-batch" className="block text-xs font-medium text-foreground">
              House / Active Batch (Any House)
            </label>
            <select
              id="fm-house-batch"
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

        {activeTab === 'feed' ? (
          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label htmlFor="feed-type" className="block text-xs font-medium text-foreground">
                  Feed Type
                </label>
                <select
                  id="feed-type"
                  value={feedType}
                  onChange={(e) => setFeedType(e.target.value)}
                  className="mt-1 min-h-[48px] w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground transition-all duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option>Breeder Female Feed</option>
                  <option>Breeder Male Feed</option>
                  <option>Pre-Lay</option>
                  <option>Supplement</option>
                </select>
              </div>

              <div>
                <label htmlFor="feed-qty" className="block text-xs font-medium text-foreground">
                  Quantity
                </label>
                <input
                  id="feed-qty"
                  type="number"
                  inputMode="decimal"
                  step="0.1"
                  min={0}
                  value={feedQty}
                  onChange={(e) => setFeedQty(e.target.value)}
                  className="mt-1 min-h-[48px] w-full rounded-md border border-border bg-background px-3 py-2 font-mono text-base font-semibold text-foreground transition-all duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <span className="block text-xs font-medium text-foreground">
                  Unit (Strictly Isolated)
                </span>
                <div className="mt-1 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFeedUnit('bags')}
                    className={`min-h-[48px] rounded-md border text-sm font-medium transition-all duration-200 ${
                      feedUnit === 'bags'
                        ? 'border-primary bg-primary text-white shadow-sm'
                        : 'border-border bg-background text-foreground hover:border-primary/40'
                    }`}
                  >
                    Bags
                  </button>
                  <button
                    type="button"
                    onClick={() => setFeedUnit('kg')}
                    className={`min-h-[48px] rounded-md border text-sm font-medium transition-all duration-200 ${
                      feedUnit === 'kg'
                        ? 'border-primary bg-primary text-white shadow-sm'
                        : 'border-border bg-background text-foreground hover:border-primary/40'
                    }`}
                  >
                    Kilograms (kg)
                  </button>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-background p-4">
              <p className="text-[11px] font-medium uppercase tracking-wide text-muted">
                Unit-Isolated Entry Preview
              </p>
              <p className="mt-1 font-mono text-base font-semibold text-foreground">
                {parsedFeedQty} {feedUnit} · {feedType}
              </p>
            </div>

            <button
              type="button"
              disabled
              className="min-h-[48px] w-full cursor-not-allowed rounded-md bg-primary/50 px-5 py-2.5 text-sm font-medium text-white sm:w-auto"
            >
              Save Feed Log (Connected in Phase 5)
            </button>
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label htmlFor="mort-female" className="block text-xs font-medium text-foreground">
                  Female Mortality (Live: {formatNumber(liveFemales)})
                </label>
                <input
                  id="mort-female"
                  type="number"
                  inputMode="numeric"
                  min={0}
                  value={femaleDeathsInput}
                  onChange={(e) => setFemaleDeathsInput(e.target.value)}
                  className="mt-1 min-h-[48px] w-full rounded-md border border-border bg-background px-3 py-2 font-mono text-base font-semibold text-foreground transition-all duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label htmlFor="mort-male" className="block text-xs font-medium text-foreground">
                  Male Mortality (Live: {formatNumber(liveMales)})
                </label>
                <input
                  id="mort-male"
                  type="number"
                  inputMode="numeric"
                  min={0}
                  value={maleDeathsInput}
                  onChange={(e) => setMaleDeathsInput(e.target.value)}
                  className="mt-1 min-h-[48px] w-full rounded-md border border-border bg-background px-3 py-2 font-mono text-base font-semibold text-foreground transition-all duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label htmlFor="mort-reason" className="block text-xs font-medium text-foreground">
                  Reason Category
                </label>
                <select
                  id="mort-reason"
                  value={reasonCategory}
                  onChange={(e) => setReasonCategory(e.target.value)}
                  className="mt-1 min-h-[48px] w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground transition-all duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option>Natural/Unknown</option>
                  <option>Heat Stress</option>
                  <option>Disease/Respiratory</option>
                  <option>Prolapse/Laying</option>
                  <option>Culling</option>
                  <option>Injury</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 rounded-lg border border-border bg-background p-4">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wide text-muted">
                  Female Mortality %
                </p>
                <p className="mt-1 font-mono text-base font-semibold text-foreground">
                  {formatPercent(femaleDeaths, liveFemales)}
                </p>
              </div>
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wide text-muted">
                  Male Mortality %
                </p>
                <p className="mt-1 font-mono text-base font-semibold text-foreground">
                  {formatPercent(maleDeaths, liveMales)}
                </p>
              </div>
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wide text-muted">
                  Total Daily %
                </p>
                <p className="mt-1 font-mono text-base font-semibold text-status-alert">
                  {formatPercent(totalDeaths, liveFemales + liveMales)}
                </p>
              </div>
            </div>

            <button
              type="button"
              disabled
              className="min-h-[48px] w-full cursor-not-allowed rounded-md bg-primary/50 px-5 py-2.5 text-sm font-medium text-white sm:w-auto"
            >
              Save Mortality Log (Connected in Phase 5)
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
