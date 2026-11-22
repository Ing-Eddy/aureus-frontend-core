import type { RowData } from "@tanstack/react-table";
import { cn } from "@/shadcn/lib/utils";
import { useDataTableContext } from "../hooks/use-data-table-context";
import { headerClassName } from "../utils/data-table-classes";
import { DataTableToolbar, hasToolbar } from "./data-table-toolbar";

/** Title, subtitle and toolbar. Renders nothing when `header={false}` or when it is empty. */
export function DataTableHeader<TData extends RowData>() {
  const { props, titleId } = useDataTableContext<TData>();
  if (props.header === false) return null;
  const title = props.header?.title;
  const subtitle = props.header?.subtitle;
  const toolbar = hasToolbar(props);
  if (title === undefined && subtitle === undefined && !toolbar) return null;

  return (
    <div data-slot="data-table-header" className={cn(headerClassName, props.classNames?.header)}>
      {(title !== undefined || subtitle !== undefined) && (
        <div className="flex flex-col gap-0.5">
          {title !== undefined && (
            <div id={titleId} className="font-semibold text-base leading-tight">
              {title}
            </div>
          )}
          {subtitle !== undefined && (
            <div className="text-muted-foreground text-sm">{subtitle}</div>
          )}
        </div>
      )}
      {toolbar && <DataTableToolbar />}
    </div>
  );
}
