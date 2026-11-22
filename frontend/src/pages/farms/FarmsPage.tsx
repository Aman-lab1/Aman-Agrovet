import { Lock } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { fetchBatches, fetchHouses } from '../../services/apiClient';
import type { FlockBatch, House } from '../../types';
import { formatFlockAge, formatMaleFemaleRatio, formatNumber, getTodayIsoDate } from '../../utils/flockMath';

export function FarmsPage() {
  const { isOwner } = useAuth();
  const [houses, setHouses] = useState<House[]>([]);
  const [batches, setBatches] = useState<FlockBatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const today = getTodayIsoDate();

  useEffect(() => {
    let active = true;
    setLoading(true);
    Promise.all([fetchHouses(), fetchBatches()])
      .then(([housesData, batchesData]) => {
        if (!active) return;
        setHouses(housesData);
        setBatches(batchesData);
      })
      .catch((err) => {
        if (!active) return;
        setError(err instanceof Error ? err.message : 'Failed to load houses and batches');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            Houses &amp; Batches
          </h1>
          <p className="mt-1 text-sm text-muted">
            Live PostgreSQL overview of breeder houses, active flock batches, flock age, and Male / Female populations
          </p>
        </div>

        {isOwner ? (
          <Link
            to="/settings"
            className="inline-flex min-h-[44px] items-center justify-center rounded-md bg-primary px-4 py-2 text-xs font-semibold text-white transition-colors duration-200 hover:bg-primary-hover"
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

      {error && (
        <div
          role="alert"
          className="rounded-lg border border-status-alert/40 bg-surface px-4 py-3 text-xs font-medium text-status-alert"
        >
          {error}
        </div>
      )}

      {/* Houses Summary */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          Array.from({ length: 2 }).map((_, idx) => (
            <div key={idx} className="h-24 animate-pulse rounded-lg border border-border bg-surface p-4" />
          ))
        ) : houses.length === 0 ? (
          <div className="col-span-full rounded-lg border border-border bg-surface p-6 text-center text-sm text-muted">
            No houses configured yet. {isOwner ? 'Create House 1 / House 2 in Settings & Setup.' : 'Ask the Business Owner to configure houses.'}
          </div>
        ) : (
          houses.map((house) => (
            <article key={house.id} className="rounded-lg border border-border bg-surface p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h2 className="font-display text-sm font-bold text-foreground">
                    {house.houseName}
                  </h2>
                  <p className="font-mono text-xs text-muted">{house.houseCode}</p>
                </div>
                <span
                  className={`rounded border px-2 py-0.5 text-[11px] font-medium ${
                    house.isActive
                      ? 'border-status-nominal/30 text-status-nominal'
                      : 'border-border text-muted'
                  }`}
                >
                  {house.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <p className="mt-2 text-xs text-muted">
                Primary Assigned Supervisor:{' '}
                <span className="font-medium text-primary">
                  {house.primarySupervisorName || 'Unassigned'}
                </span>
              </p>
            </article>
          ))
        )}
      </section>

      {/* Batches Table */}
      <section className="overflow-hidden rounded-lg border border-border bg-surface">
        <div className="border-b border-border px-5 py-3.5">
          <h2 className="font-display text-sm font-bold text-foreground">
            Breeder Batches
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-[13px]">
            <thead>
              <tr className="border-b border-border bg-background text-xs font-semibold uppercase tracking-wide text-muted">
                <th className="whitespace-nowrap px-4 py-3.5">House</th>
                <th className="whitespace-nowrap px-4 py-3.5">Batch Code</th>
                <th className="whitespace-nowrap px-4 py-3.5">Primary Supervisor</th>
                <th className="whitespace-nowrap px-4 py-3.5">Placement Date</th>
                <th className="whitespace-nowrap px-4 py-3.5">Starting Age</th>
                <th className="whitespace-nowrap px-4 py-3.5">Current Flock Age</th>
                <th className="whitespace-nowrap px-4 py-3.5">Initial Female / Male</th>
                <th className="whitespace-nowrap px-4 py-3.5">Male : Female Ratio</th>
                <th className="whitespace-nowrap px-4 py-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                Array.from({ length: 2 }).map((_, idx) => (
                  <tr key={idx}>
                    <td colSpan={9} className="px-4 py-4">
                      <div className="h-4 w-full animate-pulse rounded bg-background" />
                    </td>
                  </tr>
                ))
              ) : batches.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-10 text-center text-xs text-muted">
                    No breeder batches started yet.
                  </td>
                </tr>
              ) : (
                batches.map((batch) => (
                  <tr key={batch.id} className="transition-colors duration-150 hover:bg-background/60">
                    <td className="whitespace-nowrap px-4 py-3.5 font-semibold text-foreground">
                      {batch.houseName}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5 font-mono text-xs font-semibold text-foreground">
                      {batch.batchCode}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5 text-xs font-medium text-primary">
                      {batch.primarySupervisorName || 'Unassigned'}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5 font-mono text-xs text-foreground">
                      {batch.placementDate}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5 font-mono text-xs text-foreground">
                      Week {batch.startingAgeWeeks}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5 font-mono text-xs font-semibold text-foreground">
                      {formatFlockAge(batch.placementDate, batch.startingAgeWeeks, today)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5 font-mono text-xs text-foreground">
                      {formatNumber(batch.initialFemales)} Female · {formatNumber(batch.initialMales)} Male
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5 font-mono text-xs font-medium text-foreground">
                      {formatMaleFemaleRatio(batch.initialFemales, batch.initialMales)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5 text-xs font-medium">
                      <span
                        className={
                          batch.status === 'active' ? 'text-status-nominal' : 'text-muted'
                        }
                      >
                        {batch.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
