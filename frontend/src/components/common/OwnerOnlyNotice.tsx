import { ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';

interface OwnerOnlyNoticeProps {
  moduleName: string;
}

export function OwnerOnlyNotice({ moduleName }: OwnerOnlyNoticeProps) {
  return (
    <div className="rounded-lg border border-border bg-surface p-6">
      <div className="flex items-start gap-3">
        <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-status-warning" aria-hidden="true" />
        <div>
          <h2 className="font-display text-base font-bold text-foreground">
            {moduleName} — Owner-Only Module
          </h2>
          <p className="mt-1 text-sm text-muted">
            You are currently viewing the application in <strong>Manager / Supervisor (Demo Preview)</strong> mode.
            Managers have zero UI or backend access to Finance, Salaries, Team Access, or Activity &amp; Audit Logs.
          </p>
          <Link
            to="/"
            className="mt-4 inline-flex min-h-[44px] items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
