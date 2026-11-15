import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useCheckboxGroupValue } from "./use-checkbox-group-value";

afterEach(() => vi.restoreAllMocks());

const options = [
  { value: "email", label: "Email" },
  { value: "sms", label: "SMS" },
  { value: "push", label: "Push", disabled: true },
  { value: "slack", label: "Slack" },
];

describe("useCheckboxGroupValue", () => {
  it("reports values in the options order, whatever the click order", () => {
    const onValueChange = vi.fn();
    const { result } = renderHook(() =>
      useCheckboxGroupValue({ options, onValueChange, componentName: "CheckboxGroupField" }),
    );
    act(() => result.current.toggle("slack", true));
    act(() => result.current.toggle("email", true));
    expect(onValueChange).toHaveBeenLastCalledWith(["email", "slack"]);
    act(() => result.current.toggle("email", false));
    expect(onValueChange).toHaveBeenLastCalledWith(["slack"]);
  });

  it("follows a controlled value and only reports changes", () => {
    const onValueChange = vi.fn();
    const { result, rerender } = renderHook(
      ({ value }) =>
        useCheckboxGroupValue({
          options,
          value,
          onValueChange,
          componentName: "CheckboxGroupField",
        }),
      { initialProps: { value: ["sms"] } },
    );
    act(() => result.current.toggle("email", true));
    expect(onValueChange).toHaveBeenLastCalledWith(["email", "sms"]);
    expect(result.current.selected).toEqual(["sms"]);
    rerender({ value: ["email", "sms"] });
    expect(result.current.isChecked("email")).toBe(true);
  });

  it("keeps unknown values at the end and warns once", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const onValueChange = vi.fn();
    const { result, rerender } = renderHook(() =>
      useCheckboxGroupValue({
        options,
        defaultValue: ["fax", "sms"],
        onValueChange,
        componentName: "CheckboxGroupField",
      }),
    );
    rerender();
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn.mock.calls[0]?.[0]).toContain('"fax"');
    act(() => result.current.toggle("email", true));
    expect(onValueChange).toHaveBeenLastCalledWith(["email", "sms", "fax"]);
  });

  it("locks unchecked options at the limit", () => {
    const { result } = renderHook(() =>
      useCheckboxGroupValue({
        options,
        defaultValue: ["email", "sms"],
        maxSelected: 2,
        componentName: "CheckboxGroupField",
      }),
    );
    expect(result.current.atLimit).toBe(true);
    expect(result.current.isLocked(options[3] as (typeof options)[number])).toBe(true);
    expect(result.current.isLocked(options[0] as (typeof options)[number])).toBe(false);
    act(() => result.current.toggle("sms", false));
    expect(result.current.atLimit).toBe(false);
  });

  it("selects every enabled option, keeping disabled ones as they are", () => {
    const { result } = renderHook(() =>
      useCheckboxGroupValue({ options, componentName: "CheckboxGroupField" }),
    );
    expect(result.current.selectAllState).toBe("none");
    act(() => result.current.toggleAll());
    expect(result.current.selected).toEqual(["email", "sms", "slack"]);
    expect(result.current.selectAllState).toBe("all");
    act(() => result.current.toggleAll());
    expect(result.current.selected).toEqual([]);
  });

  it("keeps a checked disabled option when clearing", () => {
    const { result } = renderHook(() =>
      useCheckboxGroupValue({
        options,
        defaultValue: ["email", "sms", "push", "slack"],
        componentName: "CheckboxGroupField",
      }),
    );
    act(() => result.current.toggleAll());
    expect(result.current.selected).toEqual(["push"]);
  });

  it("selects in order up to the limit, and clears at the limit", () => {
    const { result } = renderHook(() =>
      useCheckboxGroupValue({ options, maxSelected: 2, componentName: "CheckboxGroupField" }),
    );
    act(() => result.current.toggleAll());
    expect(result.current.selected).toEqual(["email", "sms"]);
    expect(result.current.selectAllState).toBe("some");
    act(() => result.current.toggleAll());
    expect(result.current.selected).toEqual([]);
  });
});
