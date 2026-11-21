import type { DateFormatName, DateFormatter } from "@/date-formats";
import type { DateDisplayOptions, DisplayConfig } from "../types";
import { emptyText } from "../utils/helpers";

/**
 * A date, a time or both through the date-formats catalog. The catalog already warns about an
 * unreadable value or one that does not fit the format; both give the `empty` text here.
 */
export function displayDateValue(
  value: unknown,
  options: DateDisplayOptions<DateFormatName> | undefined,
  config: DisplayConfig,
  dates: DateFormatter,
  defaultFormat: DateFormatName,
): string {
  const text = dates.format(
    value as Parameters<DateFormatter["format"]>[0],
    options?.format ?? defaultFormat,
    {
      locale: options?.locale,
      timeZone: options?.timeZone,
    },
  );
  return text ?? emptyText(options, config);
}
