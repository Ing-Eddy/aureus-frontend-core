import { describe, expect, it } from "vitest";
import { formatDateList, normalizeDays, toggleDay } from "./format-summary";
import { isEndBlocked, nextRange, sortRange } from "./next-range";

describe("nextRange", () => {
  it("starts, ends and restarts a range", () => {
    const start = nextRange(null, "2026-08-01");
    expect(start).toEqual({ from: "2026-08-01", to: null });
    const done = nextRange(start, "2026-08-27");
    expect(done).toEqual({ from: "2026-08-01", to: "2026-08-27" });
    expect(nextRange(done, "2026-08-10")).toEqual({ from: "2026-08-10", to: null });
    expect(nextRange(start, "2026-08-01")).toEqual({ from: "2026-08-01", to: "2026-08-01" });
  });

  it("moves the start when the second day comes before it", () => {
    expect(nextRange({ from: "2026-08-10", to: null }, "2026-08-05")).toEqual({
      from: "2026-08-05",
      to: null,
    });
  });

  it("counts both ends for minDays and maxDays", () => {
    const start = { from: "2026-08-01", to: null };
    expect(nextRange(start, "2026-08-07", { maxDays: 7 }).to).toBe("2026-08-07");
    expect(nextRange(start, "2026-08-08", { maxDays: 7 })).toEqual({
      from: "2026-08-08",
      to: null,
    });
    expect(nextRange(start, "2026-08-02", { minDays: 3 })).toEqual({
      from: "2026-08-02",
      to: null,
    });
    expect(nextRange(start, "2026-08-03", { minDays: 3 }).to).toBe("2026-08-03");
    expect(isEndBlocked("2026-08-01", "2026-08-08", { maxDays: 7 })).toBe(true);
    expect(isEndBlocked("2026-08-01", "2026-08-07", { maxDays: 7 })).toBe(false);
    expect(isEndBlocked("2026-08-01", "2026-07-20", { maxDays: 7 })).toBe(false);
    expect(isEndBlocked("2026-08-01", "2026-08-01", { minDays: 3 })).toBe(false);
    expect(isEndBlocked("2026-08-01", "2026-08-02", { minDays: 3 })).toBe(true);
  });

  it("restarts at the clicked day when a disabled day is in between", () => {
    const isDisabled = (date: string) => date === "2026-08-05";
    const start = { from: "2026-08-01", to: null };
    expect(nextRange(start, "2026-08-10", { excludeDisabled: true, isDisabled })).toEqual({
      from: "2026-08-10",
      to: null,
    });
    expect(nextRange(start, "2026-08-10", { isDisabled })).toEqual({
      from: "2026-08-01",
      to: "2026-08-10",
    });
    expect(nextRange(start, "2026-08-04", { excludeDisabled: true, isDisabled }).to).toBe(
      "2026-08-04",
    );
  });

  it("sorts an inverted range", () => {
    expect(sortRange({ from: "2026-08-10", to: "2026-08-01" })).toEqual({
      from: "2026-08-01",
      to: "2026-08-10",
    });
  });
});

describe("summaries and toggling", () => {
  it("lists dates in the locale", () => {
    const dates = ["2026-08-01", "2026-08-05", "2026-08-09"];
    const format = new Intl.DateTimeFormat("es-ES", { dateStyle: "medium" });
    const expected = new Intl.ListFormat("es-ES", { type: "conjunction" }).format(
      [1, 5, 9].map((day) => format.format(new Date(2026, 7, day))),
    );
    expect(formatDateList(dates, "es-ES")).toBe(expected);
    expect(formatDateList(dates, "en-US")).toContain("and");
    expect(formatDateList([], "es-ES")).toBe("");
  });

  it("toggles days, keeps them sorted and respects the maximum", () => {
    let days = toggleDay([], "2026-08-09");
    days = toggleDay(days, "2026-08-01");
    days = toggleDay(days, "2026-08-05");
    expect(days).toEqual(["2026-08-01", "2026-08-05", "2026-08-09"]);
    expect(toggleDay(days, "2026-08-05")).toEqual(["2026-08-01", "2026-08-09"]);
    expect(toggleDay(["2026-08-01", "2026-08-02"], "2026-08-03", 2)).toEqual([
      "2026-08-01",
      "2026-08-02",
    ]);
    expect(normalizeDays(["2026-08-02", "2026-08-01", "2026-08-02"])).toEqual([
      "2026-08-01",
      "2026-08-02",
    ]);
  });
});
