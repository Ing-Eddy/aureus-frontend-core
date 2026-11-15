import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useCheckboxValue } from "./use-checkbox-value";

afterEach(() => vi.restoreAllMocks());

describe("useCheckboxValue", () => {
  it("is a boolean by default, uncontrolled", () => {
    const onValueChange = vi.fn();
    const { result } = renderHook(() =>
      useCheckboxValue<boolean>({ onValueChange, componentName: "CheckboxField" }),
    );
    expect(result.current.checked).toBe(false);
    expect(result.current.value).toBe(false);
    act(() => result.current.setChecked(true));
    expect(result.current.checked).toBe(true);
    expect(onValueChange).toHaveBeenLastCalledWith(true);
    act(() => result.current.setChecked(false));
    expect(onValueChange).toHaveBeenLastCalledWith(false);
  });

  it("maps the checked state to custom values", () => {
    const onValueChange = vi.fn();
    const { result } = renderHook(() =>
      useCheckboxValue<"S" | "N">({
        checkedValue: "S",
        uncheckedValue: "N",
        onValueChange,
        componentName: "CheckboxField",
      }),
    );
    expect(result.current.value).toBe("N");
    act(() => result.current.setChecked(true));
    expect(result.current.value).toBe("S");
    expect(onValueChange).toHaveBeenLastCalledWith("S");
  });

  it("follows a controlled value and only reports changes", () => {
    const onValueChange = vi.fn();
    const { result, rerender } = renderHook(
      ({ value }) =>
        useCheckboxValue<number>({
          value,
          checkedValue: 1,
          uncheckedValue: 0,
          onValueChange,
          componentName: "CheckboxField",
        }),
      { initialProps: { value: 1 } },
    );
    expect(result.current.checked).toBe(true);
    act(() => result.current.setChecked(false));
    expect(onValueChange).toHaveBeenLastCalledWith(0);
    expect(result.current.checked).toBe(true);
    rerender({ value: 0 });
    expect(result.current.checked).toBe(false);
  });

  it("shows an unknown value unchecked and warns once", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const { result, rerender } = renderHook(() =>
      useCheckboxValue<string>({
        value: "maybe",
        checkedValue: "S",
        uncheckedValue: "N",
        componentName: "CheckboxField",
      }),
    );
    rerender();
    expect(result.current.checked).toBe(false);
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn.mock.calls[0]?.[0]).toContain('"maybe"');
  });
});
