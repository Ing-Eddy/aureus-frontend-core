import { render } from "@testing-library/react";
import type { ReactElement } from "react";
import { describe, expect, it } from "vitest";
import { CheckboxField } from "../checkbox-field";

// Type-level checks: `pnpm typecheck` fails if any `@ts-expect-error` below stops being an error.
const typeChecks: ReactElement[] = [
  <CheckboxField key="boolean" checkboxLabel="A" onValueChange={(value: boolean) => value} />,
  <CheckboxField
    key="custom"
    checkboxLabel="A"
    checkedValue="S"
    uncheckedValue="N"
    onValueChange={(value) => {
      const literal: "S" | "N" = value;
      return literal;
    }}
  />,
  <CheckboxField key="numbers" checkboxLabel="A" checkedValue={1} uncheckedValue={0} value={1} />,
  // @ts-expect-error Custom values go together: `uncheckedValue` is missing.
  <CheckboxField key="only-checked" checkboxLabel="A" checkedValue="S" />,
  // @ts-expect-error Custom values go together: `checkedValue` is missing.
  <CheckboxField key="only-unchecked" checkboxLabel="A" uncheckedValue="N" />,
  // @ts-expect-error A boolean value does not fit string custom values.
  <CheckboxField key="mixed" checkboxLabel="A" checkedValue="S" uncheckedValue="N" value />,
  // @ts-expect-error Without custom values the value is a boolean.
  <CheckboxField key="string-value" checkboxLabel="A" value="S" />,
];

// The texts of the loading state and the info tooltip. Only constructed, never rendered.
const textChecks = [
  <CheckboxField key="loading-ok" checkboxLabel="A" loading loadingLabel="Cargando" />,
  // @ts-expect-error `loading` needs `loadingLabel`.
  <CheckboxField key="loading" checkboxLabel="A" loading />,
  <CheckboxField key="info-ok" checkboxLabel="A" info="Help" infoLabel="Más información" />,
  // @ts-expect-error `info` needs `infoLabel`.
  <CheckboxField key="info" checkboxLabel="A" info="Help" />,
];

describe("CheckboxField types", () => {
  it("require the texts of loading and info", () => {
    expect(textChecks).toHaveLength(4);
  });

  it("renders every valid combination", () => {
    const { container } = render(<div>{typeChecks.slice(0, 3)}</div>);
    expect(container.querySelectorAll("[role=checkbox]")).toHaveLength(3);
  });
});
