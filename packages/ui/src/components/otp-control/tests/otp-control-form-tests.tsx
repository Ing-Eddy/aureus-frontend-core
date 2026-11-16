import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { OtpControl } from "../otp-control";
import { lenientSchema, renderInForm } from "./render-in-form";

const save = () => userEvent.click(screen.getByRole("button", { name: "Save" }));
const field = (name: string) => screen.getByRole("textbox", { name }) as HTMLInputElement;

describe("OtpControl in a form", () => {
  it("submits the code as a string", async () => {
    const { onSubmit } = renderInForm(
      <>
        <OtpControl name="code" label="Code" length={6} />
        <OtpControl name="pin" label="PIN" length={4} />
      </>,
    );
    await userEvent.click(field("Code"));
    await userEvent.keyboard("123456");
    await userEvent.click(field("PIN"));
    await userEvent.keyboard("1234");
    await save();
    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
    expect(onSubmit.mock.calls[0]?.[0]).toEqual({ code: "123456", pin: "1234" });
  });

  it("shows the schema message and focuses the input", async () => {
    renderInForm(<OtpControl name="code" label="Code" length={6} />, { code: "", pin: "1234" });
    await userEvent.click(field("Code"));
    await userEvent.keyboard("123");
    await save();
    await waitFor(() => expect(field("Code").getAttribute("aria-invalid")).toBe("true"));
    expect(screen.getByRole("alert").textContent).toBe("Enter the 6 digits.");
    expect(document.activeElement).toBe(field("Code"));
  });

  it("submits the form with the full code on completion", async () => {
    const { onSubmit } = renderInForm(
      <OtpControl name="code" label="Code" length={6} submitOnComplete />,
      { code: "", pin: "1234" },
    );
    await userEvent.click(field("Code"));
    await userEvent.keyboard("654321");
    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
    expect(onSubmit.mock.calls[0]?.[0].code).toBe("654321");
  });

  it("treats a missing form value as empty", () => {
    const { container } = renderInForm(<OtpControl name="code" label="Code" length={4} />, {});
    const slots = [...container.querySelectorAll("[data-slot=input-otp-slot]")];
    expect(slots.every((slot) => slot.textContent === "")).toBe(true);
  });

  it("leaves disabled values out and keeps loading values", async () => {
    const { onSubmit } = renderInForm(
      <>
        <OtpControl loadingLabel="Loading" name="code" label="Code" length={6} loading />
        <OtpControl name="pin" label="PIN" length={4} disabled />
      </>,
      { code: "123456", pin: "1234" },
      lenientSchema,
    );
    await save();
    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
    const values = onSubmit.mock.calls[0]?.[0];
    expect(values?.code).toBe("123456");
    expect(values?.pin).toBeUndefined();
  });

  it("throws outside a FormProvider", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<OtpControl name="code" label="Code" length={6} />)).toThrow();
    vi.restoreAllMocks();
  });
});
