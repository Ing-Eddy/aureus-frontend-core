import { describe, expect, it } from "vitest";
import { RadioGroupControl } from "../radio-group-control";

const options = [{ value: "pro", label: "Pro" }];

// Type-level checks: `pnpm typecheck` fails if any `@ts-expect-error` below stops being an error.
const typeChecks = [
  <RadioGroupControl key="ok" name="plan" label="Plan" options={options} />,
  // @ts-expect-error The form binding comes from the FormProvider context.
  <RadioGroupControl key="control" name="plan" options={options} control={{}} />,
  // @ts-expect-error Validation lives in the form's schema.
  <RadioGroupControl key="rules" name="plan" options={options} rules={{ required: true }} />,
  // @ts-expect-error The value comes from the form.
  <RadioGroupControl key="value" name="plan" options={options} value="pro" />,
  // @ts-expect-error Default values come from the form.
  <RadioGroupControl key="defaultValue" name="plan" options={options} defaultValue="pro" />,
  // @ts-expect-error The error state comes from the form.
  <RadioGroupControl key="error" name="plan" options={options} error />,
  // @ts-expect-error `otherOption` still needs `inputLabel`.
  <RadioGroupControl key="other" name="plan" options={options} otherOption={{ label: "Other" }} />,
];

describe("RadioGroupControl props", () => {
  it("are checked at compile time", () => {
    expect(typeChecks).toHaveLength(7);
  });
});
