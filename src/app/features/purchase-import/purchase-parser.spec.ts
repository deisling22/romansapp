import { parsePurchaseText } from './purchase-parser';

describe('parsePurchaseText', () => {
  it('imports receipt products but not headers, prices, deposits, discounts or totals', () => {
    const text = `NETTO Marken-Discount
Musterstrasse 12
17.11.2026
Butter 250g 2,19 A
Bananen 1,69 B
0,750 kg x 2,25 EUR/kg
Joghurt 0,49 B
2 x 0,49
Pfand 0,25 A
Rabatt -0,20
SUMME 4,91
Bar 10,00
Klopapier 3,99`;
    expect(parsePurchaseText(text, 'receipt')).toEqual([
      { ingredientName: 'Butter', quantity: 250, unit: 'g', selected: true },
      { ingredientName: 'Bananen', quantity: 750, unit: 'g', selected: true },
      { ingredientName: 'Joghurt', quantity: 2, unit: 'Stk.', selected: true },
    ]);
  });

  it('uses shared quick-add parsing for shopping lists and normalizes weights', () => {
    expect(parsePurchaseText('Einkaufsliste\n- 500 g Tomaten\n[ ] 2 Zwiebeln\nReis 1,5 kg\nMilch 1 l\nBrot')).toEqual([
      { ingredientName: 'Tomaten', quantity: 500, unit: 'g', selected: true },
      { ingredientName: 'Zwiebeln', quantity: 2, unit: 'Stk.', selected: true },
      { ingredientName: 'Reis', quantity: 1500, unit: 'g', selected: true },
      { ingredientName: 'Milch', quantity: 1, unit: 'l', selected: true },
      { ingredientName: 'Brot', quantity: 1, unit: 'Stk.', selected: true },
    ]);
  });

  it('recognizes multipacks and repeated weighted packs', () => {
    expect(parsePurchaseText('Nudeln 2 x 500 g\n2 x Butter 250g\n3 Stk. Paprika')).toEqual([
      { ingredientName: 'Nudeln', quantity: 1000, unit: 'g', selected: true },
      { ingredientName: 'Butter', quantity: 500, unit: 'g', selected: true },
      { ingredientName: 'Paprika', quantity: 3, unit: 'Stk.', selected: true },
    ]);
  });

  it('does not interpret prices as quantities or guess missing pack weights', () => {
    expect(parsePurchaseText('Nudeln 1,99 A\nSalat 0,89', 'receipt')).toEqual([
      { ingredientName: 'Nudeln', quantity: 1, unit: 'Stk.', selected: true },
      { ingredientName: 'Salat', quantity: 1, unit: 'Stk.', selected: true },
    ]);
  });

  it('detects pasted receipts and excludes payment lines', () => {
    expect(parsePurchaseText('REWE\nMehl 1kg 0,99 B\nSUMME 0,99\nKartenzahlung 0,99')).toEqual([
      { ingredientName: 'Mehl', quantity: 1000, unit: 'g', selected: true },
    ]);
  });

  it('preserves repeated products and liquid volumes', () => {
    expect(parsePurchaseText('Sahne 200 ml\nSahne 200 ml').map((item) => item.quantity)).toEqual([200, 200]);
  });

  it('rejects empty or non-product receipt text', () => {
    expect(parsePurchaseText('')).toEqual([]);
    expect(parsePurchaseText('REWE\n123456789\nSUMME 2,99', 'receipt')).toEqual([]);
    expect(parsePurchaseText('0 g Mehl')).toEqual([]);
  });
});
