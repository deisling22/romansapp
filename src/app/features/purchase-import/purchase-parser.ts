import { parseQuickAdd, QuickAddItem } from '../../core/quick-add';

export interface PurchaseItem extends QuickAddItem {
  selected: boolean;
}

const PRICE = /\s+(-?\d+[,.]\d{2})\s*(?:€|EUR)?\s*[A-C]?\s*$/i;
const TOTAL = /^(?:zwischen)?summe\b|^(?:gesamt(?:betrag)?|total|endbetrag|zu zahlen)\b/i;
const IGNORE = /^(?:REWE|LIDL|ALDI|NETTO|EDEKA|PENNY|KAUFLAND|NORMA|GLOBUS|Einkaufsliste|Einkaufszettel|Kassenbon|Kassenbeleg|Beleg|Quittung|Filiale|Markt|Datum|Uhrzeit|Vielen Dank|Danke|www\.|https?:|Tel[.: ]|UST|MwSt|Steuer|Netto\b|Brutto|Bar\b|EC[- ]|Karte|Zahlung|Rückgeld|Rabatt|Coupon|Pfand|Leergut|Gutschein|Bon[- :]|Kasse\b|Bedien|TSE|Transaktion)/i;
const WEIGHT = /(\d+(?:[.,]\d+)?)\s*(kg|gramm|gr|g|ml|liter|l)\b/i;
const MULTIPACK = /(\d+)\s*[x×]\s*(\d+(?:[.,]\d+)?)\s*(kg|gramm|gr|g|ml|liter|l)\b/i;

/** Prices never imply quantities. Only explicit weights/counts are used. */
export function parsePurchaseText(text: string, source: 'receipt' | 'list' = 'list'): PurchaseItem[] {
  const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const receipt = source === 'receipt' || lines.some((line) => TOTAL.test(line));
  const items: PurchaseItem[] = [];
  let pendingCount = 1;
  for (const raw of lines) {
    if (receipt && TOTAL.test(raw) && !/^zwischensumme/i.test(raw)) {
      break;
    }
    // Some tills print the count/unit price on the line after the product.
    const countLine = /^(\d+)\s*(?:[x×*]|Stk\.?\s*[x×*]?)\s*\d+[,.]\d{2}(?:\s|$)/i.exec(raw);
    if (receipt && countLine) {
      const previous = items.at(-1);
      if (previous) {
        previous.quantity *= Number(countLine[1]);
      } else {
        pendingCount = Number(countLine[1]);
      }
      continue;
    }
    const weightLine = /^(\d+(?:[.,]\d+)?)\s*kg\s*[x×*]/i.exec(raw);
    if (receipt && weightLine) {
      const previous = items.at(-1);
      if (previous) {
        previous.quantity = Number(weightLine[1].replace(',', '.')) * 1000;
        previous.unit = 'g';
      }
      continue;
    }
    if (IGNORE.test(raw) || TOTAL.test(raw) || /^\d{1,2}[./]\d{1,2}[./]\d{2,4}\b/.test(raw)) {
      continue;
    }
    if (receipt && (!PRICE.test(raw) || /\s-\d+[,.]\d{2}/.test(raw))) {
      continue;
    }
    const cleaned = raw.replace(/^(?:[-•☐☑✓]|\[[ xX]?\])\s*/, '').replace(PRICE, '').trim();
    if (!/\p{L}{2}/u.test(cleaned)) {
      continue;
    }
    const pack = MULTIPACK.exec(cleaned);
    const weight = pack ?? WEIGHT.exec(cleaned);
    let item: QuickAddItem | null;
    if (weight) {
      const amount = Number((pack ? pack[2] : weight[1]).replace(',', '.'));
      const unit = (pack ? pack[3] : weight[2]).toLowerCase();
      const quantity = amount * (pack ? Number(pack[1]) : 1);
      const remainder = parseQuickAdd(cleaned.replace(weight[0], '').replace(/\s+/g, ' ').trim());
      item = {
        ingredientName: remainder?.ingredientName ?? '',
        quantity: quantity * (unit === 'kg' ? 1000 : 1) * (remainder?.quantity ?? 1),
        unit: /^(kg|g|gr|gramm)$/.test(unit) ? 'g' : /^(l|liter)$/.test(unit) ? 'l' : 'ml',
      };
    } else {
      item = parseQuickAdd(cleaned);
    }
    if (item?.ingredientName && item.quantity > 0) {
      items.push({ ...item, quantity: item.quantity * pendingCount, selected: true });
      pendingCount = 1;
    }
  }
  return items;
}
