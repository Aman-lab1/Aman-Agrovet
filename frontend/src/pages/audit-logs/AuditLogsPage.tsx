import { ModuleShell } from '../../components/common/ModuleShell';
import { OwnerOnlyNotice } from '../../components/common/OwnerOnlyNotice';
import { useRolePreview } from '../../contexts/RolePreviewContext';

export function AuditLogsPage() {
  const { isOwner } = useRolePreview();

  if (!isOwner) {
    return <OwnerOnlyNotice moduleName="Activity & Audit Logs" />;
  }

  return (
    <ModuleShell
      title="Activity & Audit Logs (Owner-Only)"
      subtitle="Immutable append-only audit trail showing actor identity, action, previous vs. updated JSON diffs, and reason"
      connectedPhase="Phase 7"
      primaryActionLabel="Refresh Audit Timeline"
      filters={['Entity Type', 'Action (CREATE / UPDATE / DELETE / VOID / REVERSE)', 'Actor', 'Date Range']}
      columns={[
        'Timestamp',
        'Actor (Name / Email)',
        'Action',
        'Entity',
        'Summary',
        'Reason / Diff',
      ]}
      emptyStateTitle="Immutable Audit Log Shell"
      emptyStateDescription="Every database mutation writes an append-only audit entry in the same ACID transaction. Audit log querying will be connected in Phase 7."
    />
  );
}
