import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { OTHER_ID, useRadioGroupValue } from "./use-radio-group-value";

afterEach(() => vi.restoreAllMocks());

const options = [
  { value: "free", label: "Free" },
  { value: "pro", label: "Pro" },
];

const base = { options, componentName: "RadioGroupField" };

describe("useRadioGroupValue", () => {
  it("starts empty and chooses one value at a time", () => {
    const onValueChange = vi.fn();
    const { result } = renderHook(() =>
      useRadioGroupValue({ ...base, hasOther: false, onValueChange }),
    );
    expect(result.current.value).toBeNull();
    expect(result.current.radixValue).toBe("");
    act(() => result.current.choose("pro"));
    act(() => result.current.choose("free"));
    expect(result.current.radixValue).toBe("free");
    expect(onValueChange).toHaveBeenLastCalledWith("free");
  });

  it("follows a controlled value, including null", () => {
    const onValueChange = vi.fn();
    const { result, rerender } = renderHook(
      ({ value }: { value: string | null }) =>
        useRadioGroupValue({ ...base, hasOther: false, value, onValueChange }),
      { initialProps: { value: "pro" as string | null } },
    );
    act(() => result.current.choose("free"));
    expect(onValueChange).toHaveBeenLastCalledWith("free");
    expect(result.current.radixValue).toBe("pro");
    rerender({ value: null });
    expect(result.current.radixValue).toBe("");
  });

  it("keeps an unknown value, checks nothing and warns once", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const { result, rerender } = renderHook(() =>
      useRadioGroupValue({ ...base, hasOther: false, defaultValue: "enterprise" }),
    );
    rerender();
    expect(result.current.value).toBe("enterprise");
    expect(result.current.radixValue).toBe("");
    expect(warn).toHaveBeenCalledTimes(1);
  });

  it("treats an unknown value as the other text when there is an other option", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const { result } = renderHook(() =>
      useRadioGroupValue({ ...base, hasOther: true, defaultValue: "Podcast" }),
    );
    expect(result.current.isOther).toBe(true);
    expect(result.current.radixValue).toBe(OTHER_ID);
    expect(result.current.otherText).toBe("Podcast");
    expect(warn).not.toHaveBeenCalled();
  });

  it("reports an empty text when other is chosen, and the last text when chosen again", () => {
    const onValueChange = vi.fn();
    const { result } = renderHook(() =>
      useRadioGroupValue({ ...base, hasOther: true, onValueChange }),
    );
    act(() => result.current.choose(OTHER_ID));
    expect(onValueChange).toHaveBeenLastCalledWith("");
    expect(result.current.radixValue).toBe(OTHER_ID);
    act(() => result.current.setOtherText("Podcast"));
    act(() => result.current.choose("pro"));
    act(() => result.current.choose(OTHER_ID));
    expect(onValueChange).toHaveBeenLastCalledWith("Podcast");
  });

  it("clears to null", () => {
    const onValueChange = vi.fn();
    const { result } = renderHook(() =>
      useRadioGroupValue({ ...base, hasOther: false, defaultValue: "pro", onValueChange }),
    );
    act(() => result.current.clear());
    expect(onValueChange).toHaveBeenLastCalledWith(null);
    expect(result.current.value).toBeNull();
  });
});
