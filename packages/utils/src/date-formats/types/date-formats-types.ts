import type { LocaleInput } from "@/internal/types";
import type { dateFormatCatalog } from "../utils/constants/date-format-catalog";

/** What a format shows: calendar parts, clock parts, or both. */
export type FormatNeeds = "date" | "time" | "both";

/** How one catalog name is written. Internal: consumers pick names, never definitions. */
export interface DateFormatDefinition {
  /** The parts the format shows. A value that lacks one of them is rejected. */
  needs: FormatNeeds;
  /** The locale's conventional form, used for every language without an exact form. */
  intl: Intl.DateTimeFormatOptions;
  /** Exact forms by language tag (`"es"`, `"es-MX"`), written with the internal pattern tokens. */
  patterns?: Readonly<Record<string, string>>;
}

/** The catalog's own type, from which the name unions are derived. */
type Catalog = typeof dateFormatCatalog;
/** The catalog names whose `needs` is `N`. */
type NamesWith<N extends FormatNeeds> = {
  [K in keyof Catalog]: Catalog[K]["needs"] extends N ? K : never;
}[keyof Catalog];

/** Every name in the catalog. */
export type DateFormatName = keyof Catalog;
/** Names that show a calendar date only: `short` … `year`. */
export type CalendarFormatName = NamesWith<"date">;
/** Names that show a time only: `time`, `timeWithSeconds`. */
export type TimeFormatName = NamesWith<"time">;
/** Names that show a date and a time: `shortDateTime`, `mediumDateTime`, `longDateTime`. */
export type DateTimeFormatName = NamesWith<"both">;

/**
 * A value `format` can read: a `Date`, milliseconds since the epoch, or an ISO string. Local ISO
 * strings (`YYYY-MM-DD`, `HH:mm[:ss]`, `YYYY-MM-DDTHH:mm[:ss]`) are wall times and are shown as
 * written; a `Date`, a timestamp, or an ISO string with `Z` / `±HH:mm` is an instant.
 */
export type DateInput = Date | number | string;

/** Configuration of `createDateFormatter`. Both settings are optional. */
export interface DateFormatterConfig {
  /** Tags or a getter evaluated on every call. Omitted → the runtime's default locale. */
  locale?: LocaleInput;
  /** IANA time zone for instants. Omitted → the runtime's time zone. */
  timeZone?: string;
}

/** Per-call overrides of the formatter's config. */
export type DateFormatOverrides = DateFormatterConfig;

/** Formats dates and times with the names of the library's catalog. */
export interface DateFormatter {
  /**
   * The value written with a catalog format, or `null` when the value is `null`/`undefined`, is
   * not a readable date, or does not fit the format (a date format on a time-only value, or the
   * reverse). The last two log a development warning.
   */
  format(
    value: DateInput | null | undefined,
    name: DateFormatName,
    overrides?: DateFormatOverrides,
  ): string | null;
}
