import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { NumberField } from "@/components/number-field";
import { fieldMarkup, normalizedMarkup } from "@/internal/testing";
import { NumberControl } from "../number-control";
import type { NumberControlProps } from "../number-control-types";
import { renderInForm } from "./render-in-form";

const noop = () => {};

const formatted = {
  label: "Amount",
  required: true,
  info: "In your account currency.",
  infoLabel: "More information",
  helperText: "Before taxes.",
  currency: "USD",
  grouping: true,
  decimals: 2,
  padDecimals: true,
  stepperLayout: "split",
} satisfies Omit<NumberControlProps, "name">;

describe("NumberField and NumberControl render the same markup", () => {
  it("in the default state", () => {
    const expected = fieldMarkup(
      <NumberField
        incrementLabel="Increase"
        decrementLabel="Decrease"
        label="Amount"
        name="amount"
        value={250}
        onValueChange={noop}
      />,
    );
    const control = renderInForm(
      <NumberControl
        incrementLabel="Increase"
        decrementLabel="Decrease"
        name="amount"
        label="Amount"
      />,
      {
        amount: 250,
        qty: null,
      },
    );
    expect(normalizedMarkup(control.container)).toBe(expected);
  });

  it("with currency, grouping, decimals and split buttons", () => {
    const expected = fieldMarkup(
      <NumberField
        incrementLabel="Increase"
        decrementLabel="Decrease"
        {...formatted}
        name="amount"
        value={1234.5}
        onValueChange={noop}
      />,
    );
    const control = renderInForm(
      <NumberControl
        incrementLabel="Increase"
        decrementLabel="Decrease"
        {...formatted}
        name="amount"
      />,
      {
        amount: 1234.5,
        qty: null,
      },
    );
    expect(normalizedMarkup(control.container)).toBe(expected);
  });

  it("in error, with the message", async () => {
    const expected = fieldMarkup(
      <NumberField
        incrementLabel="Increase"
        decrementLabel="Decrease"
        {...formatted}
        name="amount"
        value={0}
        onValueChange={noop}
        error
        errorMessage="The amount must be at least 1."
      />,
    );
    const control = renderInForm(
      <NumberControl
        incrementLabel="Increase"
        decrementLabel="Decrease"
        {...formatted}
        name="amount"
      />,
      {
        amount: 0,
        qty: null,
      },
    );
    await userEvent.click(screen.getByRole("button", { name: "Save" }));
    await waitFor(() => expect(screen.getByRole("alert")).toBeTruthy());
    expect(normalizedMarkup(control.container)).toBe(expected);
  });
});
