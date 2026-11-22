import { describe, expect, it, vi } from "vitest";
import {
  bodyRows,
  paginationTexts,
  people,
  renderTable,
  searchTexts,
  sortingTexts,
} from "./render-data-table";

describe("DataTable smoke", () => {
  it("renders every feature without crashing", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    renderTable({
      data: people(25),
      header: { title: "People", subtitle: "Everyone", toolbar: <span>slot</span> },
      search: searchTexts,
      reload: { label: "Reload", onReload: () => {} },
      filters: { label: "Filters", content: <p>filters</p>, activeCount: 2 },
      columnToggle: { label: "Columns" },
      sorting: sortingTexts,
      highlight: { rows: true, columns: true },
      hover: { rows: true, columns: true },
      selection: {
        selectRowLabel: (person) => `Select ${person.name}`,
        selectAllLabel: "Select all",
        actionsLabel: "Actions",
        actions: [{ id: "delete", label: "Delete", onSelect: () => {} }],
        selectedLabel: (count) => `${count} selected`,
      },
      expansion: {
        renderDetail: (person) => person.email,
        expandLabel: (person) => `Expand ${person.name}`,
      },
      rowActions: { label: (person) => `Actions for ${person.name}`, items: () => [] },
      resizing: { resizeLabel: (column) => `Resize ${column}` },
      pagination: { ...paginationTexts, pageSizes: [10, 20], pageSizeLabel: "Rows" },
      striped: true,
      stickyHeader: true,
      density: "compact",
    });
    expect(bodyRows()).toHaveLength(10);
    expect(warn).not.toHaveBeenCalled();
    warn.mockRestore();
  });
});
