import { describe, expect, it } from "vitest";
import { NumberField } from "../number-field";

// Type-level checks: `pnpm typecheck` fails if any `@ts-expect-error` below stops being an error.
// Each element is only constructed, never rendered.
const typeChecks = [
  <NumberField key="plain" label="Amount" stepper={false} />,
  <NumberField
    key="valid-0"
    label="Amount"
    stepper={false}
    expressions
    invalidExpressionLabel="Inválida"
    calculatedFromLabel={(e) => e}
  />,
  // @ts-expect-error `expressions` needs its two texts.
  <NumberField key="expressions" label="Amount" stepper={false} expressions />,
  // @ts-expect-error `calculatedFromLabel` is missing.
  <NumberField
    key="expressions-half"
    label="Amount"
    stepper={false}
    expressions
    invalidExpressionLabel="Inválida"
  />,
  // @ts-expect-error `loading` needs `loadingLabel`.
  <NumberField key="loading" label="Amount" stepper={false} loading />,
  // @ts-expect-error `info` needs `infoLabel`.
  <NumberField key="info" label="Amount" stepper={false} info="Help" />,
  // @ts-expect-error `minusLabel` no longer exists.
  <NumberField key="minus" label="Amount" stepper={false} minusLabel="menos" />,
  // @ts-expect-error The step buttons need their names unless `stepper={false}`.
  <NumberField key="stepper" label="Amount" />,
  <NumberField key="stepper-texts" label="Amount" incrementLabel="Más" decrementLabel="Menos" />,
  // @ts-expect-error Both step names are required.
  <NumberField key="stepper-half" label="Amount" incrementLabel="Más" />,
];

describe("NumberField types", () => {
  it("are checked at compile time", () => {
    expect(typeChecks).toHaveLength(10);
  });
});
