import { useState } from 'react';
import { PhaseNoticeBanner } from '../../components/common/PhaseNoticeBanner';
import { DEMO_HOUSE_SUPERVISORS } from '../../data/demoDashboardData';
import { getTodayIsoDate } from '../../utils/flockMath';

type AttendanceStatus = 'present' | 'half_day' | 'absent' | 'leave';

interface DemoStaffRow {
  id: string;
  name: string;
  designation: string;
  houseId: string;
}

const DEMO_STAFF: DemoStaffRow[] = [
  { id: 's-1', name: 'Ramesh Patel', designation: 'House Attendant', houseId: 'house-1' },
  { id: 's-2', name: 'Vikram Singh', designation: 'Egg Collector', houseId: 'house-1' },
  { id: 's-3', name: 'Suresh Verma', designation: 'House Attendant', houseId: 'house-2' },
  { id: 's-4', name: 'Mahesh Kumar', designation: 'Feed Operator', houseId: 'house-2' },
];

const STATUS_OPTIONS: { value: AttendanceStatus; label: string }[] = [
  { value: 'present', label: 'Present' },
  { value: 'half_day', label: 'Half-Day' },
  { value: 'absent', label: 'Absent' },
  { value: 'leave', label: 'Leave' },
];

export function AttendancePage() {
  const [attendanceDate, setAttendanceDate] = useState<string>(getTodayIsoDate);
  const [selectedHouseId, setSelectedHouseId] = useState<string>('all');
  const [statuses, setStatuses] = useState<Record<string, AttendanceStatus>>({
    's-1': 'present',
    's-2': 'present',
    's-3': 'half_day',
    's-4': 'present',
  });

  const visibleStaff =
    selectedHouseId === 'all'
      ? DEMO_STAFF
      : DEMO_STAFF.filter((s) => s.houseId === selectedHouseId);

  const counts = visibleStaff.reduce(
    (acc, staff) => {
      const st = statuses[staff.id] ?? 'present';
      acc[st] += 1;
      return acc;
    },
    { present: 0, half_day: 0, absent: 0, leave: 0 },
  );

  return (
    <div className="space-y-6">
      <PhaseNoticeBanner
        title="Phase 2 Mobile-First Entry Preview — Connected in Phase 5"
        description="Date defaults to Today and any house can be selected for leave coverage. Tap status buttons to preview live counts; database persistence will be connected in Phase 5."
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
              className="mt-1 min-h-[48px] w-full rounded-md border border-border bg-background px-3 py-2 font-mono text-sm text-foreground transition-all duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
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
              className="mt-1 min-h-[48px] w-full rounded-md border border-border bg-background px-3 py-2 text-sm font-medium text-foreground transition-all duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="all">All Houses</option>
              {DEMO_HOUSE_SUPERVISORS.map((h) => (
                <option key={h.houseId} value={h.houseId}>
                  {h.houseName} ({h.supervisorName})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Live Count Strip */}
        <div className="mt-4 grid grid-cols-4 gap-3 rounded-lg border border-border bg-background p-3.5 text-center sm:text-left">
          <div>
            <p className="text-[11px] font-medium text-status-nominal">Present</p>
            <p className="font-mono text-base font-semibold text-foreground">{counts.present}</p>
          </div>
          <div>
            <p className="text-[11px] font-medium text-status-warning">Half-Day</p>
            <p className="font-mono text-base font-semibold text-foreground">{counts.half_day}</p>
          </div>
          <div>
            <p className="text-[11px] font-medium text-status-alert">Absent</p>
            <p className="font-mono text-base font-semibold text-foreground">{counts.absent}</p>
          </div>
          <div>
            <p className="text-[11px] font-medium text-muted">Leave</p>
            <p className="font-mono text-base font-semibold text-foreground">{counts.leave}</p>
          </div>
        </div>

        {/* Mobile-First Thumb-Friendly Marking List */}
        <div className="mt-4 divide-y divide-border rounded-lg border border-border">
          {visibleStaff.map((staff) => {
            const current = statuses[staff.id] ?? 'present';
            return (
              <div
                key={staff.id}
                className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-sm font-semibold text-foreground">{staff.name}</p>
                  <p className="text-xs text-muted">{staff.designation}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
                  {STATUS_OPTIONS.map((opt) => {
                    const active = current === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() =>
                          setStatuses((prev) => ({ ...prev, [staff.id]: opt.value }))
                        }
                        className={`min-h-[44px] rounded-md border px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
                          active
                            ? 'border-primary bg-primary text-white shadow-sm'
                            : 'border-border bg-background text-foreground hover:border-primary/40'
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
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
