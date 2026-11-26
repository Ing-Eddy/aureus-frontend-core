import type { RowData } from "@tanstack/react-table";
import { EllipsisIcon } from "lucide-react";
import { Button } from "@/shadcn/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shadcn/ui/dropdown-menu";
import { useDataTableContext } from "../hooks/use-data-table-context";
import type { DataTableRowActionsOptions } from "../types";

/** Props of `DataTableRowActions`. */
export interface DataTableRowActionsProps<TData extends RowData> {
  /** The row's data, passed to the actions. */
  row: TData;
  /** The table's `rowActions` prop. */
  options: DataTableRowActionsOptions<TData>;
}

/** The actions menu of one row. Nothing is rendered when the row has no visible action. */
export function DataTableRowActions<TData extends RowData>({
  row,
  options,
}: DataTableRowActionsProps<TData>) {
  const { direction } = useDataTableContext<TData>();
  const items = options.items(row).filter((item) => !item.hidden);
  if (items.length === 0) return null;
  return (
    <DropdownMenu dir={direction}>
      <DropdownMenuTrigger asChild>
        <Button type="button" variant="ghost" size="icon-sm" aria-label={options.label?.(row)}>
          <EllipsisIcon aria-hidden />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {items.map((item) => (
          <DropdownMenuItem
            key={item.id}
            variant={item.variant}
            disabled={item.disabled}
            onSelect={() => item.onSelect(row)}
          >
            {item.icon}
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
