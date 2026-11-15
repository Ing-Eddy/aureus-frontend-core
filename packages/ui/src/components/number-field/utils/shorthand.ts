import type { NumberSymbols } from "./number-locale";
import { parseNumber } from "./parse-number";

const EXPONENTS = { k: 3, m: 6, b: 9 } as const;

/** Whether `text` ends with a shorthand suffix (k, m, b). */
export function hasShorthand(text: string): boolean {
  return /\d\s*[kmb]\s*$/i.test(text);
}

/**
 * "1.5k" → 1500, "2m" → 2 000 000, "1b" → 1 000 000 000 (case-insensitive, any locale
 * separators). Shifts the decimal point in the string form, so `1.1k` is exactly 1100.
 * Returns `undefined` when `text` is not a shorthand number.
 */
export function applyShorthand(text: string, symbols: NumberSymbols): number | undefined {
  const match = text.trim().match(/^(.*\d)\s*([kmb])$/i);
  if (!match) return undefined;
  const base = parseNumber(match[1] ?? "", symbols);
  if (base === null || base === undefined) return undefined;
  const exponent = EXPONENTS[(match[2] ?? "k").toLowerCase() as keyof typeof EXPONENTS];
  const result = Number(`${base}e${exponent}`);
  return Number.isFinite(result) ? result : undefined;
}
