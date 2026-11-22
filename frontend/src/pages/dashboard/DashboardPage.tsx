import { AlertTriangle, Building2 } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useRolePreview } from '../../contexts/RolePreviewContext';
import {
  DATE_RANGE_LABELS,
  DEMO_DASHBOARD_BY_RANGE,
  DEMO_HOUSE_SUPERVISORS,
  type DateRangePreset,
} from '../../data/demoDashboardData';
import {
  formatFlockAge,
  formatInrFromPaise,
  formatMaleFemaleRatio,
  formatNumber,
  formatPercent,
} from '../../utils/flockMath';

const PRESETS: DateRangePreset[] = ['today', 'last_7_days', 'this_month', 'cumulative'];

export function DashboardPage() {
  const [range, setRange] = useState<DateRangePreset>('today');
  const [selectedHouseId, setSelectedHouseId] = useState<string>('all');
  const { isOwner } = useRolePreview();

  const dataset = DEMO_DASHBOARD_BY_RANGE[range];

  // Flexible house selection for both Owner and Manager (supports leave coverage)
  const visibleBatches =
    selectedHouseId === 'all'
      ? dataset.batches
      : dataset.batches.filter((b) => b.houseId === selectedHouseId);

  const totalInitialFemales = visibleBatches.reduce((acc, b) => acc + b.initialFemales, 0);
  const totalInitialMales = visibleBatches.reduce((acc, b) => acc + b.initialMales, 0);
  const totalLiveFemales = visibleBatches.reduce(
    (acc, b) => acc + (b.initialFemales - b.cumulativeFemaleDeaths),
    0,
  );
  const totalLiveMales = visibleBatches.reduce(
    (acc, b) => acc + (b.initialMales - b.cumulativeMaleDeaths),
    0,
  );
  const totalOpeningLiveFemales = visibleBatches.reduce((acc, b) => acc + b.openingLiveFemales, 0);
  const totalOpeningLiveMales = visibleBatches.reduce((acc, b) => acc + b.openingLiveMales, 0);

  const periodFemaleDeaths = visibleBatches.reduce((acc, b) => acc + b.periodFemaleDeaths, 0);
  const periodMaleDeaths = visibleBatches.reduce((acc, b) => acc + b.periodMaleDeaths, 0);
  const cumulativeFemaleDeaths = visibleBatches.reduce(
    (acc, b) => acc + b.cumulativeFemaleDeaths,
    0,
  );
  const cumulativeMaleDeaths = visibleBatches.reduce((acc, b) => acc + b.cumulativeMaleDeaths, 0);

  const hatchingEggs = visibleBatches.reduce((acc, b) => acc + b.hatchingEggs, 0);
  const commercialEggs = visibleBatches.reduce((acc, b) => acc + b.commercialEggs, 0);
  const rejectEggs = visibleBatches.reduce((acc, b) => acc + b.rejectEggs, 0);
  const totalEggs = hatchingEggs + commercialEggs + rejectEggs;

  const totalFeedBags = visibleBatches.reduce((acc, b) => acc + b.feedBags, 0);
  const totalFeedKg = visibleBatches.reduce((acc, b) => acc + b.feedKg, 0);

  return (
    <div className="space-y-6">
      <div
        role="status"
        className="flex flex-col gap-3 rounded-lg border border-status-warning/40 bg-surface px-5 py-3.5 text-sm sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-status-warning" aria-hidden="true" />
          <div>
            <p className="font-semibold text-foreground">
              DEMO / SAMPLE DATA — Phase 2 UI Preview (Not Live Farm Records)
            </p>
            <p className="mt-0.5 text-xs text-muted">
              Reference Date: <span className="font-mono">{dataset.referenceDate}</span> · Live PostgreSQL
              queries and Firebase Authentication will be connected in Phases 3–7.
            </p>
          </div>
        </div>
        {isOwner && (
          <Link
            to="/settings"
            className="inline-flex min-h-[40px] shrink-0 items-center justify-center rounded-md border border-border bg-background px-3.5 py-2 text-xs font-medium text-foreground transition-all duration-200 hover:border-primary/40 hover:bg-surface"
          >
            Owner Settings &amp; Setup
          </Link>
        )}
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="font-display text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            Operations Overview
          </h1>
          <p className="mt-1 text-sm text-muted">
            Laying-Phase Broiler Breeder summary across houses, batches, and daily metrics
          </p>
        </div>

        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <label htmlFor="dashboard-house-filter" className="text-xs font-medium text-muted">
              House:
            </label>
            <select
              id="dashboard-house-filter"
              value={selectedHouseId}
              onChange={(e) => setSelectedHouseId(e.target.value)}
              className="min-h-[44px] rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground transition-all duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 sm:min-h-[38px]"
            >
              <option value="all">All Houses ({dataset.batches.length})</option>
              {DEMO_HOUSE_SUPERVISORS.map((house) => (
                <option key={house.houseId} value={house.houseId}>
                  {house.houseName} ({house.supervisorName})
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Date range filter">
            {PRESETS.map((preset) => {
              const active = range === preset;
              return (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setRange(preset)}
                  className={`min-h-[44px] rounded-md border px-3 py-1.5 text-xs font-medium transition-all duration-200 sm:min-h-[38px] ${
                    active
                      ? 'border-primary bg-primary text-white shadow-sm'
                      : 'border-border bg-surface text-foreground hover:border-primary/40 hover:bg-background'
                  }`}
                >
                  {DATE_RANGE_LABELS[preset]}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Overall Summary KPIs */}
      <section aria-label="Overall summary KPIs" className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        <article className="rounded-lg border border-border bg-surface p-5 transition-all duration-200 hover:shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            Farms, Houses &amp; Active Batches
          </p>
          <div className="mt-3 flex items-baseline gap-3">
            <div>
              <span className="font-mono text-2xl font-semibold text-foreground">
                {dataset.totalFarms}
              </span>
              <span className="ml-1 text-xs text-muted">Farm</span>
            </div>
            <span className="text-border">/</span>
            <div>
              <span className="font-mono text-2xl font-semibold text-foreground">
                {visibleBatches.length}
              </span>
              <span className="ml-1 text-xs text-muted">
                {visibleBatches.length === 1 ? 'House' : 'Houses'}
              </span>
            </div>
            <span className="text-border">/</span>
            <div>
              <span className="font-mono text-2xl font-semibold text-foreground">
                {visibleBatches.length}
              </span>
              <span className="ml-1 text-xs text-muted">
                {visibleBatches.length === 1 ? 'Batch' : 'Batches'}
              </span>
            </div>
          </div>
          <p className="mt-3 text-xs text-muted">
            Laying-Phase Broiler Breeder · Parent Stock
          </p>
        </article>

        <article className="rounded-lg border border-border bg-surface p-5 transition-all duration-200 hover:shadow-sm">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              Sex-Wise Live Birds
            </p>
            <span className="font-mono text-xs font-medium text-foreground">
              Male : Female {formatMaleFemaleRatio(totalLiveFemales, totalLiveMales)}
            </span>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted">Live Female Birds</p>
              <p className="mt-0.5 font-mono text-xl font-semibold text-foreground">
                {formatNumber(totalLiveFemales)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted">Live Male Birds</p>
              <p className="mt-0.5 font-mono text-xl font-semibold text-foreground">
                {formatNumber(totalLiveMales)}
              </p>
            </div>
          </div>
          <p className="mt-3 font-mono text-[11px] text-muted">
            Initial: {formatNumber(totalInitialFemales)} Female · {formatNumber(totalInitialMales)} Male
          </p>
        </article>

        <article className="rounded-lg border border-border bg-surface p-5 transition-all duration-200 hover:shadow-sm">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              Egg Production ({DATE_RANGE_LABELS[range]})
            </p>
            <span className="font-mono text-xs font-semibold text-primary">
              Total {formatNumber(totalEggs)}
            </span>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            <div>
              <p className="text-[11px] text-muted">Hatching</p>
              <p className="mt-0.5 font-mono text-base font-semibold text-foreground">
                {formatNumber(hatchingEggs)}
              </p>
            </div>
            <div>
              <p className="text-[11px] text-muted">Commercial</p>
              <p className="mt-0.5 font-mono text-base font-semibold text-foreground">
                {formatNumber(commercialEggs)}
              </p>
            </div>
            <div>
              <p className="text-[11px] text-muted">Reject</p>
              <p className="mt-0.5 font-mono text-base font-semibold text-status-alert">
                {formatNumber(rejectEggs)}
              </p>
            </div>
          </div>
          <p className="mt-3 font-mono text-[11px] text-muted">
            HEP: {formatPercent(hatchingEggs, totalEggs)} · HDEP: {formatPercent(totalEggs, totalOpeningLiveFemales)}
          </p>
        </article>

        <article className="rounded-lg border border-border bg-surface p-5 transition-all duration-200 hover:shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            Feed Consumption (Units Isolated)
          </p>
          <div className="mt-3 grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted">Total Bags</p>
              <p className="mt-0.5 font-mono text-xl font-semibold text-foreground">
                {formatNumber(totalFeedBags)} <span className="text-xs font-normal text-muted">bags</span>
              </p>
            </div>
            <div>
              <p className="text-xs text-muted">Total Kilograms</p>
              <p className="mt-0.5 font-mono text-xl font-semibold text-foreground">
                {totalFeedKg.toFixed(1)} <span className="text-xs font-normal text-muted">kg</span>
              </p>
            </div>
          </div>
          <p className="mt-3 text-[11px] text-muted">
            Bags and kg are never auto-converted or combined
          </p>
        </article>

        <article className="rounded-lg border border-border bg-surface p-5 transition-all duration-200 hover:shadow-sm">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              Mortality (Female &amp; Male)
            </p>
            <span className="rounded border border-status-alert/30 bg-background px-2 py-0.5 text-[11px] font-medium text-status-alert">
              Alert Tracked
            </span>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted">Period ({DATE_RANGE_LABELS[range]})</p>
              <p className="mt-0.5 font-mono text-xs font-semibold text-foreground">
                Female: {periodFemaleDeaths} ({formatPercent(periodFemaleDeaths, totalOpeningLiveFemales)})
              </p>
              <p className="mt-0.5 font-mono text-xs font-semibold text-foreground">
                Male: {periodMaleDeaths} ({formatPercent(periodMaleDeaths, totalOpeningLiveMales)})
              </p>
            </div>
            <div>
              <p className="text-xs text-muted">Cumulative</p>
              <p className="mt-0.5 font-mono text-xs font-semibold text-foreground">
                Female: {cumulativeFemaleDeaths} ({formatPercent(cumulativeFemaleDeaths, totalInitialFemales)})
              </p>
              <p className="mt-0.5 font-mono text-xs font-semibold text-foreground">
                Male: {cumulativeMaleDeaths} ({formatPercent(cumulativeMaleDeaths, totalInitialMales)})
              </p>
            </div>
          </div>
        </article>

        <article className="rounded-lg border border-border bg-surface p-5 transition-all duration-200 hover:shadow-sm">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              Attendance ({DATE_RANGE_LABELS[range]})
            </p>
            <span className="font-mono text-xs text-muted">
              {dataset.attendance.totalActiveStaff} Active Staff
            </span>
          </div>
          <div className="mt-3 grid grid-cols-4 gap-2">
            <div>
              <p className="text-[11px] font-medium text-status-nominal">Present</p>
              <p className="mt-0.5 font-mono text-base font-semibold text-foreground">
                {formatNumber(dataset.attendance.present)}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-medium text-status-warning">Half-Day</p>
              <p className="mt-0.5 font-mono text-base font-semibold text-foreground">
                {formatNumber(dataset.attendance.halfDay)}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-medium text-status-alert">Absent</p>
              <p className="mt-0.5 font-mono text-base font-semibold text-foreground">
                {formatNumber(dataset.attendance.absent)}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-medium text-muted">Leave</p>
              <p className="mt-0.5 font-mono text-base font-semibold text-foreground">
                {formatNumber(dataset.attendance.leave)}
              </p>
            </div>
          </div>
          <p className="mt-3 text-[11px] text-muted">
            One record per employee per date
          </p>
        </article>
      </section>

      {/* House-Wise Operations Breakdown */}
      <section aria-label="House-Wise Operations Breakdown" className="space-y-4">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-base font-bold text-foreground">
              House-Wise Operations Breakdown
            </h2>
            <p className="text-xs text-muted">
              Individual house performance, active batch, and primary assigned supervisor ({DATE_RANGE_LABELS[range]})
            </p>
          </div>
          <span className="font-mono text-xs text-muted">
            Showing {visibleBatches.length} {visibleBatches.length === 1 ? 'house' : 'houses'}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {visibleBatches.map((batch) => {
            const liveFemales = batch.initialFemales - batch.cumulativeFemaleDeaths;
            const liveMales = batch.initialMales - batch.cumulativeMaleDeaths;
            const totalOpeningBirds = batch.openingLiveFemales + batch.openingLiveMales;
            const totalPeriodDeaths = batch.periodFemaleDeaths + batch.periodMaleDeaths;
            const batchTotalEggs = batch.hatchingEggs + batch.commercialEggs + batch.rejectEggs;
            const flockAge = formatFlockAge(
              batch.placementDate,
              batch.startingAgeWeeks,
              dataset.referenceDate,
            );

            return (
              <article
                key={batch.id}
                className="rounded-lg border border-border bg-surface p-5 transition-all duration-200 hover:shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border pb-3.5">
                  <div className="flex items-start gap-2.5">
                    <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                    <div>
                      <h3 className="font-display text-sm font-bold text-foreground">
                        {batch.houseName} · <span className="font-mono">{batch.batchCode}</span>
                      </h3>
                      <p className="text-xs text-muted">{batch.farmName}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-block rounded border border-border bg-background px-2.5 py-0.5 font-mono text-xs font-semibold text-foreground">
                      {flockAge}
                    </span>
                    <p className="mt-1 text-[11px] font-medium text-primary">
                      Primary Assigned: {batch.primarySupervisor}
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
                  <div>
                    <p className="text-[11px] text-muted">Live Female Birds</p>
                    <p className="mt-0.5 font-mono text-sm font-semibold text-foreground">
                      {formatNumber(liveFemales)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] text-muted">Live Male Birds</p>
                    <p className="mt-0.5 font-mono text-sm font-semibold text-foreground">
                      {formatNumber(liveMales)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] text-muted">Male : Female Ratio</p>
                    <p className="mt-0.5 font-mono text-sm font-semibold text-foreground">
                      {formatMaleFemaleRatio(liveFemales, liveMales)}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] text-muted">Hatching / Comm. / Reject</p>
                    <p className="mt-0.5 font-mono text-xs font-semibold text-foreground">
                      {formatNumber(batch.hatchingEggs)} / {formatNumber(batch.commercialEggs)} /{' '}
                      <span className="text-status-alert">{formatNumber(batch.rejectEggs)}</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] text-muted">HEP % · HDEP %</p>
                    <p className="mt-0.5 font-mono text-xs font-semibold text-foreground">
                      {formatPercent(batch.hatchingEggs, batchTotalEggs)} ·{' '}
                      {formatPercent(batchTotalEggs, batch.openingLiveFemales)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] text-muted">Period Mortality %</p>
                    <p className="mt-0.5 font-mono text-xs font-semibold text-foreground">
                      {totalPeriodDeaths} ({formatPercent(totalPeriodDeaths, totalOpeningBirds)})
                    </p>
                  </div>

                  <div className="col-span-2 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3 text-xs sm:col-span-3">
                    <span className="text-muted">Feed (Isolated Units):</span>
                    <span className="font-mono font-semibold text-foreground">
                      {formatNumber(batch.feedBags)} bags · {batch.feedKg.toFixed(1)} kg
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Owner-Only INR Financial Summary */}
      {isOwner && (
        <section
          aria-label="Owner financial summary"
          className="rounded-lg border border-border bg-surface p-5 transition-all duration-200 hover:shadow-sm"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3.5">
            <div>
              <h2 className="font-display text-sm font-bold text-foreground">
                Financial Summary — INR (₹) · Owner-Only
              </h2>
              <p className="text-xs text-muted">
                Exact paise-reconciled view for {DATE_RANGE_LABELS[range]} (hidden in Manager preview)
              </p>
            </div>
            <span className="rounded border border-primary/30 bg-background px-2.5 py-0.5 text-[11px] font-medium text-primary">
              Owner View
            </span>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-xs text-muted">Expenses</p>
              <p className="mt-1 font-mono text-lg font-semibold text-foreground">
                {formatInrFromPaise(dataset.financePaise.expensesPaise)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted">Salaries</p>
              <p className="mt-1 font-mono text-lg font-semibold text-foreground">
                {formatInrFromPaise(dataset.financePaise.salariesPaise)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted">Total Paid</p>
              <p className="mt-1 font-mono text-lg font-semibold text-status-nominal">
                {formatInrFromPaise(dataset.financePaise.paidPaise)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted">Outstanding Balance</p>
              <p className="mt-1 font-mono text-lg font-semibold text-status-warning">
                {formatInrFromPaise(dataset.financePaise.outstandingPaise)}
              </p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
