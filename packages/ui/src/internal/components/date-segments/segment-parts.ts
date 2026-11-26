import type { TimeGranularity } from "@/internal/utils/helpers";

/** One editable part of a date or time. */
export type SegmentType = "year" | "month" | "day" | "hour" | "minute" | "second" | "dayPeriod";

/** A segment or the literal text between two segments, in the locale's order. */
export type SegmentLayoutItem =
  | {
      /** An editable segment, or text between segments. */
      kind: "segment";
      /** Which part of the value the segment edits. */
      type: SegmentType;
    }
  | {
      kind: "literal";
      /** The separator, as the locale writes it. */
      text: string;
    };

/** Which segments `segmentLayout` returns. */
export interface SegmentLayoutOptions {
  /** Day, month and year segments. */
  date: boolean;
  /** Hour and minute segments (and second, and the day period with a 12-hour cycle). */
  time: boolean;
  /** 12 adds the day period segment. */
  hourCycle: 12 | 24;
  /** `"second"` adds the seconds segment. */
  granularity: TimeGranularity;
}

/** The `Intl` part types that become segments. */
const SEGMENT_TYPES = new Set<string>([
  "year",
  "month",
  "day",
  "hour",
  "minute",
  "second",
  "dayPeriod",
]);
/** Direction marks: the row is laid out left to right, so they are dropped. */
const BIDI_MARKS = /[‎‏؜]/g;
/** Every format here is Gregorian, whatever the locale's default calendar. */
const GREGORIAN = { calendar: "gregory" } as const;
/** A reference date whose parts are all two digits and distinct. */
const REFERENCE = new Date(2026, 10, 23, 14, 35, 45);

/** Layouts, digits and names by locale: they never change while the page is open. */
const cache = new Map<string, unknown>();
/** The cached result for `key`, created on first use. */
function cached<T>(key: string, create: () => T): T {
  if (!cache.has(key)) cache.set(key, create());
  return cache.get(key) as T;
}

/** The locale's segments and separators, in order. */
export function segmentLayout(
  locale: string | undefined,
  options: SegmentLayoutOptions,
): SegmentLayoutItem[] {
  return cached(`layout|${locale}|${JSON.stringify(options)}`, () => {
    const format = new Intl.DateTimeFormat(locale, {
      ...GREGORIAN,
      ...(options.date ? { year: "numeric", month: "2-digit", day: "2-digit" } : {}),
      ...(options.time
        ? {
            hour: "2-digit",
            minute: "2-digit",
            ...(options.granularity === "second" ? { second: "2-digit" } : {}),
            hourCycle: options.hourCycle === 12 ? "h12" : "h23",
          }
        : {}),
    });
    const items: SegmentLayoutItem[] = [];
    for (const part of format.formatToParts(REFERENCE)) {
      if (SEGMENT_TYPES.has(part.type)) {
        items.push({ kind: "segment", type: part.type as SegmentType });
        continue;
      }
      const text = part.value.replace(BIDI_MARKS, "");
      if (!text) continue;
      const last = items.at(-1);
      if (last?.kind === "literal") last.text += text;
      else items.push({ kind: "literal", text });
    }
    // Whitespace at either end is not a separator.
    while (items[0]?.kind === "literal" && !items[0].text.trim()) items.shift();
    while (items.at(-1)?.kind === "literal" && !(items.at(-1) as { text: string }).text.trim()) {
      items.pop();
    }
    return items;
  });
}

/** The segment types of a layout, in order. */
export function segmentTypes(layout: readonly SegmentLayoutItem[]): SegmentType[] {
  return layout.flatMap((item) => (item.kind === "segment" ? [item.type] : []));
}

/** The locale's hour cycle, or `hourCycle` when given. */
export function resolveHourCycle(locale: string | undefined, hourCycle?: 12 | 24): 12 | 24 {
  if (hourCycle) return hourCycle;
  const cycle = new Intl.DateTimeFormat(locale, { hour: "numeric" }).resolvedOptions().hourCycle;
  return cycle === "h11" || cycle === "h12" ? 12 : 24;
}

/** Formats numbers with the locale's digits, and reads ASCII or locale digits back. */
export interface LocaleDigits {
  /** A number in the locale's digits, padded to `minimumIntegerDigits`, without grouping. */
  format: (value: number, minimumIntegerDigits?: number) => string;
  /** The digit 0–9 a typed character stands for, or `null`. */
  parse: (character: string) => number | null;
}

/** The cached `LocaleDigits` of a locale. */
export function localeDigits(locale: string | undefined): LocaleDigits {
  return cached(`digits|${locale}`, () => {
    const formats = new Map<number, Intl.NumberFormat>();
    const formatter = (minimumIntegerDigits: number) => {
      let format = formats.get(minimumIntegerDigits);
      if (!format) {
        format = new Intl.NumberFormat(locale, { useGrouping: false, minimumIntegerDigits });
        formats.set(minimumIntegerDigits, format);
      }
      return format;
    };
    const digits = Array.from({ length: 10 }, (_, digit) => formatter(1).format(digit));
    return {
      format: (value, minimumIntegerDigits = 1) => formatter(minimumIntegerDigits).format(value),
      parse: (character) => {
        if (/^[0-9]$/.test(character)) return Number(character);
        const index = digits.indexOf(character);
        return index < 0 ? null : index;
      },
    };
  });
}

/** Segment names from the browser's locale data ("día", "mes", "año"…). */
export function segmentNames(locale: string | undefined): Partial<Record<SegmentType, string>> {
  return cached(`names|${locale}`, () => {
    const names: Partial<Record<SegmentType, string>> = {};
    if (typeof Intl.DisplayNames !== "function") return names;
    try {
      const display = new Intl.DisplayNames(locale, { type: "dateTimeField" });
      for (const type of SEGMENT_TYPES) {
        const name = display.of(type);
        if (name) names[type as SegmentType] = name;
      }
    } catch {
      // Older engines without `dateTimeField`: the segments have no names (a dev warning says so).
    }
    return names;
  });
}

/** The 12 long month names of the locale, January first. */
export function monthNames(locale: string | undefined): string[] {
  return cached(`months|${locale}`, () => {
    const format = new Intl.DateTimeFormat(locale, { ...GREGORIAN, month: "long" });
    return Array.from({ length: 12 }, (_, month) => format.format(new Date(2026, month, 1)));
  });
}

/** The locale's texts for the morning and afternoon day periods. */
export function dayPeriodTexts(locale: string | undefined): [am: string, pm: string] {
  return cached(`periods|${locale}`, () => {
    const format = new Intl.DateTimeFormat(locale, { hour: "numeric", hourCycle: "h12" });
    const period = (hour: number) =>
      format.formatToParts(new Date(2026, 0, 1, hour)).find((part) => part.type === "dayPeriod")
        ?.value ?? "";
    return [period(1), period(13)];
  });
}
