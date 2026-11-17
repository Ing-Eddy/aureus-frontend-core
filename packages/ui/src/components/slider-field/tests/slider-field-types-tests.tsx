import { describe, expect, it } from "vitest";
import { SliderField } from "../slider-field";

// Type-level checks: `pnpm typecheck` fails if any `@ts-expect-error` below stops being an error.
const typeChecks = [
  <SliderField key="single" label="Volume" onValueChange={(value) => value.toFixed()} />,
  <SliderField
    key="range"
    label="Price"
    range
    thumbLabels={["Low", "High"]}
    onValueChange={([low, high]) => low + high}
  />,
  // @ts-expect-error `range` needs `thumbLabels`.
  <SliderField key="no-thumbs" label="Price" range />,
  // @ts-expect-error `thumbLabels` needs `range`.
  <SliderField key="thumbs-single" label="Volume" thumbLabels={["Low", "High"]} />,
  // @ts-expect-error A pair needs `range`.
  <SliderField key="pair-single" label="Volume" value={[1, 2]} />,
  // @ts-expect-error `range` takes a pair.
  <SliderField key="number-range" label="Price" range thumbLabels={["Low", "High"]} value={3} />,
  // @ts-expect-error `minDistance` needs `range`.
  <SliderField key="distance" label="Volume" minDistance={5} />,
  // @ts-expect-error `showValue` is "none", "header" or "tooltip".
  <SliderField key="show" label="Volume" showValue="always" />,
];

// The texts of the linked inputs, loading and info. Only constructed, never rendered.
const textChecks = [
  <SliderField key="input-ok" label="Volume" withInput inputLabel="Exact" />,
  // @ts-expect-error `withInput` needs `inputLabel`.
  <SliderField key="input" label="Volume" withInput />,
  // @ts-expect-error `withInput` with `range` needs `inputLabels`.
  <SliderField
    key="inputs"
    label="Price"
    range
    thumbLabels={["A", "B"]}
    withInput
    inputLabel="X"
  />,
  <SliderField
    key="inputs-ok"
    label="Price"
    range
    thumbLabels={["A", "B"]}
    withInput
    inputLabels={["From", "To"]}
  />,
  // @ts-expect-error `loading` needs `loadingLabel`.
  <SliderField key="loading" label="Volume" loading />,
  // @ts-expect-error `info` needs `infoLabel`.
  <SliderField key="info" label="Volume" info="Help" />,
];

describe("SliderField types", () => {
  it("require the texts of each feature", () => {
    expect(textChecks).toHaveLength(6);
  });

  it("are checked at compile time", () => {
    expect(typeChecks).toHaveLength(8);
  });
});
