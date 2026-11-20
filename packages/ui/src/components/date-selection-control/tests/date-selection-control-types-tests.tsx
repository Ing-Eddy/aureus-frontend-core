import { describe, expect, it } from "vitest";
import { DateSelectionControl } from "../date-selection-control";

const months = { previousMonthLabel: "Anterior", nextMonthLabel: "Siguiente" };

// Type-level checks: `pnpm typecheck` fails if any `@ts-expect-error` below stops being an error.
const typeChecks = [
  <DateSelectionControl key="ok" name="days" label="Días" selection="multiple" {...months} />,
  // @ts-expect-error The value comes from the form.
  <DateSelectionControl key="value" name="days" selection="multiple" value={[]} {...months} />,
  <DateSelectionControl
    key="default"
    name="days"
    selection="multiple"
    // @ts-expect-error Default values come from the form.
    defaultValue={[]}
    {...months}
  />,
  // @ts-expect-error The error state comes from the form.
  <DateSelectionControl key="error" name="days" selection="multiple" error {...months} />,
  // @ts-expect-error A range still needs its texts.
  <DateSelectionControl key="range" name="stay" selection="range" {...months} />,
];

describe("DateSelectionControl props", () => {
  it("are checked at compile time", () => {
    expect(typeChecks).toHaveLength(5);
  });
});
