import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { NumberControl } from "../number-control";
import { lenientSchema, renderInForm } from "./render-in-form";

const save = () => userEvent.click(screen.getByRole("button", { name: "Save" }));
const amount = () => screen.getByRole("spinbutton", { name: /^Amount/ }) as HTMLInputElement;

describe("NumberControl in a form", () => {
  it("submits a number, also from grouped text", async () => {
    const { onSubmit } = renderInForm(
      <NumberControl
        incrementLabel="Increase"
        decrementLabel="Decrease"
        name="amount"
        label="Amount"
        grouping
      />,
      {
        amount: null,
        qty: null,
      },
    );
    await userEvent.type(amount(), "1250.5");
    expect(amount().value).toBe("1,250.5");
    await save();
    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith({ amount: 1250.5, qty: null }));
    expect(typeof onSubmit.mock.calls[0]?.[0].amount).toBe("number");
  });

  it("shows the schema message, and clears it once valid", async () => {
    renderInForm(
      <NumberControl
        incrementLabel="Increase"
        decrementLabel="Decrease"
        name="amount"
        label="Amount"
        helperText="Before taxes."
      />,
      {
        amount: 0,
        qty: null,
      },
    );
    await save();
    await waitFor(() =>
      expect(screen.getByRole("alert").textContent).toBe("The amount must be at least 1."),
    );
    expect(amount().getAttribute("aria-invalid")).toBe("true");
    await userEvent.clear(amount());
    await userEvent.type(amount(), "5");
    await waitFor(() => expect(screen.queryByRole("alert")).toBeNull());
    expect(screen.getByText("Before taxes.")).toBeTruthy();
  });

  it("stores null when cleared", async () => {
    const { onSubmit } = renderInForm(
      <NumberControl
        incrementLabel="Increase"
        decrementLabel="Decrease"
        name="qty"
        label="Quantity"
      />,
      {
        amount: 5,
        qty: 3,
      },
    );
    await userEvent.clear(screen.getByRole("spinbutton", { name: "Quantity" }));
    await save();
    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith({ amount: 5, qty: null }));
  });

  it("submits the result of a remembered expression", async () => {
    const { onSubmit } = renderInForm(
      <NumberControl
        incrementLabel="Increase"
        decrementLabel="Decrease"
        invalidExpressionLabel="Invalid expression"
        calculatedFromLabel={(expression) => `Calculated from ${expression}`}
        name="amount"
        label="Amount"
        expressions
      />,
      {
        amount: null,
        qty: null,
      },
    );
    await userEvent.type(amount(), "=120*3");
    await userEvent.tab();
    await save();
    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith({ amount: 360, qty: null }));
    await userEvent.click(amount());
    expect(amount().value).toBe("=120*3");
  });

  it("leaves a disabled field out and keeps a loading one", async () => {
    const { onSubmit } = renderInForm(
      <>
        <NumberControl
          loadingLabel="Loading"
          incrementLabel="Increase"
          decrementLabel="Decrease"
          name="amount"
          label="Amount"
          loading
        />
        <NumberControl
          incrementLabel="Increase"
          decrementLabel="Decrease"
          name="qty"
          label="Quantity"
          disabled
        />
      </>,
      { amount: 250, qty: 3 },
      lenientSchema,
    );
    await save();
    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
    const submitted = onSubmit.mock.calls[0]?.[0];
    expect(submitted?.amount).toBe(250);
    expect(submitted?.qty).toBeUndefined();
  });

  it("throws outside a FormProvider", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() =>
      render(
        <NumberControl
          incrementLabel="Increase"
          decrementLabel="Decrease"
          name="amount"
          label="Amount"
        />,
      ),
    ).toThrow("NumberControl must be rendered inside a react-hook-form FormProvider.");
    vi.restoreAllMocks();
  });
});
