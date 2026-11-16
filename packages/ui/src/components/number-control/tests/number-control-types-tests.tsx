import { describe, expect, it } from "vitest";
import { NumberControl } from "../number-control";

// Type-level checks: `pnpm typecheck` fails if any `@ts-expect-error` below stops being an error.
// Each element is only constructed, never rendered.
const stepper = { incrementLabel: "Increase", decrementLabel: "Decrease" } as const;

const typeChecks = [
  // `name` is a plain string; number props pass through.
  <NumberControl
    key="name"
    name="amount"
    {...stepper}
    label="Amount"
    currency="USD"
    decimals={2}
    grouping
  />,
  // @ts-expect-error The form binding comes from the FormProvider context.
  <NumberControl key="control" name="amount" {...stepper} control={{}} />,
  // @ts-expect-error Validation lives in the form's schema.
  <NumberControl key="rules" name="amount" {...stepper} rules={{ required: true }} />,
  // @ts-expect-error The value comes from the form.
  <NumberControl key="value" name="amount" {...stepper} value={5} />,
  // @ts-expect-error Default values come from the form.
  <NumberControl key="defaultValue" name="amount" {...stepper} defaultValue={5} />,
  // @ts-expect-error The error state comes from the form.
  <NumberControl key="error" name="amount" {...stepper} error />,
  // @ts-expect-error The input type is fixed.
  <NumberControl key="type" name="amount" {...stepper} type="number" />,
  // @ts-expect-error `step` is a number.
  <NumberControl key="step" name="amount" {...stepper} step="0.1" />,
  // @ts-expect-error The step buttons need their names unless `stepper={false}`.
  <NumberControl key="stepper-texts" name="amount" label="Amount" />,
  <NumberControl key="no-stepper" name="amount" label="Amount" stepper={false} />,
  // @ts-expect-error `expressions` needs its texts.
  <NumberControl key="expressions" name="amount" stepper={false} expressions />,
  // @ts-expect-error `loading` needs `loadingLabel`, also in a control.
  <NumberControl key="loading" name="amount" stepper={false} loading />,
];

describe("NumberControl props", () => {
  it("are checked at compile time", () => {
    expect(typeChecks).toHaveLength(12);
  });
});
