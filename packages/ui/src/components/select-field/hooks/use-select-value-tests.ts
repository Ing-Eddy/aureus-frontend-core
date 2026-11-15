import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SELECT_ALL_ID } from "./sentinels";
import { useSelectValue } from "./use-select-value";

const options = [
  { value: "a", label: "A" },
  { value: "b", label: "B", disabled: true },
  { value: "c", label: "C" },
  { value: "d", label: "D" },
];

describe("useSelectValue", () => {
  it("holds a single value, uncontrolled", () => {
    const onValueChange = vi.fn();
    const { result } = renderHook(() =>
      useSelectValue({ multiple: false, options, onValueChange }),
    );
    expect(result.current.raw).toBeNull();
    act(() => result.current.set(["c"]));
    expect(result.current.raw).toBe("c");
    expect(onValueChange).toHaveBeenLastCalledWith("c");
    act(() => result.current.clear());
    expect(onValueChange).toHaveBeenLastCalledWith(null);
  });

  it("follows a controlled multiple value and resolves unknown ids", () => {
    const { result } = renderHook(() =>
      useSelectValue({ multiple: true, options, value: ["a", "zz"] }),
    );
    expect(result.current.selectedOptions).toEqual([
      { value: "a", label: "A" },
      { value: "zz", label: "zz" },
    ]);
  });

  it("removes one or the last value", () => {
    const onValueChange = vi.fn();
    const { result } = renderHook(() =>
      useSelectValue({ multiple: true, options, defaultValue: ["a", "c", "d"], onValueChange }),
    );
    act(() => result.current.remove("c"));
    expect(onValueChange).toHaveBeenLastCalledWith(["a", "d"]);
    act(() => result.current.removeLast());
    expect(onValueChange).toHaveBeenLastCalledWith(["a"]);
  });

  it("reports whether more can be selected", () => {
    const { result } = renderHook(() =>
      useSelectValue({ multiple: true, options, value: ["a", "c"], maxSelected: 2 }),
    );
    expect(result.current.canSelectMore).toBe(false);
  });

  it("selects all enabled options, respecting the limit, then none", () => {
    const onValueChange = vi.fn();
    const { result } = renderHook(() =>
      useSelectValue({ multiple: true, options, defaultValue: [], onValueChange }),
    );
    expect(result.current.selectAllState).toBe("none");
    act(() => result.current.toggleAll());
    expect(onValueChange).toHaveBeenLastCalledWith(["a", "c", "d"]);
    expect(result.current.selectAllState).toBe("all");
    act(() => result.current.toggleAll());
    expect(onValueChange).toHaveBeenLastCalledWith([]);

    const limited = renderHook(() =>
      useSelectValue({ multiple: true, options, defaultValue: [], maxSelected: 2, onValueChange }),
    );
    act(() => limited.result.current.toggleAll());
    expect(onValueChange).toHaveBeenLastCalledWith(["a", "c"]);
    expect(limited.result.current.selectAllState).toBe("some");
  });

  it("never reports sentinel ids", () => {
    const onValueChange = vi.fn();
    const { result } = renderHook(() =>
      useSelectValue({ multiple: true, options, defaultValue: [], onValueChange }),
    );
    act(() => result.current.set(["a", SELECT_ALL_ID]));
    expect(onValueChange).toHaveBeenLastCalledWith(["a"]);
  });
});
