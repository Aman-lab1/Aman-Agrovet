import { ModuleShell } from '../../components/common/ModuleShell';
import { OwnerOnlyNotice } from '../../components/common/OwnerOnlyNotice';
import { useAuth } from '../../contexts/AuthContext';

export function EmployeesPage() {
  const { isOwner } = useAuth();

  if (!isOwner) {
    return <OwnerOnlyNotice moduleName="Employees" />;
  }

  return (
    <ModuleShell
      title="Employees (Owner-Only)"
      subtitle="Staff directory with soft-deactivation and monthly INR salary management"
      connectedPhase="Phase 4"
      primaryActionLabel="Add Employee"
      filters={['Status (Active / Inactive)', 'Assigned House', 'Search Name / Code']}
      columns={[
        'Employee Code',
        'Full Name',
        'Designation',
        'Assigned House',
        'Phone',
        'Monthly Salary (INR ₹)',
        'Status',
      ]}
      emptyStateTitle="Employee Roster Shell (Owner-Only)"
      emptyStateDescription="Employee records, monthly INR salary configuration, and soft-deactivation controls will load from PostgreSQL in Phase 4. App User Access is managed under Settings & Setup."
    />
  );
}
