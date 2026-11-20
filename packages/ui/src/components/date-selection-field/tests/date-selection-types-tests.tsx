import { describe, expect, it, vi } from "vitest";
import { DateSelectionField } from "../date-selection-field";
import { dateSelectionProblems } from "../hooks";
import { monthTexts, rangeTexts, renderField } from "./helpers";

// Type-level checks: `pnpm typecheck` fails if any `@ts-expect-error` below stops being an error.
const typeChecks = [
  <DateSelectionField
    key="range"
    label="Estancia"
    selection="range"
    {...rangeTexts}
    onValueChange={(value) => value?.to}
  />,
  <DateSelectionField
    key="multiple"
    label="Días"
    selection="multiple"
    maxSelected={3}
    {...monthTexts}
    onValueChange={(days) => days.length}
  />,
  // @ts-expect-error `selection` is required.
  <DateSelectionField key="no-selection" label="Días" {...monthTexts} />,
  // @ts-expect-error A range needs `startLabel` and `endLabel`.
  <DateSelectionField
    key="no-ends"
    label="Estancia"
    selection="range"
    openCalendarLabel="Abrir"
    {...monthTexts}
  />,
  // @ts-expect-error A range needs `openCalendarLabel`.
  <DateSelectionField
    key="no-open"
    label="Estancia"
    selection="range"
    startLabel="A"
    endLabel="B"
    {...monthTexts}
  />,
  // @ts-expect-error `maxSelected` needs `selection="multiple"`.
  <DateSelectionField
    key="max-range"
    label="Estancia"
    selection="range"
    maxSelected={2}
    {...rangeTexts}
  />,
  // @ts-expect-error `maxDays` needs `selection="range"`.
  <DateSelectionField
    key="days-multiple"
    label="Días"
    selection="multiple"
    maxDays={2}
    {...monthTexts}
  />,
  // @ts-expect-error The calendar needs its month texts.
  <DateSelectionField key="no-months" label="Días" selection="multiple" />,
  // @ts-expect-error `presets` needs `presetsLabel`.
  <DateSelectionField
    key="presets"
    label="Días"
    selection="multiple"
    presets={[]}
    {...monthTexts}
  />,
  <DateSelectionField
    key="value"
    label="Días"
    selection="multiple"
    // @ts-expect-error A multiple value is a list.
    value="2026-08-01"
    {...monthTexts}
  />,
];

describe("DateSelectionField types and warnings", () => {
  it("are checked by the compiler", () => {
    expect(typeChecks).toHaveLength(10);
  });

  it("names each missing text once, with the component's name", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const untyped = { label: "Estancia", selection: "range" } as unknown as Parameters<
      typeof DateSelectionField
    >[0];
    renderField(<DateSelectionField {...untyped} />);
    const messages = warn.mock.calls.map(([message]) => String(message));
    for (const expected of [
      '`selection="range"` needs `openCalendarLabel`',
      '`selection="range"` needs `startLabel`',
      '`selection="range"` needs `endLabel`',
      "the calendar needs `previousMonthLabel`",
      "the calendar needs `nextMonthLabel`",
    ]) {
      expect(messages.filter((message) => message.includes(expected))).toHaveLength(1);
    }
    expect(messages.every((message) => message.startsWith("DateSelectionField: "))).toBe(true);
    warn.mockRestore();
  });

  it("finds invalid values and selections", () => {
    expect(
      dateSelectionProblems({ label: "Días", selection: "multiple", ...monthTexts, value: ["x"] }),
    ).toEqual(["`value` is not a list of YYYY-MM-DD dates; invalid days are ignored"]);
    expect(dateSelectionProblems({ label: "Días", ...monthTexts })).toContain(
      '`selection` must be "range" or "multiple"',
    );
    expect(
      dateSelectionProblems({
        label: "Estancia",
        selection: "range",
        ...rangeTexts,
        value: { from: "2026-08-01", to: null },
      }),
    ).toEqual([]);
  });
});
