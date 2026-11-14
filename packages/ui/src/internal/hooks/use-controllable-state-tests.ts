import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useControllableState } from "./use-controllable-state";

describe("useControllableState", () => {
  it("owns the value when uncontrolled and reports changes", () => {
    const onChange = vi.fn();
    const { result } = renderHook(() => useControllableState({ defaultValue: false, onChange }));
    expect(result.current[0]).toBe(false);

    act(() => result.current[1](true));

    expect(result.current[0]).toBe(true);
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("follows the prop when controlled and only reports changes", () => {
    const onChange = vi.fn();
    const { result, rerender } = renderHook(
      ({ value }) => useControllableState({ value, defaultValue: false, onChange }),
      { initialProps: { value: false } },
    );

    act(() => result.current[1](true));
    expect(onChange).toHaveBeenCalledWith(true);
    expect(result.current[0]).toBe(false);

    rerender({ value: true });
    expect(result.current[0]).toBe(true);
  });

  it("returns a stable setter", () => {
    const { result, rerender } = renderHook(() => useControllableState({ defaultValue: 0 }));
    const setter = result.current[1];
    rerender();
    expect(result.current[1]).toBe(setter);
  });
});
