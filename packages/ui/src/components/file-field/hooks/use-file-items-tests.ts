import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { FileItem } from "../types";
import { useFileItems } from "./use-file-items";

const item = (id: string): FileItem<string> => ({ kind: "new", id, file: new File(["x"], id) });

describe("useFileItems", () => {
  it("appends with multiple and reports the whole value", () => {
    const onValueChange = vi.fn();
    const { result } = renderHook(() =>
      useFileItems<string>({ multiple: true, defaultValue: [item("a")], onValueChange }),
    );
    act(() => result.current.add([item("b"), item("c")]));
    expect(result.current.items.map((i) => i.id)).toEqual(["a", "b", "c"]);
    expect(onValueChange).toHaveBeenLastCalledWith(result.current.items);
  });

  it("replaces the single item and reports one item or null", () => {
    const onValueChange = vi.fn();
    const { result } = renderHook(() =>
      useFileItems<string>({ multiple: false, defaultValue: item("a"), onValueChange }),
    );
    act(() => result.current.add([item("b"), item("c")]));
    expect(onValueChange).toHaveBeenLastCalledWith(item("b"));
    act(() => result.current.remove("b"));
    expect(onValueChange).toHaveBeenLastCalledWith(null);
    expect(result.current.items).toEqual([]);
  });

  it("keeps two replacements in a row", () => {
    const { result } = renderHook(() =>
      useFileItems<string>({ multiple: true, defaultValue: [item("a"), item("b")] }),
    );
    act(() => {
      result.current.replace("a", { kind: "existing", id: "a", data: "A" });
      result.current.replace("b", { kind: "existing", id: "b", data: "B" });
    });
    expect(result.current.items).toEqual([
      { kind: "existing", id: "a", data: "A" },
      { kind: "existing", id: "b", data: "B" },
    ]);
  });

  it("ignores a replacement for a removed item", () => {
    const onValueChange = vi.fn();
    const { result } = renderHook(() =>
      useFileItems<string>({ multiple: true, defaultValue: [item("a")], onValueChange }),
    );
    act(() => result.current.replace("gone", { kind: "existing", id: "gone", data: "x" }));
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("moves an item", () => {
    const { result } = renderHook(() =>
      useFileItems<string>({ multiple: true, defaultValue: [item("a"), item("b"), item("c")] }),
    );
    act(() => result.current.move(0, 2));
    expect(result.current.items.map((i) => i.id)).toEqual(["b", "c", "a"]);
  });

  it("follows a controlled value", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useFileItems<string>({ multiple: true, value }),
      { initialProps: { value: [item("a")] } },
    );
    rerender({ value: [item("z")] });
    expect(result.current.items.map((i) => i.id)).toEqual(["z"]);
  });
});
