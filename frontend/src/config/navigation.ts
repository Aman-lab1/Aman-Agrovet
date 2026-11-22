import type { LucideIcon } from 'lucide-react';
import {
  Activity,
  BarChart3,
  Building2,
  CalendarCheck,
  Egg,
  IndianRupee,
  LayoutDashboard,
  Settings,
  Users,
  Wheat,
} from 'lucide-react';

export interface NavItem {
  id: string;
  label: string;
  shortLabel: string;
  path: string;
  icon: LucideIcon;
  ownerOnly?: boolean;
  mobilePrimary?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    shortLabel: 'Dashboard',
    path: '/',
    icon: LayoutDashboard,
    mobilePrimary: true,
  },
  {
    id: 'attendance',
    label: 'Attendance',
    shortLabel: 'Attendance',
    path: '/attendance',
    icon: CalendarCheck,
    mobilePrimary: true,
  },
  {
    id: 'egg-production',
    label: 'Egg Production',
    shortLabel: 'Eggs',
    path: '/egg-production',
    icon: Egg,
    mobilePrimary: true,
  },
  {
    id: 'feed-mortality',
    label: 'Feed & Mortality',
    shortLabel: 'Feed/Mort.',
    path: '/feed-mortality',
    icon: Wheat,
    mobilePrimary: true,
  },
  {
    id: 'farms',
    label: 'Farms & Houses',
    shortLabel: 'Farms',
    path: '/farms',
    icon: Building2,
  },
  {
    id: 'employees',
    label: 'Employees',
    shortLabel: 'Employees',
    path: '/employees',
    icon: Users,
    ownerOnly: true,
  },
  {
    id: 'finance',
    label: 'Finance',
    shortLabel: 'Finance',
    path: '/finance',
    icon: IndianRupee,
    ownerOnly: true,
  },
  {
    id: 'reports',
    label: 'Reports & Analytics',
    shortLabel: 'Reports',
    path: '/reports',
    icon: BarChart3,
  },
  {
    id: 'audit-logs',
    label: 'Activity & Audit Logs',
    shortLabel: 'Audit Logs',
    path: '/audit-logs',
    icon: Activity,
    ownerOnly: true,
  },
  {
    id: 'settings',
    label: 'Settings & Setup',
    shortLabel: 'Settings',
    path: '/settings',
    icon: Settings,
    ownerOnly: true,
  },
];
