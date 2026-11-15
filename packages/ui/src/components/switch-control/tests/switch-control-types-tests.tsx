import { describe, expect, it } from "vitest";
import { SwitchControl } from "../switch-control";

// Type-level checks: `pnpm typecheck` fails if any `@ts-expect-error` below stops being an error.
const typeChecks = [
  <SwitchControl key="ok" name="alerts" switchLabel="Alerts" />,
  <SwitchControl
    key="custom"
    name="visibility"
    switchLabel="Public"
    checkedValue="public"
    uncheckedValue="private"
    onBeforeChange={(next) => next === "public"}
  />,
  // @ts-expect-error The form binding comes from the FormProvider context.
  <SwitchControl key="control" name="alerts" control={{}} />,
  // @ts-expect-error The value comes from the form.
  <SwitchControl key="value" name="alerts" value />,
  // @ts-expect-error The error state comes from the form.
  <SwitchControl key="error" name="alerts" error />,
  // @ts-expect-error Custom values stay both-or-neither.
  <SwitchControl key="half" name="visibility" checkedValue="public" />,
  // @ts-expect-error Both state labels are required.
  <SwitchControl key="labels" name="alerts" stateLabels={{ on: "On" }} />,
];

describe("SwitchControl props", () => {
  it("are checked at compile time", () => {
    expect(typeChecks).toHaveLength(7);
  });
});
