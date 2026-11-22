import type { RowData } from "@tanstack/react-table";
import { EllipsisIcon } from "lucide-react";
import { Button } from "@/shadcn/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shadcn/ui/dropdown-menu";
import type { DataTableRowActionsOptions } from "../types";

export interface DataTableRowActionsProps<TData extends RowData> {
  row: TData;
  options: DataTableRowActionsOptions<TData>;
}

/** The actions menu of one row. */
export function DataTableRowActions<TData extends RowData>({
  row,
  options,
}: DataTableRowActionsProps<TData>) {
  const items = options.items(row).filter((item) => !item.hidden);
  if (items.length === 0) return null;
  return (
    <DropdownMenu>
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
