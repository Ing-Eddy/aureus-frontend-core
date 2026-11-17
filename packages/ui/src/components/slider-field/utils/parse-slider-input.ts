/** The minus, group and decimal symbols of a locale, as `Intl.NumberFormat` writes them. */
function numberSymbols(locale: string | undefined) {
  const parts = new Intl.NumberFormat(locale).formatToParts(-12345.6);
  const find = (type: string, fallback: string) =>
    parts.find((part) => part.type === type)?.value ?? fallback;
  return {
    minus: find("minusSign", "-"),
    group: find("group", ","),
    decimal: find("decimal", "."),
  };
}

/**
 * Reads a number typed in a linked input, written for the locale ("1.234,5" in `es-ES`). Spaces
 * and group separators are ignored. Returns `undefined` for an empty or invalid text.
 */
export function parseSliderInput(text: string, locale: string | undefined): number | undefined {
  const { minus, group, decimal } = numberSymbols(locale);
  let clean = text.replace(/[\s  ]/g, "");
  if (group.trim()) clean = clean.split(group).join("");
  clean = clean.split(minus).join("-").replace(/−/g, "-").split(decimal).join(".");
  if (!/^-?(\d+\.?\d*|\.\d+)$/.test(clean)) return undefined;
  const value = Number(clean);
  return Number.isFinite(value) ? value : undefined;
}

/** The text of a value while it is edited: the locale's digits and decimal, no grouping. */
export function editingText(value: number, locale: string | undefined, decimals: number): string {
  return new Intl.NumberFormat(locale, {
    useGrouping: false,
    maximumFractionDigits: Math.min(decimals, 20),
  }).format(value);
}
