import { describe, expect, it } from "vitest";
import { TextAreaControl } from "../text-area-control";

// Type-level checks: `pnpm typecheck` fails if any `@ts-expect-error` below stops being an error.
// Each element is only constructed, never rendered.
const typeChecks = [
  // `name` is a plain string; text-area props pass through.
  <TextAreaControl key="name" name="bio" label="Bio" minRows={4} showCount actionShortcut />,
  // @ts-expect-error The form binding comes from the FormProvider context.
  <TextAreaControl key="control" name="bio" control={{}} />,
  // @ts-expect-error Validation lives in the form's schema.
  <TextAreaControl key="rules" name="bio" rules={{ required: true }} />,
  // @ts-expect-error The value comes from the form.
  <TextAreaControl key="value" name="bio" value="Hi" />,
  // @ts-expect-error Default values come from the form.
  <TextAreaControl key="defaultValue" name="bio" defaultValue="Hi" />,
  // @ts-expect-error The error state comes from the form.
  <TextAreaControl key="error" name="bio" error />,
  // @ts-expect-error `rows` is replaced by `minRows`.
  <TextAreaControl key="rows" name="bio" rows={2} />,
];

describe("TextAreaControl props", () => {
  it("are checked at compile time", () => {
    expect(typeChecks).toHaveLength(7);
  });
});
