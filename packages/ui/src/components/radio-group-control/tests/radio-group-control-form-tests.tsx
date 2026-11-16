import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { RadioGroupControl } from "../radio-group-control";
import { lenientSchema, plans, renderInForm, sources } from "./render-in-form";

const save = () => userEvent.click(screen.getByRole("button", { name: "Save" }));
const other = { label: "Other", inputLabel: "Other source" };

function Both() {
  return (
    <>
      <RadioGroupControl name="plan" label="Plan" required options={plans} />
      <RadioGroupControl name="source" label="Source" options={sources} otherOption={other} />
    </>
  );
}

describe("RadioGroupControl in a form", () => {
  it("submits the chosen value and the other text", async () => {
    const { onSubmit } = renderInForm(<Both />);
    await userEvent.click(screen.getByRole("radio", { name: "Pro" }));
    await userEvent.click(screen.getByRole("radio", { name: "Other" }));
    await userEvent.type(screen.getByRole("textbox", { name: "Other source" }), "Podcast");
    await save();
    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
    expect(onSubmit.mock.calls[0]?.[0]).toEqual({ plan: "pro", source: "Podcast" });
  });

  it("shows the schema messages and focuses the first enabled radio", async () => {
    const { onSubmit } = renderInForm(<Both />);
    await save();
    await waitFor(() => expect(screen.getAllByRole("alert")).toHaveLength(2));
    expect(screen.getByText("Choose a plan.")).toBeTruthy();
    expect(screen.getByRole("radiogroup", { name: "Plan" }).getAttribute("aria-invalid")).toBe(
      "true",
    );
    expect(document.activeElement).toBe(screen.getByRole("radio", { name: "Free" }));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("focuses the checked radio when the error is elsewhere in its value", async () => {
    renderInForm(<Both />, { plan: "pro", source: "" });
    await save();
    await waitFor(() => expect(screen.getAllByRole("alert")).toHaveLength(1));
    expect(document.activeElement).toBe(screen.getByRole("radio", { name: "Other" }));
  });

  it("treats a missing form value as null", () => {
    renderInForm(<RadioGroupControl name="plan" label="Plan" options={plans} />, {});
    expect(
      screen.getAllByRole("radio").every((r) => r.getAttribute("aria-checked") === "false"),
    ).toBe(true);
  });

  it("leaves disabled values out and keeps loading values", async () => {
    const { onSubmit } = renderInForm(
      <>
        <RadioGroupControl
          loadingLabel="Loading"
          name="plan"
          label="Plan"
          options={plans}
          loading
        />
        <RadioGroupControl name="source" label="Source" options={sources} disabled />
      </>,
      { plan: "pro", source: "friend" },
      lenientSchema,
    );
    await save();
    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
    const values = onSubmit.mock.calls[0]?.[0];
    expect(values?.plan).toBe("pro");
    expect(values?.source).toBeUndefined();
  });

  it("throws outside a FormProvider", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<RadioGroupControl name="plan" label="Plan" options={plans} />)).toThrow();
    vi.restoreAllMocks();
  });
});
