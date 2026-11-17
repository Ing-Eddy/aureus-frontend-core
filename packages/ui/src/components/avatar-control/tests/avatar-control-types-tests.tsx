import { describe, expect, it } from "vitest";
import { AvatarControl } from "../avatar-control";
import { texts } from "./render-in-form";

// Type-level checks: `pnpm typecheck` fails if any `@ts-expect-error` below stops being an error.
// Each element is only constructed, never rendered.
const typeChecks = [
  <AvatarControl key="name" {...texts} name="photo" label="Foto" shape="square" />,
  // @ts-expect-error The form binding comes from the FormProvider context.
  <AvatarControl key="control" {...texts} name="photo" control={{}} />,
  // @ts-expect-error Validation lives in the form's schema.
  <AvatarControl key="rules" {...texts} name="photo" rules={{ required: true }} />,
  // @ts-expect-error The value comes from the form.
  <AvatarControl key="value" {...texts} name="photo" value={null} />,
  // @ts-expect-error The error state comes from the form.
  <AvatarControl key="error" {...texts} name="photo" error />,
  // @ts-expect-error `removable` needs `removeLabel`, also in a control.
  <AvatarControl key="remove" {...texts} name="photo" removable />,
];

describe("AvatarControl props", () => {
  it("are checked at compile time", () => {
    expect(typeChecks).toHaveLength(6);
  });
});
