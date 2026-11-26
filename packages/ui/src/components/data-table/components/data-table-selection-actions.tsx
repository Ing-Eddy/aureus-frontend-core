import type { RowData } from "@tanstack/react-table";
import { ChevronDownIcon } from "lucide-react";
import { Badge } from "@/shadcn/ui/badge";
import { Button } from "@/shadcn/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shadcn/ui/dropdown-menu";
import { useDataTableContext } from "../hooks/use-data-table-context";

/** The bulk actions button, shown while at least one row is selected. */
export function DataTableSelectionActions<TData extends RowData>() {
  const { props, state, selectedRows, clearSelection, direction } = useDataTableContext<TData>();
  const selection = props.selection;
  if (!selection || (!selection.actions && !selection.renderActions)) return null;
  const rows = selectedRows(state.rowSelection);
  const count = Object.values(state.rowSelection).filter(Boolean).length;
  if (count === 0) return null;
  const actions = selection.actions?.filter((action) => !action.hidden?.(rows));
  if (actions?.length === 0) return null;

  return (
    <DropdownMenu dir={direction}>
      <DropdownMenuTrigger asChild>
        <Button type="button" variant="outline">
          {selection.actionsLabel}
          <Badge variant="secondary" className="tabular-nums">
            {count}
          </Badge>
          <ChevronDownIcon aria-hidden data-icon="inline-end" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-48">
        {selection.renderActions
          ? selection.renderActions(rows, clearSelection)
          : actions?.map((action) => (
              <DropdownMenuItem
                key={action.id}
                variant={action.variant}
                disabled={action.disabled?.(rows)}
                onSelect={() => action.onSelect(rows, clearSelection)}
              >
                {action.icon}
                {action.label}
              </DropdownMenuItem>
            ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
