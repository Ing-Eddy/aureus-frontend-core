import type { RowData } from "@tanstack/react-table";
import { RefreshCwIcon } from "lucide-react";
import { cn } from "@/shadcn/lib/utils";
import { Button } from "@/shadcn/ui/button";
import { useDataTableContext } from "../hooks/use-data-table-context";
import { DataTableColumnToggle } from "./data-table-column-toggle";
import { DataTableFilters } from "./data-table-filters";
import { DataTableSearch } from "./data-table-search";
import { DataTableSelectionActions } from "./data-table-selection-actions";
import { DataTableToolbarButton } from "./data-table-toolbar-button";

/** Whether the toolbar has anything to show. */
export function hasToolbar(props: {
  search?: unknown;
  reload?: unknown;
  filters?: unknown;
  columnToggle?: unknown;
  toolbarActions?: readonly { hidden?: boolean }[];
  selection?: { actions?: unknown; renderActions?: unknown };
  header?: { toolbar?: unknown } | false;
}) {
  const toolbar = props.header ? props.header.toolbar : undefined;
  return Boolean(
    props.search ||
      props.reload ||
      props.filters ||
      props.columnToggle ||
      props.toolbarActions?.some((action) => !action.hidden) ||
      props.selection?.actions ||
      props.selection?.renderActions ||
      toolbar !== undefined,
  );
}

/** Search at the inline start; the consumer's slot, bulk actions and icon buttons at the end. */
export function DataTableToolbar<TData extends RowData>() {
  const { props } = useDataTableContext<TData>();
  const reload = props.reload;
  const toolbar = props.header ? props.header.toolbar : undefined;

  return (
    <div className={cn("flex flex-wrap items-center gap-2", props.classNames?.toolbar)}>
      <DataTableSearch />
      <div className="ms-auto flex flex-wrap items-center gap-1.5">
        {toolbar}
        <DataTableSelectionActions />
        {props.toolbarActions?.map((action) =>
          action.hidden ? null : action.showLabel ? (
            <Button
              key={action.id}
              type="button"
              variant={action.variant ?? "outline"}
              disabled={action.disabled}
              onClick={action.onClick}
            >
              {action.icon}
              {action.label}
            </Button>
          ) : (
            <DataTableToolbarButton
              key={action.id}
              label={action.label}
              variant={action.variant ?? "outline"}
              disabled={action.disabled}
              onClick={action.onClick}
            >
              {action.icon}
            </DataTableToolbarButton>
          ),
        )}
        {reload && (
          <DataTableToolbarButton
            label={reload.label}
            disabled={reload.disabled}
            onClick={reload.onReload}
          >
            <RefreshCwIcon
              aria-hidden
              className={cn(props.loading && "animate-spin motion-reduce:animate-none")}
            />
          </DataTableToolbarButton>
        )}
        <DataTableFilters />
        <DataTableColumnToggle />
      </div>
    </div>
  );
}
