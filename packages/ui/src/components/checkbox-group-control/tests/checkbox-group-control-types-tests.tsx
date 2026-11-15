import { describe, expect, it } from "vitest";
import { CheckboxGroupControl } from "../checkbox-group-control";

const options = [{ value: "email", label: "Email" }];

// Type-level checks: `pnpm typecheck` fails if any `@ts-expect-error` below stops being an error.
const typeChecks = [
  <CheckboxGroupControl key="ok" name="channels" label="Channels" options={options} />,
  // @ts-expect-error The form binding comes from the FormProvider context.
  <CheckboxGroupControl key="control" name="channels" options={options} control={{}} />,
  // @ts-expect-error Validation lives in the form's schema.
  <CheckboxGroupControl key="rules" name="channels" options={options} rules={{ required: true }} />,
  // @ts-expect-error The value comes from the form.
  <CheckboxGroupControl key="value" name="channels" options={options} value={["email"]} />,
  // @ts-expect-error Default values come from the form.
  <CheckboxGroupControl key="defaultValue" name="channels" options={options} defaultValue={[]} />,
  // @ts-expect-error The error state comes from the form.
  <CheckboxGroupControl key="error" name="channels" options={options} error />,
  // @ts-expect-error `selectAll` still needs its label.
  <CheckboxGroupControl key="select-all" name="channels" options={options} selectAll={{}} />,
];

describe("CheckboxGroupControl props", () => {
  it("are checked at compile time", () => {
    expect(typeChecks).toHaveLength(7);
  });
});
