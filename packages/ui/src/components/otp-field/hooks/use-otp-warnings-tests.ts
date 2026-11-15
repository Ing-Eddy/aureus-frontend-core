import { renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { otpProblems, useOtpWarnings } from "./use-otp-warnings";

afterEach(() => vi.restoreAllMocks());

describe("useOtpWarnings", () => {
  it("names every problem", () => {
    expect(otpProblems({ label: "Code", length: 6 })).toEqual([]);
    expect(otpProblems({ length: 6 })[0]).toContain("no accessible name");
    expect(otpProblems({ label: "Code", length: 6, groups: [3, 2] })[0]).toContain("[3, 2]");
    expect(otpProblems({ label: "PIN", length: 4, reveal: {} })[0]).toContain(
      "`reveal` only works",
    );
    expect(
      otpProblems({ label: "Code", length: 4, rawValue: "12345", sanitizedValue: "1234" })[0],
    ).toContain('"12345"');
  });

  it("warns once per problem", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const { rerender } = renderHook(() => useOtpWarnings("OtpField", { length: 6 }));
    rerender();
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn.mock.calls[0]?.[0]).toContain("OtpField:");
  });
});
