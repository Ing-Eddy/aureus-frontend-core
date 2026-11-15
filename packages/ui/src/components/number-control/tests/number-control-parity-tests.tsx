import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactElement } from "react";
import { describe, expect, it } from "vitest";
import { NumberField } from "@/components/number-field";
import { TooltipProvider } from "@/shadcn/ui/tooltip";
import { NumberControl } from "../number-control";
import type { NumberControlProps } from "../number-control-types";
import { renderInForm } from "./render-in-form";

/** Serializes an element with its attributes sorted, so DOM insertion order does not matter. */
function canonical(node: Element): string {
  const attributes = [...node.attributes]
    .map((attribute) => `${attribute.name}="${attribute.value}"`)
    .sort()
    .join(" ");
  const children = [...node.childNodes]
    .map((child) =>
      child.nodeType === Node.ELEMENT_NODE ? canonical(child as Element) : child.textContent,
    )
    .join("");
  return `<${node.tagName.toLowerCase()} ${attributes}>${children}</${node.tagName.toLowerCase()}>`;
}

/** Field markup with the generated input id (and the ids derived from it) replaced by "ID". */
function normalizedMarkup(container: HTMLElement) {
  const field = container.querySelector("[data-slot=field]");
  const id = field?.querySelector("input")?.id;
  if (!field || !id) throw new Error("no field rendered");
  return canonical(field).split(id).join("ID");
}

const noop = () => {};

const formatted = {
  label: "Amount",
  required: true,
  info: "In your account currency.",
  helperText: "Before taxes.",
  currency: "USD",
  grouping: true,
  decimals: 2,
  padDecimals: true,
  stepperLayout: "split",
} satisfies Omit<NumberControlProps, "name">;

function fieldMarkup(element: ReactElement) {
  const { container, unmount } = render(<TooltipProvider>{element}</TooltipProvider>);
  const markup = normalizedMarkup(container);
  unmount();
  return markup;
}

describe("NumberField and NumberControl render the same markup", () => {
  it("in the default state", () => {
    const expected = fieldMarkup(
      <NumberField label="Amount" name="amount" value={250} onValueChange={noop} />,
    );
    const control = renderInForm(<NumberControl name="amount" label="Amount" />, {
      amount: 250,
      qty: null,
    });
    expect(normalizedMarkup(control.container)).toBe(expected);
  });

  it("with currency, grouping, decimals and split buttons", () => {
    const expected = fieldMarkup(
      <NumberField {...formatted} name="amount" value={1234.5} onValueChange={noop} />,
    );
    const control = renderInForm(<NumberControl {...formatted} name="amount" />, {
      amount: 1234.5,
      qty: null,
    });
    expect(normalizedMarkup(control.container)).toBe(expected);
  });

  it("in error, with the message", async () => {
    const expected = fieldMarkup(
      <NumberField
        {...formatted}
        name="amount"
        value={0}
        onValueChange={noop}
        error
        errorMessage="The amount must be at least 1."
      />,
    );
    const control = renderInForm(<NumberControl {...formatted} name="amount" />, {
      amount: 0,
      qty: null,
    });
    await userEvent.click(screen.getByRole("button", { name: "Save" }));
    await waitFor(() => expect(screen.getByRole("alert")).toBeTruthy());
    expect(normalizedMarkup(control.container)).toBe(expected);
  });
});
