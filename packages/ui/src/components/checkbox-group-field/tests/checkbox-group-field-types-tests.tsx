import { describe, expect, it } from "vitest";
import { CheckboxGroupField } from "../checkbox-group-field";
import { channels } from "./helpers";

// Type-level checks: `pnpm typecheck` fails if any `@ts-expect-error` below stops being an error.
const typeChecks = [
  <CheckboxGroupField
    key="ok"
    label="Channels"
    options={channels}
    selectAll={{ label: "All" }}
    onValueChange={(value) => value.join(",")}
  />,
  // @ts-expect-error `selectAll` needs its label.
  <CheckboxGroupField key="select-all" label="Channels" options={channels} selectAll={{}} />,
  // @ts-expect-error The value is an array of strings.
  <CheckboxGroupField key="value" label="Channels" options={channels} value="email" />,
  // @ts-expect-error Columns go from 2 to 4.
  <CheckboxGroupField key="columns" label="Channels" options={channels} columns={5} />,
];

// The texts of the loading state and the info tooltip. Only constructed, never rendered.
const textChecks = [
  <CheckboxGroupField key="loading-ok" label="A" options={[]} loading loadingLabel="Cargando" />,
  // @ts-expect-error `loading` needs `loadingLabel`.
  <CheckboxGroupField key="loading" label="A" options={[]} loading />,
  <CheckboxGroupField
    key="info-ok"
    label="A"
    options={[]}
    info="Help"
    infoLabel="Más información"
  />,
  // @ts-expect-error `info` needs `infoLabel`.
  <CheckboxGroupField key="info" label="A" options={[]} info="Help" />,
];

describe("CheckboxGroupField types", () => {
  it("require the texts of loading and info", () => {
    expect(textChecks).toHaveLength(4);
  });

  it("are checked at compile time", () => {
    expect(typeChecks).toHaveLength(4);
  });
});
