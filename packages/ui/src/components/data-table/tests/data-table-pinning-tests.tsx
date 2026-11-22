import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { DataTableColumn } from "../types";
import { type Person, renderTable } from "./render-data-table";

const columns: DataTableColumn<Person>[] = [
  { accessorKey: "name", header: "Name", pin: "start" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "age", header: "Age", pin: "end" },
];
const cells = (id: string) => Array.from(document.querySelectorAll(`[data-column-id="${id}"]`));

describe("pinning", () => {
  it("pinned cells are sticky and opaque, with the edge divider", () => {
    renderTable({ columns });
    expect(cells("name").every((cell) => cell.getAttribute("data-pinned") === "start")).toBe(true);
    expect(cells("name").every((cell) => cell.getAttribute("data-pin-edge") === "start")).toBe(
      true,
    );
    expect(cells("age").every((cell) => cell.getAttribute("data-pinned") === "end")).toBe(true);
    expect(cells("email").some((cell) => cell.hasAttribute("data-pinned"))).toBe(false);
    expect(cells("name")[1]?.className).toContain("sticky");
    expect(cells("name")[1]?.hasAttribute("data-opaque")).toBe(true);
  });

  it("keeps the selection column at the start and row actions at the end", () => {
    renderTable({
      columns,
      selection: { selectRowLabel: (person) => person.name, selectAllLabel: "All" },
      rowActions: { label: (person) => `Actions for ${person.name}`, items: () => [] },
    });
    expect(cells("__aureus_select")[0]?.getAttribute("data-pinned")).toBe("start");
    expect(cells("name")[0]?.getAttribute("data-pin-edge")).toBe("start");
    expect(cells("__aureus_select")[0]?.hasAttribute("data-pin-edge")).toBe(false);
    expect(cells("__aureus_actions")[0]?.getAttribute("data-pinned")).toBe("end");
    expect(cells("age")[0]?.getAttribute("data-pin-edge")).toBe("end");
    const headers = Array.from(document.querySelectorAll("thead tr:first-child > *"));
    expect(headers.at(-1)?.getAttribute("data-column-id")).toBe("__aureus_actions");
  });

  it("the pinning state is controllable and never reports the built-in columns", async () => {
    const onChange = vi.fn();
    const { rerender: _ } = renderTable({
      columns,
      rowActions: { label: (person) => person.name, items: () => [] },
      pinning: { value: { start: ["email"], end: [] }, onChange },
    });
    expect(cells("email")[0]?.getAttribute("data-pinned")).toBe("start");
    expect(cells("name")[0]?.hasAttribute("data-pinned")).toBe(false);
    expect(cells("__aureus_actions")[0]?.getAttribute("data-pinned")).toBe("end");
    expect(screen.getByRole("table")).toBeTruthy();
  });
});
