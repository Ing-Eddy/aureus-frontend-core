/** Separator symbols of a locale, as `Intl.NumberFormat` renders them. */
export interface NumberSymbols {
  /** Thousands separator, e.g. "," in en-US, "." in es-ES, " " in fr-FR. */
  group: string;
  /** Decimal separator, e.g. "." in en-US, "," in es-ES. */
  decimal: string;
}

/** Separators by locale. */
const symbolsCache = new Map<string, NumberSymbols>();
/** Currency symbols by locale, currency and display. */
const currencyCache = new Map<string, string>();

/** The browser's locale, as `Intl` resolves it when none is asked for. */
export function browserLocale(): string {
  return new Intl.NumberFormat().resolvedOptions().locale;
}

/**
 * Group and decimal separators of `locale` (memoised), as written with Latin digits: the field
 * shows and reads `0`–`9`, so a locale with its own digits (`ar-EG`) uses the separators that go
 * with Latin ones.
 */
export function getNumberSymbols(locale: string): NumberSymbols {
  const cached = symbolsCache.get(locale);
  if (cached) return cached;
  const latin = new Intl.Locale(locale, { numberingSystem: "latn" });
  const parts = new Intl.NumberFormat(latin.toString(), { useGrouping: true }).formatToParts(
    12345.6,
  );
  const symbols = {
    group: parts.find((part) => part.type === "group")?.value ?? ",",
    decimal: parts.find((part) => part.type === "decimal")?.value ?? ".",
  };
  symbolsCache.set(locale, symbols);
  return symbols;
}

/** How a currency is shown, as in `Intl.NumberFormat`. */
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
