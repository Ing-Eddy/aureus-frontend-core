import { screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { DataTableColumn } from "../types";
import { type Person, renderTable } from "./render-data-table";

const nested: DataTableColumn<Person>[] = [
  { accessorKey: "name", header: "Name", subtitle: "Full name" },
  {
    id: "contact",
    header: "Contact",
    columns: [
      { accessorKey: "email", header: "Email" },
      { id: "phone", accessorFn: () => "555", header: "Phone" },
    ],
  },
];

describe("columns", () => {
  it("draws nested headers with colSpan and leaves without a group spanning both rows", () => {
    renderTable({ columns: nested });
    const [top, bottom] = within(screen.getByRole("table")).getAllByRole("row");
    const topCells = within(top as HTMLElement).getAllByRole("columnheader");
    expect(topCells.map((cell) => cell.textContent)).toEqual(["NameFull name", "Contact"]);
    expect(topCells[0]?.getAttribute("rowspan")).toBe("2");
    expect(topCells[1]?.getAttribute("colspan")).toBe("2");
    expect(topCells[1]?.getAttribute("scope")).toBe("colgroup");
    expect(
      within(bottom as HTMLElement)
        .getAllByRole("columnheader")
        .map((cell) => cell.textContent),
    ).toEqual(["Email", "Phone"]);
    const firstRow = screen.getByText("Ada 1").closest("tr") as HTMLElement;
    expect(within(firstRow).getAllByRole("cell")).toHaveLength(3);
  });

  it("shows a subtitle under the header text", () => {
    renderTable({ columns: nested });
    const name = screen.getByRole("columnheader", { name: /Name/ });
    expect(within(name).getByText("Full name")).toBeTruthy();
  });

  it("renders cells with cell(), values as text by default, and alignment", () => {
    renderTable({
      columns: [
        {
          accessorKey: "name",
          header: "Name",
          cell: ({ value, rowIndex }) => `${value}#${rowIndex}`,
        },
        { accessorKey: "age", header: "Age", align: "end" },
      ],
    });
    expect(screen.getByText("Ada 1#0")).toBeTruthy();
    expect(screen.getByText("20").className).toContain("text-end");
  });

  it("renders the footer row only when a column defines a footer", () => {
    const { unmount } = renderTable();
    expect(screen.getByRole("table").querySelector("tfoot")).toBeNull();
    unmount();
    renderTable({
      columns: [
        { accessorKey: "name", header: "Name", footer: "Total" },
        {
          accessorKey: "age",
          header: "Age",
          footer: ({ rows }) => rows.reduce((sum, row) => sum + row.age, 0),
        },
      ],
    });
    const footer = screen.getByRole("table").querySelector("tfoot") as HTMLElement;
    expect(
      within(footer)
        .getAllByRole("cell")
        .map((cell) => cell.textContent),
    ).toEqual(["Total", "170"]);
  });

  it("has scope=col on leaf headers", () => {
    renderTable();
    for (const cell of screen.getAllByRole("columnheader"))
      expect(cell.getAttribute("scope")).toBe("col");
  });
});
