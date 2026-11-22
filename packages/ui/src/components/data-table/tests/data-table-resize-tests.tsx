import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { TooltipProvider } from "@/shadcn/ui/tooltip";
import { DataTable } from "..";
import type { DataTableColumn } from "../types";
import { type Person, people, renderTable } from "./render-data-table";

const columns: DataTableColumn<Person>[] = [
  { accessorKey: "name", header: "Name", resizable: true, size: 200, minSize: 100, maxSize: 300 },
  { accessorKey: "email", header: "Email" },
];
const resizing = { resizeLabel: (column: string) => `Resize ${column}` };
const handle = () => screen.getByRole("separator", { name: "Resize Name" });

describe("resizing", () => {
  it("has the separator ARIA", () => {
    renderTable({ columns, resizing });
    expect(handle().getAttribute("aria-orientation")).toBe("vertical");
    expect(handle().getAttribute("aria-valuenow")).toBe("200");
    expect(handle().getAttribute("aria-valuemin")).toBe("100");
    expect(handle().getAttribute("aria-valuemax")).toBe("300");
    expect(handle().getAttribute("tabindex")).toBe("0");
    expect(screen.queryByRole("separator", { name: "Resize Email" })).toBeNull();
  });

  it("changes the width with the arrows, clamped, and reports it", () => {
    const onChange = vi.fn();
    renderTable({ columns, resizing: { ...resizing, onChange } });
    fireEvent.keyDown(handle(), { key: "ArrowRight" });
    fireEvent.keyDown(handle(), { key: "ArrowRight" });
    expect(handle().getAttribute("aria-valuenow")).toBe("220");
    expect(onChange).toHaveBeenLastCalledWith({ name: 220 });
    fireEvent.keyDown(handle(), { key: "ArrowLeft" });
    expect(handle().getAttribute("aria-valuenow")).toBe("210");
    fireEvent.keyDown(handle(), { key: "Home" });
    expect(handle().getAttribute("aria-valuenow")).toBe("100");
    fireEvent.keyDown(handle(), { key: "ArrowLeft" });
    expect(handle().getAttribute("aria-valuenow")).toBe("100");
    fireEvent.keyDown(handle(), { key: "End" });
    expect(handle().getAttribute("aria-valuenow")).toBe("300");
  });

  it("mirrors the arrows in right-to-left documents", () => {
    render(
      <div dir="rtl" style={{ direction: "rtl" }}>
        <TooltipProvider>
          <DataTable aria-label="People" data={people(2)} columns={columns} resizing={resizing} />
        </TooltipProvider>
      </div>,
    );
    fireEvent.keyDown(handle(), { key: "ArrowLeft" });
    expect(handle().getAttribute("aria-valuenow")).toBe("210");
  });

  it("is controllable", () => {
    const onChange = vi.fn();
    renderTable({ columns, resizing: { ...resizing, value: { name: 250 }, onChange } });
    expect(handle().getAttribute("aria-valuenow")).toBe("250");
    fireEvent.keyDown(handle(), { key: "ArrowRight" });
    expect(onChange).toHaveBeenCalledWith({ name: 260 });
    expect(handle().getAttribute("aria-valuenow")).toBe("250");
  });
});
