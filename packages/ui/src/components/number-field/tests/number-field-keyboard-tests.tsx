import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { NumberField } from "../number-field";

const input = () => screen.getByRole("spinbutton") as HTMLInputElement;

describe("NumberField keyboard and wheel", () => {
  it("steps with the arrows, Shift and PageUp/PageDown", async () => {
    const onValueChange = vi.fn();
    render(
      <NumberField
        incrementLabel="Increase"
        decrementLabel="Decrease"
        label="Qty"
        defaultValue={5}
        onValueChange={onValueChange}
      />,
    );
    await userEvent.click(input());
    await userEvent.keyboard("{ArrowUp}");
    expect(onValueChange).toHaveBeenLastCalledWith(6);
    await userEvent.keyboard("{Shift>}{ArrowUp}{/Shift}");
    expect(onValueChange).toHaveBeenLastCalledWith(16);
    await userEvent.keyboard("{PageDown}");
    expect(onValueChange).toHaveBeenLastCalledWith(6);
    await userEvent.keyboard("{ArrowDown}");
    expect(onValueChange).toHaveBeenLastCalledWith(5);
    expect(input().value).toBe("5");
  });

  it("steps decimals exactly", async () => {
    const onValueChange = vi.fn();
    render(
      <NumberField
        incrementLabel="Increase"
        decrementLabel="Decrease"
        label="Rate"
        step={0.1}
        defaultValue={0.2}
        onValueChange={onValueChange}
      />,
    );
    await userEvent.click(input());
    await userEvent.keyboard("{ArrowUp}");
    expect(onValueChange).toHaveBeenLastCalledWith(0.3);
  });

  it("goes to min and max with Home and End, and steps within them", async () => {
    const onValueChange = vi.fn();
    render(
      <NumberField
        incrementLabel="Increase"
        decrementLabel="Decrease"
        label="Qty"
        min={1}
        max={10}
        defaultValue={5}
        onValueChange={onValueChange}
      />,
    );
    await userEvent.click(input());
    await userEvent.keyboard("{End}");
    expect(onValueChange).toHaveBeenLastCalledWith(10);
    await userEvent.keyboard("{ArrowUp}");
    expect(onValueChange).toHaveBeenLastCalledWith(10);
    await userEvent.keyboard("{Home}");
    expect(onValueChange).toHaveBeenLastCalledWith(1);
  });

  it("clamps on blur, unless clampOnBlur is off", async () => {
    const { unmount } = render(
      <NumberField incrementLabel="Increase" decrementLabel="Decrease" label="Qty" max={10} />,
    );
    await userEvent.type(input(), "50");
    await userEvent.tab();
    expect(input().value).toBe("10");
    unmount();
    render(
      <NumberField
        incrementLabel="Increase"
        decrementLabel="Decrease"
        label="Qty"
        max={10}
        clampOnBlur={false}
      />,
    );
    await userEvent.type(input(), "50");
    await userEvent.tab();
    expect(input().value).toBe("50");
  });

  it("steps with the wheel only when enabled and focused", async () => {
    const onValueChange = vi.fn();
    render(
      <NumberField
        incrementLabel="Increase"
        decrementLabel="Decrease"
        label="Qty"
        wheel
        defaultValue={5}
        onValueChange={onValueChange}
      />,
    );
    const outside = fireEvent.wheel(input(), { deltaY: -100 });
    expect(outside).toBe(true);
    expect(onValueChange).not.toHaveBeenCalled();

    await userEvent.click(input());
    const inside = fireEvent.wheel(input(), { deltaY: -100 });
    expect(inside).toBe(false); // default prevented: the page does not scroll
    expect(onValueChange).toHaveBeenLastCalledWith(6);
  });

  it("ignores the wheel by default", async () => {
    const onValueChange = vi.fn();
    render(
      <NumberField
        incrementLabel="Increase"
        decrementLabel="Decrease"
        label="Qty"
        defaultValue={5}
        onValueChange={onValueChange}
      />,
    );
    await userEvent.click(input());
    fireEvent.wheel(input(), { deltaY: -100 });
    expect(onValueChange).not.toHaveBeenCalled();
  });
});
