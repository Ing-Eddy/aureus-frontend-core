import { describe, expect, it } from "vitest";
import { TextAreaField } from "../text-area-field";

// Type-level checks: `pnpm typecheck` fails if any `@ts-expect-error` below stops being an error.
// Each element is only constructed, never rendered.
const typeChecks = [
  <TextAreaField key="plain" label="Bio" />,
  <TextAreaField
    key="valid-0"
    label="Bio"
    showCount
    countLabel={(count, max) => `${count}/${max ?? "∞"}`}
  />,
  // @ts-expect-error `showCount` needs `countLabel`.
  <TextAreaField key="count" label="Bio" showCount />,
  // @ts-expect-error `countLabel` is only allowed with `showCount`.
  <TextAreaField key="count-label-only" label="Bio" countLabel={(count) => `${count}`} />,
  // @ts-expect-error `loading` needs `loadingLabel`.
  <TextAreaField key="loading" label="Bio" loading />,
  // @ts-expect-error `info` needs `infoLabel`.
  <TextAreaField key="info" label="Bio" info="Help" />,
];

describe("TextAreaField types", () => {
  it("are checked at compile time", () => {
    expect(typeChecks).toHaveLength(6);
  });
});
