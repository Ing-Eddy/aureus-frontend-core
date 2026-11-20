import { compareIso, toLocalDate } from "@/internal/utils/helpers";

/**
 * The summary of several days: each date with `Intl.DateTimeFormat(locale, { dateStyle: "medium" })`,
 * joined by `Intl.ListFormat(locale)` ("1 ago 2026, 5 ago 2026 y 9 ago 2026").
 */
export function formatDateList(dates: readonly string[], locale?: string): string {
  const format = new Intl.DateTimeFormat(locale, { calendar: "gregory", dateStyle: "medium" });
  const texts = dates.flatMap((date) => {
    const value = toLocalDate(date);
    return value ? [format.format(value)] : [];
  });
  if (typeof Intl.ListFormat !== "function") return texts.join(", ");
  return new Intl.ListFormat(locale, { type: "conjunction" }).format(texts);
}

/** Adds a day, or removes it when it is already chosen; the list stays sorted with no duplicates. */
export function toggleDay(
  dates: readonly string[],
  day: string,
  maxSelected?: number,
): readonly string[] {
  if (dates.includes(day)) return dates.filter((date) => date !== day);
  if (maxSelected !== undefined && dates.length >= maxSelected) return dates;
  return [...dates, day].sort(compareIso);
}

/** A list of days sorted with no duplicates. */
export function normalizeDays(dates: readonly string[]): string[] {
  return [...new Set(dates)].sort(compareIso);
}
