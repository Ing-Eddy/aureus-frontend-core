import type { NumberSymbols } from "./number-locale";

/** How a number is written. */
export interface FormatOptions {
  /** The locale's separators. */
  symbols: NumberSymbols;
  /** Separates thousands. */
  grouping?: boolean;
  /** Fraction digits used by padding. */
  decimals?: number;
  /** Pads the fraction with zeros to `decimals`. */
  padDecimals?: boolean;
  /** Minus sign (default) or parentheses, when not editing. */
  negativeFormat?: "minus" | "parentheses";
}

/** Inserts `group` every three digits from the right of an integer string. */
export function groupDigits(integer: string, group: string): string {
  return integer.replace(/\B(?=(\d{3})+(?!\d))/g, group);
}

/** Plain decimal string of a non-negative number, without exponent notation. */
function plain(abs: number, decimals?: number, pad?: boolean): string {
  if (decimals !== undefined && pad) return abs.toFixed(decimals);
  const text = String(abs);
  if (!text.includes("e")) return text;
  return abs.toLocaleString("en-US", { useGrouping: false, maximumFractionDigits: 20 });
}

/** A non-negative number with the locale's separators. */
function compose(abs: number, options: FormatOptions): string {
  const { symbols, grouping, decimals, padDecimals } = options;
  const [integer = "0", fraction] = plain(abs, decimals, padDecimals).split(".");
  const head = grouping ? groupDigits(integer, symbols.group) : integer;
  return fraction ? `${head}${symbols.decimal}${fraction}` : head;
}

/** The text shown while the field is edited: minus sign, never parentheses. */
export function formatEditing(value: number | null, options: FormatOptions): string {
  if (value === null || !Number.isFinite(value)) return "";
  const body = compose(Math.abs(value), options);
  return value < 0 ? `-${body}` : body;
}

/** The text shown while the field is not focused: applies the negative format. */
export function formatDisplay(value: number | null, options: FormatOptions): string {
  if (value === null || !Number.isFinite(value)) return "";
  if (value < 0 && options.negativeFormat === "parentheses") {
    return `(${compose(Math.abs(value), options)})`;
  }
  return formatEditing(value, options);
}

/**
 * Live formatting of a sanitised draft (digits, at most one decimal separator, optional leading
 * minus): groups the integer part and keeps what the user is still typing ("1,234.", "-", "0.50").
 */
export function formatPartial(draft: string, options: FormatOptions): string {
  const { symbols, grouping } = options;
  const negative = draft.startsWith("-");
  const body = negative ? draft.slice(1) : draft;
  const separatorIndex = body.indexOf(symbols.decimal);
  const integer = separatorIndex === -1 ? body : body.slice(0, separatorIndex);
  const rest = separatorIndex === -1 ? "" : body.slice(separatorIndex);
  const head = grouping ? groupDigits(integer, symbols.group) : integer;
  return `${negative ? "-" : ""}${head}${rest}`;
}

/** What typed text may contain. */
export interface SanitizeOptions {
  /** The locale's separators. */
  symbols: NumberSymbols;
  /** Maximum fraction digits; 0 rejects the separator. */
  decimals?: number;
  /** Keeps a leading minus. Defaults to `true`. */
  allowNegative?: boolean;
  /** Keep `k`, `m`, `b` suffixes. */
  shorthand?: boolean;
}

/**
 * Cleans what the user typed into a draft: digits, the locale's decimal separator (once, and only
 * if decimals are allowed, with the fraction capped at `decimals`) and a leading minus when
 * allowed. Group separators are dropped (formatPartial adds them back).
 */
export function sanitize(text: string, options: SanitizeOptions): string {
  const { symbols, decimals, allowNegative = true, shorthand } = options;
  const trimmed = text.trim();
  const negative = allowNegative && /^[-−]/.test(trimmed);
  const suffix = shorthand ? (trimmed.match(/[kmb]$/i)?.[0] ?? "") : "";

  let integer = "";
  let fraction = "";
  let seenDecimal = false;
  for (const char of suffix ? trimmed.slice(0, -1) : trimmed) {
    if (/\d/.test(char)) {
      if (seenDecimal) fraction += char;
      else integer += char;
    } else if (char === symbols.decimal && !seenDecimal && decimals !== 0) {
      seenDecimal = true;
    }
  }
  if (decimals !== undefined) fraction = fraction.slice(0, decimals);
  const separator = seenDecimal ? symbols.decimal : "";
  return `${negative ? "-" : ""}${integer}${separator}${fraction}${suffix}`;
}
