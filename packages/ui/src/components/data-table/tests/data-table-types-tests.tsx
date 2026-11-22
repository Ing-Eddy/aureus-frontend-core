import { describe, it } from "vitest";
import type { DataTableColumn, DataTableProps } from "../types";

interface User {
  id: string;
  name: string;
  age: number;
}

const columns: DataTableColumn<User>[] = [
  { accessorKey: "name", header: "Name", cell: ({ value }) => value.toUpperCase() },
  { accessorKey: "age", header: "Age", cell: ({ value }) => value.toFixed(0) },
  { id: "group", header: "Group", columns: [{ id: "x", header: "X" }] },
  { id: "initial", accessorFn: (user) => user.name[0], header: "Initial" },
];
const base = { data: [] as User[], columns, "aria-label": "Users" };
const check = (props: DataTableProps<User>) => props;
const fn = () => {};

describe("DataTable types", () => {
  it("rejects every feature without its required texts, and accepts the complete forms", () => {
    // Columns: the cell value follows the accessor key.
    const _wrong: DataTableColumn<User> = {
      accessorKey: "age",
      header: "Age",
      // @ts-expect-error: `age` is a number.
      cell: ({ value }) => value.toUpperCase(),
    };
    // @ts-expect-error: unknown key.
    const _unknown: DataTableColumn<User> = { accessorKey: "email", header: "Email" };

    check(base);

    // @ts-expect-error: search needs submitLabel and clearLabel.
    check({ ...base, search: { label: "Search" } });
    check({ ...base, search: { label: "Search", submitLabel: "Go", clearLabel: "Clear" } });
    // @ts-expect-error: debounceMs needs trigger "change".
    check({ ...base, search: { label: "S", submitLabel: "G", clearLabel: "C", debounceMs: 200 } });
    check({
      ...base,
      search: { label: "S", submitLabel: "G", clearLabel: "C", trigger: "change", debounceMs: 200 },
    });

    // @ts-expect-error: a toolbar action needs label.
    check({ ...base, toolbarActions: [{ id: "x", icon: null, onClick: fn }] });
    // @ts-expect-error: an icon-only toolbar action needs icon.
    check({ ...base, toolbarActions: [{ id: "x", label: "X", onClick: fn }] });
    check({
      ...base,
      toolbarActions: [
        { id: "x", label: "X", icon: null, onClick: fn, disabled: true, hidden: false },
        { id: "y", label: "Y", showLabel: true, onClick: fn, variant: "default" },
      ],
    });

    // @ts-expect-error: reload needs label.
    check({ ...base, reload: { onReload: fn } });
    // @ts-expect-error: filters needs label.
    check({ ...base, filters: { content: null } });
    // @ts-expect-error: columnToggle needs label.
    check({ ...base, columnToggle: {} });
    // @ts-expect-error: sorting needs sortLabel.
    check({ ...base, sorting: {} });
    check({
      ...base,
      reload: { label: "R", onReload: fn },
      filters: { label: "F", content: null },
      columnToggle: { label: "C" },
      sorting: { sortLabel: (c) => c },
    });

    // @ts-expect-error: selection needs selectRowLabel.
    check({ ...base, selection: { selectAllLabel: "All" } });
    // @ts-expect-error: multiple selection needs selectAllLabel.
    check({ ...base, selection: { selectRowLabel: (u) => u.name } });
    check({ ...base, selection: { mode: "single", selectRowLabel: (u) => u.name } });
    check({
      ...base,
      // @ts-expect-error: actions need actionsLabel.
      selection: { selectRowLabel: (u) => u.name, selectAllLabel: "All", actions: [] },
    });
    check({
      ...base,
      // @ts-expect-error: renderActions needs actionsLabel.
      selection: {
        selectRowLabel: (u) => u.name,
        selectAllLabel: "All",
        renderActions: () => null,
      },
    });
    check({
      ...base,
      selection: {
        selectRowLabel: (u) => u.name,
        selectAllLabel: "All",
        actionsLabel: "Actions",
        actions: [{ id: "d", label: "Delete", onSelect: (rows) => rows.map((u) => u.id) }],
      },
    });

    // @ts-expect-error: expansion needs expandLabel.
    check({ ...base, expansion: { renderDetail: () => null } });
    // @ts-expect-error: rowActions needs label.
    check({ ...base, rowActions: { items: () => [] } });
    // @ts-expect-error: resizing needs resizeLabel.
    check({ ...base, resizing: {} });
    check({
      ...base,
      expansion: { renderDetail: () => null, expandLabel: (u) => u.name },
      rowActions: { label: (u) => u.name, items: () => [] },
      resizing: { resizeLabel: (c) => c },
    });

    const pages = {
      previousLabel: "Prev",
      nextLabel: "Next",
      pageLabel: (p: number, c: number) => `${p}/${c}`,
    };
    // @ts-expect-error: pagination needs pageLabel.
    check({ ...base, pagination: { previousLabel: "Prev", nextLabel: "Next" } });
    // @ts-expect-error: pageSizes needs pageSizeLabel.
    check({ ...base, pagination: { ...pages, pageSizes: [10, 20] } });
    // @ts-expect-error: showFirstLast needs firstLabel and lastLabel.
    check({ ...base, pagination: { ...pages, showFirstLast: true } });
    check({
      ...base,
      pagination: {
        ...pages,
        pageSizes: [10, 20],
        pageSizeLabel: "Rows",
        showFirstLast: true,
        firstLabel: "First",
        lastLabel: "Last",
      },
    });
    check({ ...base, pagination: false, header: false });

    // @ts-expect-error: loading needs loadingLabel.
    check({ ...base, loading: true });
    check({ ...base, loading: Math.random() > 0.5, loadingLabel: "Loading" });
    // @ts-expect-error: onRetry needs retryLabel.
    check({ ...base, error: { content: "Failed", onRetry: fn } });
    check({ ...base, error: { content: "Failed", onRetry: fn, retryLabel: "Retry" } });
  });
});
