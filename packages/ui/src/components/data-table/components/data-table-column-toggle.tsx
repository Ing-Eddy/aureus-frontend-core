import type { RowData } from "@tanstack/react-table";
import { Columns3Icon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shadcn/ui/dropdown-menu";
import { useDataTableContext } from "../hooks/use-data-table-context";
import { DataTableToolbarBadge } from "./data-table-toolbar-badge";
import { DataTableToolbarButton } from "./data-table-toolbar-button";

/** The column visibility menu: one checkbox per hideable column, and the hidden count. */
export function DataTableColumnToggle<TData extends RowData>() {
  const { props, table } = useDataTableContext<TData>();
  const options = props.columnToggle;
  if (!options) return null;
  const columns = table
    .getAllLeafColumns()
    .filter((column) => column.columnDef.meta?.aureus.kind === "data" && column.getCanHide());
  const hidden = columns.filter((column) => !column.getIsVisible()).length;

  return (
    <DropdownMenu>
      <DataTableToolbarBadge count={hidden}>
        {(describedBy) => (
          <DropdownMenuTrigger asChild>
            <DataTableToolbarButton label={options.label} aria-describedby={describedBy}>
              <Columns3Icon aria-hidden />
            </DataTableToolbarButton>
          </DropdownMenuTrigger>
        )}
      </DataTableToolbarBadge>
      <DropdownMenuContent align="end" className="min-w-48">
        {options.menuLabel !== undefined && (
          <>
            <DropdownMenuLabel>{options.menuLabel}</DropdownMenuLabel>
            <DropdownMenuSeparator />
          </>
        )}
        {columns.map((column) => (
          <DropdownMenuCheckboxItem
            key={column.id}
            checked={column.getIsVisible()}
            onCheckedChange={(checked) => column.toggleVisibility(checked === true)}
            onSelect={(event) => event.preventDefault()}
          >
            {column.columnDef.meta?.aureus.label ?? column.id}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
