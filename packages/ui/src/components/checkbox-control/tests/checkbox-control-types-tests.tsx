import { describe, expect, it } from "vitest";
import { CheckboxControl } from "../checkbox-control";

// Type-level checks: `pnpm typecheck` fails if any `@ts-expect-error` below stops being an error.
const typeChecks = [
  <CheckboxControl key="ok" name="terms" checkboxLabel="I accept" />,
  <CheckboxControl
    key="custom"
    name="active"
    checkboxLabel="Active"
    checkedValue="S"
    uncheckedValue="N"
    onValueChange={(value) => {
      const literal: "S" | "N" = value;
      return literal;
    }}
  />,
  // @ts-expect-error The form binding comes from the FormProvider context.
  <CheckboxControl key="control" name="terms" control={{}} />,
  // @ts-expect-error Validation lives in the form's schema.
  <CheckboxControl key="rules" name="terms" rules={{ required: true }} />,
  // @ts-expect-error The value comes from the form.
  <CheckboxControl key="value" name="terms" value />,
  // @ts-expect-error Default values come from the form.
  <CheckboxControl key="defaultValue" name="terms" defaultValue />,
  // @ts-expect-error The error state comes from the form.
  <CheckboxControl key="error" name="terms" error />,
  // @ts-expect-error Custom values stay both-or-neither.
  <CheckboxControl key="half" name="active" checkedValue="S" />,
];

describe("CheckboxControl props", () => {
  it("are checked at compile time", () => {
    expect(typeChecks).toHaveLength(8);
  });
});
