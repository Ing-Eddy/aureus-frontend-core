import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { renderTable, sortingTexts } from "./render-data-table";

const row = (name: string) => screen.getByText(name).closest("tr") as HTMLElement;
const header = (name: string) => screen.getByRole("columnheader", { name: new RegExp(name) });
const cellsOf = (column: string) =>
  Array.from(document.querySelectorAll(`[data-column-id="${column}"]`));

describe("highlight", () => {
  it("marks a column, a row and their crossing", async () => {
    const onChange = vi.fn();
    const { user } = renderTable({ highlight: { columns: true, rows: true, onChange } });
    await user.click(header("Age"));
    expect(cellsOf("age").every((cell) => cell.hasAttribute("data-highlight-column"))).toBe(true);
    await user.click(row("Grace 2"));
    expect(row("Grace 2").hasAttribute("data-highlight-row")).toBe(true);
    const crossing = row("Grace 2").querySelector('[data-column-id="age"]');
    expect(crossing?.hasAttribute("data-highlight-column")).toBe(true);
    expect(onChange).toHaveBeenLastCalledWith({ columnId: "age", rowId: "p2" });
  });

  it("a second click unmarks", async () => {
    const onChange = vi.fn();
    const { user } = renderTable({ highlight: { columns: true, rows: true, onChange } });
    await user.click(header("Age"));
    await user.click(header("Age"));
    expect(onChange).toHaveBeenLastCalledWith({});
    await user.click(row("Ada 1"));
    await user.click(row("Ada 1"));
    expect(row("Ada 1").hasAttribute("data-highlight-row")).toBe(false);
  });

  it("Escape clears both, and is not stopped when nothing is marked", async () => {
    const { user } = renderTable({ highlight: { columns: true, rows: true } });
    const outer = vi.fn();
    document.addEventListener("keydown", outer);
    fireEvent.keyDown(screen.getByRole("table"), { key: "Escape" });
    expect(outer).toHaveBeenCalledTimes(1);
    await user.click(header("Age"));
    await user.click(row("Ada 1"));
    fireEvent.keyDown(screen.getByRole("table"), { key: "Escape" });
    expect(outer).toHaveBeenCalledTimes(1);
    expect(document.querySelector("[data-highlight-row], [data-highlight-column]")).toBeNull();
    document.removeEventListener("keydown", outer);
  });

  it("clicks on controls never mark", async () => {
    const onChange = vi.fn();
    const { user } = renderTable({
      sorting: sortingTexts,
      highlight: { columns: true, rows: true, onChange },
      selection: { selectRowLabel: (person) => `Select ${person.name}`, selectAllLabel: "All" },
    });
    await user.click(screen.getByRole("button", { name: /^Sort by Age/ }));
    await user.click(screen.getByRole("checkbox", { name: "Select Ada 1" }));
    expect(onChange).not.toHaveBeenCalled();
    expect(header("Age").getAttribute("aria-sort")).toBe("ascending");
  });

  it("is controllable", async () => {
    const onChange = vi.fn();
    const { user } = renderTable({
      highlight: { columns: true, rows: true, value: { columnId: "name" }, onChange },
    });
    expect(header("Name").hasAttribute("data-highlight-column")).toBe(true);
    await user.click(row("Ada 1"));
    expect(onChange).toHaveBeenCalledWith({ columnId: "name", rowId: "p1" });
    expect(row("Ada 1").hasAttribute("data-highlight-row")).toBe(false);
  });

  it("does nothing without the feature", async () => {
    const { user } = renderTable();
    await user.click(header("Age"));
    expect(document.querySelector("[data-highlight-column]")).toBeNull();
    expect(row("Ada 1").getAttribute("tabindex")).toBeNull();
  });
});
