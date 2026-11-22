import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { NAV_ITEMS } from '../../config/navigation';
import { useRolePreview } from '../../contexts/RolePreviewContext';

export function MobileBottomNav() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { isOwner } = useRolePreview();

  const visibleItems = NAV_ITEMS.filter((item) => !item.ownerOnly || isOwner);
  const primaryItems = visibleItems.filter((item) => item.mobilePrimary);

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-foreground/40 transition-opacity duration-200 lg:hidden ${
          drawerOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={() => setDrawerOpen(false)}
        aria-hidden={!drawerOpen}
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-label="All modules"
          className={`absolute inset-x-0 bottom-[60px] max-h-[75vh] overflow-y-auto rounded-t-2xl border-t border-border bg-surface p-5 shadow-lg transition-transform duration-200 ease-out ${
            drawerOpen ? 'translate-y-0' : 'translate-y-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-sm font-bold text-foreground">All Modules</h2>
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              aria-label="Close menu"
              className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md text-muted transition-colors duration-200 hover:bg-background hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {visibleItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.id}
                  to={item.path}
                  end={item.path === '/'}
                  onClick={() => setDrawerOpen(false)}
                  className={({ isActive }) =>
                    `flex min-h-[44px] items-center gap-3 rounded-lg border px-3.5 py-2.5 text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'border-primary bg-primary text-white shadow-sm'
                        : 'border-border bg-background text-foreground hover:border-primary/40'
                    }`
                  }
                >
                  <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        </div>
      </div>

      <nav
        aria-label="Mobile navigation"
        className="fixed inset-x-0 bottom-0 z-30 flex h-[60px] items-center justify-around border-t border-border bg-surface px-1 lg:hidden"
      >
        {primaryItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.id}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `flex min-h-[44px] min-w-[44px] flex-1 flex-col items-center justify-center gap-0.5 rounded-md px-1 text-[11px] font-medium transition-colors duration-200 ${
                  isActive ? 'text-primary' : 'text-muted hover:text-foreground'
                }`
              }
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              <span className="truncate">{item.shortLabel}</span>
            </NavLink>
          );
        })}

        <button
          type="button"
          onClick={() => setDrawerOpen((prev) => !prev)}
          aria-expanded={drawerOpen}
          className={`flex min-h-[44px] min-w-[44px] flex-1 flex-col items-center justify-center gap-0.5 rounded-md px-1 text-[11px] font-medium transition-colors duration-200 ${
            drawerOpen ? 'text-primary' : 'text-muted hover:text-foreground'
          }`}
        >
          <Menu className="h-4 w-4" aria-hidden="true" />
          <span>More</span>
        </button>
      </nav>
    </>
  );
}
