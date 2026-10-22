/** Best-effort extraction of total, date and store from OCR'd German supermarket receipts. */
export interface ParsedReceipt {
  totalEur: number | null;
  purchasedOn: string | null;
  store: string | null;
}

const TOTAL_LINE = /(summe|gesamt|total|zu\s*zahlen|endbetrag|betrag|bar\b|ec[- ]?karte|kartenzahlung)/i;
const AMOUNT = /(-?\d{1,5})\s*[,.]\s*(\d{2})(?!\d)/g;
const DATE = /\b(\d{1,2})\.\s?(\d{1,2})\.\s?(\d{2}|\d{4})\b/;
const STORE_SKIP = /^(kassenbon|beleg|rechnung|quittung|www\.|tel|\d)/i;

export function parseReceiptText(rawText: string, today = new Date()): ParsedReceipt {
  const lines = rawText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  return {
    totalEur: findTotal(lines),
    purchasedOn: findDate(lines, today),
    store: findStore(lines),
  };
}

function amountsIn(line: string): number[] {
  const withoutDates = line.replace(new RegExp(DATE.source, 'g'), ' ');
  return [...withoutDates.matchAll(AMOUNT)].map((match) => Number(`${match[1]}.${match[2]}`)).filter((value) => value > 0);
}

function findTotal(lines: string[]): number | null {
  // Prefer the first explicit total line ("SUMME EUR 23,45"); payment lines (BAR, EC) usually repeat it.
  for (const line of lines) {
    if (TOTAL_LINE.test(line) && !/zwischensumme|mwst|netto|steuer|r(ü|ue)ckgeld/i.test(line)) {
      const amounts = amountsIn(line);
      if (amounts.length > 0) {
        return amounts[amounts.length - 1];
      }
    }
  }
  const all = lines.flatMap(amountsIn).filter((value) => value < 10000);
  return all.length > 0 ? Math.max(...all) : null;
}

function findDate(lines: string[], today: Date): string | null {
  for (const line of lines) {
    const match = DATE.exec(line);
    if (!match) {
      continue;
    }
    const day = Number(match[1]);
    const month = Number(match[2]);
    let year = Number(match[3]);
    if (year < 100) {
      year += 2000;
    }
    const date = new Date(year, month - 1, day);
    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month - 1 ||
      date.getDate() !== day ||
      date.getTime() > today.getTime() + 86_400_000
    ) {
      continue;
    }
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }
  return null;
}

function findStore(lines: string[]): string | null {
  for (const line of lines.slice(0, 5)) {
    const cleaned = line.replace(/[^\p{L}\p{N}&.\- ]/gu, '').trim();
    if (cleaned.length >= 3 && !STORE_SKIP.test(cleaned) && /\p{L}{3}/u.test(cleaned)) {
      return cleaned.slice(0, 80);
    }
  }
  return null;
}
