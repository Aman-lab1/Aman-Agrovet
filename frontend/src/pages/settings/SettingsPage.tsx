import { useState } from 'react';
import { OwnerOnlyNotice } from '../../components/common/OwnerOnlyNotice';
import { PhaseNoticeBanner } from '../../components/common/PhaseNoticeBanner';
import { useAuth } from '../../contexts/AuthContext';
import { DEMO_APP_USERS, DEMO_HOUSE_SUPERVISORS } from '../../data/demoDashboardData';

type SetupTab = 'houses' | 'new-batch' | 'supervisor-access';

export function SettingsPage() {
  const { isOwner } = useAuth();
  const [activeTab, setActiveTab] = useState<SetupTab>('houses');

  if (!isOwner) {
    return <OwnerOnlyNotice moduleName="Settings & Setup" />;
  }

  return (
    <div className="space-y-6">
      <PhaseNoticeBanner
        title="Owner-Only Settings & Setup — Connected in Phase 4"
        description="Single Owner control engine for Houses, Breeder Batch placements, Primary Supervisor assignments, and App User Access (Username + Passcode). Form submissions will be wired in Phase 4."
      />

      <div>
        <h1 className="font-display text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          Settings &amp; Setup (Owner-Only)
        </h1>
        <p className="mt-1 text-sm text-muted">
          Configure breeder houses, start new batches, assign primary supervisors, and manage user accounts
        </p>
      </div>

      <div className="flex flex-wrap gap-1 border-b border-border">
        {[
          { id: 'houses', label: '1. Houses' },
          { id: 'new-batch', label: '2. Start Breeder Batch' },
          { id: 'supervisor-access', label: '3. Supervisor Assignment & App User Access' },
        ].map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as SetupTab)}
              className={`min-h-[44px] border-b-2 px-4 py-2 text-sm font-medium transition-all duration-200 ${
                active
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === 'houses' && (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <section className="rounded-lg border border-border bg-surface p-5">
            <h2 className="font-display text-base font-bold text-foreground">
              Add House
            </h2>
            <p className="mt-1 text-xs text-muted">
              Register a top-level breeder house (e.g., House 1, House 2, House 3).
            </p>
            <div className="mt-4 space-y-3.5">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-foreground">House Name</label>
                  <input
                    type="text"
                    disabled
                    placeholder="e.g., House 3"
                    className="mt-1 min-h-[44px] w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-muted"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground">House Code</label>
                  <input
                    type="text"
                    disabled
                    placeholder="e.g., H-03"
                    className="mt-1 min-h-[44px] w-full rounded-md border border-border bg-background px-3 py-2 font-mono text-sm text-muted"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground">
                  Primary Assigned Supervisor
                </label>
                <input
                  type="text"
                  disabled
                  placeholder="e.g., Supervisor 1"
                  className="mt-1 min-h-[44px] w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-muted"
                />
              </div>
              <button
                type="button"
                disabled
                className="min-h-[44px] w-full cursor-not-allowed rounded-md bg-primary/50 px-4 py-2 text-sm font-medium text-white sm:w-auto"
              >
                Add House (Phase 4)
              </button>
            </div>
          </section>

          <section className="rounded-lg border border-border bg-surface p-5">
            <h2 className="font-display text-base font-bold text-foreground">
              Configured Houses (Sample Preview)
            </h2>
            <div className="mt-3 divide-y divide-border rounded-md border border-border">
              {DEMO_HOUSE_SUPERVISORS.map((item) => (
                <div key={item.houseId} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm">
                  <div>
                    <p className="font-semibold text-foreground">{item.houseName}</p>
                    <p className="font-mono text-xs text-muted">{item.houseCode}</p>
                  </div>
                  <span className="text-xs font-medium text-primary">
                    Primary Assigned: {item.supervisorName}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {activeTab === 'new-batch' && (
        <section className="rounded-lg border border-border bg-surface p-5">
          <h2 className="font-display text-base font-bold text-foreground">
            Start New Breeder Batch
          </h2>
          <p className="mt-1 text-xs text-muted">
            Placement Date + Starting Bird Age (Weeks, required) drives automatic Week X + Yd flock age tracking.
          </p>

          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="block text-xs font-medium text-foreground">House</label>
              <select
                disabled
                className="mt-1 min-h-[44px] w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-muted"
              >
                <option>House 1</option>
                <option>House 2</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground">Batch Code</label>
              <input
                type="text"
                disabled
                placeholder="e.g., B-2026-H1"
                className="mt-1 min-h-[44px] w-full rounded-md border border-border bg-background px-3 py-2 font-mono text-sm text-muted"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground">Placement Date</label>
              <input
                type="date"
                disabled
                defaultValue="2026-10-01"
                className="mt-1 min-h-[44px] w-full rounded-md border border-border bg-background px-3 py-2 font-mono text-sm text-muted"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground">
                Starting Bird Age (Weeks)
              </label>
              <input
                type="number"
                disabled
                placeholder="Required (e.g., 20)"
                className="mt-1 min-h-[44px] w-full rounded-md border border-border bg-background px-3 py-2 font-mono text-sm text-muted"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground">
                Initial Female Birds
              </label>
              <input
                type="number"
                disabled
                placeholder="e.g., 4200"
                className="mt-1 min-h-[44px] w-full rounded-md border border-border bg-background px-3 py-2 font-mono text-sm text-muted"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground">
                Initial Male Birds
              </label>
              <input
                type="number"
                disabled
                placeholder="e.g., 430"
                className="mt-1 min-h-[44px] w-full rounded-md border border-border bg-background px-3 py-2 font-mono text-sm text-muted"
              />
            </div>
          </div>

          <button
            type="button"
            disabled
            className="mt-5 min-h-[44px] w-full cursor-not-allowed rounded-md bg-primary/50 px-5 py-2 text-sm font-medium text-white sm:w-auto"
          >
            Start Breeder Batch (Connected in Phase 4)
          </button>
        </section>
      )}

      {activeTab === 'supervisor-access' && (
        <div className="space-y-5">
          <section className="rounded-lg border border-border bg-surface p-5">
            <h2 className="font-display text-base font-bold text-foreground">
              Primary Supervisor Assignment by House
            </h2>
            <p className="mt-1 text-xs text-muted">
              Assign primary house ownership for clarity. Managers can still select any active house during daily operations for leave coverage.
            </p>
            <div className="mt-4 overflow-x-auto rounded-md border border-border">
              <table className="w-full border-collapse text-left text-[13px]">
                <thead>
                  <tr className="border-b border-border bg-background text-xs font-semibold uppercase tracking-wide text-muted">
                    <th className="px-4 py-2.5">House</th>
                    <th className="px-4 py-2.5">Code</th>
                    <th className="px-4 py-2.5">Primary Assigned Supervisor</th>
                    <th className="px-4 py-2.5">Username</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {DEMO_HOUSE_SUPERVISORS.map((row) => (
                    <tr key={row.houseId}>
                      <td className="px-4 py-3 font-semibold text-foreground">{row.houseName}</td>
                      <td className="px-4 py-3 font-mono text-xs text-muted">{row.houseCode}</td>
                      <td className="px-4 py-3 font-medium text-primary">{row.supervisorName}</td>
                      <td className="px-4 py-3 font-mono text-xs text-foreground">{row.supervisorUsername}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-lg border border-border bg-surface p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-display text-base font-bold text-foreground">
                  App User Access (Username + Passcode)
                </h2>
                <p className="mt-1 text-xs text-muted">
                  Manage Owner and Manager/Supervisor login accounts stored in PostgreSQL `users`.
                </p>
              </div>
              <button
                type="button"
                disabled
                className="min-h-[44px] shrink-0 cursor-not-allowed rounded-md bg-primary/50 px-4 py-2 text-xs font-medium text-white"
              >
                Create User Account (Phase 4)
              </button>
            </div>

            <div className="mt-4 overflow-x-auto rounded-md border border-border">
              <table className="w-full border-collapse text-left text-[13px]">
                <thead>
                  <tr className="border-b border-border bg-background text-xs font-semibold uppercase tracking-wide text-muted">
                    <th className="px-4 py-2.5">Username</th>
                    <th className="px-4 py-2.5">Full Name</th>
                    <th className="px-4 py-2.5">Role</th>
                    <th className="px-4 py-2.5">Active Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {DEMO_APP_USERS.map((user) => (
                    <tr key={user.id}>
                      <td className="px-4 py-3 font-mono text-xs text-foreground">{user.username}</td>
                      <td className="px-4 py-3 font-medium text-foreground">{user.fullName}</td>
                      <td className="px-4 py-3 font-mono text-xs text-foreground">{user.role}</td>
                      <td className="px-4 py-3 text-xs font-medium text-status-nominal">
                        {user.isActive ? 'Active' : 'Inactive'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
