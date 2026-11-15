import { describe, expect, it } from "vitest";
import { NumberControl } from "../number-control";

// Type-level checks: `pnpm typecheck` fails if any `@ts-expect-error` below stops being an error.
// Each element is only constructed, never rendered.
const typeChecks = [
  // `name` is a plain string; number props pass through.
  <NumberControl key="name" name="amount" label="Amount" currency="USD" decimals={2} grouping />,
  // @ts-expect-error The form binding comes from the FormProvider context.
  <NumberControl key="control" name="amount" control={{}} />,
  // @ts-expect-error Validation lives in the form's schema.
  <NumberControl key="rules" name="amount" rules={{ required: true }} />,
  // @ts-expect-error The value comes from the form.
  <NumberControl key="value" name="amount" value={5} />,
  // @ts-expect-error Default values come from the form.
  <NumberControl key="defaultValue" name="amount" defaultValue={5} />,
  // @ts-expect-error The error state comes from the form.
  <NumberControl key="error" name="amount" error />,
  // @ts-expect-error The input type is fixed.
  <NumberControl key="type" name="amount" type="number" />,
  // @ts-expect-error `step` is a number.
  <NumberControl key="step" name="amount" step="0.1" />,
];

describe("NumberControl props", () => {
  it("are checked at compile time", () => {
    expect(typeChecks).toHaveLength(8);
  });
});
