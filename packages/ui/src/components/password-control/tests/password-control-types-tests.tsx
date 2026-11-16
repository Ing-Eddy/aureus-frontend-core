import { describe, expect, it } from "vitest";
import { PasswordControl } from "../password-control";

// Type-level checks: `pnpm typecheck` fails if any `@ts-expect-error` below stops being an error.
// Each element is only constructed, never rendered.
const toggle = { showPasswordLabel: "Show password", hidePasswordLabel: "Hide password" } as const;

const typeChecks = [
  // `name` is a plain string; visibility props pass through.
  <PasswordControl key="name" name="password" {...toggle} label="Password" defaultVisible />,
  // @ts-expect-error The form binding comes from the FormProvider context.
  <PasswordControl key="control" name="password" {...toggle} control={{}} />,
  // @ts-expect-error Validation lives in the form's schema.
  <PasswordControl key="rules" name="password" {...toggle} rules={{ required: true }} />,
  // @ts-expect-error The value comes from the form.
  <PasswordControl key="value" name="password" {...toggle} value="secret" />,
  // @ts-expect-error Default values come from the form.
  <PasswordControl key="defaultValue" name="password" {...toggle} defaultValue="secret" />,
  // @ts-expect-error The error state comes from the form.
  <PasswordControl key="error" name="password" {...toggle} error />,
  // @ts-expect-error The type comes from the visibility state.
  <PasswordControl key="type" name="password" {...toggle} type="text" />,
  // @ts-expect-error The button is always the visibility toggle.
  <PasswordControl key="action" name="password" {...toggle} action={{ children: "Go" }} />,
  // @ts-expect-error The toggle's names are always required.
  <PasswordControl key="toggle-texts" name="password" label="Password" />,
  // @ts-expect-error `info` needs `infoLabel`, also in a control.
  <PasswordControl key="info" name="password" {...toggle} info="Help" />,
];

describe("PasswordControl props", () => {
  it("are checked at compile time", () => {
    expect(typeChecks).toHaveLength(10);
  });
});
