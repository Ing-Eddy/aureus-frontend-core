import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { PasswordControl } from "../password-control";
import { lenientSchema, renderInForm } from "./render-in-form";

const save = () => userEvent.click(screen.getByRole("button", { name: "Save" }));
const passwordInput = () => screen.getByLabelText(/^Password/) as HTMLInputElement;
const confirmInput = () => screen.getByLabelText(/^Confirm password/) as HTMLInputElement;

const fields = (
  <>
    <PasswordControl name="password" label="Password" />
    <PasswordControl name="confirm" label="Confirm password" autoComplete="new-password" />
  </>
);

describe("PasswordControl in a form", () => {
  it("registers and submits the value", async () => {
    const { onSubmit } = renderInForm(fields, { password: "", confirm: "" });
    await userEvent.type(passwordInput(), "correct horse");
    await userEvent.type(confirmInput(), "correct horse");
    await save();
    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith({
        password: "correct horse",
        confirm: "correct horse",
      }),
    );
  });

  it("shows the schema's mismatch message on the confirmation, and clears it once they match", async () => {
    renderInForm(fields, { password: "correct horse", confirm: "correct hors" });
    await save();

    await waitFor(() =>
      expect(screen.getByRole("alert").textContent).toBe("The passwords do not match."),
    );
    expect(confirmInput().getAttribute("aria-invalid")).toBe("true");
    expect(passwordInput().hasAttribute("aria-invalid")).toBe(false);

    await userEvent.type(confirmInput(), "e");
    await waitFor(() => expect(screen.queryByRole("alert")).toBeNull());
  });

  it("leaves a disabled field out and keeps a loading one", async () => {
    const { onSubmit } = renderInForm(
      <>
        <PasswordControl name="password" label="Password" loading />
        <PasswordControl name="confirm" label="Confirm password" disabled />
      </>,
      { password: "correct horse", confirm: "correct horse" },
      lenientSchema,
    );
    expect(passwordInput().disabled).toBe(true);
    expect(confirmInput().disabled).toBe(true);

    await save();

    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
    const submitted = onSubmit.mock.calls[0]?.[0];
    expect(submitted?.password).toBe("correct horse");
    expect(submitted?.confirm).toBeUndefined();
  });

  it("submits the typed value and hides the password again", async () => {
    const { onSubmit } = renderInForm(fields, { password: "", confirm: "" });
    await userEvent.type(passwordInput(), "correct horse");
    await userEvent.type(confirmInput(), "correct horse");
    await userEvent.click(
      screen.getAllByRole("button", { name: "Show password" })[0] as HTMLElement,
    );
    expect(passwordInput().type).toBe("text");

    await save();

    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
    expect(onSubmit.mock.calls[0]?.[0].password).toBe("correct horse");
    expect(passwordInput().type).toBe("password");
  });

  it("throws outside a FormProvider", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<PasswordControl name="password" label="Password" />)).toThrow(
      "PasswordControl must be rendered inside a react-hook-form FormProvider.",
    );
    vi.restoreAllMocks();
  });
});
