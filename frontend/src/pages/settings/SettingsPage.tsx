import { useState } from 'react';
import { OwnerOnlyNotice } from '../../components/common/OwnerOnlyNotice';
import { PhaseNoticeBanner } from '../../components/common/PhaseNoticeBanner';
import { useRolePreview } from '../../contexts/RolePreviewContext';
import { DEMO_APP_USERS, DEMO_HOUSE_SUPERVISORS } from '../../data/demoDashboardData';

type SetupTab = 'farms-houses' | 'new-batch' | 'supervisor-access';

export function SettingsPage() {
  const { isOwner } = useRolePreview();
  const [activeTab, setActiveTab] = useState<SetupTab>('farms-houses');

  if (!isOwner) {
    return <OwnerOnlyNotice moduleName="Settings & Setup" />;
  }

  return (
    <div className="space-y-6">
      <PhaseNoticeBanner
        title="Owner-Only Settings & Setup — Phase 2 UI Preview (Connected in Phase 3–4)"
        description="Single Owner control engine for Farms, Houses, Breeder Batch placements, Primary Supervisor assignments, and App User Access. Form submissions are disabled until Phase 3–4."
      />

      <div>
        <h1 className="font-display text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          Settings &amp; Setup (Owner-Only)
        </h1>
        <p className="mt-1 text-sm text-muted">
          Configure farms, houses, breeder batches, primary supervisor assignments, and authorized Google emails
        </p>
      </div>

      <div className="flex flex-wrap gap-1 border-b border-border">
        {[
          { id: 'farms-houses', label: '1. Farms & Houses' },
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

      {activeTab === 'farms-houses' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {/* Create Farm (Cleanly Separated) */}
            <section className="rounded-lg border border-border bg-surface p-5">
              <h2 className="font-display text-base font-bold text-foreground">
                Create Farm
              </h2>
              <p className="mt-1 text-xs text-muted">
                Register a new farm location before adding houses.
              </p>
              <div className="mt-4 space-y-3.5">
                <div>
                  <label className="block text-xs font-medium text-foreground">Farm Name</label>
                  <input
                    type="text"
                    disabled
                    placeholder="e.g., Farm 1 — North Sheds"
                    className="mt-1 min-h-[44px] w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-muted"
                  />
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-medium text-foreground">Farm Code</label>
                    <input
                      type="text"
                      disabled
                      placeholder="e.g., FARM-01"
                      className="mt-1 min-h-[44px] w-full rounded-md border border-border bg-background px-3 py-2 font-mono text-sm text-muted"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-foreground">Location</label>
                    <input
                      type="text"
                      disabled
                      placeholder="e.g., Rajpura"
                      className="mt-1 min-h-[44px] w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-muted"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  disabled
                  className="min-h-[44px] w-full cursor-not-allowed rounded-md bg-primary/50 px-4 py-2 text-sm font-medium text-white sm:w-auto"
                >
                  Create Farm (Phase 4)
                </button>
              </div>
            </section>

            {/* Add House (Cleanly Separated) */}
            <section className="rounded-lg border border-border bg-surface p-5">
              <h2 className="font-display text-base font-bold text-foreground">
                Add House to Farm
              </h2>
              <p className="mt-1 text-xs text-muted">
                Add individual breeder houses (House 1, House 2, etc.) under an existing farm.
              </p>
              <div className="mt-4 space-y-3.5">
                <div>
                  <label className="block text-xs font-medium text-foreground">Select Farm</label>
                  <select
                    disabled
                    className="mt-1 min-h-[44px] w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-muted"
                  >
                    <option>Farm 1 — North Sheds</option>
                  </select>
                </div>
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
                      placeholder="e.g., H3"
                      className="mt-1 min-h-[44px] w-full rounded-md border border-border bg-background px-3 py-2 font-mono text-sm text-muted"
                    />
                  </div>
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
          </div>

          <section className="rounded-lg border border-border bg-surface p-5">
            <h2 className="font-display text-sm font-bold text-foreground">
              Configured Farms &amp; Houses (Sample Preview)
            </h2>
            <div className="mt-3 divide-y divide-border rounded-md border border-border">
              {DEMO_HOUSE_SUPERVISORS.map((item) => (
                <div key={item.houseId} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm">
                  <div>
                    <p className="font-semibold text-foreground">{item.houseName}</p>
                    <p className="text-xs text-muted">{item.farmName}</p>
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
            Placement Date + Starting Bird Age (Weeks) drives automatic Week X + Yd flock age tracking.
          </p>

          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="block text-xs font-medium text-foreground">Farm</label>
              <select
                disabled
                className="mt-1 min-h-[44px] w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-muted"
              >
                <option>Farm 1 — North Sheds</option>
              </select>
            </div>
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
                placeholder="e.g., 20"
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
          {/* Primary Supervisor Assignment */}
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
                    <th className="px-4 py-2.5">Farm</th>
                    <th className="px-4 py-2.5">Primary Assigned Supervisor</th>
                    <th className="px-4 py-2.5">Google Email</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {DEMO_HOUSE_SUPERVISORS.map((row) => (
                    <tr key={row.houseId}>
                      <td className="px-4 py-3 font-semibold text-foreground">{row.houseName}</td>
                      <td className="px-4 py-3 text-muted">{row.farmName}</td>
                      <td className="px-4 py-3 font-medium text-primary">{row.supervisorName}</td>
                      <td className="px-4 py-3 font-mono text-xs text-foreground">{row.supervisorEmail}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* App User Access */}
          <section className="rounded-lg border border-border bg-surface p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-display text-base font-bold text-foreground">
                  App User Access (Firebase Auth + PostgreSQL RBAC)
                </h2>
                <p className="mt-1 text-xs text-muted">
                  Pre-register authorized Google emails as Business Owner or Manager / Supervisor (wired in Phase 3).
                </p>
              </div>
              <button
                type="button"
                disabled
                className="min-h-[44px] shrink-0 cursor-not-allowed rounded-md bg-primary/50 px-4 py-2 text-xs font-medium text-white"
              >
                Pre-Register Email (Phase 3)
              </button>
            </div>

            <div className="mt-4 overflow-x-auto rounded-md border border-border">
              <table className="w-full border-collapse text-left text-[13px]">
                <thead>
                  <tr className="border-b border-border bg-background text-xs font-semibold uppercase tracking-wide text-muted">
                    <th className="px-4 py-2.5">Email</th>
                    <th className="px-4 py-2.5">Full Name</th>
                    <th className="px-4 py-2.5">Role</th>
                    <th className="px-4 py-2.5">Active Status</th>
                    <th className="px-4 py-2.5">UID Linked</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {DEMO_APP_USERS.map((user) => (
                    <tr key={user.id}>
                      <td className="px-4 py-3 font-mono text-xs text-foreground">{user.email}</td>
                      <td className="px-4 py-3 font-medium text-foreground">{user.fullName}</td>
                      <td className="px-4 py-3 font-mono text-xs text-foreground">{user.role}</td>
                      <td className="px-4 py-3 text-xs font-medium text-status-nominal">
                        {user.isActive ? 'Active' : 'Inactive'}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-muted">
                        {user.uidLinked ? 'Linked' : 'Pending First Sign-In'}
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
