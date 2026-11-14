import { describe, expect, it } from "vitest";
import { TextControl } from "../text-control";

// Type-level checks: `pnpm typecheck` fails if any `@ts-expect-error` below stops being an error.
// Each element is only constructed, never rendered.
const typeChecks = [
  // `name` is a plain string: no type parameters needed.
  <TextControl key="name" name="username" label="Username" />,
  // @ts-expect-error The form binding comes from the FormProvider context.
  <TextControl key="control" name="username" control={{}} />,
  // @ts-expect-error Validation lives in the form's schema.
  <TextControl key="rules" name="username" rules={{ required: true }} />,
  // @ts-expect-error The value comes from the form.
  <TextControl key="value" name="username" value="ada" />,
  // @ts-expect-error Default values come from the form.
  <TextControl key="defaultValue" name="username" defaultValue="ada" />,
  // @ts-expect-error The error state comes from the form.
  <TextControl key="error" name="username" error />,
  // @ts-expect-error The input is always `type="text"`.
  <TextControl key="type" name="username" type="email" />,
  // @ts-expect-error `name` is required.
  <TextControl key="missing-name" label="Username" />,
];

describe("TextControl props", () => {
  it("are checked at compile time", () => {
    expect(typeChecks).toHaveLength(8);
  });
});
