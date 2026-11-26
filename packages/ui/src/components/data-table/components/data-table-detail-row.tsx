import type { ReactNode } from "react";
import { TableCell, TableRow } from "@/shadcn/ui/table";
import { rowResetClassName } from "../utils";

/** Props of `DataTableDetailRow`. */
export interface DataTableDetailRowProps {
  /** Element id, referenced by the expand button's `aria-controls`. */
  id?: string;
  /** Number of visible columns, so the cell spans the whole row. */
  colSpan: number;
  /** The row's content. */
  children: ReactNode;
  /** Replaces the cell's default padding and wrapping classes. */
  className?: string;
}

/** A full-width row: an expanded row's detail, or the empty, error and loading states. */
export function DataTableDetailRow({ id, colSpan, children, className }: DataTableDetailRowProps) {
  return (
    <TableRow id={id} data-slot="data-table-detail-row" className={rowResetClassName}>
      <TableCell colSpan={colSpan} className={className ?? "whitespace-normal p-3"}>
        {children}
      </TableCell>
    </TableRow>
  );
}
