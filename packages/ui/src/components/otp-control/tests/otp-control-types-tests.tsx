import { describe, expect, it } from "vitest";
import { OtpControl } from "../otp-control";

// Type-level checks: `pnpm typecheck` fails if any `@ts-expect-error` below stops being an error.
const typeChecks = [
  <OtpControl key="ok" name="code" label="Code" length={6} />,
  // @ts-expect-error The form binding comes from the FormProvider context.
  <OtpControl key="control" name="code" length={6} control={{}} />,
  // @ts-expect-error The value comes from the form.
  <OtpControl key="value" name="code" length={6} value="123456" />,
  // @ts-expect-error The error state comes from the form.
  <OtpControl key="error" name="code" length={6} error />,
  // @ts-expect-error `length` is still required.
  <OtpControl key="length" name="code" />,
  // @ts-expect-error `reveal` still needs both texts.
  <OtpControl key="reveal" name="pin" length={4} masked reveal={{ hideLabel: "Hide" }} />,
];

describe("OtpControl props", () => {
  it("are checked at compile time", () => {
    expect(typeChecks).toHaveLength(6);
  });
});
