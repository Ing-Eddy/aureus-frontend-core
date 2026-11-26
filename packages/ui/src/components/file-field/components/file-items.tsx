import type { ReactNode, Ref } from "react";
import { cn } from "@/shadcn/lib/utils";

/** Props of `FileItems`. */
export interface FileItemsProps {
  /** Rows or tiles. */
  layout: "list" | "grid";
  /** The rendered items, with their ids as keys. */
  items: {
    /** The item's id, used as key. */
    id: string;
    /** Its rendered content. */
    node: ReactNode;
  }[];
  /** Reaches the list element. */
  containerRef?: Ref<HTMLUListElement>;
  /** Extra classes of the list. */
  className?: string;
}

/**
 * The items of `appearance="list"` (rows) or `"grid"` (tiles that wrap and fill the width), as
 * a list, so screen readers announce how many files there are.
 */
export function FileItems({ layout, items, containerRef, className }: FileItemsProps) {
  if (items.length === 0) return null;
  return (
    <ul
      ref={containerRef}
      data-slot="file-items"
      data-layout={layout}
      className={cn(
        "m-0 min-w-0 list-none p-0",
        layout === "grid"
          ? "grid grid-cols-[repeat(auto-fill,minmax(7rem,1fr))] gap-2"
          : "flex flex-col gap-2",
        className,
      )}
    >
      {items.map((item) => (
        <li key={item.id} className="min-w-0">
          {item.node}
        </li>
      ))}
    </ul>
  );
}
