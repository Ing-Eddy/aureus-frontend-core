import { dateTimeFormat, isNil, resolveLocale, warnOnce } from "@/internal/utils/helpers";
import type {
  DateFormatDefinition,
  DateFormatName,
  DateFormatter,
  DateFormatterConfig,
} from "./types";
import { dateFormatCatalog } from "./utils/constants";
import { formatPattern, resolveDefinition, toDateValue } from "./utils/helpers";

const catalog: Readonly<Record<string, DateFormatDefinition>> = dateFormatCatalog;

/** Every name in the catalog, in catalog order. Frozen: the catalog is defined by the library. */
export const dateFormatNames: readonly DateFormatName[] = Object.freeze(
  Object.keys(dateFormatCatalog) as DateFormatName[],
);

function describe(value: unknown): string {
  if (value instanceof Date) return "an invalid Date";
  return typeof value === "string" ? JSON.stringify(value) : String(value);
}

/**
 * A formatter for the library's date-format catalog. `locale` may be a getter, evaluated on every
 * call; omitted `locale` / `timeZone` mean the runtime's.
 *
 * ```ts
 * const dates = createDateFormatter({ locale: () => i18n.resolvedLanguage });
 * dates.format("2026-11-21", "long"); // "21 de noviembre de 2026" · "November 21, 2026"
 * ```
 */
export function createDateFormatter(config: DateFormatterConfig = {}): DateFormatter {
  return {
    format(value, name, overrides) {
      if (isNil(value)) return null;

      let formatName: string = name;
      if (!Object.hasOwn(catalog, formatName)) {
        warnOnce(
          `date-formats:name:${formatName}`,
          `date-formats: unknown format "${formatName}"; "short" is used instead.`,
        );
        formatName = "short";
      }
      const definition = catalog[formatName] as DateFormatDefinition;

      const dateValue = toDateValue(value);
      if (!dateValue) {
        warnOnce(
          `date-formats:value:${describe(value)}`,
          `date-formats: ${describe(value)} is not a readable date.`,
        );
        return null;
      }

      const hasDate = dateValue.kind !== "time";
      const hasTime = dateValue.kind !== "date";
      const { needs } = definition;
      if ((needs !== "time" && !hasDate) || (needs !== "date" && !hasTime)) {
        warnOnce(
          `date-formats:fit:${formatName}:${describe(value)}`,
          `date-formats: format "${formatName}" needs a ${needs === "both" ? "date and a time" : needs}, but ${describe(value)} has only a ${hasDate ? "date" : "time"}.`,
        );
        return null;
      }

      const locale = resolveLocale(overrides?.locale ?? config.locale);
      const timeZone =
        dateValue.kind === "instant" ? (overrides?.timeZone ?? config.timeZone) : "UTC";
      const resolved = resolveDefinition(definition, locale);
      return resolved.kind === "pattern"
        ? formatPattern(dateValue.date, resolved.pattern, locale, timeZone)
        : dateTimeFormat(locale, { ...resolved.options, timeZone }).format(dateValue.date);
    },
  };
}
