import { screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { OtpField } from "../otp-field";
import { input, renderField, typeInto } from "./helpers";

describe("OtpField states", () => {
  it("does not take input while loading, with a spinner and aria-busy", async () => {
    const onValueChange = vi.fn();
    renderField(
      <OtpField
        loadingLabel="Loading"
        label="Code"
        length={4}
        loading
        onValueChange={onValueChange}
      />,
    );
    await typeInto(input("Code"), "12");
    expect(onValueChange).not.toHaveBeenCalled();
    expect(input("Code").getAttribute("aria-busy")).toBe("true");
    expect(screen.getByLabelText("Loading")).toBeTruthy();
  });

  it("does not take input while disabled", async () => {
    const onValueChange = vi.fn();
    renderField(<OtpField label="Code" length={4} disabled onValueChange={onValueChange} />);
    await typeInto(input("Code"), "12");
    expect(onValueChange).not.toHaveBeenCalled();
    expect(input("Code").disabled).toBe(true);
  });

  it("shows the error message in place of the helper text", () => {
    renderField(
      <OtpField label="Code" length={4} helperText="Help" error errorMessage="Wrong code." />,
    );
    expect(screen.getByRole("alert").textContent).toBe("Wrong code.");
  });

  it("focuses on mount with autoFocus and forwards the ref", () => {
    const ref = createRef<HTMLInputElement>();
    renderField(<OtpField label="Code" length={4} autoFocus ref={ref} />);
    expect(ref.current).toBe(input("Code"));
    expect(document.activeElement).toBe(input("Code"));
  });
});
