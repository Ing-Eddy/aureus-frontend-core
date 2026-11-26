import type { DayPickerProps } from "react-day-picker";

/** A day of the week, 0 for Sunday. */
type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/** What the calendar needs to speak the field's locale. */
export interface CalendarTexts {
  /** The visible texts. */
  formatters: NonNullable<DayPickerProps["formatters"]>;
  /** The accessible names. */
  labels: NonNullable<DayPickerProps["labels"]>;
}

/** The calendar every text uses, whatever the locale's default. */
const GREGORIAN = { calendar: "gregory" } as const;

/**
 * Every text the calendar shows or announces, from `Intl` with `locale` and the field's two month
 * button names. Day names carry the date only: today and the chosen days are conveyed by
 * `aria-current` and `aria-selected`, never by words.
 */
export function calendarTexts(
  locale: string | undefined,
  previousMonthLabel: string,
  nextMonthLabel: string,
): CalendarTexts {
  const caption = new Intl.DateTimeFormat(locale, { ...GREGORIAN, month: "long", year: "numeric" });
  const fullDate = new Intl.DateTimeFormat(locale, { ...GREGORIAN, dateStyle: "full" });
  const weekdayShort = new Intl.DateTimeFormat(locale, { ...GREGORIAN, weekday: "narrow" });
  const weekdayLong = new Intl.DateTimeFormat(locale, { ...GREGORIAN, weekday: "long" });
  const number = new Intl.NumberFormat(locale, { useGrouping: false });
  return {
    formatters: {
      formatCaption: (date) => caption.format(date),
      formatWeekdayName: (date) => weekdayShort.format(date),
      formatDay: (date) => number.format(date.getDate()),
      formatMonthDropdown: (date) =>
        new Intl.DateTimeFormat(locale, { ...GREGORIAN, month: "short" }).format(date),
      formatYearDropdown: (date) => number.format(date.getFullYear()),
      formatWeekNumber: (week) => number.format(week),
    },
    labels: {
      labelDayButton: (date) => fullDate.format(date),
      labelGridcell: (date) => fullDate.format(date),
      labelGrid: (date) => caption.format(date),
      labelWeekday: (date) => weekdayLong.format(date),
      labelPrevious: () => previousMonthLabel,
      labelNext: () => nextMonthLabel,
      labelNav: () => "",
    },
  };
}

/** The locale's first day of the week (0 is Sunday), or Sunday when the browser cannot tell. */
export function localeWeekStart(locale: string | undefined): Weekday {
  try {
    const resolved = new Intl.Locale(locale ?? new Intl.DateTimeFormat().resolvedOptions().locale);
    const info =
      (
        resolved as Intl.Locale & {
          getWeekInfo?: () => { firstDay: number };
          weekInfo?: { firstDay: number };
        }
      ).getWeekInfo?.() ?? (resolved as Intl.Locale & { weekInfo?: { firstDay: number } }).weekInfo;
    return info ? ((info.firstDay % 7) as Weekday) : 0;
  } catch {
    return 0;
  }
}
