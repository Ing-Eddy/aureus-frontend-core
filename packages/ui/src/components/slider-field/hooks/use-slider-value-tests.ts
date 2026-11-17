import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { type UseSliderValueOptions, useSliderValue } from "./use-slider-value";

const limits = { min: 0, max: 100, step: 1 };

function setup(options: Partial<UseSliderValueOptions>) {
  return renderHook((props: Partial<UseSliderValueOptions>) =>
    useSliderValue({ range: false, limits, ...options, ...props }),
  );
}

describe("useSliderValue", () => {
  it("defaults to min, or to [min, max] for a range", () => {
    expect(setup({}).result.current.values).toEqual([0]);
    expect(setup({ range: true }).result.current.values).toEqual([0, 100]);
  });

  it("is uncontrolled with defaultValue", () => {
    const onValueChange = vi.fn();
    const { result } = setup({ defaultValue: 30, onValueChange });
    act(() => result.current.change([40]));
    expect(result.current.values).toEqual([40]);
    expect(onValueChange).toHaveBeenCalledWith(40);
  });

  it("only reports changes when controlled", () => {
    const onValueChange = vi.fn();
    const { result, rerender } = setup({ value: 30, onValueChange });
    act(() => result.current.change([40]));
    expect(result.current.values).toEqual([30]);
    expect(onValueChange).toHaveBeenCalledWith(40);
    rerender({ value: 40 });
    expect(result.current.values).toEqual([40]);
  });

  it("reports a pair for a range", () => {
    const onValueChange = vi.fn();
    const { result } = setup({ range: true, defaultValue: [20, 80], onValueChange });
    act(() => result.current.change([20, 60], 1));
    expect(onValueChange).toHaveBeenCalledWith([20, 60]);
  });

  it("shows out-of-order and out-of-range values normalized", () => {
    expect(setup({ range: true, value: [80, 20] }).result.current.values).toEqual([20, 80]);
    expect(setup({ value: 140 }).result.current.values).toEqual([100]);
    expect(setup({ value: 33.3 }).result.current.values).toEqual([33]);
  });

  it("does not report a change that normalizes to the current value", () => {
    const onValueChange = vi.fn();
    const marks = [0, 50, 100];
    const { result } = setup({ defaultValue: 50, limits: { ...limits, marks }, onValueChange });
    act(() => result.current.change([55]));
    expect(onValueChange).not.toHaveBeenCalled();
    act(() => result.current.change([80]));
    expect(onValueChange).toHaveBeenCalledWith(100);
  });

  it("commits the latest value once, before the consumer re-renders", () => {
    const onValueCommit = vi.fn();
    const { result } = setup({ value: 10, onValueCommit });
    act(() => {
      result.current.change([25]);
      result.current.change([40]);
      result.current.commit();
    });
    expect(onValueCommit).toHaveBeenCalledOnce();
    expect(onValueCommit).toHaveBeenCalledWith(40);
  });
});
