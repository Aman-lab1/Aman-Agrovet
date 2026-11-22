import { NavLink } from 'react-router-dom';
import { NAV_ITEMS } from '../../config/navigation';
import { useRolePreview } from '../../contexts/RolePreviewContext';
import { useHealthCheck } from '../../hooks/useHealthCheck';

export function Sidebar() {
  const { isOwner } = useRolePreview();
  const { loading, data, error } = useHealthCheck();

  const visibleItems = NAV_ITEMS.filter((item) => !item.ownerOnly || isOwner);

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-[248px] flex-col border-r border-border bg-surface lg:flex">
      <div className="flex h-14 items-center border-b border-border px-5">
        <div>
          <span className="font-display text-base font-bold tracking-tight text-foreground">
            AMAN Agrovet V3
          </span>
          <p className="text-[11px] text-muted">Broiler Breeder Ops</p>
        </div>
      </div>

      <nav aria-label="Primary navigation" className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.id}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `flex min-h-[44px] items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-muted hover:bg-background hover:text-foreground'
                }`
              }
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="truncate">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="border-t border-border px-4 py-3 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-muted">API Health</span>
          {loading ? (
            <span className="font-mono text-muted">Checking...</span>
          ) : error || !data ? (
            <span className="font-mono font-medium text-status-alert">Offline</span>
          ) : (
            <span className="font-mono font-medium text-status-nominal">OK</span>
          )}
        </div>
        <p className="mt-1 font-mono text-[11px] text-muted">Phase 2 · UI Preview</p>
      </div>
    </aside>
  );
}
