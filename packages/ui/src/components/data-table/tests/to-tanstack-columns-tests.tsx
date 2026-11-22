import { describe, expect, it } from "vitest";
import type { DataTableColumn } from "../types";
import {
  ACTIONS_COLUMN_ID,
  columnLabel,
  EXPAND_COLUMN_ID,
  leafColumns,
  SELECT_COLUMN_ID,
  toTanstackColumns,
} from "../utils";

interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
}

const columns: DataTableColumn<Employee>[] = [
  { accessorKey: "name", header: "Name", subtitle: "Full name", align: "start", pin: "start" },
  {
    id: "contact",
    header: "Contact",
    columns: [
      { accessorKey: "email", header: "Email", sortable: true, hideable: true, resizable: true },
      { accessorKey: "phone", header: <b>Phone</b>, label: "Phone number", size: 120 },
    ],
  },
  { id: "badge", header: <i>Badge</i>, cellClassName: "x" },
];

const none = { select: false, expand: false, actions: false };
// biome-ignore lint/suspicious/noExplicitAny: inspecting the produced definitions.
const defs = (display = none) => toTanstackColumns(columns, display) as any[];

describe("toTanstackColumns", () => {
  it("keeps groups with their children", () => {
    const [, group] = defs();
    expect(group.id).toBe("contact");
    expect(group.columns.map((child: { id: string }) => child.id)).toEqual(["email", "phone"]);
    expect(group.meta.aureus.kind).toBe("group");
  });

  it("defaults sortable, hideable and resizable to false", () => {
    const [name, group] = defs();
    expect([name.enableSorting, name.enableHiding, name.enableResizing]).toEqual([
      false,
      false,
      false,
    ]);
    const [email] = group.columns;
    expect([email.enableSorting, email.enableHiding, email.enableResizing]).toEqual([
      true,
      true,
      true,
    ]);
  });

  it("carries label, the source column and sizes", () => {
    const [name, group, badge] = defs();
    expect(name.meta.aureus).toEqual({ kind: "data", label: "Name", source: columns[0] });
    expect(group.columns[1].meta.aureus.label).toBe("Phone number");
    expect(group.columns[1].size).toBe(120);
    expect(badge.meta.aureus.label).toBe("badge");
    expect(badge.enableGlobalFilter).toBe(false);
    expect(name.enableGlobalFilter).toBe(true);
  });

  it("adds the display columns of the features that are on, in order", () => {
    expect(defs({ select: true, expand: true, actions: true }).map((def) => def.id)).toEqual([
      SELECT_COLUMN_ID,
      EXPAND_COLUMN_ID,
      "name",
      "contact",
      "badge",
      ACTIONS_COLUMN_ID,
    ]);
    expect(defs({ select: false, expand: true, actions: false }).map((def) => def.id)).toEqual([
      EXPAND_COLUMN_ID,
      "name",
      "contact",
      "badge",
    ]);
  });

  it("wraps a compare function to compare row data", () => {
    const [def] = toTanstackColumns<Employee>(
      [{ accessorKey: "name", header: "Name", sortFn: (a, b) => a.name.length - b.name.length }],
      none,
      // biome-ignore lint/suspicious/noExplicitAny: inspecting the produced definitions.
    ) as any[];
    expect(def.sortFn({ original: { name: "abc" } }, { original: { name: "a" } })).toBe(2);
  });
});

describe("columnLabel", () => {
  it("falls back from label to a string header to the id", () => {
    const leaves = leafColumns(columns);
    expect(leaves.map(columnLabel)).toEqual(["Name", "Email", "Phone number", "badge"]);
  });
});
