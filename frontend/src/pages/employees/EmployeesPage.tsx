import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { OwnerOnlyNotice } from '../../components/common/OwnerOnlyNotice';
import { useAuth } from '../../contexts/AuthContext';
import {
  createEmployee,
  deactivateEmployee,
  fetchEmployees,
  fetchHouses,
  updateEmployee,
} from '../../services/apiClient';
import type { Employee, House } from '../../types';
import { formatInrFromPaise, getTodayIsoDate } from '../../utils/flockMath';

export function EmployeesPage() {
  const { isOwner } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [houses, setHouses] = useState<House[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('active');
  const [search, setSearch] = useState('');
  const [banner, setBanner] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form state (Add or Edit)
  const [editing, setEditing] = useState<Employee | null>(null);
  const [employeeCode, setEmployeeCode] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [designation, setDesignation] = useState('House Attendant');
  const [assignedHouseId, setAssignedHouseId] = useState<string>('');
  const [joiningDate, setJoiningDate] = useState<string>(getTodayIsoDate);
  const [monthlySalary, setMonthlySalary] = useState('12000');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadData = useCallback(async () => {
    if (!isOwner) return;
    setLoading(true);
    try {
      const [empData, houseData] = await Promise.all([fetchEmployees(), fetchHouses()]);
      setEmployees(empData);
      setHouses(houseData);
    } catch (err) {
      setBanner({
        type: 'error',
        text: err instanceof Error ? err.message : 'Failed to load employees',
      });
    } finally {
      setLoading(false);
    }
  }, [isOwner]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  if (!isOwner) {
    return <OwnerOnlyNotice moduleName="Employees" />;
  }

  function resetForm() {
    setEditing(null);
    setEmployeeCode('');
    setFullName('');
    setPhone('');
    setDesignation('House Attendant');
    setAssignedHouseId('');
    setJoiningDate(getTodayIsoDate());
    setMonthlySalary('12000');
    setReason('');
  }

  function startEdit(emp: Employee) {
    setEditing(emp);
    setEmployeeCode(emp.employeeCode);
    setFullName(emp.fullName);
    setPhone(emp.phone || '');
    setDesignation(emp.designation);
    setAssignedHouseId(emp.assignedHouseId ? String(emp.assignedHouseId) : '');
    setJoiningDate(emp.joiningDate);
    setMonthlySalary(emp.monthlySalary);
    setReason('');
    setBanner(null);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setBanner(null);
    setSubmitting(true);

    try {
      const parsedHouseId = assignedHouseId ? Number(assignedHouseId) : null;
      const parsedSalary = Number(monthlySalary);

      if (editing) {
        await updateEmployee(editing.id, {
          employeeCode,
          fullName,
          phone: phone || undefined,
          designation,
          assignedHouseId: parsedHouseId,
          joiningDate,
          monthlySalary: parsedSalary,
          version: editing.version,
          reason: reason || undefined,
        });
        setBanner({ type: 'success', text: `Updated employee ${fullName} (${employeeCode}).` });
      } else {
        await createEmployee({
          employeeCode,
          fullName,
          phone: phone || undefined,
          designation,
          assignedHouseId: parsedHouseId,
          joiningDate,
          monthlySalary: parsedSalary,
        });
        setBanner({ type: 'success', text: `Added employee ${fullName} (${employeeCode}).` });
      }

      resetForm();
      await loadData();
    } catch (err) {
      setBanner({
        type: 'error',
        text: err instanceof Error ? err.message : 'Failed to save employee',
      });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeactivate(emp: Employee) {
    if (!window.confirm(`Deactivate employee ${emp.fullName} (${emp.employeeCode})? Historical records will be preserved.`)) {
      return;
    }
    setBanner(null);
    try {
      await deactivateEmployee(emp.id, {
        version: emp.version,
        reason: 'Deactivated by Business Owner',
      });
      setBanner({ type: 'success', text: `Deactivated employee ${emp.fullName}.` });
      await loadData();
    } catch (err) {
      setBanner({
        type: 'error',
        text: err instanceof Error ? err.message : 'Failed to deactivate employee',
      });
    }
  }

  const filtered = employees.filter((emp) => {
    if (statusFilter !== 'all' && emp.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      return (
        emp.fullName.toLowerCase().includes(q) ||
        emp.employeeCode.toLowerCase().includes(q) ||
        emp.designation.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          Employees (Owner-Only)
        </h1>
        <p className="mt-1 text-sm text-muted">
          Staff directory, monthly INR salary configuration, and soft-deactivation (never permanently deleted)
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

      {/* Add / Edit Employee Form */}
      <section className="rounded-lg border border-border bg-surface p-5">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <h2 className="font-display text-base font-bold text-foreground">
            {editing ? `Edit Employee: ${editing.fullName}` : 'Add New Employee'}
          </h2>
          {editing && (
            <button
              type="button"
              onClick={resetForm}
              className="text-xs font-medium text-muted hover:text-foreground"
            >
              Cancel Edit
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="block text-xs font-medium text-foreground">Employee Code</label>
            <input
              type="text"
              required
              value={employeeCode}
              onChange={(e) => setEmployeeCode(e.target.value)}
              placeholder="e.g., EMP-001"
              className="mt-1 min-h-[44px] w-full rounded-md border border-border bg-background px-3 py-2 font-mono text-sm text-foreground"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-foreground">Full Name</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g., Ramesh Patel"
              className="mt-1 min-h-[44px] w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-foreground">Designation</label>
            <input
              type="text"
              required
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              className="mt-1 min-h-[44px] w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-foreground">Assigned House</label>
            <select
              value={assignedHouseId}
              onChange={(e) => setAssignedHouseId(e.target.value)}
              className="mt-1 min-h-[44px] w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
            >
              <option value="">All / Unassigned</option>
              {houses.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.houseName} ({h.houseCode})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-foreground">Phone</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Optional"
              className="mt-1 min-h-[44px] w-full rounded-md border border-border bg-background px-3 py-2 font-mono text-sm text-foreground"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-foreground">Joining Date</label>
            <input
              type="date"
              required
              value={joiningDate}
              onChange={(e) => setJoiningDate(e.target.value)}
              className="mt-1 min-h-[44px] w-full rounded-md border border-border bg-background px-3 py-2 font-mono text-sm text-foreground"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-foreground">Monthly Salary (INR ₹)</label>
            <input
              type="number"
              required
              step="0.01"
              min={0}
              value={monthlySalary}
              onChange={(e) => setMonthlySalary(e.target.value)}
              className="mt-1 min-h-[44px] w-full rounded-md border border-border bg-background px-3 py-2 font-mono text-sm text-foreground"
            />
          </div>
          {editing && (
            <div>
              <label className="block text-xs font-medium text-foreground">Correction Reason</label>
              <input
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Optional audit note"
                className="mt-1 min-h-[44px] w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
              />
            </div>
          )}

          <div className="sm:col-span-2 lg:col-span-4">
            <button
              type="submit"
              disabled={submitting}
              className="min-h-[44px] rounded-md bg-primary px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-hover disabled:opacity-60"
            >
              {submitting ? 'Saving...' : editing ? 'Save Changes' : 'Add Employee'}
            </button>
          </div>
        </form>
      </section>

      {/* Filters & Table */}
      <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-surface p-4">
        <select
          aria-label="Filter by status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
          className="min-h-[40px] rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground"
        >
          <option value="active">Active Only</option>
          <option value="inactive">Inactive Only</option>
          <option value="all">All Staff</option>
        </select>

        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name, code, or designation..."
          className="min-h-[40px] flex-1 rounded-md border border-border bg-background px-3 py-1.5 text-xs text-foreground"
        />
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-surface">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-[13px]">
            <thead>
              <tr className="border-b border-border bg-background text-xs font-semibold uppercase tracking-wide text-muted">
                <th className="whitespace-nowrap px-4 py-3">Code</th>
                <th className="whitespace-nowrap px-4 py-3">Full Name</th>
                <th className="whitespace-nowrap px-4 py-3">Designation</th>
                <th className="whitespace-nowrap px-4 py-3">Assigned House</th>
                <th className="whitespace-nowrap px-4 py-3">Monthly Salary</th>
                <th className="whitespace-nowrap px-4 py-3">Status</th>
                <th className="whitespace-nowrap px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                Array.from({ length: 3 }).map((_, idx) => (
                  <tr key={idx}>
                    <td colSpan={7} className="px-4 py-4">
                      <div className="h-4 w-full animate-pulse rounded bg-background" />
                    </td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-xs text-muted">
                    No employees found matching the current filter.
                  </td>
                </tr>
              ) : (
                filtered.map((emp) => {
                  const salaryPaise = Math.round(Number(emp.monthlySalary) * 100);
                  return (
                    <tr key={emp.id} className="hover:bg-background/60">
                      <td className="whitespace-nowrap px-4 py-3 font-mono text-xs font-semibold text-foreground">
                        {emp.employeeCode}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <p className="font-medium text-foreground">{emp.fullName}</p>
                        {emp.phone && <p className="font-mono text-[11px] text-muted">{emp.phone}</p>}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-xs text-foreground">
                        {emp.designation}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-xs text-muted">
                        {emp.assignedHouseName || 'Unassigned'}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 font-mono text-xs font-semibold text-foreground">
                        {formatInrFromPaise(salaryPaise)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-xs font-medium">
                        <span
                          className={
                            emp.status === 'active' ? 'text-status-nominal' : 'text-status-alert'
                          }
                        >
                          {emp.status === 'active' ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-xs">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => startEdit(emp)}
                            className="rounded border border-border bg-background px-2.5 py-1 font-medium text-foreground hover:border-primary/40"
                          >
                            Edit
                          </button>
                          {emp.status === 'active' && (
                            <button
                              type="button"
                              onClick={() => void handleDeactivate(emp)}
                              className="rounded border border-status-alert/30 bg-background px-2.5 py-1 font-medium text-status-alert hover:bg-status-alert/5"
                            >
                              Deactivate
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
