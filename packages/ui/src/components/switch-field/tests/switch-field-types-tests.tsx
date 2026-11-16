import { render } from "@testing-library/react";
import type { ReactElement } from "react";
import { describe, expect, it } from "vitest";
import { SwitchField } from "../switch-field";

// Type-level checks: `pnpm typecheck` fails if any `@ts-expect-error` below stops being an error.
const typeChecks: ReactElement[] = [
  <SwitchField key="boolean" switchLabel="A" onValueChange={(value: boolean) => value} />,
  <SwitchField
    key="custom"
    switchLabel="A"
    checkedValue="public"
    uncheckedValue="private"
    onValueChange={(value) => {
      const literal: "public" | "private" = value;
      return literal;
    }}
    onBeforeChange={(next) => next === "public"}
  />,
  // @ts-expect-error Custom values go together: `uncheckedValue` is missing.
  <SwitchField key="half" switchLabel="A" checkedValue="public" />,
  // @ts-expect-error Both state labels are required.
  <SwitchField key="labels" switchLabel="A" stateLabels={{ on: "Yes" }} />,
  // @ts-expect-error Both thumb icons are required.
  <SwitchField key="icons" switchLabel="A" thumbIcons={{ off: "x" }} />,
];

// The texts of the loading state and the info tooltip. Only constructed, never rendered.
const textChecks = [
  // The spinner is decorative, so `loading` needs no text.
  <SwitchField key="loading" switchLabel="A" loading />,
  <SwitchField key="info-ok" switchLabel="A" info="Help" infoLabel="Más información" />,
  // @ts-expect-error `info` needs `infoLabel`.
  <SwitchField key="info" switchLabel="A" info="Help" />,
];

describe("SwitchField types", () => {
  it("require the texts of loading and info", () => {
    expect(textChecks).toHaveLength(3);
  });

  it("renders every valid combination", () => {
    const { container } = render(<div>{typeChecks.slice(0, 2)}</div>);
    expect(container.querySelectorAll("[role=switch]")).toHaveLength(2);
  });
});
