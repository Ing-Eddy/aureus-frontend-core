import { act, fireEvent, render, renderHook, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { FieldStepperSplitButton, FieldStepperStacked } from "./field-stepper";
import { useStepperLayout } from "./hooks";

describe("FieldStepper", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  const renderStacked = (props: Partial<Parameters<typeof FieldStepperStacked>[0]> = {}) => {
    const onStep = vi.fn();
    render(
      <>
        <input id="amount" aria-label="Amount" />
        <FieldStepperStacked
          controls="amount"
          onStep={onStep}
          canIncrement
          canDecrement
          incrementLabel="Increase"
          decrementLabel="Decrease"
          {...props}
        />
      </>,
    );
    return onStep;
  };

  it("names the buttons, points them at the input and keeps them out of the tab order", () => {
    renderStacked();
    for (const name of ["Increase", "Decrease"]) {
      const button = screen.getByRole("button", { name });
      expect(button.getAttribute("aria-controls")).toBe("amount");
      expect(button.getAttribute("tabindex")).toBe("-1");
      expect(button.getAttribute("type")).toBe("button");
    }
  });

  it("does not take focus from the input on press", () => {
    renderStacked();
    const input = screen.getByRole("textbox", { name: "Amount" });
    input.focus();
    const event = fireEvent.pointerDown(screen.getByRole("button", { name: "Increase" }), {
      button: 0,
    });
    expect(event).toBe(false); // default prevented
    expect(document.activeElement).toBe(input);
  });

  it("steps once on press, then repeats while held, and stops on release", () => {
    const onStep = renderStacked();
    const button = screen.getByRole("button", { name: "Increase" });
    fireEvent.pointerDown(button, { button: 0 });
    expect(onStep).toHaveBeenCalledTimes(1);
    expect(onStep).toHaveBeenLastCalledWith("increment");

    act(() => vi.advanceTimersByTime(399));
    expect(onStep).toHaveBeenCalledTimes(1);
    act(() => vi.advanceTimersByTime(1 + 60 * 3));
    expect(onStep).toHaveBeenCalledTimes(4);

    fireEvent.pointerUp(button);
    act(() => vi.advanceTimersByTime(500));
    expect(onStep).toHaveBeenCalledTimes(4);
  });

  it("stops repeating when the pointer leaves", () => {
    const onStep = renderStacked();
    const button = screen.getByRole("button", { name: "Decrease" });
    fireEvent.pointerDown(button, { button: 0 });
    act(() => vi.advanceTimersByTime(460));
    fireEvent.pointerLeave(button);
    const calls = onStep.mock.calls.length;
    act(() => vi.advanceTimersByTime(500));
    expect(onStep).toHaveBeenCalledTimes(calls);
    expect(onStep).toHaveBeenLastCalledWith("decrement");
  });

  it("steps once on a click without a pointer (assistive technology)", () => {
    const onStep = renderStacked();
    fireEvent.click(screen.getByRole("button", { name: "Increase" }), { detail: 0 });
    expect(onStep).toHaveBeenCalledTimes(1);
  });

  it("disables each button at its limit, and both when the field is disabled", () => {
    const { rerender } = render(
      <FieldStepperStacked
        controls="x"
        onStep={vi.fn()}
        canIncrement={false}
        canDecrement
        incrementLabel="Increase"
        decrementLabel="Decrease"
      />,
    );
    expect((screen.getByRole("button", { name: "Increase" }) as HTMLButtonElement).disabled).toBe(
      true,
    );
    expect((screen.getByRole("button", { name: "Decrease" }) as HTMLButtonElement).disabled).toBe(
      false,
    );
    rerender(
      <FieldStepperStacked
        controls="x"
        onStep={vi.fn()}
        canIncrement
        canDecrement
        disabled
        incrementLabel="Increase"
        decrementLabel="Decrease"
      />,
    );
    expect((screen.getByRole("button", { name: "Decrease" }) as HTMLButtonElement).disabled).toBe(
      true,
    );
  });

  it("renders split buttons with − and + and custom names", () => {
    render(
      <>
        <FieldStepperSplitButton
          direction="decrement"
          controls="x"
          onStep={vi.fn()}
          canStep
          incrementLabel="Más"
          decrementLabel="Menos"
        />
        <FieldStepperSplitButton
          direction="increment"
          controls="x"
          onStep={vi.fn()}
          canStep
          incrementLabel="Más"
          decrementLabel="Menos"
        />
      </>,
    );
    expect(
      screen.getByRole("button", { name: "Menos" }).querySelector(".lucide-minus"),
    ).toBeTruthy();
    expect(screen.getByRole("button", { name: "Más" }).querySelector(".lucide-plus")).toBeTruthy();
  });
});

describe("useStepperLayout", () => {
  afterEach(() => vi.unstubAllGlobals());

  const stubPointer = (coarse: boolean) =>
    vi.stubGlobal(
      "matchMedia",
      vi.fn(() => ({ matches: coarse, addEventListener: vi.fn(), removeEventListener: vi.fn() })),
    );

  it("keeps stacked on a fine pointer", () => {
    stubPointer(false);
    expect(renderHook(() => useStepperLayout("stacked")).result.current).toBe("stacked");
  });

  it("switches stacked to split on a coarse pointer", () => {
    stubPointer(true);
    expect(renderHook(() => useStepperLayout("stacked")).result.current).toBe("split");
  });

  it("keeps split always", () => {
    stubPointer(false);
    expect(renderHook(() => useStepperLayout("split")).result.current).toBe("split");
  });
});
