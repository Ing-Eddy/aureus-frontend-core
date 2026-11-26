import { type ReactElement, type ReactNode, useId } from "react";
import { Badge } from "@/shadcn/ui/badge";

/** Props of `DataTableToolbarBadge`. */
export interface DataTableToolbarBadgeProps {
  /** Shown when greater than zero. */
  count: number;
  /** Renders the toolbar button, given the id that describes it (undefined without a badge). */
  children: (describedBy: string | undefined) => ReactElement;
}

/**
 * A count badge on the corner of a toolbar button. It sits outside the button, so the button's
 * accessible name stays its label; the count is the button's description.
 */
export function DataTableToolbarBadge({ count, children }: DataTableToolbarBadgeProps): ReactNode {
  const id = useId();
  const shown = count > 0;
  return (
    <span className="relative inline-flex">
      {children(shown ? id : undefined)}
      {shown && (
        <Badge
          id={id}
          aria-hidden
          data-slot="data-table-toolbar-badge"
          className="pointer-events-none absolute -end-1.5 -top-1.5 h-4 min-w-4 rounded-full px-1 text-[0.625rem] tabular-nums"
        >
          {count}
        </Badge>
      )}
    </span>
  );
}
