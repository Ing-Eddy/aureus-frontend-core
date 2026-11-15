import { screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { OtpField } from "../otp-field";
import { input, renderField } from "./helpers";

afterEach(() => vi.restoreAllMocks());

describe("OtpField accessibility", () => {
  it("exposes one labelled, described input with SMS autofill", () => {
    renderField(
      <OtpField
        id="code"
        label="Code"
        length={6}
        helperText="We sent it by SMS."
        info="It expires in 10 minutes."
        required
        error
      />,
    );
    const field = input(/^Code/);
    expect(screen.getAllByRole("textbox")).toHaveLength(1);
    expect(field.getAttribute("aria-describedby")?.split(" ")).toEqual([
      "code-helper",
      "code-info",
    ]);
    expect(field.getAttribute("autocomplete")).toBe("one-time-code");
    expect(field.getAttribute("inputmode")).toBe("numeric");
    expect(field.getAttribute("maxlength")).toBe("6");
    expect(field.getAttribute("aria-invalid")).toBe("true");
    expect(field.getAttribute("aria-required")).toBe("true");
  });

  it("hides the boxes from assistive technology and keeps them left to right", () => {
    const { container } = renderField(<OtpField label="Code" length={4} defaultValue="12" />);
    const slots = container.querySelector("[data-slot=otp-slots]");
    expect(slots?.getAttribute("aria-hidden")).toBe("true");
    expect(slots?.getAttribute("dir")).toBe("ltr");
    expect(input("Code").getAttribute("dir")).toBe("ltr");
  });

  it("warns without a name, and accepts aria-label", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const { unmount } = renderField(<OtpField length={4} />);
    expect(warn).toHaveBeenCalledWith(expect.stringContaining("no accessible name"));
    unmount();
    warn.mockClear();
    renderField(<OtpField aria-label="PIN" length={4} />);
    expect(input("PIN")).toBeTruthy();
    expect(warn).not.toHaveBeenCalled();
  });
});
