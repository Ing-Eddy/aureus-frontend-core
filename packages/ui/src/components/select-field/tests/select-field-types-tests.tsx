import { render } from "@testing-library/react";
import type { ReactElement } from "react";
import { describe, expect, it, vi } from "vitest";
import { SelectField } from "../select-field";
import { countries } from "./helpers";

const options = countries;

// Type-level checks: `pnpm typecheck` fails if any `@ts-expect-error` below stops being an error.
const typeChecks = [
  <SelectField key="minimal" label="País" options={options} />,
  // @ts-expect-error `searchable` needs `searchLabel`.
  <SelectField key="search" label="País" options={options} searchable />,
  // @ts-expect-error `clearable` needs `clearLabel`.
  <SelectField key="clear" label="País" options={options} clearable />,
  // @ts-expect-error `multiple` needs `multipleDisplay`.
  <SelectField key="multiple" label="País" options={options} multiple />,
  // @ts-expect-error Chips need `removeChipLabel`.
  <SelectField key="chips" label="País" options={options} multiple multipleDisplay="chips" />,
  // @ts-expect-error Summary needs `renderSummary`.
  <SelectField key="summary" label="País" options={options} multiple multipleDisplay="summary" />,
  // @ts-expect-error `creatable` needs `searchable`.
  <SelectField
    key="create"
    label="País"
    options={options}
    creatable
    createLabel={(q) => q}
    onCreate={() => {}}
  />,
  // @ts-expect-error `creatable` needs `createLabel` and `onCreate`.
  <SelectField
    key="creatable-ok"
    label="País"
    options={options}
    searchable
    searchLabel="Buscar"
    creatable
  />,
  // @ts-expect-error Server messages need `searchable`.
  <SelectField key="no-results" label="País" options={options} noResultsMessage="Nada" />,
  // @ts-expect-error Limits are for multiple selection.
  <SelectField key="max" label="País" options={options} maxSelected={2} />,
];

// The texts of the loading state and the info tooltip. Only constructed, never rendered.
const textChecks = [
  <SelectField key="loading-ok" label="A" options={[]} loading loadingLabel="Cargando" />,
  // @ts-expect-error `loading` needs `loadingLabel`.
  <SelectField key="loading" label="A" options={[]} loading />,
  <SelectField key="info-ok" label="A" options={[]} info="Help" infoLabel="Más información" />,
  // @ts-expect-error `info` needs `infoLabel`.
  <SelectField key="info" label="A" options={[]} info="Help" />,
];

describe("SelectField texts", () => {
  it("require the texts of loading and info", () => {
    expect(textChecks).toHaveLength(4);
  });

  it("are enforced by the types", () => {
    expect(typeChecks).toHaveLength(10);
  });

  it("are reported in development for untyped usage", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const Untyped = SelectField as unknown as (props: Record<string, unknown>) => ReactElement;
    render(<Untyped label="País" options={options} clearable searchable />);
    const messages = warn.mock.calls.map((call) => String(call[0]));
    expect(messages).toContain("SelectField: `searchable` needs `searchLabel`.");
    expect(messages).toContain("SelectField: `clearable` needs `clearLabel`.");
    warn.mockRestore();
  });
});
