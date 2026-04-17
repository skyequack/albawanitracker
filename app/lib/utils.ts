/**
 * Format utilities
 */

export function formatCurrency(amount: number): string {
  return `﷼${amount.toFixed(2)}`;
}

export function formatDate(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString();
}

export function formatDateTime(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleString();
}

export function getMonthYear(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

/**
 * Calculation utilities
 */

export function calculatePendingBalance(issued: number, cleared: number): number {
  return issued - cleared;
}

export function calculateClearedPercentage(cleared: number, issued: number): number {
  if (issued === 0) return 0;
  return (cleared / issued) * 100;
}
