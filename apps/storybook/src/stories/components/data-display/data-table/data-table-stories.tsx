import {
  DataTable,
  type DataTableColumn,
  type DataTablePage,
  type DataTableProps,
  type DataTableSort,
} from "@aureus-core/ui/components/data-table";
import { Badge } from "@aureus-core/ui/shadcn/badge";
import { type Employee, employees } from "@fixtures/employees";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { DownloadIcon, PencilIcon, PlusIcon, PrinterIcon, TrashIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { docs } from "./data-table-docs";

// ---- Shared texts (a real app passes them from its translations) -------------------------------

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});
const statusVariant = {
  active: "secondary",
  "on leave": "outline",
  inactive: "destructive",
} as const;

const texts = {
  search: {
    label: "Search employees",
    placeholder: "Search by name, email…",
    tooltip: "Press Enter to search",
    submitLabel: "Search",
    clearLabel: "Clear search",
  },
  sorting: {
    sortLabel: (column: string, next: string) =>
      next === "none" ? `Remove sorting by ${column}` : `Sort by ${column}, ${next}`,
  },
  pagination: {
    previousLabel: "Previous page",
    nextLabel: "Next page",
    pageLabel: (page: number, count: number) => `Page ${page} of ${count}`,
    rangeLabel: (from: number, to: number, total: number) => `${from}–${to} of ${total}`,
    pageSizes: [10, 20, 50],
    pageSizeLabel: "Rows per page",
  },
  selection: {
    selectRowLabel: (employee: Employee) => `Select ${employee.name}`,
    selectAllLabel: "Select all on this page",
    selectedLabel: (count: number) => `${count} selected`,
  },
} as const;

const columns: DataTableColumn<Employee>[] = [
  { accessorKey: "name", header: "Name", sortable: true, hideable: true },
  { accessorKey: "department", header: "Department", sortable: true, hideable: true },
  {
    accessorKey: "status",
    header: "Status",
    hideable: true,
    cell: ({ value }) => (
      <Badge variant={statusVariant[value]} className="capitalize">
        {value}
      </Badge>
    ),
  },
  { accessorKey: "email", header: "Email", hideable: true },
  {
    accessorKey: "salary",
    header: "Salary",
    align: "end",
    sortable: true,
    cell: ({ value }) => <span className="tabular-nums">{money.format(value)}</span>,
  },
];

const nestedColumns: DataTableColumn<Employee>[] = [
  { accessorKey: "name", header: "Name", subtitle: "Full name", sortable: true },
  {
    id: "contact",
    header: "Contact",
    subtitle: "Work details",
    columns: [
      { accessorKey: "email", header: "Email" },
      { accessorKey: "phone", header: "Phone" },
    ],
  },
  {
    id: "employment",
    header: "Employment",
    columns: [
      { accessorKey: "department", header: "Department", sortable: true },
      { accessorKey: "startDate", header: "Start date", sortable: true, sortFn: "text" },
    ],
  },
];

const body = () => within(document.body);
const tableOf = (canvasElement: HTMLElement) => within(canvasElement).getByRole("table");
/** The names shown in the body, in order. */
const firstNames = (canvasElement: HTMLElement) =>
  Array.from(tableOf(canvasElement).querySelectorAll('tbody [data-column-id="name"]')).map(
    (cell) => cell.textContent ?? "",
  );

// ---- Playground ---------------------------------------------------------------------------------

interface PlaygroundArgs {
  title: string;
  subtitle: string;
  header: boolean;
  search: boolean;
  reload: boolean;
  filters: boolean;
  columnToggle: boolean;
  sorting: boolean;
  highlight: boolean;
  hoverRows: boolean;
  hoverColumns: boolean;
  selection: boolean;
  expansion: boolean;
  rowActions: boolean;
  resizing: boolean;
  pagination: boolean;
  loading: boolean;
  density: "default" | "compact";
  striped: boolean;
  columnDividers: boolean;
  stickyHeader: boolean;
  toolbarActions: boolean;
  onReload: () => void;
  onSearch: (query: string) => void;
  onRowClick: (row: Employee) => void;
}

function PlaygroundTable(args: PlaygroundArgs) {
  const props: DataTableProps<Employee> = {
    data: employees,
    columns,
    getRowId: (employee) => employee.id,
    header: args.header ? { title: args.title, subtitle: args.subtitle } : false,
    ...(args.search ? { search: { ...texts.search, onSearch: args.onSearch } } : {}),
    ...(args.toolbarActions
      ? {
          toolbarActions: [
            { id: "export", label: "Export", icon: <DownloadIcon />, onClick: () => {} },
            { id: "print", label: "Print", icon: <PrinterIcon />, onClick: () => {} },
          ],
        }
      : {}),
    ...(args.reload ? { reload: { label: "Reload", onReload: args.onReload } } : {}),
    ...(args.filters
      ? {
          filters: {
            label: "Filters",
            activeCount: 1,
            content: <p className="text-sm">Your filters go here.</p>,
          },
        }
      : {}),
    ...(args.columnToggle
      ? { columnToggle: { label: "Columns", menuLabel: "Visible columns" } }
      : {}),
    ...(args.sorting ? { sorting: texts.sorting } : {}),
    ...(args.highlight ? { highlight: { rows: true, columns: true } } : {}),
    hover: { rows: args.hoverRows, columns: args.hoverColumns },
    ...(args.selection
      ? {
          selection: {
            ...texts.selection,
            actionsLabel: "Actions",
            actions: [{ id: "export", label: "Export", onSelect: () => {} }],
          },
        }
      : {}),
    ...(args.expansion
      ? {
          expansion: {
            renderDetail: (employee: Employee) =>
              `Started on ${employee.startDate} · ${employee.phone}`,
            expandLabel: (employee: Employee, expanded: boolean) =>
              `${expanded ? "Hide" : "Show"} details of ${employee.name}`,
          },
        }
      : {}),
    ...(args.rowActions
      ? {
          rowActions: {
            label: (employee: Employee) => `Actions for ${employee.name}`,
            items: () => [{ id: "edit", label: "Edit", onSelect: () => {} }],
          },
        }
      : {}),
    ...(args.resizing ? { resizing: { resizeLabel: (column: string) => `Resize ${column}` } } : {}),
    pagination: args.pagination ? texts.pagination : false,
    loading: args.loading,
    loadingLabel: "Loading employees",
    density: args.density,
    striped: args.striped,
    columnDividers: args.columnDividers,
    stickyHeader: args.stickyHeader,
    ...(args.stickyHeader ? { maxHeight: 360 } : {}),
    onRowClick: args.onRowClick,
  };
  return <DataTable {...props} />;
}

const meta = {
  title: "components/Data Display/Data Table",
  component: PlaygroundTable,
  parameters: { aureusDocs: docs, layout: "padded" },
  args: {
    title: "Employees",
    subtitle: "Everyone in the company",
    header: true,
    search: true,
    toolbarActions: true,
    reload: true,
    filters: true,
    columnToggle: true,
    sorting: true,
    highlight: true,
    hoverRows: true,
    hoverColumns: true,
    selection: true,
    expansion: false,
    rowActions: true,
    resizing: false,
    pagination: true,
    loading: false,
    density: "default",
    striped: false,
    columnDividers: false,
    stickyHeader: false,
    onReload: fn(),
    onSearch: fn(),
    onRowClick: fn(),
  },
  argTypes: {
    title: { control: "text", table: { category: "Content" } },
    subtitle: { control: "text", table: { category: "Content" } },
    header: { control: "boolean", table: { category: "Content" } },
    search: { control: "boolean", table: { category: "Behavior" } },
    toolbarActions: { control: "boolean", table: { category: "Behavior" } },
    reload: { control: "boolean", table: { category: "Behavior" } },
    filters: { control: "boolean", table: { category: "Behavior" } },
    columnToggle: { control: "boolean", table: { category: "Behavior" } },
    sorting: { control: "boolean", table: { category: "Behavior" } },
    highlight: { control: "boolean", table: { category: "Behavior" } },
    selection: { control: "boolean", table: { category: "Behavior" } },
    expansion: { control: "boolean", table: { category: "Behavior" } },
    rowActions: { control: "boolean", table: { category: "Behavior" } },
    resizing: { control: "boolean", table: { category: "Behavior" } },
    pagination: { control: "boolean", table: { category: "Behavior" } },
    hoverRows: { control: "boolean", table: { category: "Appearance" } },
    hoverColumns: { control: "boolean", table: { category: "Appearance" } },
    density: {
      control: "inline-radio",
      options: ["default", "compact"],
      table: { category: "Appearance" },
    },
    striped: { control: "boolean", table: { category: "Appearance" } },
    columnDividers: { control: "boolean", table: { category: "Appearance" } },
    stickyHeader: { control: "boolean", table: { category: "Appearance" } },
    loading: { control: "boolean", table: { category: "State" } },
    onReload: { table: { category: "Events" } },
    onSearch: { table: { category: "Events" } },
    onRowClick: { table: { category: "Events" } },
  },
} satisfies Meta<typeof PlaygroundTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("textbox", { name: "Search employees" });
    await userEvent.type(input, "grace{Enter}");
    await expect(args.onSearch).toHaveBeenCalledWith("grace");
    await expect(firstNames(canvasElement).every((name) => name.startsWith("Grace"))).toBe(true);
    await userEvent.click(canvas.getByRole("button", { name: "Clear search" }));
    await expect(input).toHaveValue("");
    await expect(input).toHaveFocus();
  },
};

// ---- Examples -------------------------------------------------------------------------------------

export const Minimal: Story = {
  render: () => (
    <DataTable
      aria-label="Employees"
      data={employees.slice(0, 6)}
      columns={columns}
      getRowId={(row) => row.id}
    />
  ),
};

export const NestedColumns: Story = {
  render: () => (
    <DataTable
      aria-label="Employees"
      data={employees.slice(0, 8)}
      columns={nestedColumns}
      getRowId={(row) => row.id}
      sorting={texts.sorting}
      hover={{ rows: true, columns: true }}
    />
  ),
  play: async ({ canvasElement }) => {
    const contact = within(canvasElement).getByRole("columnheader", { name: /Contact/ });
    await expect(contact).toHaveAttribute("colspan", "2");
  },
};

export const SortingAndHighlight: Story = {
  render: () => (
    <DataTable
      aria-label="Employees"
      data={employees.slice(0, 8)}
      columns={columns}
      getRowId={(row) => row.id}
      sorting={texts.sorting}
      highlight={{ rows: true, columns: true }}
      hover={{ rows: true, columns: true }}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const salary = () => canvas.getByRole("columnheader", { name: /Salary/ });
    const sort = () => canvas.getByRole("button", { name: /Salary/ });
    await userEvent.click(sort());
    await expect(salary()).toHaveAttribute("aria-sort", "ascending");
    await userEvent.click(sort());
    await expect(salary()).toHaveAttribute("aria-sort", "descending");
    await userEvent.click(sort());
    await expect(salary()).not.toHaveAttribute("aria-sort");

    // Crosshair: mark the Salary column, then a row.
    await userEvent.click(salary(), { skipHover: true });
    const row = canvas.getAllByRole("row")[2] as HTMLElement;
    await userEvent.click(within(row).getAllByRole("cell")[0] as HTMLElement);
    await expect(row).toHaveAttribute("data-highlight-row");
    const crossing = row.querySelector('[data-column-id="salary"]');
    await expect(crossing).toHaveAttribute("data-highlight-column");
    await userEvent.keyboard("{Escape}");
    await expect(canvasElement.querySelector("[data-highlight-row]")).toBeNull();
  },
};

function SelectionTable() {
  const [rows, setRows] = useState(employees.slice(0, 12));
  return (
    <DataTable
      aria-label="Employees"
      data={rows}
      columns={columns}
      getRowId={(row) => row.id}
      header={{ title: "Team" }}
      selection={{
        ...texts.selection,
        canSelect: (employee) => employee.status !== "inactive",
        actionsLabel: "Bulk actions",
        actions: [
          { id: "edit", label: "Edit", icon: <PencilIcon />, onSelect: () => {} },
          {
            id: "remove",
            label: "Remove",
            icon: <TrashIcon />,
            variant: "destructive",
            onSelect: (selected, clear) => {
              const ids = new Set(selected.map((employee) => employee.id));
              setRows((current) => current.filter((employee) => !ids.has(employee.id)));
              clear();
            },
          },
        ],
      }}
    />
  );
}

export const SelectionActions: Story = {
  render: () => <SelectionTable />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.queryByRole("button", { name: /Bulk actions/ })).toBeNull();
    await userEvent.click(canvas.getByRole("checkbox", { name: "Select Ada Lovelace" }));
    await userEvent.click(canvas.getByRole("checkbox", { name: /^Select Grace/ }));
    await userEvent.click(canvas.getByRole("button", { name: /Bulk actions/ }));
    await userEvent.click(await body().findByRole("menuitem", { name: "Remove" }));
    await waitFor(() => expect(canvas.getAllByRole("row")).toHaveLength(11));
    await expect(canvas.queryByRole("button", { name: /Bulk actions/ })).toBeNull();
  },
};

/** A simulated server: filters, sorts and pages the fixture after a short delay (no network). */
function ServerTable() {
  const [query, setQuery] = useState("");
  const [sorting, setSorting] = useState<DataTableSort[]>([]);
  const [page, setPage] = useState<DataTablePage>({ pageIndex: 0, pageSize: 10 });
  const [result, setResult] = useState<{ rows: Employee[]; total: number }>({ rows: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [reloads, setReloads] = useState(0);

  useEffect(() => {
    setLoading(true);
    void reloads;
    const timer = setTimeout(() => {
      const term = query.toLowerCase();
      let rows = employees.filter(
        (employee) => !term || `${employee.name} ${employee.email}`.toLowerCase().includes(term),
      );
      const [sort] = sorting;
      if (sort) {
        const key = sort.id as keyof Employee;
        rows = [...rows].sort(
          (a, b) =>
            String(a[key]).localeCompare(String(b[key]), undefined, { numeric: true }) *
            (sort.desc ? -1 : 1),
        );
      }
      const start = page.pageIndex * page.pageSize;
      setResult({ rows: rows.slice(start, start + page.pageSize), total: rows.length });
      setLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [query, sorting, page, reloads]);

  return (
    <DataTable
      aria-label="Employees"
      data={result.rows}
      columns={columns}
      getRowId={(row) => row.id}
      loading={loading}
      loadingLabel="Loading employees"
      header={{ title: "Employees", subtitle: "Served page by page" }}
      search={{
        ...texts.search,
        manual: true,
        onSearch: (next) => {
          setQuery(next);
          setPage((current) => ({ ...current, pageIndex: 0 }));
        },
      }}
      reload={{ label: "Reload", onReload: () => setReloads((count) => count + 1) }}
      sorting={{ ...texts.sorting, manual: true, value: sorting, onChange: setSorting }}
      pagination={{
        ...texts.pagination,
        manual: true,
        rowCount: result.total,
        value: page,
        onChange: setPage,
      }}
      empty={<p className="text-muted-foreground">No employees match.</p>}
    />
  );
}

export const ServerSide: Story = {
  render: () => <ServerTable />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const page = (number: number) => canvas.getByRole("button", { name: `Page ${number} of 6` });
    await waitFor(() => expect(page(1)).toHaveAttribute("aria-current", "page"));
    await userEvent.click(canvas.getByRole("button", { name: "Next page" }));
    await waitFor(() => expect(page(2)).toHaveAttribute("aria-current", "page"));
    await waitFor(() => expect(canvas.getByText("11–20 of 60")).toBeInTheDocument());
    await userEvent.click(page(6));
    await waitFor(() => expect(canvas.getByText("51–60 of 60")).toBeInTheDocument());
  },
};

export const States: Story = {
  render: () => (
    <div className="grid gap-8">
      <DataTable
        aria-label="Loading"
        data={[]}
        columns={columns}
        loading
        loadingLabel="Loading employees"
        loadingRows={3}
      />
      <DataTable
        aria-label="Empty"
        data={[]}
        columns={columns}
        empty={<p className="text-muted-foreground">No employees yet.</p>}
      />
      <DataTable
        aria-label="Error"
        data={[]}
        columns={columns}
        error={{
          content: <p className="text-destructive">Could not load the employees.</p>,
          onRetry: () => {},
          retryLabel: "Try again",
        }}
      />
    </div>
  ),
};

export const PinnedAndResizable: Story = {
  render: () => (
    <div className="max-w-2xl">
      <DataTable
        aria-label="Employees"
        data={employees.slice(0, 20)}
        getRowId={(row) => row.id}
        columns={[
          { accessorKey: "name", header: "Name", pin: "start", resizable: true, size: 180 },
          { accessorKey: "department", header: "Department", resizable: true, size: 160 },
          { accessorKey: "email", header: "Email", resizable: true, size: 280 },
          { accessorKey: "phone", header: "Phone", resizable: true, size: 160 },
          { accessorKey: "startDate", header: "Start date", resizable: true, size: 140 },
          {
            accessorKey: "salary",
            header: "Salary",
            align: "end",
            pin: "end",
            size: 120,
            cell: ({ value }) => money.format(value),
          },
        ]}
        resizing={{ resizeLabel: (column) => `Resize ${column}` }}
        stickyHeader
        maxHeight={320}
        hover={{ rows: true, columns: true }}
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const handle = within(canvasElement).getByRole("separator", { name: "Resize Email" });
    handle.focus();
    await userEvent.keyboard("{ArrowRight}{ArrowRight}");
    await expect(handle).toHaveAttribute("aria-valuenow", "300");
  },
};

export const ExpandableRows: Story = {
  render: () => (
    <DataTable
      aria-label="Employees"
      data={employees.slice(0, 8)}
      columns={columns}
      getRowId={(row) => row.id}
      expansion={{
        single: true,
        renderDetail: (employee) => (
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
            <dt className="text-muted-foreground">Phone</dt>
            <dd>{employee.phone}</dd>
            <dt className="text-muted-foreground">Start date</dt>
            <dd>{employee.startDate}</dd>
          </dl>
        ),
        expandLabel: (employee, expanded) =>
          `${expanded ? "Hide" : "Show"} details of ${employee.name}`,
      }}
      rowActions={{
        label: (employee) => `Actions for ${employee.name}`,
        items: () => [
          { id: "edit", label: "Edit", icon: <PencilIcon />, onSelect: () => {} },
          {
            id: "remove",
            label: "Remove",
            icon: <TrashIcon />,
            variant: "destructive",
            onSelect: () => {},
          },
        ],
      }}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const toggle = canvas.getByRole("button", { name: "Show details of Ada Lovelace" });
    await userEvent.click(toggle);
    await expect(
      canvas.getByRole("button", { name: "Hide details of Ada Lovelace" }),
    ).toHaveAttribute("aria-expanded", "true");
    await userEvent.click(canvas.getByRole("button", { name: "Actions for Ada Lovelace" }));
    await expect(await body().findByRole("menuitem", { name: "Edit" })).toBeInTheDocument();
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(body().queryByRole("menu")).toBeNull());
  },
};

export const DensityStripedFooter: Story = {
  render: () => (
    <DataTable
      aria-label="Salaries"
      data={employees.slice(0, 10)}
      getRowId={(row) => row.id}
      density="compact"
      striped
      columns={[
        { accessorKey: "name", header: "Name", footer: "Total" },
        { accessorKey: "department", header: "Department" },
        {
          accessorKey: "salary",
          header: "Salary",
          align: "end",
          cell: ({ value }) => money.format(value),
          footer: ({ rows }) => money.format(rows.reduce((sum, row) => sum + row.salary, 0)),
        },
      ]}
    />
  ),
};

export const HiddenHeaderAndPagination: Story = {
  render: () => (
    <DataTable
      aria-label="Employees"
      data={employees.slice(0, 5)}
      columns={columns}
      getRowId={(row) => row.id}
      header={false}
      pagination={false}
      search={texts.search}
      columnToggle={{ label: "Columns" }}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.queryByRole("textbox")).toBeNull();
    await expect(canvas.getAllByRole("row")).toHaveLength(6);
  },
};

export const ColumnsMenu: Story = {
  render: () => (
    <DataTable
      aria-label="Employees"
      data={employees.slice(0, 5)}
      columns={columns}
      getRowId={(row) => row.id}
      columnToggle={{ label: "Columns", menuLabel: "Visible columns" }}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Columns" }));
    await userEvent.click(await body().findByRole("menuitemcheckbox", { name: "Email" }));
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(body().queryByRole("menu")).toBeNull());
    await waitFor(() => expect(canvas.queryByRole("columnheader", { name: "Email" })).toBeNull());
    // The button shows how many columns are hidden, and is described by that count (and by its
    // tooltip while it is open: aria-describedby holds several ids).
    const columnsButton = canvas.getByRole("button", { name: "Columns" });
    const badge = canvasElement.querySelector('[data-slot="data-table-toolbar-badge"]');
    await expect(badge).toHaveTextContent("1");
    await expect(columnsButton.getAttribute("aria-describedby")?.split(/\s+/)).toContain(badge?.id);
  },
};

export const Responsive: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <p className="text-muted-foreground text-sm">
        Drag the corner of the box to resize the table: the layout follows the table's own width.
      </p>
      <div className="w-[22rem] min-w-72 max-w-full resize-x overflow-auto p-1">
        <DataTable
          data={employees}
          columns={[
            { ...columns[0], pin: "start" } as DataTableColumn<Employee>,
            ...columns.slice(1),
          ]}
          getRowId={(row) => row.id}
          header={{ title: "Team", subtitle: "Pinned columns scroll when the table is narrow" }}
          search={texts.search}
          sorting={texts.sorting}
          reload={{ label: "Reload", onReload: () => {} }}
          columnToggle={{ label: "Columns" }}
          selection={texts.selection}
          rowActions={{
            label: (employee) => `Actions for ${employee.name}`,
            items: () => [{ id: "edit", label: "Edit", icon: <PencilIcon />, onSelect: () => {} }],
          }}
          highlight={{ rows: true }}
          pagination={texts.pagination}
        />
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const region = canvas.getByRole("region", { name: "Team" });
    await expect(region).toHaveAttribute("tabindex", "0");
    await expect(region).toHaveAttribute("data-pins-suspended");
    const first = canvas.getByText("Ada Lovelace").closest("tr") as HTMLElement;
    first.focus();
    await userEvent.keyboard("{ArrowDown}");
    await expect(canvas.getByText("Grace Liskov").closest("tr")).toHaveFocus();
  },
};

export const FixedHeight: Story = {
  render: () => (
    <DataTable
      className="h-[26rem]"
      data={employees}
      columns={columns}
      getRowId={(row) => row.id}
      header={{ title: "Employees", subtitle: "A fixed height: only the rows scroll" }}
      search={texts.search}
      stickyHeader
      hover={{ rows: true }}
      pagination={{ ...texts.pagination, defaultValue: { pageIndex: 0, pageSize: 20 } }}
    />
  ),
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('[data-slot="data-table"]') as HTMLElement;
    const region = within(canvasElement).getByRole("region", { name: "Employees" });
    const pagination = canvasElement.querySelector(
      '[data-slot="data-table-pagination"]',
    ) as HTMLElement;
    // The root keeps its height, the rows scroll inside it and the pagination stays visible.
    await expect(root.getBoundingClientRect().height).toBeCloseTo(416, 0);
    await expect(region.scrollHeight).toBeGreaterThan(region.clientHeight);
    await expect(pagination.getBoundingClientRect().bottom).toBeLessThanOrEqual(
      root.getBoundingClientRect().bottom,
    );
  },
};

export const ColumnDividers: Story = {
  render: () => (
    <DataTable
      aria-label="Employees"
      data={employees.slice(0, 6)}
      columns={nestedColumns}
      getRowId={(row) => row.id}
      columnDividers
      hover={{ rows: true }}
    />
  ),
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('[data-slot="data-table"]') as HTMLElement;
    await expect(root).toHaveAttribute("data-column-dividers");
    const first = canvasElement.querySelector("tbody td") as HTMLElement;
    await expect(getComputedStyle(first, "::before").width).toBe("1px");
    const last = canvasElement.querySelector("tbody tr > td:last-child") as HTMLElement;
    await expect(getComputedStyle(last, "::before").content).toBe("none");
  },
};

const onExport = fn();

export const ToolbarActions: Story = {
  render: () => (
    <DataTable
      data={employees.slice(0, 5)}
      columns={columns}
      getRowId={(row) => row.id}
      header={{ title: "Employees" }}
      search={texts.search}
      toolbarActions={[
        { id: "export", label: "Export", icon: <DownloadIcon />, onClick: onExport },
        { id: "print", label: "Print", icon: <PrinterIcon />, disabled: true, onClick: () => {} },
        { id: "purge", label: "Purge", icon: <TrashIcon />, hidden: true, onClick: () => {} },
        {
          id: "new",
          label: "New employee",
          icon: <PlusIcon />,
          showLabel: true,
          variant: "default",
          onClick: () => {},
        },
      ]}
      reload={{ label: "Reload", onReload: () => {} }}
      columnToggle={{ label: "Columns" }}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    onExport.mockClear();
    await userEvent.click(canvas.getByRole("button", { name: "Export" }));
    await expect(onExport).toHaveBeenCalledTimes(1);
    await expect(canvas.getByRole("button", { name: "Print" })).toBeDisabled();
    await expect(canvas.queryByRole("button", { name: "Purge" })).toBeNull();
    await expect(canvas.getByRole("button", { name: "New employee" })).toHaveTextContent(
      "New employee",
    );
  },
};
