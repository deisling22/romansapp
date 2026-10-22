export type ExpiryLevel = 'expired' | 'soon' | 'ok';

export interface ExpiryInfo {
  daysLeft: number;
  level: ExpiryLevel;
  label: string;
}

/** Same window as the backend (PantryService.EXPIRING_SOON_DAYS). */
export const EXPIRING_SOON_DAYS = 3;

/** `expiresOn` is an ISO date (yyyy-MM-dd) and is compared in local time. */
export function expiryInfo(expiresOn: string | null | undefined, today = new Date()): ExpiryInfo | null {
  if (!expiresOn) {
    return null;
  }
  const [year, month, day] = expiresOn.split('-').map(Number);
  const expiry = new Date(year, month - 1, day);
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const daysLeft = Math.round((expiry.getTime() - start.getTime()) / 86_400_000);
  if (daysLeft < 0) {
    const ago = -daysLeft;
    return { daysLeft, level: 'expired', label: ago === 1 ? 'Seit gestern abgelaufen' : `Seit ${ago} Tagen abgelaufen` };
  }
  const level: ExpiryLevel = daysLeft <= EXPIRING_SOON_DAYS ? 'soon' : 'ok';
  if (daysLeft === 0) {
    return { daysLeft, level, label: 'Läuft heute ab' };
  }
  if (daysLeft === 1) {
    return { daysLeft, level, label: 'Läuft morgen ab' };
  }
  return { daysLeft, level, label: `Noch ${daysLeft} Tage haltbar` };
}
