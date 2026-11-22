import type { ReactNode } from "react";
import { TableCell, TableRow } from "@/shadcn/ui/table";
import { rowResetClassName } from "../utils";

export interface DataTableDetailRowProps {
  id?: string;
  colSpan: number;
  children: ReactNode;
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
