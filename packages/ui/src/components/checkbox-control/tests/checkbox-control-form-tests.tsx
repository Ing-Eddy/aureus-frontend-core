import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { CheckboxControl } from "../checkbox-control";
import { defaults, lenientSchema, renderInForm } from "./render-in-form";

const save = () => userEvent.click(screen.getByRole("button", { name: "Save" }));

function AllControls() {
  return (
    <>
      <CheckboxControl name="terms" checkboxLabel="I accept the terms" required />
      <CheckboxControl name="newsletter" label="Newsletter" checkboxLabel="Weekly digest" />
      <CheckboxControl name="active" checkboxLabel="Active" checkedValue="S" uncheckedValue="N" />
    </>
  );
}

describe("CheckboxControl in a form", () => {
  it("submits booleans and custom values", async () => {
    const { onSubmit } = renderInForm(<AllControls />);
    await userEvent.click(screen.getByRole("checkbox", { name: /^I accept the terms/ }));
    await userEvent.click(screen.getByRole("checkbox", { name: "Weekly digest" }));
    await userEvent.click(screen.getByRole("checkbox", { name: "Active" }));
    await save();
    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
    expect(onSubmit.mock.calls[0]?.[0]).toEqual({ terms: true, newsletter: true, active: "S" });
  });

  it("shows the schema message and focuses the box", async () => {
    const { onSubmit } = renderInForm(<AllControls />);
    await save();
    const terms = screen.getByRole("checkbox", { name: /^I accept the terms/ });
    await waitFor(() => expect(terms.getAttribute("aria-invalid")).toBe("true"));
    expect(screen.getByRole("alert").textContent).toBe("Debes aceptar los términos.");
    expect(document.activeElement).toBe(terms);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("shows the unchecked state when the form value is missing", () => {
    renderInForm(<CheckboxControl name="newsletter" checkboxLabel="Weekly digest" />, {});
    expect(
      screen.getByRole("checkbox", { name: "Weekly digest" }).getAttribute("aria-checked"),
    ).toBe("false");
  });

  it("leaves disabled values out and keeps loading values", async () => {
    const { onSubmit } = renderInForm(
      <>
        <CheckboxControl
          loadingLabel="Loading"
          name="newsletter"
          checkboxLabel="Weekly digest"
          loading
        />
        <CheckboxControl name="terms" checkboxLabel="Terms" disabled />
      </>,
      { ...defaults, newsletter: true, terms: true },
      lenientSchema,
    );
    await save();
    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
    const values = onSubmit.mock.calls[0]?.[0];
    expect(values?.newsletter).toBe(true);
    expect(values?.terms).toBeUndefined();
  });

  it("throws outside a FormProvider", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<CheckboxControl name="terms" checkboxLabel="Terms" />)).toThrow();
    vi.restoreAllMocks();
  });
});
