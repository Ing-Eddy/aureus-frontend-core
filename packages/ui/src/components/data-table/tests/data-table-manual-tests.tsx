import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import {
  names,
  paginationTexts,
  people,
  renderTable,
  searchTexts,
  sortingTexts,
} from "./render-data-table";

describe("manual (server) mode per feature", () => {
  it("manual sorting reports the sort and keeps the order of data", async () => {
    const onChange = vi.fn();
    const data = people(5).reverse();
    const { user } = renderTable({ data, sorting: { ...sortingTexts, manual: true, onChange } });
    await user.click(screen.getByRole("button", { name: /^Sort by Name/ }));
    expect(onChange).toHaveBeenCalledWith([{ id: "name", desc: false }]);
    expect(names()).toEqual(data.map((person) => person.name));
  });

  it("manual search reports the query and does not filter", async () => {
    const onSearch = vi.fn();
    const { user } = renderTable({ search: { ...searchTexts, manual: true, onSearch } });
    await user.type(screen.getByRole("textbox", { name: "Search people" }), "ada{Enter}");
    expect(onSearch).toHaveBeenCalledWith("ada");
    expect(names()).toHaveLength(5);
  });

  it("manual pagination uses rowCount and the given rows", async () => {
    const onChange = vi.fn();
    const { user } = renderTable({
      data: people(10),
      pagination: {
        ...paginationTexts,
        manual: true,
        rowCount: 95,
        value: { pageIndex: 0, pageSize: 10 },
        onChange,
      },
    });
    expect(screen.getByText("Page 1 of 10")).toBeTruthy();
    await user.click(screen.getByRole("button", { name: "Next page" }));
    expect(onChange).toHaveBeenCalledWith({ pageIndex: 1, pageSize: 10 });
    expect(names()).toHaveLength(10);
  });

  it("manual pagination with client sorting sorts the given page and does not paginate it again", async () => {
    const data = people(12).reverse();
    const { user } = renderTable({
      data,
      sorting: sortingTexts,
      pagination: {
        ...paginationTexts,
        manual: true,
        rowCount: 100,
        defaultValue: { pageIndex: 0, pageSize: 10 },
      },
    });
    expect(names()).toHaveLength(12);
    await user.click(screen.getByRole("button", { name: /^Sort by Age/ }));
    const ages = data.map((person) => person.age).sort((a, b) => a - b);
    expect(
      screen
        .getAllByRole("row")
        .slice(1)
        .map((row) => Number(row.lastChild?.textContent)),
    ).toEqual(ages);
  });

  it("selection reports rows selected on another page in manual pagination", async () => {
    const onChange = vi.fn();
    const pageOne = people(20).slice(0, 10);
    const pageTwo = people(20).slice(10);
    const selection = {
      selectRowLabel: (person: { name: string }) => `Select ${person.name}`,
      selectAllLabel: "Select all",
      onChange,
    };
    const pagination = { ...paginationTexts, manual: true, rowCount: 20 };
    const { user, rerender } = renderTable({ data: pageOne, selection, pagination });
    await user.click(screen.getByRole("checkbox", { name: "Select Ada 1" }));
    const { DataTable } = await import("..");
    const { TooltipProvider } = await import("@/shadcn/ui/tooltip");
    const { personColumns } = await import("./render-data-table");
    rerender(
      <TooltipProvider>
        <DataTable
          aria-label="People"
          data={pageTwo}
          columns={personColumns}
          getRowId={(person) => person.id}
          selection={selection}
          pagination={pagination}
        />
      </TooltipProvider>,
    );
    await user.click(screen.getByRole("checkbox", { name: "Select Katherine 13" }));
    const [state, rows] = onChange.mock.calls.at(-1) ?? [];
    expect(state).toEqual({ p1: true, p13: true });
    expect(rows.map((person: { name: string }) => person.name)).toEqual(["Ada 1", "Katherine 13"]);
  });
});
