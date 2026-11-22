import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { DataTableColumn } from "../types";
import { type Person, renderTable } from "./render-data-table";

const hovered = () =>
  Array.from(document.querySelectorAll("[data-column-hover]")).map((cell) =>
    cell.getAttribute("data-column-id"),
  );

const grouped: DataTableColumn<Person>[] = [
  { accessorKey: "name", header: "Name", footer: "Total" },
  {
    id: "details",
    header: "Details",
    columns: [
      { accessorKey: "email", header: "Email" },
      { accessorKey: "age", header: "Age", footer: "99" },
    ],
  },
];

describe("hover", () => {
  it("marks every cell of the column under the pointer, header and footer included", () => {
    renderTable({ hover: { columns: true }, columns: grouped });
    fireEvent.pointerOver(screen.getByText("Ada 1"));
    expect(hovered()).toEqual(["name", "name", "name", "name", "name", "name", "name"]);
    fireEvent.pointerOver(screen.getByText("user1@example.com"));
    expect(new Set(hovered())).toEqual(new Set(["email"]));
  });

  it("a group header marks all its leaves, and leaving clears", () => {
    renderTable({ hover: { columns: true }, columns: grouped });
    fireEvent.pointerOver(screen.getByText("Details"));
    expect(new Set(hovered())).toEqual(new Set(["email", "age"]));
    fireEvent.pointerLeave(screen.getByRole("table"));
    expect(hovered()).toEqual([]);
  });

  it("sets nothing without hover.columns", () => {
    renderTable({ hover: { rows: true } });
    fireEvent.pointerOver(screen.getByText("Ada 1"));
    expect(hovered()).toEqual([]);
  });

  it("hover.rows turns on row hover on the root", () => {
    const { container, unmount } = renderTable({ hover: { rows: true } });
    expect(
      container.querySelector('[data-slot="data-table"]')?.hasAttribute("data-hover-rows"),
    ).toBe(true);
    unmount();
    const other = renderTable();
    expect(
      other.container.querySelector('[data-slot="data-table"]')?.hasAttribute("data-hover-rows"),
    ).toBe(false);
  });
});
