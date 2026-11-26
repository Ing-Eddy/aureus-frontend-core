/**
 * Local ISO date and time strings with no time zone: `YYYY-MM-DD`, `HH:mm[:ss]` and
 * `YYYY-MM-DDTHH:mm[:ss]`. Every `Date` here is built from local parts and day arithmetic runs at
 * noon, so a daylight-saving change never moves the day, and nothing goes through UTC.
 */

/** What an ISO value holds. */
export type IsoMode = "date" | "time" | "datetime";
/** Whether a time has seconds. */
export type TimeGranularity = "minute" | "second";

/** The parts of a calendar date. */
export interface IsoDateParts {
  /** From 1 to 9999. */
  year: number;
  /** 1–12. */
  month: number;
  /** 1–31. */
  day: number;
}

/** The parts of a 24-hour time. */
export interface IsoTimeParts {
  /** 0–23. */
  hour: number;
  /** 0–59. */
  minute: number;
  /** 0–59; 0 when the value has no seconds. */
  second: number;
}

/** The parts of a date and a time together. */
export type IsoDateTimeParts = IsoDateParts & IsoTimeParts;

/** The shape of `YYYY-MM-DD`; the ranges are checked when parsing. */
const DATE = /^(\d{4})-(\d{2})-(\d{2})$/;
/** The shape of `HH:mm` or `HH:mm:ss`; the ranges are checked when parsing. */
const TIME = /^(\d{2}):(\d{2})(?::(\d{2}))?$/;
/** Milliseconds in a day of 24 hours. */
const DAY_MS = 86_400_000;

/** The Gregorian leap-year rule. */
export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/** Days in a month (`month` 1–12). */
export function daysInMonth(year: number, month: number): number {
  if (month === 2) return isLeapYear(year) ? 29 : 28;
  return [4, 6, 9, 11].includes(month) ? 30 : 31;
}

/** The parts of a real calendar date, or `null`. */
export function parseIsoDate(value: unknown): IsoDateParts | null {
  if (typeof value !== "string") return null;
  const match = DATE.exec(value);
  if (!match) return null;
  const [year, month, day] = match.slice(1).map(Number) as [number, number, number];
  if (year < 1 || month < 1 || month > 12 || day < 1 || day > daysInMonth(year, month)) return null;
  return { year, month, day };
}

/** The parts of a valid 24-hour time (seconds are 0 when absent), or `null`. */
export function parseIsoTime(value: unknown): (IsoTimeParts & { hasSeconds: boolean }) | null {
  if (typeof value !== "string") return null;
  const match = TIME.exec(value);
  if (!match) return null;
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  const second = match[3] === undefined ? 0 : Number(match[3]);
  if (hour > 23 || minute > 59 || second > 59) return null;
  return { hour, minute, second, hasSeconds: match[3] !== undefined };
}

/** The parts of a valid date and time, or `null`. */
export function parseIsoDateTime(
  value: unknown,
): (IsoDateTimeParts & { hasSeconds: boolean }) | null {
  if (typeof value !== "string") return null;
  const [date, time, extra] = value.split("T");
  if (extra !== undefined || time === undefined) return null;
  const dateParts = parseIsoDate(date);
  const timeParts = parseIsoTime(time);
  return dateParts && timeParts ? { ...dateParts, ...timeParts } : null;
}

/** `true` only for a well-formed `YYYY-MM-DD` of a real date. */
export function isIsoDate(value: unknown): value is string {
  return parseIsoDate(value) !== null;
}

/** `true` only for a well-formed `HH:mm` or `HH:mm:ss`. */
export function isIsoTime(value: unknown): value is string {
  return parseIsoTime(value) !== null;
}

/** `true` only for a well-formed `YYYY-MM-DDTHH:mm[:ss]` of a real date. */
export function isIsoDateTime(value: unknown): value is string {
  return parseIsoDateTime(value) !== null;
}

/** Whether `value` is valid for `mode`. */
export function isIsoValue(value: unknown, mode: IsoMode): value is string {
  if (mode === "date") return isIsoDate(value);
  if (mode === "time") return isIsoTime(value);
  return isIsoDateTime(value);
}

/** `value` with leading zeros up to `length` digits. */
const pad = (value: number, length = 2) => String(value).padStart(length, "0");

/** The `YYYY-MM-DD` of the parts, which are not validated. */
export function formatIsoDate({ year, month, day }: IsoDateParts): string {
  return `${pad(year, 4)}-${pad(month)}-${pad(day)}`;
}

/**
 * The `HH:mm`, or `HH:mm:ss` with `granularity: "second"`, of the parts, which are not validated.
 */
export function formatIsoTime(
  { hour, minute, second }: IsoTimeParts,
  granularity: TimeGranularity = "minute",
): string {
  const base = `${pad(hour)}:${pad(minute)}`;
  return granularity === "second" ? `${base}:${pad(second)}` : base;
}

/** The date and the time of the parts joined by `T`. */
export function formatIsoDateTime(
  parts: IsoDateTimeParts,
  granularity: TimeGranularity = "minute",
): string {
  return `${formatIsoDate(parts)}T${formatIsoTime(parts, granularity)}`;
}

/** A local `Date` from parts; years below 100 are kept as they are. */
function localDate(year: number, month: number, day: number, hour = 0, minute = 0, second = 0) {
  const date = new Date(2000, 0, 1, hour, minute, second, 0);
  date.setFullYear(year, month - 1, day);
  return date;
}

/** The local calendar date of a `Date`. */
function datePartsOf(date: Date): IsoDateParts {
  return { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() };
}

/**
 * A local `Date` for a date (at 00:00), a time (on today's date) or a date and time, or `null`
 * when the value is not valid.
 */
export function toLocalDate(value: string): Date | null {
  const dateTime = parseIsoDateTime(value);
  if (dateTime) {
    const { year, month, day, hour, minute, second } = dateTime;
    return localDate(year, month, day, hour, minute, second);
  }
  const date = parseIsoDate(value);
  if (date) return localDate(date.year, date.month, date.day);
  const time = parseIsoTime(value);
  if (time) {
    const today = datePartsOf(new Date());
    return localDate(today.year, today.month, today.day, time.hour, time.minute, time.second);
  }
  return null;
}

/** The ISO value of a `Date` in local time. */
export function fromLocalDate(
  date: Date,
  mode: IsoMode,
  granularity: TimeGranularity = "minute",
): string {
  const time = { hour: date.getHours(), minute: date.getMinutes(), second: date.getSeconds() };
  if (mode === "time") return formatIsoTime(time, granularity);
  const day = datePartsOf(date);
  if (mode === "date") return formatIsoDate(day);
  return formatIsoDateTime({ ...day, ...time }, granularity);
}

/** Today's local date. */
export function todayIso(): string {
  return formatIsoDate(datePartsOf(new Date()));
}

/** The date part of a date or date-and-time value. */
export function isoDatePart(value: string): string {
  return value.slice(0, 10);
}

/** A date moved by `days` calendar days. Throws on an invalid date. */
export function addDaysIso(value: string, days: number): string {
  const parts = parseIsoDate(value);
  if (!parts) throw new RangeError(`addDaysIso: "${value}" is not a YYYY-MM-DD date`);
  const date = localDate(parts.year, parts.month, parts.day, 12);
  date.setDate(date.getDate() + days);
  return formatIsoDate(datePartsOf(date));
}

/** Days from `from` to `to`, counting both (the same day is 1). Negative when `to` is earlier. */
export function daysBetweenInclusive(from: string, to: string): number {
  const a = parseIsoDate(from);
  const b = parseIsoDate(to);
  if (!a || !b) return Number.NaN;
  const diff = Math.round(
    (localDate(b.year, b.month, b.day, 12).getTime() -
      localDate(a.year, a.month, a.day, 12).getTime()) /
      DAY_MS,
  );
  return diff >= 0 ? diff + 1 : diff - 1;
}

/** Times without seconds compare as `:00`, so `"14:30"` equals `"14:30:00"`. */
function comparable(value: string): string {
  return /(?:^|T)\d{2}:\d{2}$/.test(value) ? `${value}:00` : value;
}

/** Compares two values of the same mode: negative, 0 or positive. */
export function compareIso(a: string, b: string): number {
  const left = comparable(a);
  const right = comparable(b);
  return left < right ? -1 : left > right ? 1 : 0;
}

/** `value` moved into `[min, max]` (either limit is optional). */
export function clampIso(value: string, min?: string | null, max?: string | null): string {
  if (min && compareIso(value, min) < 0) return min;
  if (max && compareIso(value, max) > 0) return max;
  return value;
}
