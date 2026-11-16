import { describe, expect, it } from "vitest";
import { RadioGroupField } from "../radio-group-field";
import { plans } from "./helpers";

// Type-level checks: `pnpm typecheck` fails if any `@ts-expect-error` below stops being an error.
const typeChecks = [
  <RadioGroupField
    key="ok"
    label="Plan"
    options={plans}
    otherOption={{ label: "Other", inputLabel: "Other plan" }}
    onValueChange={(value) => value?.toUpperCase()}
  />,
  // @ts-expect-error `otherOption` needs `inputLabel`.
  <RadioGroupField key="other" label="Plan" options={plans} otherOption={{ label: "Other" }} />,
  // @ts-expect-error The value is a string or null.
  <RadioGroupField key="value" label="Plan" options={plans} value={["pro"]} />,
  // @ts-expect-error Columns go from 2 to 4.
  <RadioGroupField key="columns" label="Plan" options={plans} columns={5} />,
];

// The texts of the loading state and the info tooltip. Only constructed, never rendered.
const textChecks = [
  <RadioGroupField key="loading-ok" label="A" options={[]} loading loadingLabel="Cargando" />,
  // @ts-expect-error `loading` needs `loadingLabel`.
  <RadioGroupField key="loading" label="A" options={[]} loading />,
  <RadioGroupField key="info-ok" label="A" options={[]} info="Help" infoLabel="Más información" />,
  // @ts-expect-error `info` needs `infoLabel`.
  <RadioGroupField key="info" label="A" options={[]} info="Help" />,
];

describe("RadioGroupField types", () => {
  it("require the texts of loading and info", () => {
    expect(textChecks).toHaveLength(4);
  });

  it("are checked at compile time", () => {
    expect(typeChecks).toHaveLength(4);
  });
});
