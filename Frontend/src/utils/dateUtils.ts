/**
 * Utility functions for date/time formatting.
 * All timestamps from backend are UTC; display in local timezone (A-10).
 */

export function formatDateTime(isoString: string | undefined | null): string {
  if (!isoString) return '—';
  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(isoString));
  } catch {
    return isoString;
  }
}

export function formatDate(isoString: string | undefined | null): string {
  if (!isoString) return '—';
  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: 'medium',
    }).format(new Date(isoString));
  } catch {
    return isoString;
  }
}

export function toISOString(date: Date): string {
  return date.toISOString();
}

export function subtractDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() - days);
  return result;
}
