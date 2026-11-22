import { fireEvent, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import type { DataTableColumn } from "../types";
import { type Person, renderTable } from "./render-data-table";

/** Gives the scroll container a size: jsdom lays nothing out. */
function layout({
  client,
  scroll,
  cell = 0,
}: {
  client: number;
  scroll: number;
  /** Width of the header cells, or of each by column id. */
  cell?: number | Record<string, number>;
}) {
  const restore: (() => void)[] = [];
  const define = (proto: object, name: string, get: (this: HTMLElement) => number) => {
    const original = Object.getOwnPropertyDescriptor(proto, name);
    Object.defineProperty(proto, name, { configurable: true, get });
    restore.push(() => {
      if (original) Object.defineProperty(proto, name, original);
      else delete (proto as Record<string, unknown>)[name];
    });
  };
  const isContainer = (element: HTMLElement) => element.dataset.slot === "table-container";
  define(HTMLElement.prototype, "clientWidth", function () {
    return isContainer(this) ? client : 0;
  });
  define(HTMLElement.prototype, "scrollWidth", function () {
    return isContainer(this) ? scroll : 0;
  });
  const rect = Element.prototype.getBoundingClientRect;
  Element.prototype.getBoundingClientRect = function () {
    const id = this.getAttribute("data-column-id") ?? "";
    const width = typeof cell === "number" ? cell : (cell[id] ?? 0);
    return { ...rect.call(this), width: this.matches("thead :is(th, td)") ? width : 0 } as DOMRect;
  };
  restore.push(() => {
    Element.prototype.getBoundingClientRect = rect;
  });
  cleanups.push(() => {
    for (const undo of restore.reverse()) undo();
  });
}

const cleanups: (() => void)[] = [];
afterEach(() => {
  for (const cleanup of cleanups.splice(0)) cleanup();
});

const container = () => document.querySelector('[data-slot="table-container"]') as HTMLElement;
const pinnedColumns: DataTableColumn<Person>[] = [
  { accessorKey: "name", header: "Name", pin: "start" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "age", header: "Age", pin: "end" },
];

describe("responsive behaviour", () => {
  it("a scrolling container is a named, focusable region", () => {
    layout({ client: 300, scroll: 800 });
    renderTable();
    const region = screen.getByRole("region", { name: "People" });
    expect(region).toBe(container());
    expect(region.tabIndex).toBe(0);
  });

  it("a container that fits is neither a region nor focusable", () => {
    layout({ client: 800, scroll: 800 });
    renderTable();
    expect(screen.queryByRole("region")).toBeNull();
    expect(container().hasAttribute("tabindex")).toBe(false);
  });

  it("the region takes its name from the title", () => {
    layout({ client: 300, scroll: 800 });
    renderTable({ "aria-label": undefined, header: { title: "Team" } });
    expect(screen.getByRole("region", { name: "Team" })).toBe(container());
  });

  it("flags the edges that hide content, also in RTL", () => {
    layout({ client: 300, scroll: 800 });
    renderTable();
    expect(container().hasAttribute("data-scroll-start")).toBe(false);
    expect(container().hasAttribute("data-scroll-end")).toBe(true);
    container().scrollLeft = 200;
    fireEvent.scroll(container());
    expect(container().hasAttribute("data-scroll-start")).toBe(true);
    expect(container().hasAttribute("data-scroll-end")).toBe(true);
    container().scrollLeft = 500;
    fireEvent.scroll(container());
    expect(container().hasAttribute("data-scroll-end")).toBe(false);
    // RTL: scrollLeft runs from 0 to negative values.
    container().scrollLeft = -200;
    fireEvent.scroll(container());
    expect(container().hasAttribute("data-scroll-start")).toBe(true);
  });

  it("keeps pinned columns sticky while they take at most half the width", () => {
    layout({ client: 800, scroll: 1200, cell: 150 });
    renderTable({ columns: pinnedColumns });
    expect(container().hasAttribute("data-pins-suspended")).toBe(false);
    const name = document.querySelector('td[data-column-id="name"]');
    expect(name?.getAttribute("data-pinned")).toBe("start");
    expect(container().style.scrollPaddingInlineStart).toBe("150px");
    expect(container().style.scrollPaddingInlineEnd).toBe("150px");
  });

  it("keeps the narrow selection and actions columns pinned while the data columns scroll", () => {
    layout({
      client: 400,
      scroll: 1200,
      cell: { __aureus_select: 40, name: 200, age: 100, __aureus_actions: 40 },
    });
    renderTable({
      columns: pinnedColumns,
      selection: { selectRowLabel: (person) => person.name, selectAllLabel: "All" },
      rowActions: { label: (person) => `Actions for ${person.name}`, items: () => [] },
    });
    const cell = (id: string) => document.querySelector(`td[data-column-id="${id}"]`);
    expect(container().hasAttribute("data-pins-suspended")).toBe(true);
    expect(cell("__aureus_select")?.getAttribute("data-pinned")).toBe("start");
    expect(cell("__aureus_select")?.getAttribute("data-pin-edge")).toBe("start");
    expect(cell("__aureus_actions")?.getAttribute("data-pinned")).toBe("end");
    expect(cell("name")?.hasAttribute("data-pinned")).toBe(false);
    expect(cell("age")?.hasAttribute("data-pinned")).toBe(false);
    expect(container().style.scrollPaddingInlineStart).toBe("40px");
  });

  it("lets pinned columns scroll when they would cover most of a narrow table", () => {
    layout({ client: 400, scroll: 1200, cell: 150 });
    renderTable({ columns: pinnedColumns });
    expect(container().hasAttribute("data-pins-suspended")).toBe(true);
    expect(document.querySelector("[data-pinned]")).toBeNull();
    expect(container().style.scrollPaddingInlineStart).toBe("");
  });
});

describe("container", () => {
  it("the root is the data-table size container", () => {
    renderTable();
    const root = document.querySelector('[data-slot="data-table"]');
    expect(root?.classList.contains("@container/data-table")).toBe(true);
  });
});
