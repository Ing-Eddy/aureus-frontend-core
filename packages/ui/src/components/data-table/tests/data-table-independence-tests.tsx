import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  names,
  paginationTexts,
  people,
  renderTable,
  searchTexts,
  sortingTexts,
} from "./render-data-table";

const has = (selector: string) => document.querySelector(selector) !== null;

describe("independent features", () => {
  it("a minimal table has no controls", () => {
    renderTable({ data: people(30) });
    expect(names()).toHaveLength(30);
    expect(screen.queryAllByRole("button")).toHaveLength(0);
    expect(screen.queryAllByRole("checkbox")).toHaveLength(0);
    expect(has('[data-slot="data-table-header"]')).toBe(false);
  });

  it("column dividers are off by default and change nothing else", () => {
    const root = () => document.querySelector('[data-slot="data-table"]');
    const { unmount } = renderTable({ striped: true });
    expect(root()?.hasAttribute("data-column-dividers")).toBe(false);
    unmount();
    renderTable({ columnDividers: true });
    expect(root()?.hasAttribute("data-column-dividers")).toBe(true);
    expect(has("[data-stripe]")).toBe(false);
    expect(root()?.getAttribute("data-density")).toBe("default");
  });

  it("selection does not enable pagination, search or sorting", () => {
    renderTable({
      data: people(30),
      selection: { selectRowLabel: (person) => person.name, selectAllLabel: "All" },
    });
    expect(names()).toHaveLength(30);
    expect(screen.queryByRole("textbox")).toBeNull();
    expect(screen.queryByRole("button", { name: /^Sort/ })).toBeNull();
  });

  it("pagination does not enable search, and search does not enable pagination", () => {
    const { unmount } = renderTable({ data: people(30), pagination: paginationTexts });
    expect(screen.queryByRole("textbox")).toBeNull();
    unmount();
    renderTable({ data: people(30), search: searchTexts });
    expect(names()).toHaveLength(30);
    expect(has('[data-slot="data-table-pagination"]')).toBe(false);
  });

  it("highlight does not enable hover, and hover does not enable highlight", async () => {
    const { user, unmount } = renderTable({ highlight: { rows: true, columns: true } });
    expect(has("[data-hover-rows]")).toBe(false);
    unmount();
    const other = renderTable({ hover: { rows: true, columns: true } });
    await other.user.click(screen.getByText("Ada 1"));
    expect(has("[data-highlight-row]")).toBe(false);
    void user;
  });

  it("manual on one feature does not make another manual", async () => {
    const data = people(12).reverse();
    const { user } = renderTable({
      data,
      sorting: { ...sortingTexts, manual: true },
      search: searchTexts,
      pagination: paginationTexts,
    });
    expect(names()).toHaveLength(10);
    await user.type(screen.getByRole("textbox"), "ada{Enter}");
    expect(names()).toEqual(["Ada 9", "Ada 1"]);
  });
});
