import { useLocation } from 'react-router-dom';
import { NAV_ITEMS } from '../../config/navigation';
import { useRolePreview } from '../../contexts/RolePreviewContext';

export function TopBar() {
  const { pathname } = useLocation();
  const { role, setRole } = useRolePreview();

  const currentItem =
    NAV_ITEMS.find((item) => (item.path === '/' ? pathname === '/' : pathname.startsWith(item.path))) ??
    NAV_ITEMS[0];

  return (
    <header className="sticky top-0 z-20 flex h-[52px] items-center justify-between gap-3 border-b border-border bg-surface px-4 lg:h-14 lg:px-8">
      <div className="min-w-0">
        <p className="truncate font-display text-sm font-bold text-foreground lg:text-base">
          <span className="lg:hidden">AMAN Agrovet · </span>
          {currentItem.label}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-2.5">
        <label htmlFor="role-preview-select" className="hidden text-xs font-medium text-muted sm:inline">
          View Mode:
        </label>
        <select
          id="role-preview-select"
          value={role}
          onChange={(e) => setRole(e.target.value as 'owner' | 'manager')}
          className="min-h-[44px] rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-all duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 sm:min-h-[36px]"
        >
          <option value="owner">Business Owner (Demo Preview)</option>
          <option value="manager">Manager / Supervisor (Demo Preview)</option>
        </select>
      </div>
    </header>
  );
}
