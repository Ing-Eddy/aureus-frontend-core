import type { NumberSymbols } from "./number-locale";

export interface ParseOptions {
  allowNegative?: boolean;
}

const MINUS = /[-−]/;
/** Characters that never carry meaning in a number: currency symbols, letters, spaces… */
const NOISE = /[^\d.,\-−()]/g;

/**
 * Parses typed or pasted text into a number, per `symbols`:
 * - group separators, spaces, currency symbols and codes are ignored;
 * - accounting parentheses and a leading or trailing minus make it negative;
 * - when both "," and "." appear, the last one is the decimal separator ("1.234,50 €" works in
 *   any locale); when only one kind appears, the locale decides.
 *
 * Returns `null` for empty text and `undefined` for text that is not a number.
 */
export function parseNumber(
  text: string,
  symbols: NumberSymbols,
  { allowNegative = true }: ParseOptions = {},
): number | null | undefined {
  let rest = text.trim();
  if (rest === "") return null;

  let negative = false;
  if (/^\(.*\)$/.test(rest.replace(NOISE, ""))) {
    negative = true;
  }
  if (MINUS.test(rest)) negative = !negative;

  // Keep digits and the two candidate separators; the locale's own symbols map onto them.
  rest = rest
    .split(symbols.group)
    .join(symbols.group === "." || symbols.group === "," ? symbols.group : "")
    .replace(NOISE, "")
    .replace(/[-−()]/g, "");
  if (symbols.decimal !== "." && symbols.decimal !== ",") {
    rest = rest.split(symbols.decimal).join(".");
  }

  const lastDot = rest.lastIndexOf(".");
  const lastComma = rest.lastIndexOf(",");
  let decimalChar: string | undefined;
  if (lastDot !== -1 && lastComma !== -1) {
    decimalChar = lastDot > lastComma ? "." : ",";
  } else if (lastDot !== -1 || lastComma !== -1) {
    const only = lastDot !== -1 ? "." : ",";
    const count = rest.split(only).length - 1;
    decimalChar = only === symbols.decimal && count === 1 ? only : undefined;
  }

  const groupChar = decimalChar === "." ? "," : decimalChar === "," ? "." : undefined;
  let normalized = rest;
  if (groupChar) normalized = normalized.split(groupChar).join("");
  if (decimalChar) normalized = normalized.replace(decimalChar, ".");
  else normalized = normalized.replace(/[.,]/g, "");

  if (!/^\d*\.?\d*$/.test(normalized) || !/\d/.test(normalized)) return undefined;
  const value = Number(normalized);
  if (!Number.isFinite(value)) return undefined;
  if (negative && !allowNegative) return undefined;
  return negative && value !== 0 ? -value : value;
}
