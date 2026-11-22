import { ModuleShell } from '../../components/common/ModuleShell';
import { useAuth } from '../../contexts/AuthContext';

export function ReportsPage() {
  const { isOwner } = useAuth();

  return (
    <ModuleShell
      title="Reports & Analytics"
      subtitle="Date-range operational & financial reports with reconciled CSV export"
      connectedPhase="Phase 7"
      primaryActionLabel="Export Reconciled CSV"
      filters={[
        'Preset (Daily / Weekly / Monthly / Custom / Cumulative)',
        'House',
        isOwner
          ? 'Report Type (Attendance / Eggs / Feed / Mortality / Financial)'
          : 'Report Type (Attendance / Eggs / Feed / Mortality)',
      ]}
      columns={[
        'Period / Date',
        'House / Batch',
        'Metric Category',
        'Operational Value',
        'Unit / Denominator',
        'Reconciled Total',
      ]}
      emptyStateTitle="Reports & CSV Export Shell"
      emptyStateDescription="Role-scoped date-range reports and one-click CSV exports of reconciled PostgreSQL tables will be connected in Phase 7."
    />
  );
}
