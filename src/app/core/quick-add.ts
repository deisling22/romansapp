/** Units offered in forms; free text may use any of {@link UNIT_ALIASES}. */
export const ITEM_UNITS = ['Stk.', 'g', 'kg', 'ml', 'l', 'Packung'] as const;

const UNIT_ALIASES: Record<string, string> = {
  g: 'g', gr: 'g', gramm: 'g',
  kg: 'kg', kilo: 'kg',
  ml: 'ml',
  l: 'l', liter: 'l',
  stk: 'Stk.', 'stk.': 'Stk.', stück: 'Stk.', stueck: 'Stk.', st: 'Stk.', x: 'Stk.',
  packung: 'Packung', packungen: 'Packung', pck: 'Packung', 'pck.': 'Packung', pkg: 'Packung',
  dose: 'Dose', dosen: 'Dose', glas: 'Glas', gläser: 'Glas', bund: 'Bund', becher: 'Becher', flasche: 'Flasche',
  flaschen: 'Flasche',
};

export interface QuickAddItem {
  ingredientName: string;
  quantity: number;
  unit: string;
}

const AMOUNT = String.raw`(\d+(?:[.,]\d+)?)\s*([a-zA-ZäöüÄÖÜ]+\.?)?`;
const LEADING = new RegExp(`^${AMOUNT}\\s+(.+)$`);
const TRAILING = new RegExp(`^(.+?)\\s+${AMOUNT}$`);

/**
 * Understands what people type into one field: "2 Zwiebeln", "500 g Hackfleisch", "1,5 l Milch",
 * "Butter 250g" or just "Milch" (one piece). Returns null for empty input.
 */
export function parseQuickAdd(input: string): QuickAddItem | null {
  const text = input.trim().replace(/\s+/g, ' ');
  if (!text) {
    return null;
  }
  const leading = LEADING.exec(text);
  if (leading) {
    return build(leading[3], leading[1], leading[2]);
  }
  const trailing = TRAILING.exec(text);
  if (trailing) {
    return build(trailing[1], trailing[2], trailing[3]);
  }
  return { ingredientName: text, quantity: 1, unit: 'Stk.' };
}

function build(rest: string, amount: string, unitCandidate: string | undefined): QuickAddItem | null {
  const quantity = Number(amount.replace(',', '.'));
  if (!(quantity > 0)) {
    return null;
  }
  const unit = unitCandidate ? UNIT_ALIASES[unitCandidate.toLowerCase()] : undefined;
  // "2 Zwiebeln": the word after the number is the ingredient, not a unit
  const ingredientName = (unit || !unitCandidate ? rest : `${unitCandidate} ${rest}`).trim();
  return ingredientName ? { ingredientName, quantity, unit: unit ?? 'Stk.' } : null;
}
