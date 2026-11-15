/** Separator symbols of a locale, as `Intl.NumberFormat` renders them. */
export interface NumberSymbols {
  /** Thousands separator, e.g. "," in en-US, "." in es-ES, " " in fr-FR. */
  group: string;
  /** Decimal separator, e.g. "." in en-US, "," in es-ES. */
  decimal: string;
}

const symbolsCache = new Map<string, NumberSymbols>();
const currencyCache = new Map<string, string>();

/** Group and decimal separators of `locale` (memoised). */
export function getNumberSymbols(locale: string): NumberSymbols {
  const cached = symbolsCache.get(locale);
  if (cached) return cached;
  const parts = new Intl.NumberFormat(locale, { useGrouping: true }).formatToParts(12345.6);
  const symbols = {
    group: parts.find((part) => part.type === "group")?.value ?? ",",
    decimal: parts.find((part) => part.type === "decimal")?.value ?? ".",
  };
  symbolsCache.set(locale, symbols);
  return symbols;
}

export type CurrencyDisplay = "symbol" | "narrowSymbol" | "code";

/** The symbol (or code) of `currency` as `locale` displays it (memoised). */
export function getCurrencySymbol(
  locale: string,
  currency: string,
  display: CurrencyDisplay = "symbol",
): string {
  const key = `${locale}|${currency}|${display}`;
  const cached = currencyCache.get(key);
  if (cached !== undefined) return cached;
  const symbol =
    new Intl.NumberFormat(locale, { style: "currency", currency, currencyDisplay: display })
      .formatToParts(1)
      .find((part) => part.type === "currency")?.value ?? currency;
  currencyCache.set(key, symbol);
  return symbol;
}
