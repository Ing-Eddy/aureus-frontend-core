import { describe, expect, it } from "vitest";
import {
  dayPeriodTexts,
  localeDigits,
  monthNames,
  resolveHourCycle,
  type SegmentLayoutItem,
  segmentLayout,
  segmentNames,
  segmentTypes,
} from "./segment-parts";

const date = { date: true, time: false, hourCycle: 24, granularity: "minute" } as const;
const time = { date: false, time: true, hourCycle: 24, granularity: "minute" } as const;

const text = (layout: SegmentLayoutItem[]) =>
  layout.map((item) => (item.kind === "segment" ? `[${item.type}]` : item.text)).join("");

describe("segmentLayout", () => {
  it("follows each locale's order and separators", () => {
    expect(text(segmentLayout("es-ES", date))).toBe("[day]/[month]/[year]");
    expect(text(segmentLayout("en-US", date))).toBe("[month]/[day]/[year]");
    expect(text(segmentLayout("ja-JP", date))).toBe("[year]/[month]/[day]");
    expect(text(segmentLayout("de-DE", date))).toBe("[day].[month].[year]");
  });

  it("adds the day period with a 12-hour cycle and the second with that granularity", () => {
    expect(text(segmentLayout("es-ES", time))).toBe("[hour]:[minute]");
    expect(segmentTypes(segmentLayout("en-US", { ...time, hourCycle: 12 }))).toEqual([
      "hour",
      "minute",
      "dayPeriod",
    ]);
    expect(segmentTypes(segmentLayout("es-ES", { ...time, granularity: "second" }))).toEqual([
      "hour",
      "minute",
      "second",
    ]);
    expect(segmentTypes(segmentLayout("ko-KR", { ...time, hourCycle: 12 }))[0]).toBe("dayPeriod");
  });

  it("joins a date and a time", () => {
    expect(segmentTypes(segmentLayout("es-ES", { ...date, time: true }))).toEqual([
      "day",
      "month",
      "year",
      "hour",
      "minute",
    ]);
  });

  it("drops direction marks and stays Gregorian", () => {
    const arabic = segmentLayout("ar-EG", date);
    expect(text(arabic)).not.toMatch(/[‎‏؜]/);
    expect(segmentTypes(arabic)).toEqual(["day", "month", "year"]);
    // Persian defaults to its own calendar; the layout uses the Gregorian one.
    expect(segmentTypes(segmentLayout("fa-IR", date))).toHaveLength(3);
  });
});

describe("locale data", () => {
  it("names segments from Intl", () => {
    const names = segmentNames("es-ES");
    expect([names.day, names.month, names.year, names.hour]).toEqual(["día", "mes", "año", "hora"]);
    expect(segmentNames("en-US").minute).toBe("minute");
  });

  it("formats and reads the locale's digits", () => {
    const arabic = localeDigits("ar-EG");
    expect(arabic.format(5, 2)).toBe("٠٥");
    expect(arabic.parse("٧")).toBe(7);
    expect(arabic.parse("7")).toBe(7);
    expect(arabic.parse("x")).toBeNull();
    expect(localeDigits("es-ES").format(2026, 4)).toBe("2026");
  });

  it("resolves the hour cycle", () => {
    expect(resolveHourCycle("en-US")).toBe(12);
    expect(resolveHourCycle("es-ES")).toBe(24);
    expect(resolveHourCycle("en-US", 24)).toBe(24);
  });

  it("names months and day periods", () => {
    expect(monthNames("es-ES")[7]).toBe("agosto");
    expect(dayPeriodTexts("en-US")).toEqual(["AM", "PM"]);
    expect(dayPeriodTexts("es-ES").map((period) => period.replace(/\s/gu, " "))).toEqual([
      "a. m.",
      "p. m.",
    ]);
  });
});
