import { afterEach, describe, expect, it, vi } from "vitest";
import type { DataTableProps } from "../types";
import { type Person, personColumns, renderTable } from "./render-data-table";

afterEach(() => vi.restoreAllMocks());

const warnings = (props: Partial<DataTableProps<Person>>) => {
  const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
  renderTable(props);
  return warn.mock.calls.map(([message]) => message as string);
};

// Untyped JavaScript: every object below omits a required text.
const untyped = (value: unknown) => value as never;

describe("development warnings", () => {
  it("names every missing required text once", () => {
    const messages = warnings({
      search: untyped({}),
      reload: untyped({ onReload: () => {} }),
      toolbarActions: untyped([{ id: "export", icon: null, onClick: () => {} }]),
      filters: untyped({ content: null }),
      columnToggle: untyped({}),
      sorting: untyped({}),
      selection: untyped({ actions: [] }),
      expansion: untyped({ renderDetail: () => null }),
      rowActions: untyped({ items: () => [] }),
      resizing: untyped({}),
      pagination: untyped({ pageSizes: [10], showFirstLast: true }),
      ...(untyped({ loading: true }) as object),
      error: untyped({ content: "x", onRetry: () => {} }),
    });
    for (const text of [
      "`search` needs `label`",
      "`search` needs `submitLabel`",
      "`search` needs `clearLabel`",
      "`reload` needs `label`",
      'toolbar action "export" needs `label`',
      "`filters` needs `label`",
      "`columnToggle` needs `label`",
      "`sorting` needs `sortLabel`",
      "`selection` needs `selectRowLabel`",
      "`selection` needs `selectAllLabel`",
      "`selection` needs `actionsLabel`",
      "`expansion` needs `expandLabel`",
      "`rowActions` needs `label`",
      "`resizing` needs `resizeLabel`",
      "`pagination` needs `previousLabel`",
      "`pagination` needs `nextLabel`",
      "`pagination` needs `pageLabel`",
      "`pagination.pageSizes` needs `pageSizeLabel`",
      "`pagination.showFirstLast` needs `firstLabel` and `lastLabel`",
      "`loading` needs `loadingLabel`",
      "`error.onRetry` needs `error.retryLabel`",
    ]) {
      expect(messages, text).toContain(`DataTable: ${text}.`);
    }
    expect(new Set(messages).size).toBe(messages.length);
  });

  it("warns about a missing accessible name and a rich header without label", () => {
    const messages = warnings({
      "aria-label": undefined,
      columns: [
        { accessorKey: "name", header: <b>Name</b>, sortable: true },
        ...personColumns.slice(1),
      ],
      sorting: { sortLabel: (column) => column },
    });
    expect(messages).toContain(
      "DataTable: the table has no accessible name. Pass `aria-label`, `aria-labelledby` or `header.title`.",
    );
    expect(messages).toContain('DataTable: column "name" has a non-text `header` and no `label`.');
  });

  it("logs nothing for a complete configuration", () => {
    expect(
      warnings({
        header: { title: "People" },
        "aria-label": undefined,
        sorting: { sortLabel: (column) => column },
        columnToggle: { label: "Columns" },
      }),
    ).toEqual([]);
  });
});
