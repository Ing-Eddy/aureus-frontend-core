import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { NumberField } from "../number-field";

const input = () => screen.getByRole("spinbutton") as HTMLInputElement;

function Controlled() {
  const [value, setValue] = useState<number | null>(5);
  return (
    <>
      <NumberField
        incrementLabel="Increase"
        decrementLabel="Decrease"
        label="Amount"
        value={value}
        onValueChange={setValue}
      />
      <output>{String(value)}</output>
    </>
  );
}

describe("NumberField typing", () => {
  it("groups live while typing and reports numbers", async () => {
    const onValueChange = vi.fn();
    render(
      <NumberField
        incrementLabel="Increase"
        decrementLabel="Decrease"
        label="Amount"
        grouping
        onValueChange={onValueChange}
      />,
    );
    await userEvent.type(input(), "1234567");
    expect(input().value).toBe("1,234,567");
    expect(onValueChange).toHaveBeenLastCalledWith(1234567);
  });

  it("keeps the caret after the same digit when grouping changes", async () => {
    render(
      <NumberField
        incrementLabel="Increase"
        decrementLabel="Decrease"
        label="Amount"
        grouping
        defaultValue={1234}
      />,
    );
    const field = input();
    await userEvent.click(field);
    field.setSelectionRange(3, 3); // "1,2|34"
    await userEvent.keyboard("9");
    expect(field.value).toBe("12,934");
    expect(field.selectionStart).toBe(4);
  });

  it("deletes the digit before a group separator with Backspace", async () => {
    render(
      <NumberField
        incrementLabel="Increase"
        decrementLabel="Decrease"
        label="Amount"
        grouping
        defaultValue={1234}
      />,
    );
    const field = input();
    await userEvent.click(field);
    field.setSelectionRange(2, 2); // "1,|234"
    await userEvent.keyboard("{Backspace}");
    expect(field.value).toBe("234");
  });

  it("caps decimals and pads on blur", async () => {
    render(
      <NumberField
        incrementLabel="Increase"
        decrementLabel="Decrease"
        label="Amount"
        decimals={2}
        padDecimals
      />,
    );
    await userEvent.type(input(), "12.3456");
    expect(input().value).toBe("12.34");
    await userEvent.type(input(), "{Backspace}");
    await userEvent.tab();
    expect(input().value).toBe("12.30");
  });

  it("keeps every decimal without a decimals limit", async () => {
    const onValueChange = vi.fn();
    render(
      <NumberField
        incrementLabel="Increase"
        decrementLabel="Decrease"
        label="Amount"
        onValueChange={onValueChange}
      />,
    );
    await userEvent.type(input(), "1.005");
    await userEvent.tab();
    expect(onValueChange).toHaveBeenLastCalledWith(1.005);
  });

  it("rounds a computed value to decimals on commit", async () => {
    const onValueChange = vi.fn();
    render(
      <NumberField
        incrementLabel="Increase"
        decrementLabel="Decrease"
        invalidExpressionLabel="Invalid expression"
        calculatedFromLabel={(expression) => `Calculated from ${expression}`}
        label="Amount"
        decimals={2}
        expressions
        onValueChange={onValueChange}
      />,
    );
    await userEvent.type(input(), "=10/3");
    await userEvent.tab();
    expect(onValueChange).toHaveBeenLastCalledWith(3.33);
  });

  it("warns in development beyond the exact range", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(
      <NumberField
        incrementLabel="Increase"
        decrementLabel="Decrease"
        label="Amount"
        decimals={2}
      />,
    );
    await userEvent.type(input(), "999999999999999");
    await userEvent.tab();
    expect(warn).toHaveBeenCalledWith(expect.stringContaining("beyond the range"));
    warn.mockRestore();
  });

  it("blocks the minus sign when negatives are not allowed", async () => {
    render(
      <NumberField
        incrementLabel="Increase"
        decrementLabel="Decrease"
        label="Amount"
        allowNegative={false}
      />,
    );
    await userEvent.type(input(), "-12");
    expect(input().value).toBe("12");
  });

  it("parses pasted formatted amounts and ignores garbage", () => {
    render(
      <NumberField
        incrementLabel="Increase"
        decrementLabel="Decrease"
        label="Amount"
        grouping
        decimals={2}
      />,
    );
    fireEvent.paste(input(), { clipboardData: { getData: () => "$1,234.567" } });
    expect(input().value).toBe("1,234.57");
    fireEvent.paste(input(), { clipboardData: { getData: () => "hello" } });
    expect(input().value).toBe("1,234.57");
  });

  it("reads accounting parentheses on paste", () => {
    const onValueChange = vi.fn();
    render(
      <NumberField
        incrementLabel="Increase"
        decrementLabel="Decrease"
        label="Amount"
        onValueChange={onValueChange}
      />,
    );
    fireEvent.paste(input(), { clipboardData: { getData: () => "(500)" } });
    expect(onValueChange).toHaveBeenLastCalledWith(-500);
  });

  it("commits on Enter without submitting when the text changed", async () => {
    const onSubmit = vi.fn((event: { preventDefault: () => void }) => event.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <NumberField
          incrementLabel="Increase"
          decrementLabel="Decrease"
          label="Amount"
          decimals={2}
          padDecimals
        />
      </form>,
    );
    await userEvent.type(input(), "12.5{Enter}");
    expect(input().value).toBe("12.50");
    expect(onSubmit).not.toHaveBeenCalled();
    await userEvent.keyboard("{Enter}");
    expect(onSubmit).toHaveBeenCalledOnce();
  });

  it("reverts to the last committed text with Escape", async () => {
    render(
      <NumberField
        incrementLabel="Increase"
        decrementLabel="Decrease"
        label="Amount"
        defaultValue={120}
      />,
    );
    await userEvent.click(input());
    await userEvent.clear(input());
    await userEvent.type(input(), "999");
    await userEvent.keyboard("{Escape}");
    expect(input().value).toBe("120");
  });

  it("reports null when cleared", async () => {
    const onValueChange = vi.fn();
    render(
      <NumberField
        incrementLabel="Increase"
        decrementLabel="Decrease"
        label="Amount"
        defaultValue={5}
        onValueChange={onValueChange}
      />,
    );
    await userEvent.clear(input());
    expect(onValueChange).toHaveBeenLastCalledWith(null);
  });

  it("works controlled", async () => {
    render(<Controlled />);
    await userEvent.clear(input());
    await userEvent.type(input(), "42");
    expect(screen.getByRole("status").textContent).toBe("42");
  });
});
