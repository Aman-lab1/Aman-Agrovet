import { LogOut } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { NAV_ITEMS } from '../../config/navigation';
import { useAuth } from '../../contexts/AuthContext';

export function TopBar() {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();

  const currentItem =
    NAV_ITEMS.find((item) => (item.path === '/' ? pathname === '/' : pathname.startsWith(item.path))) ??
    NAV_ITEMS[0];

  const roleLabel = user?.role === 'owner' ? 'Business Owner' : 'Manager / Supervisor';

  return (
    <header className="sticky top-0 z-20 flex h-[52px] items-center justify-between gap-3 border-b border-border bg-surface px-4 lg:h-14 lg:px-8">
      <div className="min-w-0">
        <p className="truncate font-display text-sm font-bold text-foreground lg:text-base">
          <span className="lg:hidden">AMAN Agrovet · </span>
          {currentItem.label}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="text-xs font-semibold text-foreground">{user?.fullName}</p>
          <p className="text-[11px] text-muted">{roleLabel}</p>
        </div>
        <button
          type="button"
          onClick={logout}
          className="inline-flex min-h-[44px] items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors duration-200 hover:border-primary/40 hover:bg-surface sm:min-h-[36px]"
        >
          <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Sign Out</span>
        </button>
      </div>
    </header>
  );
}
