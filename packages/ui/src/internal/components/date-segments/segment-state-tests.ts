import { describe, expect, it } from "vitest";
import {
  EMPTY_VALUES,
  edgeSegment,
  emptyState,
  isoFromState,
  type SegmentConfig,
  type SegmentState,
  stepSegment,
  typeDayPeriod,
  typeDigit,
  valuesFromIso,
} from "./segment-state";

const dateConfig: SegmentConfig = {
  types: ["day", "month", "year"],
  mode: "date",
  hourCycle: 24,
  granularity: "minute",
  minuteStep: 1,
  secondStep: 1,
};
const timeConfig: SegmentConfig = { ...dateConfig, types: ["hour", "minute"], mode: "time" };

const stateOf = (iso: string | null, config = dateConfig) =>
  emptyState(valuesFromIso(iso, config.mode, config.hourCycle));

function typeAll(state: SegmentState, type: Parameters<typeof typeDigit>[1], text: string) {
  let current = state;
  let advance = false;
  for (const character of text) {
    const typed = typeDigit(current, type, Number(character), 24);
    current = typed.state;
    advance = typed.advance;
  }
  return { state: current, advance };
}

describe("typing", () => {
  it("advances once no further digit could fit", () => {
    expect(typeDigit(emptyState(), "month", 4, 24)).toMatchObject({ advance: true });
    expect(typeDigit(emptyState(), "month", 1, 24)).toMatchObject({ advance: false });
    expect(typeAll(emptyState(), "month", "12")).toMatchObject({ advance: true });
    expect(typeAll(emptyState(), "day", "3").advance).toBe(false);
    expect(typeAll(emptyState(), "day", "4").advance).toBe(true);
    expect(typeAll(emptyState(), "hour", "2").advance).toBe(false);
    expect(typeAll(emptyState(), "hour", "3").advance).toBe(true);
  });

  it("starts over when a digit would pass the maximum", () => {
    const typed = typeAll(emptyState(), "month", "15");
    expect(typed.state.values.month).toBe(5);
    expect(typed.advance).toBe(true);
  });

  it("keeps a leading zero until the second digit", () => {
    const zero = typeAll(emptyState(), "month", "0");
    expect(zero.state.values.month).toBeNull();
    expect(zero.state.buffer).toBe("0");
    expect(typeAll(zero.state, "month", "4").state.values.month).toBe(4);
  });

  it("treats a year as pending until four digits", () => {
    let state = stateOf(null);
    state = typeAll(state, "day", "01").state;
    state = typeAll(state, "month", "08").state;
    state = typeAll(state, "year", "202").state;
    expect(isoFromState(state, dateConfig)).toBeNull();
    const done = typeAll(state, "year", "6");
    expect(done.advance).toBe(true);
    expect(isoFromState(done.state, dateConfig)).toBe("2026-08-01");
  });

  it("limits the day to a known month", () => {
    const february = emptyState({ ...EMPTY_VALUES, month: 2, year: 2027 });
    expect(typeAll(february, "day", "3")).toMatchObject({ advance: true });
    expect(typeAll(february, "day", "3").state.values.day).toBe(3);
    const april = emptyState({ ...EMPTY_VALUES, month: 4, year: 2026, day: 31 });
    expect(typeAll(april, "month", "04").state.values.day).toBe(30);
  });

  it("picks the day period by the locale's first letter", () => {
    const state = emptyState({ ...EMPTY_VALUES, hour: 2, minute: 30, dayPeriod: 1 });
    const typed = typeDayPeriod(state, "a", ["AM", "PM"], "en-US");
    expect(typed?.state.values.dayPeriod).toBe(0);
    expect(typeDayPeriod(state, "x", ["AM", "PM"], "en-US")).toBeNull();
    expect(typeDayPeriod(state, "P", ["a. m.", "p. m."], "es-ES")?.state.values.dayPeriod).toBe(1);
    const config = {
      ...timeConfig,
      types: ["hour", "minute", "dayPeriod"] as const,
      hourCycle: 12 as const,
    };
    expect(isoFromState((typed as { state: SegmentState }).state, config)).toBe("02:30");
  });
});

describe("arrows", () => {
  const now = new Date(2026, 7, 15, 10, 7, 0);

  it("wraps within a segment without touching the others", () => {
    expect(stepSegment(stateOf("2026-12-10"), "month", 1, dateConfig).values).toMatchObject({
      month: 1,
      year: 2026,
    });
    expect(stepSegment(stateOf("2026-01-10"), "month", -1, dateConfig).values.month).toBe(12);
  });

  it("clamps the day when the month changes (February)", () => {
    const next = stepSegment(stateOf("2027-01-31"), "month", 1, dateConfig);
    expect(isoFromState(next, dateConfig)).toBe("2027-02-28");
  });

  it("starts an empty segment at now", () => {
    expect(stepSegment(emptyState(), "year", 1, dateConfig, now).values.year).toBe(2026);
    expect(stepSegment(emptyState(), "minute", 1, timeConfig, now).values.minute).toBe(7);
  });

  it("follows the minute step", () => {
    const config = { ...timeConfig, minuteStep: 15 };
    expect(stepSegment(stateOf("10:07", config), "minute", 1, config).values.minute).toBe(15);
    expect(stepSegment(stateOf("10:07", config), "minute", -1, config).values.minute).toBe(0);
    expect(stepSegment(stateOf("10:45", config), "minute", 1, config).values.minute).toBe(0);
    expect(stepSegment(stateOf("10:00", config), "minute", -1, config).values.minute).toBe(45);
  });

  it("stops at the limits", () => {
    const config = { ...dateConfig, min: "2026-08-10", max: "2026-08-20" };
    expect(isoFromState(stepSegment(stateOf("2026-08-10"), "day", -1, config), config)).toBe(
      "2026-08-10",
    );
    expect(isoFromState(stepSegment(stateOf("2026-08-20"), "month", 1, config), config)).toBe(
      "2026-08-20",
    );
    expect(isoFromState(edgeSegment(stateOf("2026-08-15"), "day", "min", config), config)).toBe(
      "2026-08-10",
    );
  });
});

describe("values", () => {
  it("is null until every segment is filled", () => {
    expect(isoFromState(emptyState({ ...EMPTY_VALUES, day: 1, month: 8 }), dateConfig)).toBeNull();
    expect(isoFromState(stateOf("2026-08-01"), dateConfig)).toBe("2026-08-01");
  });

  it("uses the 24-hour clock whatever the cycle shown", () => {
    const config = {
      ...timeConfig,
      types: ["hour", "minute", "dayPeriod"] as const,
      hourCycle: 12 as const,
    };
    const values = valuesFromIso("14:30", "time", 12);
    expect(values).toMatchObject({ hour: 2, dayPeriod: 1 });
    expect(isoFromState(emptyState(values), config)).toBe("14:30");
    expect(valuesFromIso("00:15", "time", 12)).toMatchObject({ hour: 12, dayPeriod: 0 });
  });

  it("ignores invalid values", () => {
    expect(valuesFromIso("2027-02-29", "date", 24)).toEqual(EMPTY_VALUES);
    expect(valuesFromIso("14:30", "date", 24)).toEqual(EMPTY_VALUES);
  });

  it("adds seconds only with that granularity", () => {
    const config = {
      ...timeConfig,
      types: ["hour", "minute", "second"] as const,
      granularity: "second" as const,
    };
    expect(isoFromState(stateOf("14:30:15", config), config)).toBe("14:30:15");
    expect(isoFromState(stateOf("14:30:15", timeConfig), timeConfig)).toBe("14:30");
  });
});
