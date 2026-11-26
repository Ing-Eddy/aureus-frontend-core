import type { RowData } from "@tanstack/react-table";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  EllipsisIcon,
  Rows3Icon,
} from "lucide-react";
import { type ReactNode, useCallback, useState } from "react";
import { cn } from "@/shadcn/lib/utils";
import { Button } from "@/shadcn/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shadcn/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shadcn/ui/tooltip";
import { useDataTableContext } from "../hooks/use-data-table-context";
import { paginationClassName } from "../utils/data-table-classes";
import { pageItems } from "../utils/page-items";

/** Below this width (the `@md` container size) only the current page is listed between the ends. */
const NARROW_WIDTH = 448;

/** A callback ref and the element's width, followed with a ResizeObserver (0 before measuring). */
function useWidth() {
  const [width, setWidth] = useState(0);
  const ref = useCallback((element: HTMLElement | null) => {
    if (!element) return;
    const measure = () => setWidth(element.clientWidth);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return [ref, width] as const;
}

/**
 * The arrows point the other way in right-to-left pages, and the buttons are larger on touch
 * screens.
 */
const navButtonClassName = "rtl:[&_svg]:rotate-180 pointer-coarse:size-10";

/** A first, previous, next or last page button. */
function NavButton({
  label,
  disabled,
  onClick,
  children,
}: {
  /** Accessible name; `undefined` only in untyped code that omits it. */
  label: string | undefined;
  /** Whether there is no page to go to. */
  disabled: boolean;
  /** Changes the page. */
  onClick: () => void;
  /** The arrow icon. */
  children: ReactNode;
}) {
  return (
    <Button
      type="button"
      variant="outline"
      size="icon-sm"
      className={navButtonClassName}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </Button>
  );
}

/**
 * Compact pagination: the page-size select (named by `pageSizeLabel`, shown as its tooltip) and
 * the range on one side; first/previous, the page buttons and next/last on the other. Each page
 * button is named by `pageLabel(page, count)`; the current one has `aria-current="page"`.
 */
export function DataTablePagination<TData extends RowData>() {
  const { props, table, state, direction } = useDataTableContext<TData>();
  const [rootRef, width] = useWidth();
  const pagination = props.pagination;
  if (!pagination) return null;

  const { pageIndex, pageSize } = state.pagination;
  const pageCount = Math.max(table.getPageCount(), 1);
  const current = pageIndex + 1;
  const total = pagination.manual
    ? pagination.rowCount
    : table.getPrePaginatedRowModel().rows.length;
  const from = total === 0 ? 0 : pageIndex * pageSize + 1;
  const to = total === undefined ? undefined : Math.min((pageIndex + 1) * pageSize, total);
  const range =
    pagination.rangeLabel && total !== undefined && to !== undefined
      ? pagination.rangeLabel(from, to, total)
      : undefined;
  const siblings = width > 0 && width < NARROW_WIDTH ? 0 : 1;
  const canPrevious = table.getCanPreviousPage();
  const canNext = table.getCanNextPage();

  return (
    <div
      ref={rootRef}
      data-slot="data-table-pagination"
      className={cn(paginationClassName, props.classNames?.pagination)}
    >
      <div className="flex items-center gap-3 text-muted-foreground">
        {pagination.pageSizes && (
          <Select
            dir={direction}
            value={String(pageSize)}
            onValueChange={(value) => table.setPageSize(Number(value))}
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <SelectTrigger
                  size="sm"
                  aria-label={pagination.pageSizeLabel}
                  className="gap-1.5 bg-background tabular-nums"
                >
                  <Rows3Icon aria-hidden className="text-muted-foreground" />
                  <SelectValue />
                </SelectTrigger>
              </TooltipTrigger>
              <TooltipContent>{pagination.pageSizeLabel}</TooltipContent>
            </Tooltip>
            <SelectContent>
              {pagination.pageSizes.map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        {/* The range announces page and search changes. */}
        {range !== undefined && (
          <span aria-live="polite" className="tabular-nums">
            {range}
          </span>
        )}
      </div>

      <div className="flex w-full items-center gap-1 @md/data-table:ms-auto @md/data-table:w-auto">
        {pagination.showFirstLast && (
          <NavButton
            label={pagination.firstLabel}
            disabled={!canPrevious}
            onClick={() => table.firstPage()}
          >
            <ChevronsLeftIcon aria-hidden />
          </NavButton>
        )}
        <NavButton
          label={pagination.previousLabel}
          disabled={!canPrevious}
          onClick={() => table.previousPage()}
        >
          <ChevronLeftIcon aria-hidden />
        </NavButton>
        <div className="flex flex-1 items-center justify-center gap-1 @md/data-table:flex-none">
          {pageItems(current, pageCount, siblings).map((item) =>
            typeof item === "number" ? (
              <Button
                key={item}
                type="button"
                variant={item === current ? "outline" : "ghost"}
                size="sm"
                className="h-8 min-w-8 px-1.5 tabular-nums pointer-coarse:h-10 pointer-coarse:min-w-10"
                aria-label={pagination.pageLabel?.(item, pageCount)}
                aria-current={item === current ? "page" : undefined}
                onClick={() => table.setPageIndex(item - 1)}
              >
                {item}
              </Button>
            ) : (
              <span
                key={item}
                aria-hidden
                className="flex size-8 items-center justify-center text-muted-foreground"
              >
                <EllipsisIcon className="size-4" />
              </span>
            ),
          )}
        </div>
        <NavButton
          label={pagination.nextLabel}
          disabled={!canNext}
          onClick={() => table.nextPage()}
        >
          <ChevronRightIcon aria-hidden />
        </NavButton>
        {pagination.showFirstLast && (
          <NavButton
            label={pagination.lastLabel}
            disabled={!canNext}
            onClick={() => table.lastPage()}
          >
            <ChevronsRightIcon aria-hidden />
          </NavButton>
        )}
      </div>

      {/* Without a range, the page label announces page changes. */}
      {range === undefined && (
        <span aria-live="polite" className="sr-only">
          {pagination.pageLabel?.(current, pageCount)}
        </span>
      )}
    </div>
  );
}
