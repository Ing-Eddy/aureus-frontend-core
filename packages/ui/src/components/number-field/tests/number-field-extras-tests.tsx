import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { NumberField } from "../number-field";

const input = () => screen.getByRole("spinbutton") as HTMLInputElement;

describe("NumberField extras", () => {
  it("shows parentheses and red when blurred, a minus while editing", async () => {
    render(
      <NumberField
        label="Balance"
        defaultValue={-1234.5}
        grouping
        decimals={2}
        padDecimals
        negativeFormat="parentheses"
        negativeColor
      />,
    );
    expect(input().value).toBe("(1,234.50)");
    expect(input().className).toContain("text-destructive");
    await userEvent.click(input());
    expect(input().value).toBe("-1,234.50");
  });

  it("expands shorthand on commit only when enabled", async () => {
    const onValueChange = vi.fn();
    const { unmount } = render(
      <NumberField label="Amount" shorthand onValueChange={onValueChange} />,
    );
    await userEvent.type(input(), "1.5k");
    await userEvent.tab();
    expect(onValueChange).toHaveBeenLastCalledWith(1500);
    unmount();
    render(<NumberField label="Amount" />);
    await userEvent.type(input(), "1.5k");
    expect(input().value).toBe("1.5");
  });

  it("remembers an expression: shows the result, and the expression again on focus", async () => {
    const onValueChange = vi.fn();
    render(<NumberField label="Total" expressions onValueChange={onValueChange} />);
    await userEvent.type(input(), "=3+3");
    await userEvent.tab();
    expect(input().value).toBe("6");
    expect(onValueChange).toHaveBeenLastCalledWith(6);
    expect(document.body.textContent).toContain("Calculated from =3+3");

    await userEvent.click(input());
    expect(input().value).toBe("=3+3");

    await userEvent.clear(input());
    await userEvent.type(input(), "=3+4{Enter}");
    expect(onValueChange).toHaveBeenLastCalledWith(7);
    await userEvent.tab();
    await userEvent.click(input());
    expect(input().value).toBe("=3+4");
  });

  it("forgets the expression after a step", async () => {
    render(<NumberField label="Total" expressions />);
    await userEvent.type(input(), "=3+3");
    await userEvent.tab();
    await userEvent.click(input());
    await userEvent.keyboard("{ArrowUp}");
    expect(input().value).toBe("7");
    await userEvent.tab();
    await userEvent.click(input());
    expect(input().value).toBe("7");
    expect(document.body.textContent).not.toContain("Calculated from");
  });

  it("forgets the expression when the value changes from outside", async () => {
    const { rerender } = render(
      <NumberField label="Total" expressions value={null} onValueChange={() => {}} />,
    );
    // Controlled: simulate the parent accepting 6, then replacing it with 10.
    await userEvent.type(input(), "=3+3");
    await userEvent.tab();
    rerender(<NumberField label="Total" expressions value={6} onValueChange={() => {}} />);
    rerender(<NumberField label="Total" expressions value={10} onValueChange={() => {}} />);
    await userEvent.click(input());
    expect(input().value).toBe("10");
  });

  it("loses the expression on unmount", async () => {
    const { unmount } = render(<NumberField label="Total" expressions />);
    await userEvent.type(input(), "=2*2");
    await userEvent.tab();
    unmount();
    render(<NumberField label="Total" expressions defaultValue={4} />);
    await userEvent.click(input());
    expect(input().value).toBe("4");
  });

  it("shows an error for an invalid expression and keeps the text", async () => {
    const onValueChange = vi.fn();
    render(
      <NumberField label="Total" expressions defaultValue={5} onValueChange={onValueChange} />,
    );
    await userEvent.clear(input());
    onValueChange.mockClear();
    await userEvent.type(input(), "=3+*2");
    await userEvent.tab();
    expect(input().value).toBe("=3+*2");
    expect(input().getAttribute("aria-invalid")).toBe("true");
    expect(screen.getByRole("alert").textContent).toBe("Invalid expression");
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("selects the whole text on focus when asked", async () => {
    render(<NumberField label="Total" defaultValue={1234} selectOnFocus />);
    await userEvent.click(input());
    expect([input().selectionStart, input().selectionEnd]).toEqual([0, 4]);
  });
});
