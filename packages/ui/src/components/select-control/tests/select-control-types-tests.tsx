import { describe, expect, it } from "vitest";
import { SelectControl } from "../select-control";

const options = [{ value: "es", label: "España" }];

// Type-level checks: `pnpm typecheck` fails if any `@ts-expect-error` below stops being an error.
const typeChecks = [
  <SelectControl key="ok" name="country" label="Country" options={options} />,
  // @ts-expect-error The form binding comes from the FormProvider context.
  <SelectControl key="control" name="country" options={options} control={{}} />,
  // @ts-expect-error Validation lives in the form's schema.
  <SelectControl key="rules" name="country" options={options} rules={{ required: true }} />,
  // @ts-expect-error The value comes from the form.
  <SelectControl key="value" name="country" options={options} value="es" />,
  // @ts-expect-error Default values come from the form.
  <SelectControl key="defaultValue" name="country" options={options} defaultValue="es" />,
  // @ts-expect-error The error state comes from the form.
  <SelectControl key="error" name="country" options={options} error />,
  // @ts-expect-error Feature texts stay required: `clearable` needs `clearLabel`.
  <SelectControl key="clear" name="country" options={options} clearable />,
  // @ts-expect-error Feature texts stay required: chips need `removeChipLabel`.
  <SelectControl key="chips" name="tags" options={options} multiple multipleDisplay="chips" />,
];

describe("SelectControl props", () => {
  it("are checked at compile time", () => {
    expect(typeChecks).toHaveLength(8);
  });
});
