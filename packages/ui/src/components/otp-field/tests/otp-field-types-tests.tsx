import { describe, expect, it } from "vitest";
import { OtpField } from "../otp-field";

// Type-level checks: `pnpm typecheck` fails if any `@ts-expect-error` below stops being an error.
const typeChecks = [
  <OtpField key="ok" label="Code" length={6} onComplete={(code) => code.length} />,
  // @ts-expect-error `length` is required.
  <OtpField key="length" label="Code" />,
  // @ts-expect-error `reveal` needs both texts.
  <OtpField key="reveal" label="PIN" length={4} masked reveal={{ showLabel: "Show" }} />,
  // @ts-expect-error Unknown charset.
  <OtpField key="charset" label="Code" length={4} charset="hex" />,
];

describe("OtpField types", () => {
  it("are checked at compile time", () => {
    expect(typeChecks).toHaveLength(4);
  });
});
