import type { ReactNode } from 'react';
import { MobileBottomNav } from './MobileBottomNav';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Sidebar />
      <div className="flex min-h-screen flex-col lg:pl-[248px]">
        <TopBar />
        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 pb-24 sm:px-6 lg:px-8 lg:py-7 lg:pb-10">
          {children}
        </main>
      </div>
      <MobileBottomNav />
    </div>
  );
}
