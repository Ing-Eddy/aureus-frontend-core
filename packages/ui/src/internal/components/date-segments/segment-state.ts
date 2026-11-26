import {
  clampIso,
  daysInMonth,
  formatIsoDate,
  formatIsoTime,
  type IsoMode,
  parseIsoDate,
  parseIsoDateTime,
  parseIsoTime,
  type TimeGranularity,
} from "@/internal/utils/helpers";
import type { SegmentType } from "./segment-parts";

/** The value of each segment, or `null` while it is empty. `dayPeriod` is 0 (AM) or 1 (PM). */
export type SegmentValues = Record<SegmentType, number | null>;

/** The segment values plus what is being typed in one segment. */
export interface SegmentState {
  /** The value of every segment. */
  values: SegmentValues;
  /** Digits typed so far in `bufferType`, cleared when the segment is complete or left. */
  buffer: string;
  /** The segment being typed in, or `null`. */
  bufferType: SegmentType | null;
}

/** What the pure segment transitions need to know about the field. */
export interface SegmentConfig {
  /** The segments shown, in order. */
  types: readonly SegmentType[];
  /** Whether the value is a date, a time or both. */
  mode: IsoMode;
  /** A 12 or 24-hour clock. */
  hourCycle: 12 | 24;
  /** Whether the value has seconds. */
  granularity: TimeGranularity;
  /** Arrow step of the minutes. */
  minuteStep: number;
  /** Arrow step of the seconds. */
  secondStep: number;
  /** Earliest ISO value. */
  min?: string | null;
  /** Latest ISO value. */
  max?: string | null;
}

/** Every segment empty. */
export const EMPTY_VALUES: SegmentValues = {
  year: null,
  month: null,
  day: null,
  hour: null,
  minute: null,
  second: null,
  dayPeriod: null,
};

/** A state showing `values`, with nothing being typed. */
export const emptyState = (values: SegmentValues = EMPTY_VALUES): SegmentState => ({
  values,
  buffer: "",
  bufferType: null,
});

/** The segment values of an ISO value of `mode`; empty when the value is missing or invalid. */
export function valuesFromIso(
  value: string | null | undefined,
  mode: IsoMode,
  hourCycle: 12 | 24,
): SegmentValues {
  if (!value) return EMPTY_VALUES;
  const date = mode === "time" ? null : mode === "date" ? parseIsoDate(value) : null;
  const time = mode === "time" ? parseIsoTime(value) : null;
  const dateTime = mode === "datetime" ? parseIsoDateTime(value) : null;
  const dateParts = date ?? dateTime;
  const timeParts = time ?? dateTime;
  if (!dateParts && !timeParts) return EMPTY_VALUES;
  return {
    ...EMPTY_VALUES,
    ...(dateParts ? { year: dateParts.year, month: dateParts.month, day: dateParts.day } : {}),
    ...(timeParts ? hourValues(timeParts.hour, hourCycle) : {}),
    ...(timeParts ? { minute: timeParts.minute, second: timeParts.second } : {}),
  };
}

/** The hour and day period segments of a 24-hour clock hour. */
function hourValues(hour24: number, hourCycle: 12 | 24) {
  return hourCycle === 12
    ? { hour: hour24 % 12 || 12, dayPeriod: hour24 >= 12 ? 1 : 0 }
    : { hour: hour24, dayPeriod: null };
}

/** The 24-hour clock hour of the segments, or `null` while the hour or the day period is empty. */
function hour24Of(values: SegmentValues, hourCycle: 12 | 24): number | null {
  if (values.hour === null) return null;
  if (hourCycle === 24) return values.hour;
  if (values.dayPeriod === null) return null;
  return (values.hour % 12) + (values.dayPeriod === 1 ? 12 : 0);
}

/** Whether a year is still being typed (fewer than four digits), so it is not part of a value yet. */
export function isYearPending(state: SegmentState): boolean {
  return state.bufferType === "year" && state.buffer.length > 0 && state.buffer.length < 4;
}

/** The ISO value of complete segments, or `null` while any shown segment is empty. */
export function isoFromState(state: SegmentState, config: SegmentConfig): string | null {
  const { values } = state;
  if (isYearPending(state)) return null;
  if (config.types.some((type) => values[type] === null)) return null;
  const hasDate = config.mode !== "time";
  const hasTime = config.mode !== "date";
  let date = "";
  if (hasDate) {
    const { year, month, day } = values as { year: number; month: number; day: number };
    if (day > daysInMonth(year, month)) return null;
    date = formatIsoDate({ year, month, day });
  }
  let time = "";
  if (hasTime) {
    const hour = hour24Of(values, config.hourCycle);
    if (hour === null) return null;
    time = formatIsoTime(
      { hour, minute: values.minute ?? 0, second: values.second ?? 0 },
      config.granularity,
    );
  }
  return hasDate && hasTime ? `${date}T${time}` : hasDate ? date : time;
}

/** The lowest and highest value of a segment. A day's highest follows a known month and year. */
export function segmentRange(
  type: SegmentType,
  values: SegmentValues,
  hourCycle: 12 | 24,
): { min: number; max: number } {
  switch (type) {
    case "year":
      return { min: 1, max: 9999 };
    case "month":
      return { min: 1, max: 12 };
    case "day":
      return {
        min: 1,
        max:
          values.month !== null && values.year !== null
            ? daysInMonth(values.year, values.month)
            : values.month !== null
              ? daysInMonth(2000, values.month)
              : 31,
      };
    case "hour":
      return hourCycle === 12 ? { min: 1, max: 12 } : { min: 0, max: 23 };
    case "minute":
    case "second":
      return { min: 0, max: 59 };
    case "dayPeriod":
      return { min: 0, max: 1 };
  }
}

/** The largest number of digits a segment takes. */
export const maxDigits = (type: SegmentType) => (type === "year" ? 4 : 2);

/** Reduces the day to the month's length once month and year are known. */
export function clampDay(state: SegmentState): SegmentState {
  const { day, month, year } = state.values;
  if (day === null || month === null || year === null || isYearPending(state)) return state;
  const last = daysInMonth(year, month);
  return day > last ? { ...state, values: { ...state.values, day: last } } : state;
}

/** Types a digit into a segment. `advance` tells whether focus moves to the next segment. */
export function typeDigit(
  state: SegmentState,
  type: SegmentType,
  digit: number,
  hourCycle: 12 | 24,
): { state: SegmentState; advance: boolean } {
  const { min, max } = segmentRange(type, state.values, hourCycle);
  const digits = maxDigits(type);
  let buffer = state.bufferType === type ? `${state.buffer}${digit}` : String(digit);
  if (buffer.length > digits || (type !== "year" && Number(buffer) > max)) buffer = String(digit);
  const typed = Number(buffer);
  const value = typed >= min && typed <= max ? typed : null;
  const advance = buffer.length >= digits || (type !== "year" && typed * 10 > max);
  const next: SegmentState = {
    values: { ...state.values, [type]: value },
    buffer: advance ? "" : buffer,
    bufferType: advance ? null : type,
  };
  return { state: clampDay(next), advance };
}

/** Picks the day period whose text starts with `letter`. Ignored when both start with it. */
export function typeDayPeriod(
  state: SegmentState,
  letter: string,
  periods: readonly [string, string],
  locale: string | undefined,
): { state: SegmentState; advance: boolean } | null {
  const initial = (text: string) =>
    text
      .replace(/[^\p{L}]/gu, "")
      .charAt(0)
      .toLocaleLowerCase(locale);
  const typed = letter.toLocaleLowerCase(locale);
  const matches = periods
    .map((period, index) => (initial(period) === typed ? index : -1))
    .filter((index) => index >= 0);
  if (matches.length !== 1) return null;
  return {
    state: { ...state, values: { ...state.values, dayPeriod: matches[0] as number } },
    advance: true,
  };
}

/** The value a segment starts from when an arrow is pressed while it is empty. */
function nowValue(type: SegmentType, now: Date, hourCycle: 12 | 24): number {
  switch (type) {
    case "year":
      return now.getFullYear();
    case "month":
      return now.getMonth() + 1;
    case "day":
      return now.getDate();
    case "hour":
      return hourValues(now.getHours(), hourCycle).hour;
    case "minute":
      return now.getMinutes();
    case "second":
      return now.getSeconds();
    case "dayPeriod":
      return now.getHours() >= 12 ? 1 : 0;
  }
}

/** The arrow step of a segment: the configured one for minutes and seconds (at least 1), else 1. */
function stepOf(type: SegmentType, config: SegmentConfig): number {
  if (type === "minute") return Math.max(1, Math.floor(config.minuteStep));
  if (type === "second") return Math.max(1, Math.floor(config.secondStep));
  return 1;
}

/**
 * Moves a segment one step up or down, wrapping within it. Minutes and seconds move to the next
 * multiple of their step. An empty segment starts at now's part. A value that becomes complete
 * outside `[min, max]` stops at the nearest limit.
 */
export function stepSegment(
  state: SegmentState,
  type: SegmentType,
  direction: 1 | -1,
  config: SegmentConfig,
  now: Date = new Date(),
): SegmentState {
  const { min, max } = segmentRange(type, state.values, config.hourCycle);
  const current = state.values[type];
  const step = stepOf(type, config);
  let next: number;
  if (current === null) {
    next = nowValue(type, now, config.hourCycle);
    if (step > 1) next = Math.round(next / step) * step;
  } else if (direction === 1) {
    next = current % step === 0 ? current + step : Math.ceil(current / step) * step;
  } else {
    next = current % step === 0 ? current - step : Math.floor(current / step) * step;
  }
  if (next > max) next = min;
  if (next < min) next = Math.floor(max / step) * step;
  return clampToLimits(
    clampDay({ values: { ...state.values, [type]: next }, buffer: "", bufferType: null }),
    config,
  );
}

/** Sets a segment to its lowest or highest value. */
export function edgeSegment(
  state: SegmentState,
  type: SegmentType,
  edge: "min" | "max",
  config: SegmentConfig,
): SegmentState {
  const range = segmentRange(type, state.values, config.hourCycle);
  const step = stepOf(type, config);
  const value = edge === "min" ? range.min : Math.floor(range.max / step) * step;
  return clampToLimits(
    clampDay({ values: { ...state.values, [type]: value }, buffer: "", bufferType: null }),
    config,
  );
}

/** Empties a segment. */
export function clearSegment(state: SegmentState, type: SegmentType): SegmentState {
  return { values: { ...state.values, [type]: null }, buffer: "", bufferType: null };
}

/** Ends typing in a segment: a short year is kept as typed. */
export function commitBuffer(state: SegmentState): SegmentState {
  if (!state.bufferType) return state;
  return clampDay({ ...state, buffer: "", bufferType: null });
}

/** A complete value outside `[min, max]` replaced by the nearest limit. */
export function clampToLimits(state: SegmentState, config: SegmentConfig): SegmentState {
  const value = isoFromState(state, config);
  if (!value || (!config.min && !config.max)) return state;
  const clamped = clampIso(value, config.min, config.max);
  if (clamped === value) return state;
  return { ...state, values: valuesFromIso(clamped, config.mode, config.hourCycle) };
}

/** Sets the day, month and year from an ISO date, keeping the time segments. */
export function withDate(state: SegmentState, date: string): SegmentState {
  const parts = parseIsoDate(date);
  if (!parts) return state;
  return {
    values: { ...state.values, year: parts.year, month: parts.month, day: parts.day },
    buffer: "",
    bufferType: null,
  };
}
