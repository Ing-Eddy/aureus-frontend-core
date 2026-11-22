import { cn } from "cn";
import { ChevronRightIcon, MoreHorizontalIcon } from "lucide-react";
import { Fragment, type ReactNode } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/shadcn/ui/breadcrumb";
import { Button } from "@/shadcn/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shadcn/ui/dropdown-menu";
import { useAppLayoutBreadcrumbContext, useAppLayoutContext, useAppLayoutWarnings } from "../hooks";
import type { AppLayoutBreadcrumbItem, AppLayoutBreadcrumbProps } from "../types";
import {
  breadcrumbButtonClassName,
  breadcrumbEllipsisClassName,
  breadcrumbItemContentClassName,
  breadcrumbPageClassName,
  breadcrumbSeparatorIconClassName,
} from "../utils";
import { AppLayoutLink } from "./app-layout-link";

type Entry = { kind: "item"; item: AppLayoutBreadcrumbItem; index: number } | { kind: "ellipsis" };

/** The visible entries: everything, or the first item, the ellipsis and the last items. */
export function breadcrumbEntries(
  items: readonly AppLayoutBreadcrumbItem[],
  maxItems: number | undefined,
): { entries: Entry[]; hidden: AppLayoutBreadcrumbItem[] } {
  const all = items.map((item, index) => ({ kind: "item" as const, item, index }));
  if (maxItems === undefined || items.length <= Math.max(maxItems, 3)) {
    return { entries: all, hidden: [] };
  }
  const tail = Math.max(Math.max(maxItems, 3) - 2, 1);
  const first = all[0];
  return {
    entries: [...(first ? [first] : []), { kind: "ellipsis" }, ...all.slice(-tail)],
    hidden: items.slice(1, items.length - tail),
  };
}

function content(item: AppLayoutBreadcrumbItem): ReactNode {
  return (
    <>
      {item.icon}
      {item.label}
    </>
  );
}

/**
 * The layout's breadcrumb trail, set with `useAppLayoutBreadcrumbItems` or
 * `useAppLayoutBreadcrumb`. The last item is the current page; earlier items are links or
 * buttons. With `maxItems`, the middle items collapse into a menu named by `ellipsisLabel`.
 */
export function AppLayoutBreadcrumb({
  label,
  maxItems,
  ellipsisLabel,
  separator,
  className,
  ...rest
}: AppLayoutBreadcrumbProps) {
  const { direction } = useAppLayoutContext("AppLayoutBreadcrumb");
  const { items } = useAppLayoutBreadcrumbContext("AppLayoutBreadcrumb");
  useAppLayoutWarnings([
    [!label, "AppLayoutBreadcrumb needs `label`, the name of the breadcrumb landmark"],
    [
      maxItems !== undefined && !ellipsisLabel,
      "AppLayoutBreadcrumb `maxItems` needs `ellipsisLabel`",
    ],
  ]);
  if (items.length === 0) return null;
  const { entries, hidden } = breadcrumbEntries(items, maxItems);
  const lastIndex = items.length - 1;
  const separatorNode = separator ?? (
    <ChevronRightIcon aria-hidden className={breadcrumbSeparatorIconClassName} />
  );

  const renderItem = (item: AppLayoutBreadcrumbItem, index: number) => {
    if (index === lastIndex) {
      return (
        <span data-slot="breadcrumb-page" aria-current="page" className={breadcrumbPageClassName}>
          {content(item)}
        </span>
      );
    }
    if (item.href) {
      return (
        <BreadcrumbLink asChild>
          <AppLayoutLink href={item.href} className={breadcrumbItemContentClassName}>
            {content(item)}
          </AppLayoutLink>
        </BreadcrumbLink>
      );
    }
    if (item.onSelect) {
      return (
        <BreadcrumbLink asChild>
          <button type="button" className={breadcrumbButtonClassName} onClick={item.onSelect}>
            {content(item)}
          </button>
        </BreadcrumbLink>
      );
    }
    return <span className={breadcrumbItemContentClassName}>{content(item)}</span>;
  };

  return (
    <Breadcrumb
      data-slot="app-layout-breadcrumb"
      aria-label={label}
      className={cn("min-w-0", className)}
      {...rest}
    >
      <BreadcrumbList>
        {entries.map((entry, position) => (
          <Fragment key={entry.kind === "item" ? (entry.item.id ?? entry.index) : "ellipsis"}>
            {position > 0 ? <BreadcrumbSeparator>{separatorNode}</BreadcrumbSeparator> : null}
            <BreadcrumbItem>
              {entry.kind === "item" ? (
                renderItem(entry.item, entry.index)
              ) : (
                <DropdownMenu dir={direction}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      aria-label={ellipsisLabel}
                      className={breadcrumbEllipsisClassName}
                    >
                      <MoreHorizontalIcon aria-hidden />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    {hidden.map((item, index) =>
                      item.href ? (
                        <DropdownMenuItem key={item.id ?? index} asChild>
                          <AppLayoutLink href={item.href}>{content(item)}</AppLayoutLink>
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem key={item.id ?? index} onSelect={item.onSelect}>
                          {content(item)}
                        </DropdownMenuItem>
                      ),
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </BreadcrumbItem>
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
