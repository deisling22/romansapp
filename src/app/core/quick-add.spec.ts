import { parseQuickAdd } from './quick-add';

describe('parseQuickAdd', () => {
  const cases: Array<[string, string, number, string]> = [
    ['2 Zwiebeln', 'Zwiebeln', 2, 'Stk.'],
    ['500 g Hackfleisch', 'Hackfleisch', 500, 'g'],
    ['500g Hackfleisch', 'Hackfleisch', 500, 'g'],
    ['1,5 l Milch', 'Milch', 1.5, 'l'],
    ['Butter 250g', 'Butter', 250, 'g'],
    ['Butter 250 g', 'Butter', 250, 'g'],
    ['Passierte Tomaten 2 Dosen', 'Passierte Tomaten', 2, 'Dose'],
    ['3 Stk. Paprika', 'Paprika', 3, 'Stk.'],
    ['2 rote Paprika', 'rote Paprika', 2, 'Stk.'],
    ['  Milch  ', 'Milch', 1, 'Stk.'],
    ['Eier 10', 'Eier', 10, 'Stk.'],
  ];

  for (const [input, ingredientName, quantity, unit] of cases) {
    it(`reads "${input}"`, () => {
      expect(parseQuickAdd(input)).toEqual({ ingredientName, quantity, unit });
    });
  }

  it('rejects empty input and zero quantities', () => {
    expect(parseQuickAdd('   ')).toBeNull();
    expect(parseQuickAdd('0 Zwiebeln')).toBeNull();
  });
});
