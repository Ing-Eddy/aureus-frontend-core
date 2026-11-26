import type { RowData } from "@tanstack/react-table";
import { SlidersHorizontalIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/shadcn/ui/popover";
import { useDataTableContext } from "../hooks/use-data-table-context";
import { DataTableToolbarBadge } from "./data-table-toolbar-badge";
import { DataTableToolbarButton } from "./data-table-toolbar-button";

/** The advanced filters button: a popover with the consumer's content, and the active count. */
export function DataTableFilters<TData extends RowData>() {
  const { props, state, direction } = useDataTableContext<TData>();
  const filters = props.filters;
  if (!filters) return null;

  return (
    <DataTableToolbarBadge count={filters.activeCount ?? 0}>
      {(describedBy) => (
        <Popover open={state.filtersOpen} onOpenChange={state.setFiltersOpen}>
          <PopoverTrigger asChild>
            <DataTableToolbarButton label={filters.label} aria-describedby={describedBy}>
              <SlidersHorizontalIcon aria-hidden />
            </DataTableToolbarButton>
          </PopoverTrigger>
          <PopoverContent dir={direction} align="end" className="w-80 max-w-[calc(100vw-2rem)]">
            {filters.content}
          </PopoverContent>
        </Popover>
      )}
    </DataTableToolbarBadge>
  );
}
