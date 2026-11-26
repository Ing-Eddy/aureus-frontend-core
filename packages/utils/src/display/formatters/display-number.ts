import { isNil, numberFormat, resolveLocale, warnOnce } from "@/internal/utils/helpers";
import type { DisplayConfig, NumberOptions } from "../types";
import { emptyText, integerOption, warnType } from "../utils/helpers";

/**
 * `Display.number`: a finite number in the locale's digits. Anything else, or options `Intl`
 * rejects (such as an unknown currency code or locale tag), gives the `empty` text with a
 * development warning.
 */
export function displayNumber(
  value: unknown,
  options: NumberOptions | undefined,
  config: DisplayConfig,
): string {
  const empty = emptyText(options, config);
  if (isNil(value)) return empty;
  if (typeof value !== "number") {
    warnType("number", "a number", value);
    return empty;
  }
  if (!Number.isFinite(value)) {
    warnOnce(
      `display:number:${value}`,
      `display: number() cannot show ${value}; the empty text is shown.`,
    );
    return empty;
  }

  const decimals = integerOption("number", "decimals", options?.decimals, 0, 20);
  const formatOptions: Intl.NumberFormatOptions = {
    // Explicit fraction digits: neutral by default, and a currency never imposes its own.
    minimumFractionDigits: options?.padDecimals && decimals !== undefined ? decimals : 0,
    maximumFractionDigits: decimals ?? 20,
    // "always": `true` would follow CLDR's minimum grouping digits (es-ES leaves 1234 ungrouped).
    useGrouping: options?.grouping ? "always" : false,
    // No sign for -0 or for values that round to zero.
    signDisplay: "negative",
  };
  if (options?.currency !== undefined) {
    formatOptions.style = "currency";
    formatOptions.currency = options.currency;
  }

  let formatter: Intl.NumberFormat;
  try {
    formatter = numberFormat(resolveLocale(options?.locale ?? config.locale), formatOptions);
  } catch (error) {
    warnOnce(
      `display:number:options:${options?.currency}`,
      `display: number() cannot format with these options (${(error as Error).message}); the empty text is shown.`,
    );
    return empty;
  }

  if (
    options?.negativeFormat === "parentheses" &&
    formatter.formatToParts(value).some((part) => part.type === "minusSign")
  ) {
    return `(${formatter.format(Math.abs(value))})`;
  }
  return formatter.format(value);
}
