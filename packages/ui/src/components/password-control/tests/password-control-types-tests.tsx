import { describe, expect, it } from "vitest";
import { PasswordControl } from "../password-control";

// Type-level checks: `pnpm typecheck` fails if any `@ts-expect-error` below stops being an error.
// Each element is only constructed, never rendered.
const typeChecks = [
  // `name` is a plain string; visibility props pass through.
  <PasswordControl key="name" name="password" label="Password" defaultVisible />,
  // @ts-expect-error The form binding comes from the FormProvider context.
  <PasswordControl key="control" name="password" control={{}} />,
  // @ts-expect-error Validation lives in the form's schema.
  <PasswordControl key="rules" name="password" rules={{ required: true }} />,
  // @ts-expect-error The value comes from the form.
  <PasswordControl key="value" name="password" value="secret" />,
  // @ts-expect-error Default values come from the form.
  <PasswordControl key="defaultValue" name="password" defaultValue="secret" />,
  // @ts-expect-error The error state comes from the form.
  <PasswordControl key="error" name="password" error />,
  // @ts-expect-error The type comes from the visibility state.
  <PasswordControl key="type" name="password" type="text" />,
  // @ts-expect-error The button is always the visibility toggle.
  <PasswordControl key="action" name="password" action={{ children: "Go" }} />,
];

describe("PasswordControl props", () => {
  it("are checked at compile time", () => {
    expect(typeChecks).toHaveLength(8);
  });
});
