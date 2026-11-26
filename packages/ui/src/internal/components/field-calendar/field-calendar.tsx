import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { type ComponentProps, useMemo } from "react";
import type { DateRange, Matcher } from "react-day-picker";
import {
  clampIso,
  compareIso,
  fromLocalDate,
  isoDatePart,
  todayIso,
  toLocalDate,
} from "@/internal/utils/helpers";
import { cn } from "@/shadcn/lib/utils";
import { Calendar, CalendarDayButton } from "@/shadcn/ui/calendar";
import { calendarTexts, localeWeekStart } from "./calendar-intl";

/** What the calendar shows as chosen. */
export type FieldCalendarSelection =
  | {
      /** One day, a range of days, or any number of days. */
      mode: "single";
      /** The chosen ISO date or dates, as `mode` says. */
      selected: string | null;
    }
  | {
      mode: "range";
      selected: {
        /** First day of the range. */
        from: string;
        /** Last day, or `null` while only the first is chosen. */
        to: string | null;
      } | null;
    }
  | { mode: "multiple"; selected: readonly string[] };

/** Props of `FieldCalendar`: what is chosen, the limits and the field's texts. */
export type FieldCalendarProps = FieldCalendarSelection & {
  /** Language of every text and number. Defaults to the browser's. */
  locale?: string;
  /** First day of the week; defaults to the locale's. */
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  /** Name of the previous-month button. */
  previousMonthLabel: string;
  /** Name of the next-month button. */
  nextMonthLabel: string;
  /** Earliest and latest choosable days (ISO dates; a date-and-time is cut to its date). */
  min?: string | null;
  /** Latest choosable day (a date-and-time is cut to its date). */
  max?: string | null;
  /** ISO dates that cannot be chosen. */
  disabledDates?: readonly string[];
  /** Returns `true` for a day that cannot be chosen. */
  isDateDisabled?: (date: string) => boolean;
  /** Extra days to disable, such as range ends that break its length. */
  isExtraDisabled?: (date: string) => boolean;
  /** Called with the ISO date of a chosen day (never a disabled one). */
  onDayClick: (date: string) => void;
  /** Called with the hovered day, or `null` when the pointer leaves the days. */
  onDayHover?: (date: string | null) => void;
  /** Days drawn as a hover preview (the band of a range being chosen). */
  isPreview?: (date: string) => boolean;
  /** Focuses the chosen day, today or the first enabled day on mount. */
  autoFocus?: boolean;
  /** Text direction of the calendar. */
  dir?: "ltr" | "rtl";
  /** Extra classes of the calendar. */
  className?: string;
};

/** The ISO date of a local `Date`. */
const iso = (date: Date) => fromLocalDate(date, "date");

/** shadcn's day button, marking today with `aria-current` instead of a word in its name. */
function TodayAwareDayButton(props: ComponentProps<typeof CalendarDayButton>) {
  return <CalendarDayButton {...props} aria-current={props.modifiers.today ? "date" : undefined} />;
}

/**
 * The parts of the calendar that can be replaced. shadcn's `Calendar` declares its `Root`, `Chevron` and `WeekNumber` inline, so every render of
 * the calendar gives them a new identity and remounts every day button: focus and hover are lost
 * on each pick. The same markup is passed here as stable components.
 */
type DayPickerComponents = NonNullable<ComponentProps<typeof Calendar>["components"]>;

/** shadcn's calendar root, with a stable identity. */
const StableRoot: DayPickerComponents["Root"] = ({ className, rootRef, ...rest }) => (
  <div data-slot="calendar" ref={rootRef} className={cn(className)} {...rest} />
);

/** shadcn's month arrows, with a stable identity. */
const StableChevron: DayPickerComponents["Chevron"] = ({ className, orientation, ...rest }) => {
  if (orientation === "left")
    return <ChevronLeftIcon className={cn("size-4", className)} {...rest} />;
  if (orientation === "right") {
    return <ChevronRightIcon className={cn("size-4", className)} {...rest} />;
  }
  return <ChevronDownIcon className={cn("size-4", className)} {...rest} />;
};

/** shadcn's week number cell, with a stable identity. */
const StableWeekNumber: DayPickerComponents["WeekNumber"] = ({ children, ...rest }) => (
  <td {...rest}>
    <div className="flex size-(--cell-size) items-center justify-center text-center">
      {children}
    </div>
  </td>
);

/** The replaced parts, created once. */
const calendarComponents: DayPickerComponents = {
  Root: StableRoot,
  Chevron: StableChevron,
  WeekNumber: StableWeekNumber,
  DayButton: TodayAwareDayButton,
};

/** The month the calendar opens at: the first chosen day, otherwise today moved into the limits. */
export function openingMonth(
  first: string | null | undefined,
  min?: string | null,
  max?: string | null,
): Date {
  const day =
    first ?? clampIso(todayIso(), min ? isoDatePart(min) : null, max ? isoDatePart(max) : null);
  const date = toLocalDate(day) ?? new Date();
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

/** The first chosen day, which the calendar opens at. */
function firstSelected(selection: FieldCalendarSelection): string | null {
  if (selection.mode === "single") return selection.selected;
  if (selection.mode === "range") return selection.selected?.from ?? null;
  return selection.selected[0] ?? null;
}

/**
 * shadcn's `Calendar` speaking the field's locale: every caption, weekday, day name and number
 * comes from `Intl`, and the two month buttons are named by the field's texts. It never shows or
 * announces English defaults. The selection is driven by the field through `onDayClick`.
 */
export function FieldCalendar(props: FieldCalendarProps) {
  const {
    locale,
    weekStartsOn,
    previousMonthLabel,
    nextMonthLabel,
    min,
    max,
    disabledDates,
    isDateDisabled,
    isExtraDisabled,
    onDayClick,
    onDayHover,
    isPreview,
    autoFocus,
    dir,
    className,
  } = props;
  const texts = useMemo(
    () => calendarTexts(locale, previousMonthLabel, nextMonthLabel),
    [locale, previousMonthLabel, nextMonthLabel],
  );
  const minDay = min ? isoDatePart(min) : null;
  const maxDay = max ? isoDatePart(max) : null;
  const blocked = useMemo(() => new Set(disabledDates ?? []), [disabledDates]);

  const disabled: Matcher = (date: Date) => {
    const day = iso(date);
    if (minDay && compareIso(day, minDay) < 0) return true;
    if (maxDay && compareIso(day, maxDay) > 0) return true;
    return blocked.has(day) || Boolean(isDateDisabled?.(day)) || Boolean(isExtraDisabled?.(day));
  };

  const defaultMonth = openingMonth(firstSelected(props), min, max);
  const startMonth = minDay ? openingMonth(minDay) : undefined;
  const endMonth = maxDay ? openingMonth(maxDay) : undefined;

  const shared = {
    locale: undefined,
    weekStartsOn: weekStartsOn ?? localeWeekStart(locale),
    formatters: texts.formatters,
    labels: texts.labels,
    defaultMonth,
    startMonth,
    endMonth,
    disabled,
    autoFocus,
    dir,
    modifiers: isPreview ? { preview: (date: Date) => isPreview(iso(date)) } : undefined,
    modifiersClassNames: { preview: "[&>button]:bg-muted [&>button]:text-foreground" },
    onDayClick: (date: Date) => onDayClick(iso(date)),
    onDayMouseEnter: onDayHover ? (date: Date) => onDayHover(iso(date)) : undefined,
    onDayMouseLeave: onDayHover ? () => onDayHover(null) : undefined,
    // Transparent on the popover (shadcn keys this on its own popover slot, which the field renames).
    className: cn("bg-transparent p-0", className),
    components: calendarComponents,
  };

  // The field decides what is chosen; day-picker's own selection is ignored (`onSelect` is a no-op).
  const ignore = () => {};
  if (props.mode === "single") {
    const selected = props.selected ? (toLocalDate(props.selected) ?? undefined) : undefined;
    return <Calendar {...shared} mode="single" selected={selected} onSelect={ignore} />;
  }
  if (props.mode === "range") {
    const range: DateRange | undefined = props.selected
      ? {
          from: toLocalDate(props.selected.from) ?? undefined,
          to: props.selected.to ? (toLocalDate(props.selected.to) ?? undefined) : undefined,
        }
      : undefined;
    return <Calendar {...shared} mode="range" selected={range} onSelect={ignore} />;
  }
  const days = props.selected.flatMap((day) => {
    const date = toLocalDate(day);
    return date ? [date] : [];
  });
  return <Calendar {...shared} mode="multiple" selected={days} onSelect={ignore} />;
}
