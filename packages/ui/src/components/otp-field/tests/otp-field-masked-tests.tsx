import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { OtpField } from "../otp-field";
import { renderField, slotTexts } from "./helpers";

afterEach(() => vi.restoreAllMocks());

const reveal = { showLabel: "Show PIN", hideLabel: "Hide PIN" };

describe("OtpField masking", () => {
  it("shows dots and uses a password input while masked", async () => {
    const { container } = renderField(<OtpField label="PIN" length={4} masked defaultValue="12" />);
    expect(slotTexts(container)).toEqual(["•", "•", "", ""]);
    expect(container.querySelector("input")?.getAttribute("type")).toBe("password");
  });

  it("reveals and hides the characters without leaving the input", async () => {
    const { container } = renderField(
      <OtpField label="PIN" length={4} masked reveal={reveal} defaultValue="1234" />,
    );
    const field = container.querySelector("input") as HTMLInputElement;
    field.focus();
    await userEvent.click(screen.getByRole("button", { name: "Show PIN" }));
    expect(slotTexts(container)).toEqual(["1", "2", "3", "4"]);
    const toggle = screen.getByRole("button", { name: "Hide PIN" });
    expect(toggle.getAttribute("aria-pressed")).toBe("true");
    expect(document.activeElement).toBe(field);
    await userEvent.click(toggle);
    expect(slotTexts(container)).toEqual(["•", "•", "•", "•"]);
  });

  it("warns for reveal without masked", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    renderField(<OtpField label="PIN" length={4} reveal={reveal} />);
    expect(warn).toHaveBeenCalledWith(expect.stringContaining("`reveal` only works"));
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("keeps every other default when one extra is set", () => {
    const { container } = renderField(
      <>
        <OtpField label="A" length={4} masked />
        <OtpField label="B" length={4} groups={[2, 2]} />
        <OtpField label="C" length={4} charset="letters" />
      </>,
    );
    const inputs = [...container.querySelectorAll("input")];
    expect(inputs.map((field) => field.getAttribute("type"))).toEqual(["password", "text", "text"]);
    expect(inputs.map((field) => field.getAttribute("inputmode"))).toEqual([
      "numeric",
      "numeric",
      "text",
    ]);
  });
});
