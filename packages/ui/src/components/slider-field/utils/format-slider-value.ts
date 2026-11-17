/** How a slider turns its values into text. `formatValue` wins over `locale`/`formatOptions`. */
export interface SliderFormatSources {
  locale?: string;
  formatOptions?: Intl.NumberFormatOptions;
  formatValue?: (value: number) => string;
}

export interface SliderFormatter {
  /** One value, as shown and as announced (`aria-valuetext`). */
  format: (value: number) => string;
  /** Both values of a range, as one text ("20 € – 80 €"). */
  formatRange: (low: number, high: number) => string;
}

/** The separator used when the formatter cannot join a range itself. */
const RANGE_SEPARATOR = " – ";

/**
 * One formatter for every text the slider shows or announces. Without `formatValue` it is
 * `Intl.NumberFormat(locale, formatOptions)`, and a range uses its `formatRange` (or joins the two
 * values when the engine lacks it). Equal ends are joined too: `formatRange` would show them as an
 * approximation ("~5").
 */
export function createSliderFormatter({
  locale,
  formatOptions,
  formatValue,
}: SliderFormatSources): SliderFormatter {
  if (formatValue) {
    return {
      format: formatValue,
      formatRange: (low, high) => `${formatValue(low)}${RANGE_SEPARATOR}${formatValue(high)}`,
    };
  }
  const formatter = new Intl.NumberFormat(locale, formatOptions);
  const format = (value: number) => formatter.format(value);
  return {
    format,
    formatRange: (low, high) =>
      low !== high && typeof formatter.formatRange === "function"
        ? formatter.formatRange(low, high)
        : `${format(low)}${RANGE_SEPARATOR}${format(high)}`,
  };
}
