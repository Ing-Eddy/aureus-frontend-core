import { Badge } from "@aureus-core/ui/shadcn/badge";
import { Button } from "@aureus-core/ui/shadcn/button";
import { Checkbox } from "@aureus-core/ui/shadcn/checkbox";
import { Input } from "@aureus-core/ui/shadcn/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@aureus-core/ui/shadcn/table";
import { currency, type Payment, payments } from "@fixtures/payments";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  type ColumnDef,
  columnFilteringFeature,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFn_includesString,
  flexRender,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_text,
  tableFeatures,
  useTable,
} from "@tanstack/react-table";
import { ArrowDownIcon, ArrowUpDownIcon, ArrowUpIcon } from "lucide-react";
import { useEffect } from "react";
import { expect, fn, userEvent, within } from "storybook/test";
import { docs } from "./table-docs";

interface TableArgs {
  caption: string;
  rows: number;
}

const meta = {
  title: "shadcn/Data Display/Table",
  parameters: { aureusDocs: docs },
  args: { caption: "Recent payments", rows: 5 },
  argTypes: {
    caption: { control: "text", table: { category: "Content" } },
    rows: { control: { type: "number", min: 1, max: 12 }, table: { category: "Content" } },
  },
  render: ({ caption, rows }) => (
    <Table className="w-[36rem]">
      <TableCaption>{caption}</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead scope="col">Payment</TableHead>
          <TableHead scope="col">Status</TableHead>
          <TableHead scope="col">Email</TableHead>
          <TableHead scope="col" className="text-right">
            Amount
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {payments.slice(0, rows).map((payment) => (
          <TableRow key={payment.id}>
            <TableCell className="font-medium">{payment.id}</TableCell>
            <TableCell className="capitalize">{payment.status}</TableCell>
            <TableCell>{payment.email}</TableCell>
            <TableCell className="text-right tabular-nums">
              {currency.format(payment.amount)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
} satisfies Meta<TableArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The caption names the table and every column has a header. */
export const Playground: Story = {
  play: async ({ canvas }) => {
    const table = canvas.getByRole("table", { name: "Recent payments" });
    await expect(within(table).getAllByRole("columnheader")).toHaveLength(4);
    await expect(within(table).getAllByRole("row")).toHaveLength(6);
  },
};

export const WithFooter: Story = {
  render: () => {
    const rows = payments.slice(0, 4);
    const total = rows.reduce((sum, payment) => sum + payment.amount, 0);
    return (
      <Table className="w-[28rem]">
        <TableCaption>Invoices for January</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead scope="col">Invoice</TableHead>
            <TableHead scope="col" className="text-right">
              Amount
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((payment) => (
            <TableRow key={payment.id}>
              <TableCell>{payment.id}</TableCell>
              <TableCell className="text-right tabular-nums">
                {currency.format(payment.amount)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableHead scope="row">Total</TableHead>
            <TableCell className="text-right tabular-nums">{currency.format(total)}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    );
  },
};

const statusVariant = {
  success: "secondary",
  processing: "outline",
  pending: "outline",
  failed: "destructive",
} as const;

/**
 * TanStack Table v9: features, row models and the sort/filter functions are declared once,
 * statically, and passed to `useTable`.
 */
const features = tableFeatures({
  rowSortingFeature,
  columnFilteringFeature,
  rowSelectionFeature,
  rowPaginationFeature,
  sortedRowModel: createSortedRowModel(),
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortFns: { alphanumeric: sortFn_alphanumeric, text: sortFn_text },
  filterFns: { includesString: filterFn_includesString },
});

const columns: ColumnDef<typeof features, Payment>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        aria-label="Select all rows on this page"
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() ? "indeterminate" : false)
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(value === true)}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        aria-label={`Select ${row.original.id}`}
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(value === true)}
      />
    ),
    enableSorting: false,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={statusVariant[row.original.status]} className="capitalize">
        {row.original.status}
      </Badge>
    ),
  },
  {
    accessorKey: "email",
    filterFn: "includesString",
    sortFn: "text",
    header: ({ column }) => {
      const sorted = column.getIsSorted();
      const Icon =
        sorted === "asc" ? ArrowUpIcon : sorted === "desc" ? ArrowDownIcon : ArrowUpDownIcon;
      return (
        <Button
          variant="ghost"
          size="sm"
          className="-ms-2"
          onClick={() => column.toggleSorting(sorted === "asc")}
        >
          Email
          <Icon data-icon="inline-end" aria-hidden />
        </Button>
      );
    },
  },
  {
    accessorKey: "amount",
    header: () => <span className="block text-right">Amount</span>,
    cell: ({ row }) => (
      <span className="block text-right tabular-nums">{currency.format(row.original.amount)}</span>
    ),
  },
];

function PaymentsTable({ onSelectionChange }: { onSelectionChange: (ids: string[]) => void }) {
  const table = useTable({
    features,
    data: payments as Payment[],
    columns,
    getRowId: (row) => row.id,
    initialState: { pagination: { pageIndex: 0, pageSize: 5 } },
  });
  const { rowSelection, pagination } = table.state;
  useEffect(() => {
    onSelectionChange(Object.keys(rowSelection).filter((id) => rowSelection[id]));
  }, [rowSelection, onSelectionChange]);
  const emailSort = table.getColumn("email")?.getIsSorted();

  return (
    <div className="grid w-[40rem] gap-3">
      <Input
        aria-label="Filter emails"
        placeholder="Filter emails…"
        className="max-w-xs"
        value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
        onChange={(event) => table.getColumn("email")?.setFilterValue(event.target.value)}
      />
      <div className="rounded-lg border">
        <Table aria-label="Payments">
          <TableHeader>
            {table.getHeaderGroups().map((group) => (
              <TableRow key={group.id}>
                {group.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    scope="col"
                    aria-sort={
                      header.column.id === "email" && emailSort
                        ? emailSort === "asc"
                          ? "ascending"
                          : "descending"
                        : undefined
                    }
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() ? "selected" : undefined}>
                  {row.getAllCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-20 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between text-muted-foreground text-sm">
        <span aria-live="polite">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </span>
        <div className="flex items-center gap-2">
          <span>
            Page {pagination.pageIndex + 1} of {table.getPageCount()}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

const emailColumn = (canvas: ReturnType<typeof within>) =>
  within(canvas.getByRole("table", { name: "Payments" }))
    .getAllByRole("row")
    .slice(1)
    .map((row) => within(row).getAllByRole("cell")[2]?.textContent);

/** Sorting reorders rows; the filter narrows them; the header checkbox selects every row on the page. */
export const DataTable: Story = {
  args: { onSelectionChange: fn() } as never,
  render: (args) => (
    <PaymentsTable
      onSelectionChange={
        (args as unknown as { onSelectionChange: (ids: string[]) => void }).onSelectionChange
      }
    />
  ),
  play: async ({ args, canvas }) => {
    const onSelectionChange = (args as unknown as { onSelectionChange: ReturnType<typeof fn> })
      .onSelectionChange;
    await userEvent.click(canvas.getByRole("button", { name: "Email" }));
    const sorted = emailColumn(canvas);
    await expect(sorted).toEqual([...sorted].sort());
    await expect(canvas.getByRole("columnheader", { name: "Email" })).toHaveAttribute(
      "aria-sort",
      "ascending",
    );

    await userEvent.click(canvas.getByRole("checkbox", { name: "Select all rows on this page" }));
    const rowBoxes = canvas.getAllByRole("checkbox", { name: /^Select pay_/ });
    for (const box of rowBoxes) await expect(box).toBeChecked();
    await expect(onSelectionChange.mock.lastCall?.[0]).toHaveLength(5);
    await userEvent.click(rowBoxes[0] as HTMLElement);
    await expect(
      canvas.getByRole("checkbox", { name: "Select all rows on this page" }),
    ).toHaveAttribute("aria-checked", "mixed");

    await userEvent.click(canvas.getByRole("button", { name: "Next" }));
    await expect(canvas.getByText("Page 2 of 3")).toBeVisible();

    await userEvent.type(canvas.getByRole("textbox", { name: "Filter emails" }), "ken");
    await expect(emailColumn(canvas)).toEqual(["ken99@example.com"]);
    await userEvent.clear(canvas.getByRole("textbox", { name: "Filter emails" }));
    await userEvent.type(canvas.getByRole("textbox", { name: "Filter emails" }), "zzz");
    await expect(canvas.getByText("No results.")).toBeVisible();
  },
};
