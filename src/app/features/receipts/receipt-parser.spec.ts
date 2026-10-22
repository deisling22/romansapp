import { parseReceiptText } from './receipt-parser';

describe('parseReceiptText', () => {
  const today = new Date(2026, 4, 20);

  it('reads store, date and total from a typical receipt', () => {
    const text = [
      'REWE Markt GmbH',
      'Musterstr. 1',
      'Milch 1,19',
      'Brot 2,49',
      'Zwischensumme 3,68',
      'SUMME EUR 23,45',
      'Bar 50,00',
      '15.05.26 18:03',
    ].join('\n');
    expect(parseReceiptText(text, today)).toEqual({ totalEur: 23.45, purchasedOn: '2026-05-15', store: 'REWE Markt GmbH' });
  });

  it('falls back to the largest amount and ignores future dates', () => {
    const result = parseReceiptText('Kassenbon\nLIDL\nApfel 0,99\nKäse 4.29\n01.01.2099', today);
    expect(result.totalEur).toBe(4.29);
    expect(result.purchasedOn).toBeNull();
    expect(result.store).toBe('LIDL');
  });

  it('returns nulls for empty text', () => {
    expect(parseReceiptText('', today)).toEqual({ totalEur: null, purchasedOn: null, store: null });
  });
});
