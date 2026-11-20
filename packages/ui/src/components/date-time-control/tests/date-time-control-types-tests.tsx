import { describe, expect, it } from "vitest";
import { DateTimeControl } from "../date-time-control";

const texts = {
  openCalendarLabel: "Abrir",
  previousMonthLabel: "Anterior",
  nextMonthLabel: "Siguiente",
};

// Type-level checks: `pnpm typecheck` fails if any `@ts-expect-error` below stops being an error.
const typeChecks = [
  <DateTimeControl key="ok" name="birth" label="Nacimiento" {...texts} />,
  <DateTimeControl key="time" name="hour" label="Hora" mode="time" />,
  // @ts-expect-error The form binding comes from the FormProvider context.
  <DateTimeControl key="control" name="birth" control={{}} {...texts} />,
  // @ts-expect-error The value comes from the form.
  <DateTimeControl key="value" name="birth" value="2026-08-01" {...texts} />,
  // @ts-expect-error Default values come from the form.
  <DateTimeControl key="defaultValue" name="birth" defaultValue="2026-08-01" {...texts} />,
  // @ts-expect-error The error state comes from the form.
  <DateTimeControl key="error" name="birth" error {...texts} />,
  // @ts-expect-error The calendar still needs its texts.
  <DateTimeControl key="texts" name="birth" label="Nacimiento" />,
];

describe("DateTimeControl props", () => {
  it("are checked at compile time", () => {
    expect(typeChecks).toHaveLength(7);
  });
});
