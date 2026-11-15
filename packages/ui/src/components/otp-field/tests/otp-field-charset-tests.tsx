import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { OtpField } from "../otp-field";
import { input, renderField, slotTexts, typeInto } from "./helpers";

describe("OtpField character set and paste", () => {
  it("rejects letters in a digits code", async () => {
    const onValueChange = vi.fn();
    renderField(<OtpField label="Code" length={4} onValueChange={onValueChange} />);
    await typeInto(input("Code"), "1a2");
    expect(onValueChange).toHaveBeenLastCalledWith("12");
  });

  it("uppercases an alphanumeric code and sets a text keyboard", async () => {
    const onValueChange = vi.fn();
    renderField(
      <OtpField
        label="Code"
        length={4}
        charset="alphanumeric"
        uppercase
        onValueChange={onValueChange}
      />,
    );
    expect(input("Code").getAttribute("inputmode")).toBe("text");
    await typeInto(input("Code"), "ab12");
    expect(onValueChange).toHaveBeenLastCalledWith("AB12");
  });

  it("removes spaces and dashes from pasted codes", async () => {
    const onValueChange = vi.fn();
    renderField(<OtpField label="Code" length={6} onValueChange={onValueChange} />);
    await userEvent.click(input("Code"));
    await userEvent.paste("123 456");
    expect(onValueChange).toHaveBeenLastCalledWith("123456");
  });

  it("accepts a custom pattern", async () => {
    const { container } = renderField(
      <OtpField label="Hex" length={4} charset={{ pattern: "^[0-9A-F]+$" }} uppercase />,
    );
    await typeInto(input("Hex"), "0afz9");
    expect(slotTexts(container)).toEqual(["0", "A", "F", "9"]);
  });
});
