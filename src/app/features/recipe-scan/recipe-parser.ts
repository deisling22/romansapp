/**
 * Heuristic parsing of OCR'd German recipe text into structured dish data.
 * This is a best-effort text parser (no cloud AI involved) — results are always
 * shown to the user for review and correction before saving, never saved directly.
 */

export interface ParsedIngredient {
  id: number;
  name: string;
  quantity: number | null;
  unit: string;
}

export interface ParsedStep {
  id: number;
  text: string;
  timerSeconds: number | null;
}

export interface ParsedNutrition {
  carbsGrams: number | null;
  fatGrams: number | null;
  vitaminAMcg: number | null;
  vitaminCMg: number | null;
  vitaminDMcg: number | null;
  vitaminKMcg: number | null;
  vitaminB12Mcg: number | null;
  folateMcg: number | null;
}

export interface ParsedRecipe {
  name: string | null;
  description: string | null;
  prepMinutes: number | null;
  servings: number | null;
  tags: string[];
  ingredients: ParsedIngredient[];
  steps: ParsedStep[];
  nutrition: ParsedNutrition;
}

const INGREDIENT_HEADING = /^(zutaten|ingredients)\b/i;
const STEP_HEADING = /^(zubereitung|schritte|anleitung|instructions|steps)\b/i;
const NUTRITION_HEADING = /^(n(ä|ae)hrwerte|nutrition)\b/i;
const ANY_HEADING = [INGREDIENT_HEADING, STEP_HEADING, NUTRITION_HEADING];

const PREP_MINUTES_PATTERN = /(\d{1,3})\s*(?:min(?:uten)?|min\.)/i;
const SERVINGS_PATTERN = /(\d{1,2})\s*(?:personen|portionen)/i;
const TAG_KEYWORDS = [
  'vegetarisch',
  'vegan',
  'schnell',
  'glutenfrei',
  'laktosefrei',
  'low carb',
  'high protein',
  'kalorienarm',
  'herzhaft',
  'scharf',
];

const LEADING_QUANTITY = /^(\d+(?:[.,]\d+)?|\d+\/\d+)\s*/;
const LEADING_WORD = /^([A-Za-zÄÖÜäöüß.]+)\s*/;

const UNIT_LOOKUP: Record<string, string> = {
  g: 'g',
  gramm: 'g',
  kg: 'kg',
  ml: 'ml',
  l: 'l',
  liter: 'l',
  el: 'EL',
  'el.': 'EL',
  esslöffel: 'EL',
  tl: 'TL',
  'tl.': 'TL',
  teelöffel: 'TL',
  prise: 'Prise',
  prisen: 'Prise',
  bund: 'Bund',
  zehe: 'Zehe',
  zehen: 'Zehe',
  scheibe: 'Scheibe',
  scheiben: 'Scheibe',
  dose: 'Dose',
  dosen: 'Dose',
  packung: 'Packung',
  packungen: 'Packung',
  becher: 'Becher',
  glas: 'Glas',
  gläser: 'Glas',
  blatt: 'Blatt',
  blätter: 'Blatt',
  stange: 'Stange',
  stangen: 'Stange',
  stk: 'Stk.',
  'stk.': 'Stk.',
  stück: 'Stk.',
};

const STEP_NUMBER_PREFIX = /^(?:schritt\s*)?\d+[.):]\s*/i;
const STEP_TIMER = /(\d{1,3})\s*min(?:uten)?\b/i;

export function parseRecipeText(rawText: string): ParsedRecipe {
  const lines = rawText.split(/\r?\n/).map((line) => line.trim());
  const nonEmptyLines = lines.filter((line) => line.length > 0);
  const nextId = createIdGenerator();

  const name = guessName(nonEmptyLines);
  const metadataText = metadataZone(lines);

  const ingredientLines = sliceSection(lines, INGREDIENT_HEADING);
  const stepLines = sliceSection(lines, STEP_HEADING);
  const nutritionLines = sliceSection(lines, NUTRITION_HEADING);
  const nutritionText = nutritionLines.length > 0 ? nutritionLines.join('\n') : rawText;

  const ingredients = ingredientLines
    .map((line) => parseIngredientLine(line, nextId()))
    .filter(isNotNull);

  const steps = stepLines
    .map((line) => parseStepLine(line, nextId()))
    .filter(isNotNull);

  return {
    name,
    description: guessDescription(nonEmptyLines, name),
    prepMinutes: firstMatchNumber(metadataText, PREP_MINUTES_PATTERN),
    servings: firstMatchNumber(metadataText, SERVINGS_PATTERN),
    tags: findTags(metadataText),
    ingredients,
    steps,
    nutrition: parseNutrition(nutritionText),
  };
}

function metadataZone(lines: string[]): string {
  const headingIndex = lines.findIndex((line) => ANY_HEADING.some((heading) => heading.test(line)));
  const zoneLines = headingIndex === -1 ? lines : lines.slice(0, headingIndex);
  return zoneLines.join('\n');
}

function sliceSection(lines: string[], heading: RegExp): string[] {
  const startIndex = lines.findIndex((line) => heading.test(line));
  if (startIndex === -1) {
    return [];
  }
  const sectionLines: string[] = [];
  for (let i = startIndex + 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line) {
      continue;
    }
    if (ANY_HEADING.some((otherHeading) => otherHeading.test(line))) {
      break;
    }
    sectionLines.push(line);
  }
  return sectionLines;
}

function guessName(lines: string[]): string | null {
  for (const line of lines) {
    if (ANY_HEADING.some((heading) => heading.test(line))) {
      continue;
    }
    if (line.length > 3 && line.length <= 80) {
      return line;
    }
  }
  return null;
}

function guessDescription(lines: string[], nameLine: string | null): string | null {
  let started = nameLine === null;
  for (const line of lines) {
    if (!started) {
      if (line === nameLine) {
        started = true;
      }
      continue;
    }
    if (ANY_HEADING.some((heading) => heading.test(line))) {
      break;
    }
    if (line.length >= 20 && line.includes(' ')) {
      return line;
    }
  }
  return null;
}

function findTags(text: string): string[] {
  const lower = text.toLowerCase();
  return TAG_KEYWORDS.filter((tag) => lower.includes(tag));
}

function firstMatchNumber(text: string, pattern: RegExp): number | null {
  const match = pattern.exec(text);
  if (!match) {
    return null;
  }
  const value = Number(match[1].replace(',', '.'));
  return Number.isFinite(value) ? value : null;
}

function parseQuantityToken(token: string): number | null {
  if (token.includes('/')) {
    const [numerator, denominator] = token.split('/').map(Number);
    if (!denominator) {
      return null;
    }
    return numerator / denominator;
  }
  const value = Number(token.replace(',', '.'));
  return Number.isFinite(value) ? value : null;
}

function parseIngredientLine(rawLine: string, id: number): ParsedIngredient | null {
  const line = rawLine.replace(/^[-•*]\s*/, '').trim();
  if (!line || line.endsWith(':')) {
    return null;
  }

  let rest = line;
  let quantity: number | null = null;
  const quantityMatch = LEADING_QUANTITY.exec(rest);
  if (quantityMatch) {
    quantity = parseQuantityToken(quantityMatch[1]);
    rest = rest.slice(quantityMatch[0].length);
  }

  let unit = 'Stk.';
  const wordMatch = LEADING_WORD.exec(rest);
  if (wordMatch) {
    const looked = UNIT_LOOKUP[wordMatch[1].toLowerCase()];
    if (looked) {
      unit = looked;
      rest = rest.slice(wordMatch[0].length);
    }
  }

  const name = rest.trim().replace(/,+$/, '');
  if (!name) {
    return null;
  }

  return { id, name, quantity, unit };
}

function parseStepLine(rawLine: string, id: number): ParsedStep | null {
  const withoutBullet = rawLine.replace(/^[-•*]\s*/, '');
  const text = withoutBullet.replace(STEP_NUMBER_PREFIX, '').trim();
  if (!text) {
    return null;
  }
  const timerMatch = STEP_TIMER.exec(text);
  const timerSeconds = timerMatch ? Number(timerMatch[1]) * 60 : null;
  return { id, text, timerSeconds };
}

function extractGrams(text: string, labelPattern: string): number | null {
  const regex = new RegExp(`${labelPattern}[^\\d]{0,15}(\\d+(?:[.,]\\d+)?)`, 'i');
  const match = regex.exec(text);
  if (!match) {
    return null;
  }
  const value = Number(match[1].replace(',', '.'));
  return Number.isFinite(value) ? value : null;
}

function parseNutrition(text: string): ParsedNutrition {
  return {
    carbsGrams: extractGrams(text, 'kohlenhydrate'),
    fatGrams: extractGrams(text, 'fett'),
    vitaminAMcg: extractGrams(text, 'vitamin\\s*a'),
    vitaminCMg: extractGrams(text, 'vitamin\\s*c'),
    vitaminDMcg: extractGrams(text, 'vitamin\\s*d'),
    vitaminKMcg: extractGrams(text, 'vitamin\\s*k'),
    vitaminB12Mcg: extractGrams(text, 'vitamin\\s*b\\s*12|b12'),
    folateMcg: extractGrams(text, 'folsäure|folat'),
  };
}

function createIdGenerator(): () => number {
  let next = 1;
  return () => next++;
}

function isNotNull<T>(value: T | null): value is T {
  return value !== null;
}
