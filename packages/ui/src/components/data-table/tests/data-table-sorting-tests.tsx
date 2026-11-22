import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { names, renderTable, sortingTexts } from "./render-data-table";

const sortButton = (column: string) =>
  screen.getByRole("button", { name: new RegExp(`^Sort by ${column}`) });
const sortOf = (column: string) =>
  screen.getByRole("columnheader", { name: new RegExp(column) }).getAttribute("aria-sort");

describe("sorting", () => {
  it("cycles none → ascending → descending → none", async () => {
    const { user } = renderTable({ sorting: sortingTexts });
    const original = names();
    expect(sortButton("Age").getAttribute("aria-label")).toBe("Sort by Age ascending");
    await user.click(sortButton("Age"));
    expect(sortOf("Age")).toBe("ascending");
    expect(sortButton("Age").getAttribute("aria-label")).toBe("Sort by Age descending");
    await user.click(sortButton("Age"));
    expect(sortOf("Age")).toBe("descending");
    expect(sortButton("Age").getAttribute("aria-label")).toBe("Sort by Age none");
    await user.click(sortButton("Age"));
    expect(sortOf("Age")).toBeNull();
    expect(names()).toEqual(original);
  });

  it("sorts the rows", async () => {
    const { user } = renderTable({ sorting: sortingTexts });
    await user.click(sortButton("Name"));
    expect(names()).toEqual(["Ada 1", "Alan 3", "Grace 2", "Katherine 5", "Linus 4"]);
    await user.click(sortButton("Name"));
    expect(names()).toEqual(["Linus 4", "Katherine 5", "Grace 2", "Alan 3", "Ada 1"]);
  });

  it("descFirst starts descending", async () => {
    const { user } = renderTable({ sorting: { ...sortingTexts, descFirst: true } });
    await user.click(sortButton("Age"));
    expect(sortOf("Age")).toBe("descending");
  });

  it("multi adds a column with Shift and replaces it without", async () => {
    const onChange = vi.fn();
    const { user } = renderTable({ sorting: { ...sortingTexts, multi: true, onChange } });
    await user.click(sortButton("Age"));
    await user.keyboard("{Shift>}");
    await user.click(sortButton("Name"));
    await user.keyboard("{/Shift}");
    expect(onChange).toHaveBeenLastCalledWith([
      { id: "age", desc: false },
      { id: "name", desc: false },
    ]);
    await user.click(sortButton("Email"));
    expect(onChange).toHaveBeenLastCalledWith([{ id: "email", desc: false }]);
  });

  it("without multi, Shift does not add", async () => {
    const onChange = vi.fn();
    const { user } = renderTable({ sorting: { ...sortingTexts, onChange } });
    await user.click(sortButton("Age"));
    await user.keyboard("{Shift>}");
    await user.click(sortButton("Name"));
    await user.keyboard("{/Shift}");
    expect(onChange).toHaveBeenLastCalledWith([{ id: "name", desc: false }]);
  });

  it("columns are sortable only with sortable, and only when sorting is on", () => {
    const { unmount } = renderTable({
      sorting: sortingTexts,
      columns: [
        { accessorKey: "name", header: "Name" },
        { accessorKey: "age", header: "Age", sortable: true },
      ],
    });
    expect(screen.queryByRole("button", { name: /^Sort by Name/ })).toBeNull();
    expect(sortButton("Age")).toBeTruthy();
    unmount();
    renderTable();
    expect(screen.queryByRole("button", { name: /^Sort by/ })).toBeNull();
  });
});
