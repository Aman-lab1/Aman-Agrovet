/**
 * Pure domain calculation helpers for Phase 2 Demo UI preview.
 * Follows docs/CALCULATIONS.md specifications.
 */

export function formatFlockAge(
  placementDateIso: string,
  startingAgeWeeks: number,
  targetDateIso: string,
): string {
  const placementMs = Date.parse(`${placementDateIso}T00:00:00Z`);
  const targetMs = Date.parse(`${targetDateIso}T00:00:00Z`);
  const diffDays = Math.max(0, Math.floor((targetMs - placementMs) / (1000 * 60 * 60 * 24)));
  const weeks = startingAgeWeeks + Math.floor(diffDays / 7);
  const days = diffDays % 7;
  return `Week ${weeks} + ${days}d`;
}

export function formatMaleFemaleRatio(females: number, males: number): string {
  if (males <= 0) return 'N/A';
  const ratio = females / males;
  return `1 : ${ratio.toFixed(1)}`;
}

export function formatPercent(numerator: number, denominator: number): string {
  if (denominator <= 0) return 'N/A';
  return `${((numerator / denominator) * 100).toFixed(2)}%`;
}

export function formatInrFromPaise(paise: number): string {
  const rupees = paise / 100;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(rupees);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-IN').format(value);
}

export function getTodayIsoDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
