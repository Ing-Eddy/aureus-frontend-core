import type {
  CalendarFormatName,
  DateInput,
  DateTimeFormatName,
  LocaleInput,
  TimeFormatName,
} from "@/date-formats";

/** Configuration of `createDisplay`, shared by all its functions. */
export interface DisplayConfig {
  /** The text shown for a missing (`null` / `undefined`) or unshowable value. Required. */
  empty: string;
  /** Tags or a getter evaluated on every call. Omitted → the runtime's default locale. */
  locale?: LocaleInput;
  /** IANA time zone for instants (`Date`, timestamps, ISO with a zone). Omitted → the runtime's. */
  timeZone?: string;
}

/** Lets one call replace the display's `empty` text. */
interface EmptyOption {
  /** Overrides the display's `empty` text for this call. */
  empty?: string;
}

/** Lets one call replace the display's locale. */
interface LocaleOption {
  /** Overrides the display's locale for this call. */
  locale?: LocaleInput;
}

/** Options of `Display.text`. */
export interface TextOptions extends EmptyOption {
  /** Maximum user-perceived characters (grapheme clusters). A positive integer. */
  maxLength?: number;
  /** Appended only when `maxLength` cuts the text; counts toward `maxLength`. */
  ellipsis?: string;
  /** Shows the `empty` text for a value that is blank after trimming. Default `false`. */
  blankAsEmpty?: boolean;
}

/** Options of `Display.number`. Each option is independent and opt-in. */
export interface NumberOptions extends EmptyOption, LocaleOption {
  /** Maximum decimals (0–20); rounds half away from zero. Default: every decimal the number has. */
  decimals?: number;
  /** Pads with zeros up to `decimals`. No effect without `decimals`. */
  padDecimals?: boolean;
  /** Inserts the locale's grouping separator, also in four-digit numbers. Default `false`. */
  grouping?: boolean;
  /** ISO 4217 code: adds the currency symbol only; never changes the decimals. */
  currency?: string;
  /** `"minus"` (default) or `"parentheses"`: `(1234,5 €)`. */
  negativeFormat?: "minus" | "parentheses";
}

/** Options of `Display.boolean`. Both labels are required: the library ships no text. */
export interface BooleanOptions extends EmptyOption {
  /** Text for `true`. Required. */
  true: string;
  /** Text for `false`. Required. */
  false: string;
}

/**
 * Options of `date`, `time` and `dateTime`. `Name` limits `format` to the names that fit the
 * function.
 */
export interface DateDisplayOptions<Name extends string> extends EmptyOption, LocaleOption {
  /**
   * A name of the date-formats catalog. Defaults to `short` in `date`, `time` in `time` and
   * `shortDateTime` in `dateTime`.
   */
  format?: Name;
  /** Overrides the display's time zone for this call (instants only). */
  timeZone?: string;
}

/** The options of `list` that do not depend on `maxItems`. */
interface ListBaseOptions extends EmptyOption, LocaleOption {
  /** `"conjunction"` (a, b y c; default), `"disjunction"` (a, b o c) or `"unit"`. */
  type?: Intl.ListFormatType;
  /** `"long"` (default), `"short"` or `"narrow"`. */
  style?: Intl.ListFormatStyle;
}

/** Options of `Display.list`. `more` is required whenever `maxItems` is given. */
export type ListOptions = ListBaseOptions &
  (
    | { maxItems?: undefined; more?: undefined }
    | {
        /** Shows only the first `maxItems` items (a positive integer), then `more(hidden)`. */
        maxItems: number;
        /** The last item when some are hidden, e.g. `(n) => t("common.more", { count: n })`. */
        more: (hidden: number) => string;
      }
  );

/** One item of `Display.list`. Missing and blank items are skipped. */
export type ListItem = string | null | undefined;

/**
 * The functions returned by `createDisplay`. Each returns a string; `null` and `undefined` give the
 * `empty` text, and so does a value of the wrong type, with a development warning. An invalid
 * locale tag or time zone makes `date`, `time`, `dateTime` and `list` throw a `RangeError`.
 */
export interface Display {
  /** Trimmed text, optionally cut to `maxLength` graphemes. */
  text(value: string | null | undefined, options?: TextOptions): string;
  /** A finite number in the locale's digits; neutral by default (no grouping, no rounding). */
  number(value: number | null | undefined, options?: NumberOptions): string;
  /** One of the two required labels. */
  boolean(value: boolean | null | undefined, options: BooleanOptions): string;
  /** A calendar date. Default format `short`. */
  date(
    value: DateInput | null | undefined,
    options?: DateDisplayOptions<CalendarFormatName>,
  ): string;
  /** A time. Default format `time`. */
  time(value: DateInput | null | undefined, options?: DateDisplayOptions<TimeFormatName>): string;
  /** A date and a time. Default format `shortDateTime`. */
  dateTime(
    value: DateInput | null | undefined,
    options?: DateDisplayOptions<DateTimeFormatName>,
  ): string;
  /** The items joined with the locale's list conventions; blank and missing items are skipped. */
  list(values: readonly ListItem[] | null | undefined, options?: ListOptions): string;
}
