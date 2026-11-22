import { Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PhaseNoticeBanner } from '../../components/common/PhaseNoticeBanner';
import { useAuth } from '../../contexts/AuthContext';
import { DEMO_DASHBOARD_BY_RANGE, DEMO_REFERENCE_DATE } from '../../data/demoDashboardData';
import { formatFlockAge, formatMaleFemaleRatio, formatNumber } from '../../utils/flockMath';

export function FarmsPage() {
  const { isOwner } = useAuth();
  const batches = DEMO_DASHBOARD_BY_RANGE.today.batches;

  return (
    <div className="space-y-5">
      <PhaseNoticeBanner
        title="Connected in Phase 4"
        description={
          isOwner
            ? 'Manage Houses and Breeder Batches from Owner Settings & Setup. Live PostgreSQL queries will be connected in Phase 4.'
            : 'Manager / Supervisor View (Read-Only) — Overview of all active house batches, flock ages, and live Male/Female populations.'
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-xl font-bold text-foreground">
            Houses &amp; Batches
          </h1>
          <p className="mt-0.5 text-sm text-muted">
            Active breeder houses, batch placement dates, current flock age, and live Male/Female populations
          </p>
        </div>

        {isOwner ? (
          <Link
            to="/settings"
            className="inline-flex min-h-[44px] items-center justify-center rounded-md border border-border bg-surface px-4 py-2 text-xs font-medium text-foreground transition-all duration-200 hover:border-primary/40 hover:bg-background"
          >
            Manage Houses &amp; Batches
          </Link>
        ) : (
          <span className="inline-flex min-h-[38px] items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted">
            <Lock className="h-3.5 w-3.5" aria-hidden="true" />
            Read-Only Overview
          </span>
        )}
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-surface">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-[13px]">
            <thead>
              <tr className="border-b border-border bg-background text-xs font-semibold uppercase tracking-wide text-muted">
                <th className="whitespace-nowrap px-4 py-3.5">House</th>
                <th className="whitespace-nowrap px-4 py-3.5">Active Batch</th>
                <th className="whitespace-nowrap px-4 py-3.5">Primary Assigned Supervisor</th>
                <th className="whitespace-nowrap px-4 py-3.5">Placement Date</th>
                <th className="whitespace-nowrap px-4 py-3.5">Starting Age</th>
                <th className="whitespace-nowrap px-4 py-3.5">Current Flock Age</th>
                <th className="whitespace-nowrap px-4 py-3.5">Live Female / Male</th>
                <th className="whitespace-nowrap px-4 py-3.5">Male : Female Ratio</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {batches.map((batch) => {
                const liveFemales = batch.initialFemales - batch.cumulativeFemaleDeaths;
                const liveMales = batch.initialMales - batch.cumulativeMaleDeaths;

                return (
                  <tr key={batch.id} className="transition-colors duration-150 hover:bg-background/60">
                    <td className="whitespace-nowrap px-4 py-3.5 font-semibold text-foreground">
                      {batch.houseName}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5 font-mono text-xs font-semibold text-foreground">
                      {batch.batchCode}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5 text-xs font-medium text-primary">
                      {batch.primarySupervisor}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5 font-mono text-xs text-foreground">
                      {batch.placementDate}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5 font-mono text-xs text-foreground">
                      Week {batch.startingAgeWeeks}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5 font-mono text-xs font-semibold text-foreground">
                      {formatFlockAge(batch.placementDate, batch.startingAgeWeeks, DEMO_REFERENCE_DATE)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5 font-mono text-xs text-foreground">
                      {formatNumber(liveFemales)} Female · {formatNumber(liveMales)} Male
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5 font-mono text-xs font-medium text-foreground">
                      {formatMaleFemaleRatio(liveFemales, liveMales)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
