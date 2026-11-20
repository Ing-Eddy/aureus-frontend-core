import { describe, expect, it, vi } from "vitest";
import { DateTimeField } from "../date-time-field";
import { calendarTexts, renderField } from "./helpers";

// Type-level checks: `pnpm typecheck` fails if any `@ts-expect-error` below stops being an error.
const typeChecks = [
  <DateTimeField key="date" label="Fecha" {...calendarTexts} onValueChange={(v) => v?.length} />,
  <DateTimeField key="time" label="Hora" mode="time" hourCycle={12} minuteStep={5} />,
  <DateTimeField
    key="datetime"
    label="Reunión"
    mode="datetime"
    granularity="second"
    {...calendarTexts}
  />,
  // @ts-expect-error A calendar needs `openCalendarLabel`, `previousMonthLabel` and `nextMonthLabel`.
  <DateTimeField key="no-texts" label="Fecha" />,
  // @ts-expect-error A calendar needs `openCalendarLabel`.
  <DateTimeField key="no-open" label="Fecha" previousMonthLabel="A" nextMonthLabel="B" />,
  // @ts-expect-error `presets` needs `presetsLabel`.
  <DateTimeField
    key="presets"
    label="Fecha"
    presets={[{ label: "Hoy", value: "2026-08-10" }]}
    {...calendarTexts}
  />,
  // @ts-expect-error `presets` are not allowed with `mode="time"`.
  <DateTimeField key="time-presets" label="Hora" mode="time" presets={[]} presetsLabel="Atajos" />,
  // @ts-expect-error `isDateDisabled` needs a calendar.
  <DateTimeField key="time-disabled" label="Hora" mode="time" isDateDisabled={() => false} />,
  // @ts-expect-error Calendar texts are not allowed with `mode="time"`.
  <DateTimeField key="time-texts" label="Hora" mode="time" {...calendarTexts} />,
  // @ts-expect-error Time options need a time.
  <DateTimeField key="date-steps" label="Fecha" minuteStep={15} {...calendarTexts} />,
  // @ts-expect-error `loading` needs `loadingLabel`.
  <DateTimeField key="loading" label="Fecha" loading {...calendarTexts} />,
  // @ts-expect-error `info` needs `infoLabel`.
  <DateTimeField key="info" label="Fecha" info="Más" {...calendarTexts} />,
  // @ts-expect-error The value is a string.
  <DateTimeField key="date-value" label="Fecha" value={new Date()} {...calendarTexts} />,
];

describe("DateTimeField types", () => {
  it("are checked by the compiler", () => {
    expect(typeChecks).toHaveLength(13);
  });

  it("needs no calendar texts, and warns about nothing, in time mode", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    renderField(<DateTimeField label="Hora" mode="time" />);
    expect(warn).not.toHaveBeenCalled();
    warn.mockRestore();
  });
});
