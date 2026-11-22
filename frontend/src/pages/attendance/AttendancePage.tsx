import { useEffect, useState } from 'react';
import { PhaseNoticeBanner } from '../../components/common/PhaseNoticeBanner';
import { fetchHouses } from '../../services/apiClient';
import type { House } from '../../types';
import { getTodayIsoDate } from '../../utils/flockMath';

export function AttendancePage() {
  const [houses, setHouses] = useState<House[]>([]);
  const [loadingHouses, setLoadingHouses] = useState(true);
  const [attendanceDate, setAttendanceDate] = useState<string>(getTodayIsoDate);
  const [selectedHouseId, setSelectedHouseId] = useState<string>('all');

  useEffect(() => {
    fetchHouses()
      .then((rows) => setHouses(rows.filter((h) => h.isActive)))
      .catch(() => setHouses([]))
      .finally(() => setLoadingHouses(false));
  }, []);

  return (
    <div className="space-y-6">
      <PhaseNoticeBanner
        title="Phase 5 Preview — Connected in Phase 5"
        description="House dropdown reads live PostgreSQL houses. Attendance marking (Present, Half-Day, Absent, Leave) and employee roster integration will be connected in Phase 5."
      />

      <div>
        <h1 className="font-display text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          Daily Attendance
        </h1>
        <p className="mt-1 text-sm text-muted">
          Single and bulk daily marking (Present, Half-Day, Absent, Leave) — one record per employee per date
        </p>
      </div>

      <section className="rounded-lg border border-border bg-surface p-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="att-date" className="block text-xs font-medium text-foreground">
              Attendance Date
            </label>
            <input
              id="att-date"
              type="date"
              value={attendanceDate}
              onChange={(e) => setAttendanceDate(e.target.value)}
              className="mt-1 min-h-[48px] w-full rounded-md border border-border bg-background px-3 py-2 font-mono text-sm text-foreground"
            />
          </div>

          <div>
            <label htmlFor="att-house" className="block text-xs font-medium text-foreground">
              House Filter (Any House)
            </label>
            <select
              id="att-house"
              value={selectedHouseId}
              onChange={(e) => setSelectedHouseId(e.target.value)}
              disabled={loadingHouses}
              className="mt-1 min-h-[48px] w-full rounded-md border border-border bg-background px-3 py-2 text-sm font-medium text-foreground"
            >
              <option value="all">All Houses</option>
              {houses.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.houseName} ({h.primarySupervisorName || h.houseCode})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-5 rounded-lg border border-border bg-background p-8 text-center">
          <p className="font-display text-sm font-semibold text-foreground">
            Daily Attendance Grid (Connected in Phase 5)
          </p>
          <p className="mx-auto mt-1 max-w-md text-xs text-muted">
            Staff attendance marking and duplicate-date enforcement will be wired to PostgreSQL `attendance_records` in Phase 5.
          </p>
        </div>

        <button
          type="button"
          disabled
          className="mt-5 min-h-[48px] w-full cursor-not-allowed rounded-md bg-primary/50 px-5 py-2.5 text-sm font-medium text-white sm:w-auto"
        >
          Save Attendance (Connected in Phase 5)
        </button>
      </section>
    </div>
  );
}
