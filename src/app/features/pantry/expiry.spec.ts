import { expiryInfo } from './expiry';

describe('expiryInfo', () => {
  const today = new Date(2026, 2, 10, 15, 30);

  it('returns null without a date', () => {
    expect(expiryInfo(null, today)).toBeNull();
  });

  it('flags expired, soon and ok items', () => {
    expect(expiryInfo('2026-03-08', today)).toEqual({ daysLeft: -2, level: 'expired', label: 'Seit 2 Tagen abgelaufen' });
    expect(expiryInfo('2026-03-10', today)?.label).toBe('Läuft heute ab');
    expect(expiryInfo('2026-03-11', today)?.level).toBe('soon');
    expect(expiryInfo('2026-03-13', today)?.level).toBe('soon');
    expect(expiryInfo('2026-03-14', today)).toEqual({ daysLeft: 4, level: 'ok', label: 'Noch 4 Tage haltbar' });
  });
});
