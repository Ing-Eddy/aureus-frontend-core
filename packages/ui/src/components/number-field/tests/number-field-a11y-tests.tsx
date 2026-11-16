import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TooltipProvider } from "@/shadcn/ui/tooltip";
import { NumberField } from "../number-field";

describe("NumberField accessibility", () => {
  it("is a spinbutton with its value, range and readable text", () => {
    render(
      <NumberField
        incrementLabel="Increase"
        decrementLabel="Decrease"
        label="Amount"
        currency="USD"
        grouping
        decimals={2}
        padDecimals
        min={0}
        max={5000}
        defaultValue={1234.5}
      />,
    );
    const field = screen.getByRole("spinbutton", { name: "Amount" });
    expect(field.getAttribute("aria-valuenow")).toBe("1234.5");
    expect(field.getAttribute("aria-valuemin")).toBe("0");
    expect(field.getAttribute("aria-valuemax")).toBe("5000");
    expect(field.getAttribute("aria-valuetext")).toBe("$1,234.50");
  });

  it("speaks negatives with the formatted minus sign, never parentheses or words", () => {
    render(
      <NumberField
        incrementLabel="Increase"
        decrementLabel="Decrease"
        label="Balance"
        currency="USD"
        negativeFormat="parentheses"
        defaultValue={-20}
      />,
    );
    expect(screen.getByRole("spinbutton").getAttribute("aria-valuetext")).toBe("-$20");
  });

  it("formats the negative value text with grouping and decimals", () => {
    render(
      <NumberField
        label="Balance"
        stepper={false}
        currency="USD"
        grouping
        decimals={2}
        padDecimals
        defaultValue={-1234.5}
      />,
    );
    expect(screen.getByRole("spinbutton").getAttribute("aria-valuetext")).toBe("-$1,234.50");
  });

  it("has no value text when empty", () => {
    render(<NumberField incrementLabel="Increase" decrementLabel="Decrease" label="Amount" />);
    const field = screen.getByRole("spinbutton");
    expect(field.hasAttribute("aria-valuenow")).toBe(false);
    expect(field.hasAttribute("aria-valuetext")).toBe(false);
  });

  it("sets the input mode, direction and no autocomplete", () => {
    const { unmount } = render(
      <NumberField incrementLabel="Increase" decrementLabel="Decrease" label="Amount" />,
    );
    let field = screen.getByRole("spinbutton");
    expect(field.getAttribute("inputmode")).toBe("decimal");
    expect(field.getAttribute("dir")).toBe("ltr");
    expect(field.getAttribute("autocomplete")).toBe("off");
    expect(field.getAttribute("type")).toBe("text");
    unmount();
    render(
      <NumberField
        incrementLabel="Increase"
        decrementLabel="Decrease"
        label="Qty"
        decimals={0}
        allowNegative={false}
      />,
    );
    field = screen.getByRole("spinbutton");
    expect(field.getAttribute("inputmode")).toBe("numeric");
  });

  it("keeps the shared field contract", () => {
    render(
      <TooltipProvider>
        <NumberField
          infoLabel="More information"
          incrementLabel="Increase"
          decrementLabel="Decrease"
          label="Amount"
          required
          helperText="Before taxes."
          info="In your account currency."
          error
          errorMessage="Too high"
        />
      </TooltipProvider>,
    );
    const field = screen.getByRole("spinbutton", { name: /^Amount/ });
    expect(field.getAttribute("aria-required")).toBe("true");
    expect(field.getAttribute("aria-invalid")).toBe("true");
    expect(screen.getByRole("alert").textContent).toBe("Too high");
  });
});
