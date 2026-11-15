import type { NumberSymbols } from "./number-locale";

/** Characters that survive formatting: digits, the decimal separator, the minus sign. */
function isSignificant(char: string, symbols: NumberSymbols) {
  return /\d/.test(char) || char === symbols.decimal || char === "-";
}

/** How many significant characters are left of `caret` in `text`. */
export function countSignificant(text: string, caret: number, symbols: NumberSymbols): number {
  let count = 0;
  for (let index = 0; index < Math.min(caret, text.length); index++) {
    if (isSignificant(text.charAt(index), symbols)) count++;
  }
  return count;
}

/** The caret index right after the `count`-th significant character of `formatted`. */
export function caretFromCount(formatted: string, count: number, symbols: NumberSymbols): number {
  if (count <= 0) return 0;
  let seen = 0;
  for (let index = 0; index < formatted.length; index++) {
    if (isSignificant(formatted.charAt(index), symbols)) seen++;
    if (seen === count) return index + 1;
  }
  return formatted.length;
}
