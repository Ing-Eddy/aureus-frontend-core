import { act, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import type { DataTableHandle } from "../types";
import { names, type Person, people, renderTable, searchTexts } from "./render-data-table";

describe("states", () => {
  it("loading: aria-busy, the label in a status region, and skeleton rows only without rows", () => {
    const { unmount } = renderTable({
      data: [],
      loading: true,
      loadingLabel: "Loading people",
      loadingRows: 3,
    });
    expect(screen.getByRole("table").getAttribute("aria-busy")).toBe("true");
    expect(
      screen.getAllByRole("status").some((status) => status.textContent === "Loading people"),
    ).toBe(true);
    expect(document.querySelectorAll('tbody tr[aria-hidden="true"]')).toHaveLength(3);
    unmount();
    renderTable({ loading: true, loadingLabel: "Loading people" });
    expect(names()).toHaveLength(5);
    expect(document.querySelectorAll('tbody tr[aria-hidden="true"]')).toHaveLength(0);
  });

  it("empty shows the slot in a full-width row, and nothing without it", async () => {
    const { user, unmount } = renderTable({ search: searchTexts, empty: <p>No people</p> });
    await user.type(screen.getByRole("textbox", { name: "Search people" }), "zzz{Enter}");
    const cell = screen.getByText("No people").closest("td") as HTMLElement;
    expect(cell.getAttribute("colspan")).toBe("3");
    unmount();
    renderTable({ data: [] });
    expect(document.querySelectorAll("tbody tr")).toHaveLength(0);
  });

  it("error replaces the rows, with retry", async () => {
    const onRetry = vi.fn();
    const { user } = renderTable({
      error: { content: <p>Could not load</p>, onRetry, retryLabel: "Retry" },
    });
    expect(screen.getByText("Could not load")).toBeTruthy();
    expect(names()).toEqual([""]);
    await user.click(screen.getByRole("button", { name: "Retry" }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("tableRef exposes the instance and helpers", async () => {
    const ref = createRef<DataTableHandle<Person>>();
    const onChange = vi.fn();
    const { user } = renderTable({
      tableRef: ref,
      search: searchTexts,
      selection: { selectRowLabel: (person) => person.name, selectAllLabel: "All", onChange },
      highlight: { rows: true, onChange: vi.fn() },
    });
    expect(ref.current?.table.getRowModel().rows).toHaveLength(5);
    await user.click(screen.getByRole("checkbox", { name: "Ada 1" }));
    act(() => ref.current?.clearSelection());
    expect(onChange).toHaveBeenLastCalledWith({}, []);
    act(() => ref.current?.focusSearch());
    expect(document.activeElement).toBe(screen.getByRole("textbox", { name: "Search people" }));
  });

  it("applies classNames and density", () => {
    renderTable({
      density: "compact",
      classNames: { root: "my-root", cell: "my-cell" },
      data: people(1),
    });
    expect(document.querySelector('[data-slot="data-table"]')?.className).toContain("my-root");
    expect(screen.getByText("Ada 1").className).toContain("my-cell");
    expect(screen.getByText("Ada 1").className).toContain("py-1");
  });
});
