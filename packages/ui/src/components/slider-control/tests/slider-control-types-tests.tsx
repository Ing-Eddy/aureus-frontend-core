import { describe, expect, it } from "vitest";
import { SliderControl } from "../slider-control";

// Type-level checks: `pnpm typecheck` fails if any `@ts-expect-error` below stops being an error.
const typeChecks = [
  <SliderControl key="ok" name="volume" label="Volumen" />,
  <SliderControl key="range" name="price" label="Precio" range thumbLabels={["Mín", "Máx"]} />,
  // @ts-expect-error The form binding comes from the FormProvider context.
  <SliderControl key="control" name="volume" control={{}} />,
  // @ts-expect-error Validation lives in the form's schema.
  <SliderControl key="rules" name="volume" rules={{ required: true }} />,
  // @ts-expect-error The value comes from the form.
  <SliderControl key="value" name="volume" value={3} />,
  // @ts-expect-error Default values come from the form.
  <SliderControl key="defaultValue" name="volume" defaultValue={3} />,
  // @ts-expect-error The error state comes from the form.
  <SliderControl key="error" name="volume" error />,
  // @ts-expect-error `range` still needs `thumbLabels`.
  <SliderControl key="thumbs" name="price" range />,
  // @ts-expect-error `withInput` still needs `inputLabel`.
  <SliderControl key="input" name="volume" withInput />,
];

describe("SliderControl props", () => {
  it("are checked at compile time", () => {
    expect(typeChecks).toHaveLength(9);
  });
});
