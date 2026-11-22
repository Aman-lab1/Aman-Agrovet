import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { RolePreviewProvider } from './contexts/RolePreviewContext';
import { AttendancePage } from './pages/attendance/AttendancePage';
import { AuditLogsPage } from './pages/audit-logs/AuditLogsPage';
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { EggProductionPage } from './pages/egg-production/EggProductionPage';
import { EmployeesPage } from './pages/employees/EmployeesPage';
import { FarmsPage } from './pages/farms/FarmsPage';
import { FeedMortalityPage } from './pages/feed-mortality/FeedMortalityPage';
import { FinancePage } from './pages/finance/FinancePage';
import { ReportsPage } from './pages/reports/ReportsPage';
import { SettingsPage } from './pages/settings/SettingsPage';

export function App() {
  return (
    <RolePreviewProvider>
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/employees" element={<EmployeesPage />} />
            <Route path="/attendance" element={<AttendancePage />} />
            <Route path="/farms" element={<FarmsPage />} />
            <Route path="/egg-production" element={<EggProductionPage />} />
            <Route path="/feed-mortality" element={<FeedMortalityPage />} />
            <Route path="/finance" element={<FinancePage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/audit-logs" element={<AuditLogsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </RolePreviewProvider>
  );
}

export default App;
