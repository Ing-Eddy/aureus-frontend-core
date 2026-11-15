import { renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { UseSelectOptionsOptions } from "./use-select-options";
import { useSelectOptions } from "./use-select-options";

const options = [
  { value: "es", label: "España", group: "Europa" },
  { value: "mx", label: "México", group: "América" },
  { value: "cl", label: "Chile", group: "América" },
];

const base: UseSelectOptionsOptions = {
  options,
  query: "",
  filter: true,
  creatable: false,
  selectAll: false,
  multiple: false,
  selectedIds: [],
};

const values = (groups: ReturnType<typeof useSelectOptions>["groups"]) =>
  groups.flatMap((group) =>
    group.rows.map((row) => (row.kind === "option" ? row.option.value : row.kind)),
  );

afterEach(() => vi.restoreAllMocks());

describe("useSelectOptions", () => {
  it("filters by label ignoring case and accents, keeping groups", () => {
    const { result } = renderHook(() => useSelectOptions({ ...base, query: "MEX" }));
    expect(values(result.current.groups)).toEqual(["mx"]);
    expect(result.current.groups[0]?.title).toBe("América");
  });

  it("does not filter with filter={false}", () => {
    const { result } = renderHook(() => useSelectOptions({ ...base, query: "zzz", filter: false }));
    expect(values(result.current.groups)).toEqual(["es", "mx", "cl"]);
    expect(result.current.noResults).toBe(false);
  });

  it("reports no results and an empty list", () => {
    expect(
      renderHook(() => useSelectOptions({ ...base, query: "zzz" })).result.current.noResults,
    ).toBe(true);
    expect(
      renderHook(() => useSelectOptions({ ...base, options: [] })).result.current.isEmpty,
    ).toBe(true);
  });

  it("offers create only without an exact match", () => {
    const create = renderHook(() => useSelectOptions({ ...base, creatable: true, query: "Perú" }))
      .result.current;
    expect(values(create.groups)).toContain("create");
    const exact = renderHook(() => useSelectOptions({ ...base, creatable: true, query: "espana" }))
      .result.current;
    expect(values(exact.groups)).not.toContain("create");
  });

  it("puts select all first in multiple mode, hidden while searching", () => {
    const first = renderHook(() => useSelectOptions({ ...base, multiple: true, selectAll: true }))
      .result.current;
    expect(values(first.groups)[0]).toBe("select-all");
    const searching = renderHook(() =>
      useSelectOptions({ ...base, multiple: true, selectAll: true, query: "es" }),
    ).result.current;
    expect(values(searching.groups)).not.toContain("select-all");
  });

  it("disables unselected options at the limit", () => {
    const { result } = renderHook(() =>
      useSelectOptions({ ...base, multiple: true, selectedIds: ["es"], maxSelected: 1 }),
    );
    const rows = result.current.groups.flatMap((group) => group.rows);
    expect(result.current.atLimit).toBe(true);
    expect(rows.map((row) => row.kind === "option" && row.disabled)).toEqual([false, true, true]);
  });

  it("warns once about values that are not among the options", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const { rerender } = renderHook(() => useSelectOptions({ ...base, selectedIds: ["pe"] }));
    rerender();
    expect(warn).toHaveBeenCalledOnce();
    expect(warn.mock.calls[0]?.[0]).toContain('"pe"');
  });
});
