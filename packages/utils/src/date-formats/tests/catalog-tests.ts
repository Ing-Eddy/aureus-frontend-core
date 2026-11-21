import { afterEach, describe, expect, it, vi } from "vitest";
import { resetWarnings } from "@/internal/utils/helpers";
import { createDateFormatter, dateFormatNames } from "..";

afterEach(() => {
  resetWarnings();
  vi.restoreAllMocks();
});

/** ICU writes narrow / no-break spaces (`2:30 PM`, `p. m.`); compare them as plain spaces. */
const plain = (text: string | null) => text?.replace(/[  ]/g, " ") ?? null;

const sample = "2026-11-21T14:30:05";

function table(locale: string) {
  const dates = createDateFormatter({ locale });
  return Object.fromEntries(
    dateFormatNames.map((name) => [name, plain(dates.format(sample, name))]),
  );
}

describe("catalog", () => {
  // The single source of how every app shows dates. A change here must be deliberate.
  it("in es-ES", () => {
    expect(table("es-ES")).toEqual({
      short: "21/11/26",
      medium: "21 nov 2026",
      long: "21 de noviembre de 2026",
      full: "sábado, 21 de noviembre de 2026",
      numericDate: "21/11/2026",
      dayMonth: "21 nov",
      monthYear: "noviembre de 2026",
      weekday: "sábado",
      month: "noviembre",
      year: "2026",
      time: "14:30",
      timeWithSeconds: "14:30:05",
      shortDateTime: "21/11/26, 14:30",
      mediumDateTime: "21 nov 2026, 14:30",
      longDateTime: "21 de noviembre de 2026 a las 14:30",
    });
  });

  it("in en-US", () => {
    expect(table("en-US")).toEqual({
      short: "11/21/26",
      medium: "Nov 21, 2026",
      long: "November 21, 2026",
      full: "Saturday, November 21, 2026",
      numericDate: "11/21/2026",
      dayMonth: "Nov 21",
      monthYear: "November 2026",
      weekday: "Saturday",
      month: "November",
      year: "2026",
      time: "2:30 PM",
      timeWithSeconds: "2:30:05 PM",
      shortDateTime: "11/21/26, 2:30 PM",
      mediumDateTime: "Nov 21, 2026, 2:30 PM",
      longDateTime: "November 21, 2026 at 2:30 PM",
    });
  });

  it("follows each language's conventions", () => {
    const dates = createDateFormatter();
    expect(dates.format(sample, "long", { locale: "fr" })).toBe("21 novembre 2026");
    expect(dates.format(sample, "long", { locale: "de" })).toBe("21. November 2026");
  });

  it("lists exactly the fifteen names and cannot be changed", () => {
    expect(dateFormatNames).toHaveLength(15);
    expect(Object.isFrozen(dateFormatNames)).toBe(true);
    expect(() => (dateFormatNames as string[]).push("custom")).toThrow(TypeError);
    expect(dateFormatNames).not.toContain("custom");
  });
});

describe("locale", () => {
  it("evaluates a getter on every call", () => {
    let current = "es";
    const dates = createDateFormatter({ locale: () => current });
    expect(dates.format("2026-11-21", "month")).toBe("noviembre");
    current = "en";
    expect(dates.format("2026-11-21", "month")).toBe("November");
  });

  it("uses the runtime's locale when none is given", () => {
    const expected = new Intl.DateTimeFormat(undefined, { month: "long", timeZone: "UTC" }).format(
      Date.UTC(2026, 10, 21),
    );
    expect(createDateFormatter().format("2026-11-21", "month")).toBe(expected);
    expect(createDateFormatter({ locale: () => undefined }).format("2026-11-21", "month")).toBe(
      expected,
    );
  });

  it("applies per-call overrides to that call only", () => {
    const dates = createDateFormatter({ locale: "es-ES" });
    expect(dates.format("2026-11-21", "month", { locale: "en-US" })).toBe("November");
    expect(dates.format("2026-11-21", "month")).toBe("noviembre");
  });
});

describe("time zones", () => {
  it("shows an instant in the given time zone", () => {
    const dates = createDateFormatter({ locale: "es-ES" });
    expect(dates.format("2026-11-21T14:30:00Z", "time", { timeZone: "America/Mexico_City" })).toBe(
      "8:30",
    );
    const mexico = createDateFormatter({ locale: "es-ES", timeZone: "America/Mexico_City" });
    expect(mexico.format(Date.UTC(2026, 10, 21, 14, 30), "time")).toBe("8:30");
  });

  it("shows an instant in the runtime's time zone by default (America/New_York in tests)", () => {
    const dates = createDateFormatter({ locale: "es-ES" });
    expect(dates.format(new Date(Date.UTC(2026, 10, 21, 14, 30)), "time")).toBe("9:30");
  });

  it("never shifts a local date", () => {
    const dates = createDateFormatter({ locale: "es-ES" });
    expect(dates.format("2026-11-21", "numericDate")).toBe("21/11/2026");
    expect(dates.format("2026-11-21", "numericDate", { timeZone: "Asia/Tokyo" })).toBe(
      "21/11/2026",
    );
    expect(dates.format("2026-11-21", "numericDate", { timeZone: "Pacific/Honolulu" })).toBe(
      "21/11/2026",
    );
  });

  it("keeps local wall times across daylight-saving changes", () => {
    const dates = createDateFormatter({ locale: "en-US" });
    expect(plain(dates.format("2026-03-08T12:00", "shortDateTime"))).toBe("3/8/26, 12:00 PM");
    // 02:30 does not exist in New York that day; a local wall time is still shown as written.
    expect(plain(dates.format("2026-03-08T02:30", "shortDateTime"))).toBe("3/8/26, 2:30 AM");
    expect(plain(dates.format("2026-11-01T01:30", "time"))).toBe("1:30 AM");
  });
});

describe("values and formats", () => {
  it("returns null for missing values without warning", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const dates = createDateFormatter();
    expect(dates.format(null, "long")).toBeNull();
    expect(dates.format(undefined, "long")).toBeNull();
    expect(warn).not.toHaveBeenCalled();
  });

  it("returns null and warns once for an unreadable value", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const dates = createDateFormatter();
    expect(dates.format("2026-02-30", "long")).toBeNull();
    expect(dates.format("2026-02-30", "long")).toBeNull();
    expect(dates.format(new Date(Number.NaN), "long")).toBeNull();
    expect(warn.mock.calls.map(([message]) => message)).toEqual([
      'date-formats: "2026-02-30" is not a readable date.',
      "date-formats: an invalid Date is not a readable date.",
    ]);
  });

  it("refuses a date format on a time and a time format on a date", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const dates = createDateFormatter({ locale: "en-US" });
    expect(dates.format("14:30", "long")).toBeNull();
    expect(dates.format("2026-11-21", "time")).toBeNull();
    expect(dates.format("2026-11-21", "shortDateTime")).toBeNull();
    expect(warn).toHaveBeenCalledTimes(3);
    expect(warn.mock.calls[0]?.[0]).toBe(
      'date-formats: format "long" needs a date, but "14:30" has only a time.',
    );
  });

  it("accepts what fits", () => {
    const dates = createDateFormatter({ locale: "en-US" });
    expect(plain(dates.format("14:30", "time"))).toBe("2:30 PM");
    expect(dates.format("2026-11-21T14:30", "long")).toBe("November 21, 2026");
    expect(plain(dates.format("2026-11-21T14:30", "time"))).toBe("2:30 PM");
  });

  it("falls back to short for an unknown name, with one warning", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const dates = createDateFormatter({ locale: "en-US" });
    const untyped = dates.format as (value: unknown, name: string) => string | null;
    expect(untyped("2026-11-21", "shrot")).toBe("11/21/26");
    expect(untyped("2026-11-21", "shrot")).toBe("11/21/26");
    expect(untyped("2026-11-21", "toString")).toBe("11/21/26");
    expect(warn.mock.calls.map(([message]) => message)).toEqual([
      'date-formats: unknown format "shrot"; "short" is used instead.',
      'date-formats: unknown format "toString"; "short" is used instead.',
    ]);
  });
});
