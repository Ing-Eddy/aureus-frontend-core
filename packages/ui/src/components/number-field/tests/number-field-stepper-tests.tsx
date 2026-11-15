import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { NumberField } from "../number-field";

const increase = () => screen.getByRole("button", { name: "Increase" }) as HTMLButtonElement;
const decrease = () => screen.getByRole("button", { name: "Decrease" }) as HTMLButtonElement;

describe("NumberField step buttons", () => {
  it("renders stacked buttons by default, after the input", () => {
    const { container } = render(<NumberField label="Qty" />);
    const stepper = container.querySelector("[data-slot=field-stepper]");
    expect(stepper?.getAttribute("data-layout")).toBe("stacked");
    expect(stepper?.contains(increase())).toBe(true);
    expect(stepper?.contains(decrease())).toBe(true);
  });

  it("renders split buttons on both sides", () => {
    const { container } = render(<NumberField label="Qty" stepperLayout="split" />);
    const frame = container.querySelector("[data-slot=input-group]") as HTMLElement;
    expect(frame.firstElementChild).toBe(decrease());
    expect(frame.lastElementChild).toBe(increase());
  });

  it("hides the buttons with stepper={false}", () => {
    render(<NumberField label="Qty" stepper={false} />);
    expect(screen.queryByRole("button", { name: "Increase" })).toBeNull();
  });

  it("steps, keeps focus in the input and disables at the limits", async () => {
    const onValueChange = vi.fn();
    render(
      <NumberField label="Qty" min={0} max={2} defaultValue={1} onValueChange={onValueChange} />,
    );
    const field = screen.getByRole("spinbutton");
    await userEvent.click(field);
    fireEvent.pointerDown(increase(), { button: 0 });
    fireEvent.pointerUp(increase());
    expect(onValueChange).toHaveBeenLastCalledWith(2);
    expect(document.activeElement).toBe(field);
    expect(increase().disabled).toBe(true);
    expect(decrease().disabled).toBe(false);
  });

  it("disables both buttons while loading or disabled", () => {
    const { unmount } = render(<NumberField label="Qty" loading />);
    expect(increase().disabled).toBe(true);
    expect(decrease().disabled).toBe(true);
    unmount();
    render(<NumberField label="Qty" disabled />);
    expect(increase().disabled).toBe(true);
  });

  it("disables decrease at 0 when negatives are not allowed", () => {
    render(<NumberField label="Qty" allowNegative={false} defaultValue={0} />);
    expect(decrease().disabled).toBe(true);
  });

  it("uses custom names", () => {
    render(<NumberField label="Qty" incrementLabel="Más" decrementLabel="Menos" />);
    expect(screen.getByRole("button", { name: "Más" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Menos" })).toBeTruthy();
  });
});
