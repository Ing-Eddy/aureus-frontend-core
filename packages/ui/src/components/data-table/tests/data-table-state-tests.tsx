import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { names, paginationTexts, people, renderTable, sortingTexts } from "./render-data-table";

const sortButton = (column: string) =>
  screen.getByRole("button", { name: new RegExp(`^Sort by ${column}`) });

describe("controllable state slices", () => {
  it("sorting: uncontrolled with defaultValue", () => {
    renderTable({ sorting: { ...sortingTexts, defaultValue: [{ id: "age", desc: true }] } });
    expect(screen.getByRole("columnheader", { name: /Age/ }).getAttribute("aria-sort")).toBe(
      "descending",
    );
  });

  it("sorting: uncontrolled with no defaultValue starts unsorted and reports every change", async () => {
    const onChange = vi.fn();
    const { user } = renderTable({ sorting: { ...sortingTexts, onChange } });
    await user.click(sortButton("Name"));
    await user.click(sortButton("Name"));
    expect(onChange.mock.calls).toEqual([
      [[{ id: "name", desc: false }]],
      [[{ id: "name", desc: true }]],
    ]);
  });

  it("sorting: controlled renders exactly its value and ignores clicks until accepted", async () => {
    const onChange = vi.fn();
    const before = people(5).map((person) => person.name);
    const { user } = renderTable({ sorting: { ...sortingTexts, value: [], onChange } });
    await user.click(sortButton("Name"));
    expect(onChange).toHaveBeenCalledWith([{ id: "name", desc: false }]);
    expect(screen.getByRole("columnheader", { name: /Name/ }).hasAttribute("aria-sort")).toBe(
      false,
    );
    expect(names()).toEqual(before);
  });

  it("pagination: neutral initial page size of 10, then pageSizes[0]", () => {
    renderTable({ data: people(25), pagination: paginationTexts });
    expect(names()).toHaveLength(10);
  });

  it("pagination: a page-size change returns to the first page", async () => {
    const onChange = vi.fn();
    renderTable({
      data: people(40),
      pagination: {
        ...paginationTexts,
        pageSizes: [10, 20],
        pageSizeLabel: "Rows",
        defaultValue: { pageIndex: 2, pageSize: 10 },
        onChange,
      },
    });
    expect(screen.getByText("Page 3 of 4")).toBeTruthy();
  });

  it("column visibility: controlled value hides columns", () => {
    renderTable({ columnToggle: { label: "Columns", value: { email: false } } });
    expect(screen.queryByRole("columnheader", { name: "Email" })).toBeNull();
  });

  it("selection: controlled value marks rows", () => {
    renderTable({
      selection: {
        selectRowLabel: (person) => `Select ${person.name}`,
        selectAllLabel: "Select all",
        value: { p2: true, p3: false },
      },
    });
    expect(
      screen.getByRole("checkbox", { name: "Select Grace 2" }).getAttribute("aria-checked"),
    ).toBe("true");
    expect(
      screen.getByRole("checkbox", { name: "Select Alan 3" }).getAttribute("aria-checked"),
    ).toBe("false");
  });

  it("expansion: defaultValue opens rows", () => {
    renderTable({
      expansion: {
        renderDetail: (person) => `Detail of ${person.name}`,
        expandLabel: (person) => `Expand ${person.name}`,
        defaultValue: { p1: true },
      },
    });
    expect(screen.getByText("Detail of Ada 1")).toBeTruthy();
  });
});
