import { useState } from 'react';
import { ModuleShell } from '../../components/common/ModuleShell';
import { OwnerOnlyNotice } from '../../components/common/OwnerOnlyNotice';
import { useAuth } from '../../contexts/AuthContext';

export function FinancePage() {
  const { isOwner } = useAuth();
  const [activeTab, setActiveTab] = useState<'expenses' | 'salaries' | 'payments'>('expenses');

  if (!isOwner) {
    return <OwnerOnlyNotice moduleName="Finance" />;
  }

  const columnsByTab: Record<'expenses' | 'salaries' | 'payments', string[]> = {
    expenses: [
      'Expense Date',
      'House / Overhead',
      'Category',
      'Vendor',
      'Amount (INR ₹)',
      'Paid / Outstanding',
      'Status (Active / Voided)',
    ],
    salaries: [
      'Salary Month',
      'Employee',
      'Attendance (P / HD / A / L)',
      'Base Salary (₹)',
      'Adjustments (₹)',
      'Net Payable (₹)',
      'Status',
    ],
    payments: [
      'Payment Date',
      'Direction',
      'Target (Expense / Salary)',
      'Amount (INR ₹)',
      'Method',
      'Reference No',
      'Reversal Status',
    ],
  };

  const actionByTab: Record<'expenses' | 'salaries' | 'payments', string> = {
    expenses: 'Record Expense',
    salaries: 'Generate Salary Run',
    payments: 'Record Payment',
  };

  return (
    <ModuleShell
      title="Finance (Owner-Only)"
      subtitle="Exact integer-paise INR accounting with voiding and payment reversal protection"
      connectedPhase="Phase 6"
      primaryActionLabel={actionByTab[activeTab]}
      tabs={[
        { id: 'expenses', label: 'Expenses' },
        { id: 'salaries', label: 'Monthly Salaries' },
        { id: 'payments', label: 'Payments & Transactions' },
      ]}
      activeTabId={activeTab}
      onTabChange={(id) => setActiveTab(id as 'expenses' | 'salaries' | 'payments')}
      filters={['Date Range', 'House', 'Status (Active / Voided / Reversed)']}
      columns={columnsByTab[activeTab]}
      summaryStrip={
        <div className="grid grid-cols-2 gap-3 rounded-lg border border-border bg-surface p-4 sm:grid-cols-4">
          <div>
            <p className="text-xs text-muted">Total Expenses</p>
            <p className="mt-1 font-mono text-sm font-semibold text-foreground">₹0.00</p>
          </div>
          <div>
            <p className="text-xs text-muted">Salaries Payable</p>
            <p className="mt-1 font-mono text-sm font-semibold text-foreground">₹0.00</p>
          </div>
          <div>
            <p className="text-xs text-muted">Cash Paid Out</p>
            <p className="mt-1 font-mono text-sm font-semibold text-status-nominal">₹0.00</p>
          </div>
          <div>
            <p className="text-xs text-muted">Outstanding Payable</p>
            <p className="mt-1 font-mono text-sm font-semibold text-status-warning">₹0.00</p>
          </div>
        </div>
      }
      emptyStateTitle="Finance Ledger Shell"
      emptyStateDescription="Expenses, attendance-assisted monthly salary runs, partial/full payments with overpayment protection, and payment reversals will be connected in Phase 6."
    />
  );
}
