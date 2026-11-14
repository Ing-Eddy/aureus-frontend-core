import { act, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { FieldCounter } from "./field-counter";

const liveRegion = (container: HTMLElement) =>
  container.querySelector("[aria-live=polite]") as HTMLElement;

describe("FieldCounter", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("shows count/max, hidden from assistive technology", () => {
    const { container } = render(
      <FieldCounter
        count={120}
        max={500}
        describedById="c"
        announcement="380 characters remaining"
      />,
    );
    const visible = container.querySelector("[data-slot=field-counter]") as HTMLElement;
    expect(visible.textContent).toBe("120/500");
    expect(visible.getAttribute("aria-hidden")).toBe("true");
    expect(container.querySelector("#c")?.textContent).toBe("380 characters remaining");
  });

  it("shows the count alone without a max", () => {
    const { container } = render(
      <FieldCounter count={42} describedById="c" announcement="42 characters" />,
    );
    expect(container.querySelector("[data-slot=field-counter]")?.textContent).toBe("42");
  });

  it("turns destructive at the limit", () => {
    const { container, rerender } = render(
      <FieldCounter count={9} max={10} describedById="c" announcement="1 character remaining" />,
    );
    const visible = () => container.querySelector("[data-slot=field-counter]") as HTMLElement;
    expect(visible().className).not.toContain("text-destructive");
    rerender(
      <FieldCounter count={10} max={10} describedById="c" announcement="0 characters remaining" />,
    );
    expect(visible().className).toContain("text-destructive");
    expect(visible().getAttribute("data-limit")).toBe("true");
  });

  it("announces nothing on mount, and announces once after a pause", () => {
    const { container, rerender } = render(
      <FieldCounter count={0} max={10} describedById="c" announcement="10 characters remaining" />,
    );
    act(() => vi.advanceTimersByTime(2000));
    expect(liveRegion(container).textContent).toBe("");

    for (const count of [1, 2, 3]) {
      rerender(
        <FieldCounter
          count={count}
          max={10}
          describedById="c"
          announcement={`${10 - count} characters remaining`}
        />,
      );
      act(() => vi.advanceTimersByTime(300));
    }
    expect(liveRegion(container).textContent).toBe("");

    act(() => vi.advanceTimersByTime(1000));
    expect(liveRegion(container).textContent).toBe("7 characters remaining");
  });
});
