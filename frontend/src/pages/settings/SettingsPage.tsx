import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { OwnerOnlyNotice } from '../../components/common/OwnerOnlyNotice';
import { useAuth } from '../../contexts/AuthContext';
import {
  closeBatch,
  createBatch,
  createHouse,
  createUser,
  deactivateHouse,
  fetchBatches,
  fetchHouses,
  fetchUsers,
  updateHouse,
  updateUser,
} from '../../services/apiClient';
import type { AppUser, FlockBatch, House, UserRole } from '../../types';
import { formatNumber, getTodayIsoDate } from '../../utils/flockMath';

type SetupTab = 'houses' | 'new-batch' | 'supervisor-access';

export function SettingsPage() {
  const { isOwner, user: currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<SetupTab>('houses');
  const [houses, setHouses] = useState<House[]>([]);
  const [batches, setBatches] = useState<FlockBatch[]>([]);
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [banner, setBanner] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // House form state
  const [editingHouse, setEditingHouse] = useState<House | null>(null);
  const [houseCode, setHouseCode] = useState('');
  const [houseName, setHouseName] = useState('');
  const [primarySupervisorName, setPrimarySupervisorName] = useState('');
  const [houseNotes, setHouseNotes] = useState('');

  // Batch form state
  const [batchHouseId, setBatchHouseId] = useState<string>('');
  const [batchCode, setBatchCode] = useState('');
  const [placementDate, setPlacementDate] = useState<string>(getTodayIsoDate);
  const [startingAgeWeeks, setStartingAgeWeeks] = useState('');
  const [initialFemales, setInitialFemales] = useState('');
  const [initialMales, setInitialMales] = useState('');
  const [batchNotes, setBatchNotes] = useState('');

  // User form state
  const [newUsername, setNewUsername] = useState('');
  const [newFullName, setNewFullName] = useState('');
  const [newPasscode, setNewPasscode] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('manager');

  const [submitting, setSubmitting] = useState(false);

  const loadAll = useCallback(async () => {
    if (!isOwner) return;
    setLoading(true);
    try {
      const [housesData, batchesData, usersData] = await Promise.all([
        fetchHouses(),
        fetchBatches(),
        fetchUsers(),
      ]);
      setHouses(housesData);
      setBatches(batchesData);
      setUsers(usersData);
      if (housesData.length > 0 && !batchHouseId) {
        setBatchHouseId(String(housesData[0].id));
      }
    } catch (err) {
      setBanner({
        type: 'error',
        text: err instanceof Error ? err.message : 'Failed to load setup data',
      });
    } finally {
      setLoading(false);
    }
  }, [isOwner, batchHouseId]);

  useEffect(() => {
    void loadAll();
  }, [loadAll]);

  if (!isOwner) {
    return <OwnerOnlyNotice moduleName="Settings & Setup" />;
  }

  async function handleHouseSubmit(e: FormEvent) {
    e.preventDefault();
    setBanner(null);
    setSubmitting(true);
    try {
      if (editingHouse) {
        await updateHouse(editingHouse.id, {
          houseCode,
          houseName,
          primarySupervisorName: primarySupervisorName || undefined,
          notes: houseNotes || undefined,
          version: editingHouse.version,
        });
        setBanner({ type: 'success', text: `Updated house ${houseName}.` });
      } else {
        await createHouse({
          houseCode,
          houseName,
          primarySupervisorName: primarySupervisorName || undefined,
          notes: houseNotes || undefined,
        });
        setBanner({ type: 'success', text: `Created house ${houseName} (${houseCode}).` });
      }
      setEditingHouse(null);
      setHouseCode('');
      setHouseName('');
      setPrimarySupervisorName('');
      setHouseNotes('');
      await loadAll();
    } catch (err) {
      setBanner({
        type: 'error',
        text: err instanceof Error ? err.message : 'Failed to save house',
      });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeactivateHouse(house: House) {
    if (!window.confirm(`Deactivate ${house.houseName}?`)) return;
    setBanner(null);
    try {
      await deactivateHouse(house.id, { version: house.version });
      setBanner({ type: 'success', text: `Deactivated ${house.houseName}.` });
      await loadAll();
    } catch (err) {
      setBanner({
        type: 'error',
        text: err instanceof Error ? err.message : 'Failed to deactivate house',
      });
    }
  }

  async function handleBatchSubmit(e: FormEvent) {
    e.preventDefault();
    setBanner(null);
    setSubmitting(true);
    try {
      await createBatch({
        houseId: Number(batchHouseId),
        batchCode,
        placementDate,
        startingAgeWeeks: Number(startingAgeWeeks),
        initialFemales: Number(initialFemales),
        initialMales: Number(initialMales),
        notes: batchNotes || undefined,
      });
      setBanner({ type: 'success', text: `Started breeder batch ${batchCode}.` });
      setBatchCode('');
      setStartingAgeWeeks('');
      setInitialFemales('');
      setInitialMales('');
      setBatchNotes('');
      await loadAll();
    } catch (err) {
      setBanner({
        type: 'error',
        text: err instanceof Error ? err.message : 'Failed to start breeder batch',
      });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleCloseBatch(batch: FlockBatch) {
    if (!window.confirm(`Close batch ${batch.batchCode}?`)) return;
    setBanner(null);
    try {
      await closeBatch(batch.id, {
        version: batch.version,
        closedDate: getTodayIsoDate(),
        reason: 'Closed by Business Owner',
      });
      setBanner({ type: 'success', text: `Closed batch ${batch.batchCode}.` });
      await loadAll();
    } catch (err) {
      setBanner({
        type: 'error',
        text: err instanceof Error ? err.message : 'Failed to close batch',
      });
    }
  }

  async function handleCreateUser(e: FormEvent) {
    e.preventDefault();
    setBanner(null);
    setSubmitting(true);
    try {
      await createUser({
        username: newUsername,
        fullName: newFullName,
        passcode: newPasscode,
        role: newRole,
      });
      setBanner({ type: 'success', text: `Created user login "${newUsername}".` });
      setNewUsername('');
      setNewFullName('');
      setNewPasscode('');
      setNewRole('manager');
      await loadAll();
    } catch (err) {
      setBanner({
        type: 'error',
        text: err instanceof Error ? err.message : 'Failed to create user',
      });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleResetPasscode(targetUser: AppUser) {
    const passcode = window.prompt(`Enter new passcode (min 4 chars) for ${targetUser.username}:`);
    if (!passcode) return;
    setBanner(null);
    try {
      await updateUser(targetUser.id, {
        passcode,
        reason: 'Passcode reset by Business Owner',
      });
      setBanner({ type: 'success', text: `Reset passcode for ${targetUser.username}.` });
    } catch (err) {
      setBanner({
        type: 'error',
        text: err instanceof Error ? err.message : 'Failed to reset passcode',
      });
    }
  }

  async function handleToggleUserActive(targetUser: AppUser) {
    setBanner(null);
    try {
      await updateUser(targetUser.id, {
        isActive: !targetUser.isActive,
        reason: targetUser.isActive ? 'Deactivated by Owner' : 'Reactivated by Owner',
      });
      setBanner({
        type: 'success',
        text: `${targetUser.isActive ? 'Deactivated' : 'Reactivated'} ${targetUser.username}.`,
      });
      await loadAll();
    } catch (err) {
      setBanner({
        type: 'error',
        text: err instanceof Error ? err.message : 'Failed to update user status',
      });
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          Settings &amp; Setup (Owner-Only)
        </h1>
        <p className="mt-1 text-sm text-muted">
          Single Owner control engine for Houses, Breeder Batches, Primary Supervisors, and App User Access
        </p>
      </div>

      {banner && (
        <div
          role="status"
          className={`rounded-lg border px-4 py-3 text-xs font-medium ${
            banner.type === 'success'
              ? 'border-status-nominal/40 bg-surface text-status-nominal'
              : 'border-status-alert/40 bg-surface text-status-alert'
          }`}
        >
          {banner.text}
        </div>
      )}

      <div className="flex flex-wrap gap-1 border-b border-border">
        {[
          { id: 'houses', label: '1. Houses' },
          { id: 'new-batch', label: '2. Breeder Batches' },
          { id: 'supervisor-access', label: '3. App User Access' },
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
            <div className="flex items-center justify-between">
              <h2 className="font-display text-base font-bold text-foreground">
                {editingHouse ? `Edit House: ${editingHouse.houseName}` : 'Add House'}
              </h2>
              {editingHouse && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingHouse(null);
                    setHouseCode('');
                    setHouseName('');
                    setPrimarySupervisorName('');
                    setHouseNotes('');
                  }}
                  className="text-xs font-medium text-muted hover:text-foreground"
                >
                  Cancel
                </button>
              )}
            </div>
            <form onSubmit={handleHouseSubmit} className="mt-4 space-y-3.5">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-foreground">House Name</label>
                  <input
                    type="text"
                    required
                    value={houseName}
                    onChange={(e) => setHouseName(e.target.value)}
                    placeholder="e.g., House 1"
                    className="mt-1 min-h-[44px] w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground">House Code</label>
                  <input
                    type="text"
                    required
                    value={houseCode}
                    onChange={(e) => setHouseCode(e.target.value)}
                    placeholder="e.g., H-01"
                    className="mt-1 min-h-[44px] w-full rounded-md border border-border bg-background px-3 py-2 font-mono text-sm text-foreground"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground">
                  Primary Assigned Supervisor
                </label>
                <input
                  type="text"
                  value={primarySupervisorName}
                  onChange={(e) => setPrimarySupervisorName(e.target.value)}
                  placeholder="e.g., Supervisor 1"
                  className="mt-1 min-h-[44px] w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground">Notes</label>
                <input
                  type="text"
                  value={houseNotes}
                  onChange={(e) => setHouseNotes(e.target.value)}
                  placeholder="Optional"
                  className="mt-1 min-h-[44px] w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="min-h-[44px] rounded-md bg-primary px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-hover disabled:opacity-60"
              >
                {submitting ? 'Saving...' : editingHouse ? 'Update House' : 'Add House'}
              </button>
            </form>
          </section>

          <section className="rounded-lg border border-border bg-surface p-5">
            <h2 className="font-display text-base font-bold text-foreground">
              Configured Houses
            </h2>
            <div className="mt-3 divide-y divide-border rounded-md border border-border">
              {loading ? (
                <div className="p-4 text-xs text-muted">Loading houses...</div>
              ) : houses.length === 0 ? (
                <div className="p-4 text-xs text-muted">No houses created yet.</div>
              ) : (
                houses.map((item) => (
                  <div key={item.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm">
                    <div>
                      <p className="font-semibold text-foreground">
                        {item.houseName}{' '}
                        {!item.isActive && <span className="text-xs text-status-alert">(Inactive)</span>}
                      </p>
                      <p className="font-mono text-xs text-muted">
                        {item.houseCode} · Primary: {item.primarySupervisorName || 'Unassigned'}
                      </p>
                    </div>
                    <div className="flex gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingHouse(item);
                          setHouseCode(item.houseCode);
                          setHouseName(item.houseName);
                          setPrimarySupervisorName(item.primarySupervisorName || '');
                          setHouseNotes(item.notes || '');
                        }}
                        className="rounded border border-border bg-background px-2.5 py-1 font-medium text-foreground"
                      >
                        Edit
                      </button>
                      {item.isActive && (
                        <button
                          type="button"
                          onClick={() => void handleDeactivateHouse(item)}
                          className="rounded border border-status-alert/30 bg-background px-2.5 py-1 font-medium text-status-alert"
                        >
                          Deactivate
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      )}

      {activeTab === 'new-batch' && (
        <div className="space-y-5">
          <section className="rounded-lg border border-border bg-surface p-5">
            <h2 className="font-display text-base font-bold text-foreground">
              Start New Breeder Batch
            </h2>
            <p className="mt-1 text-xs text-muted">
              Starting Bird Age (Weeks) is required and drives automatic Week X + Yd flock age tracking.
            </p>

            <form onSubmit={handleBatchSubmit} className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className="block text-xs font-medium text-foreground">House</label>
                <select
                  required
                  value={batchHouseId}
                  onChange={(e) => setBatchHouseId(e.target.value)}
                  className="mt-1 min-h-[44px] w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
                >
                  {houses.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.houseName} ({h.houseCode})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground">Batch Code</label>
                <input
                  type="text"
                  required
                  value={batchCode}
                  onChange={(e) => setBatchCode(e.target.value)}
                  placeholder="e.g., B-2026-H1"
                  className="mt-1 min-h-[44px] w-full rounded-md border border-border bg-background px-3 py-2 font-mono text-sm text-foreground"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground">Placement Date</label>
                <input
                  type="date"
                  required
                  value={placementDate}
                  onChange={(e) => setPlacementDate(e.target.value)}
                  className="mt-1 min-h-[44px] w-full rounded-md border border-border bg-background px-3 py-2 font-mono text-sm text-foreground"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground">
                  Starting Bird Age (Weeks)
                </label>
                <input
                  type="number"
                  required
                  min={0}
                  value={startingAgeWeeks}
                  onChange={(e) => setStartingAgeWeeks(e.target.value)}
                  placeholder="Required (e.g., 20)"
                  className="mt-1 min-h-[44px] w-full rounded-md border border-border bg-background px-3 py-2 font-mono text-sm text-foreground"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground">
                  Initial Female Birds
                </label>
                <input
                  type="number"
                  required
                  min={0}
                  value={initialFemales}
                  onChange={(e) => setInitialFemales(e.target.value)}
                  placeholder="e.g., 4200"
                  className="mt-1 min-h-[44px] w-full rounded-md border border-border bg-background px-3 py-2 font-mono text-sm text-foreground"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground">
                  Initial Male Birds
                </label>
                <input
                  type="number"
                  required
                  min={0}
                  value={initialMales}
                  onChange={(e) => setInitialMales(e.target.value)}
                  placeholder="e.g., 430"
                  className="mt-1 min-h-[44px] w-full rounded-md border border-border bg-background px-3 py-2 font-mono text-sm text-foreground"
                />
              </div>
              <div className="sm:col-span-2 lg:col-span-3">
                <button
                  type="submit"
                  disabled={submitting || houses.length === 0}
                  className="min-h-[44px] rounded-md bg-primary px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-hover disabled:opacity-60"
                >
                  {submitting ? 'Starting...' : 'Start Breeder Batch'}
                </button>
              </div>
            </form>
          </section>

          <section className="overflow-hidden rounded-lg border border-border bg-surface">
            <div className="border-b border-border px-5 py-3">
              <h3 className="font-display text-sm font-bold text-foreground">Existing Batches</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-[13px]">
                <thead>
                  <tr className="border-b border-border bg-background text-xs font-semibold uppercase tracking-wide text-muted">
                    <th className="px-4 py-2.5">House</th>
                    <th className="px-4 py-2.5">Batch</th>
                    <th className="px-4 py-2.5">Placement</th>
                    <th className="px-4 py-2.5">Start Age</th>
                    <th className="px-4 py-2.5">Initial Female / Male</th>
                    <th className="px-4 py-2.5">Status</th>
                    <th className="px-4 py-2.5">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {batches.map((b) => (
                    <tr key={b.id}>
                      <td className="px-4 py-3 font-semibold text-foreground">{b.houseName}</td>
                      <td className="px-4 py-3 font-mono text-xs">{b.batchCode}</td>
                      <td className="px-4 py-3 font-mono text-xs">{b.placementDate}</td>
                      <td className="px-4 py-3 font-mono text-xs">Week {b.startingAgeWeeks}</td>
                      <td className="px-4 py-3 font-mono text-xs">
                        {formatNumber(b.initialFemales)} F · {formatNumber(b.initialMales)} M
                      </td>
                      <td className="px-4 py-3 text-xs font-medium">{b.status}</td>
                      <td className="px-4 py-3 text-xs">
                        {b.status === 'active' && (
                          <button
                            type="button"
                            onClick={() => void handleCloseBatch(b)}
                            className="rounded border border-status-alert/30 bg-background px-2.5 py-1 font-medium text-status-alert"
                          >
                            Close Batch
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}

      {activeTab === 'supervisor-access' && (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <section className="rounded-lg border border-border bg-surface p-5">
            <h2 className="font-display text-base font-bold text-foreground">
              Create App User Login
            </h2>
            <p className="mt-1 text-xs text-muted">
              Create Business Owner or Manager / Supervisor login credentials.
            </p>
            <form onSubmit={handleCreateUser} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-foreground">Username</label>
                <input
                  type="text"
                  required
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="e.g., supervisor1"
                  className="mt-1 min-h-[44px] w-full rounded-md border border-border bg-background px-3 py-2 font-mono text-sm text-foreground"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground">Full Name</label>
                <input
                  type="text"
                  required
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value)}
                  placeholder="e.g., Supervisor 1"
                  className="mt-1 min-h-[44px] w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
                />
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-foreground">Passcode</label>
                  <input
                    type="password"
                    required
                    minLength={4}
                    value={newPasscode}
                    onChange={(e) => setNewPasscode(e.target.value)}
                    placeholder="Min 4 chars"
                    className="mt-1 min-h-[44px] w-full rounded-md border border-border bg-background px-3 py-2 font-mono text-sm text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground">Role</label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as UserRole)}
                    className="mt-1 min-h-[44px] w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
                  >
                    <option value="manager">Manager / Supervisor</option>
                    <option value="owner">Business Owner</option>
                  </select>
                </div>
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="min-h-[44px] rounded-md bg-primary px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-hover disabled:opacity-60"
              >
                {submitting ? 'Creating...' : 'Create User Account'}
              </button>
            </form>
          </section>

          <section className="rounded-lg border border-border bg-surface p-5">
            <h2 className="font-display text-base font-bold text-foreground">
              App Users
            </h2>
            <div className="mt-3 divide-y divide-border rounded-md border border-border">
              {users.map((u) => (
                <div key={u.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm">
                  <div>
                    <p className="font-semibold text-foreground">
                      {u.fullName}{' '}
                      <span className="font-mono text-xs text-muted">({u.username})</span>
                    </p>
                    <p className="font-mono text-xs text-muted">
                      Role: {u.role} ·{' '}
                      <span className={u.isActive ? 'text-status-nominal' : 'text-status-alert'}>
                        {u.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </p>
                  </div>
                  <div className="flex gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => void handleResetPasscode(u)}
                      className="rounded border border-border bg-background px-2.5 py-1 font-medium text-foreground"
                    >
                      Reset Passcode
                    </button>
                    {u.id !== currentUser?.id && (
                      <button
                        type="button"
                        onClick={() => void handleToggleUserActive(u)}
                        className="rounded border border-border bg-background px-2.5 py-1 font-medium text-foreground"
                      >
                        {u.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
