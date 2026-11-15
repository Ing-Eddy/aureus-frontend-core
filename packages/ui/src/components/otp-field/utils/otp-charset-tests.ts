import { describe, expect, it } from "vitest";
import { resolveCharset, sanitizeOtp, transformPastedOtp } from "./otp-charset";

describe("otp charset", () => {
  it("maps each charset to a pattern and a mobile keyboard", () => {
    expect(resolveCharset().inputMode).toBe("numeric");
    expect(resolveCharset("letters").inputMode).toBe("text");
    expect(resolveCharset("alphanumeric").pattern).toContain("a-zA-Z0-9");
    expect(resolveCharset({ pattern: "^[0-9A-F]+$" })).toEqual({
      pattern: "^[0-9A-F]+$",
      inputMode: "text",
    });
    expect(resolveCharset({ pattern: "^[0-7]+$", inputMode: "numeric" }).inputMode).toBe("numeric");
  });

  it("drops characters outside the set and trims to length", () => {
    expect(sanitizeOtp("12a3b456789", { length: 6 })).toBe("123456");
    expect(sanitizeOtp("ab12", { length: 6, charset: "alphanumeric", uppercase: true })).toBe(
      "AB12",
    );
    expect(sanitizeOtp("AbC9", { length: 6, charset: "letters" })).toBe("AbC");
  });

  it("removes spaces and dashes from pasted codes", () => {
    expect(transformPastedOtp("123 456", { length: 6 })).toBe("123456");
    expect(transformPastedOtp("123-456", { length: 6 })).toBe("123456");
    expect(
      transformPastedOtp(" ab-cd 12 ", { length: 6, charset: "alphanumeric", uppercase: true }),
    ).toBe("ABCD12");
  });
});
