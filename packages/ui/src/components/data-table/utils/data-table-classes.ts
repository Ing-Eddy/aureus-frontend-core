/**
 * Classes of the table parts. The container and table classes are shadcn's, copied from
 * `src/shadcn/ui/table.tsx` (`Table`), because that part renders its own scroll container and
 * accepts no props for it; the data table needs it as the vertical scroll container (sticky
 * header, `maxHeight`). Compare them after `shadcn:update`. Cell backgrounds (stripes, hover,
 * selection, marks, pinned cells) live in `src/styles/data-table.css`.
 */

/**
 * The frame: a bordered, rounded box. The header and the pagination are bands with a muted
 * background, divided from the table by a border, so each reads as its own section. `overflow-clip`
 * rounds the table corners without creating a scroll container (the sticky header keeps working).
 * The root is the `data-table` size container: the toolbar and pagination follow the table's
 * own width (`@md/data-table:`), and `w-full` keeps it from collapsing in a shrink-to-fit parent.
 */
export const rootClassName =
  "@container/data-table flex w-full min-w-0 flex-col overflow-clip rounded-lg border bg-background";

/** The title and toolbar band above the table. */
export const headerClassName =
  "flex shrink-0 flex-col gap-3 border-b bg-muted/50 dark:bg-muted/60 px-4 py-3";

/** The pagination band below the table. */
export const paginationClassName =
  "flex shrink-0 flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t bg-muted/50 dark:bg-muted/60 px-4 py-2.5 text-sm";

/** The line that shows the selection count. */
export const selectedStatusClassName =
  "shrink-0 border-t px-4 py-2 text-muted-foreground text-sm tabular-nums";

/** shadcn's container of `Table`: it scrolls both axes. */
export const containerClassName = "relative w-full overflow-auto";

/** Pinned columns may take at most this share of the visible width; past it they scroll. */
export const MAX_PINNED_SHARE = 0.5;

/**
 * Takes the height the header and pagination leave in the root, so a root with a fixed height
 * (`className="h-[480px]"`, `h-full` in a sized parent) scrolls the rows, not the whole table.
 * Without a fixed height it is as tall as its content.
 */
export const scrollAreaClassName = "relative flex min-h-0 flex-1 flex-col";

/** The focus ring of the scroll container, focusable while it scrolls. */
export const scrollRegionClassName =
  "peer/scroll min-h-0 flex-1 outline-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring";

/**
 * What both scroll shadows share: a gradient over the edge, hidden until it is needed and in
 * forced-colors mode.
 */
const scrollShadowBase =
  "pointer-events-none absolute inset-y-0 z-40 w-4 opacity-0 transition-opacity motion-reduce:transition-none forced-colors:hidden from-black/12 to-transparent dark:from-black/50";

/** Shown while content is hidden at that edge (`data-scroll-start` / `data-scroll-end`). */
export const scrollShadowClassName = {
  start: `${scrollShadowBase} bg-linear-to-r rtl:bg-linear-to-l peer-data-[scroll-start]/scroll:opacity-100`,
  end: `${scrollShadowBase} bg-linear-to-l rtl:bg-linear-to-r peer-data-[scroll-end]/scroll:opacity-100`,
} as const;

/** shadcn's classes of `<table>`. */
export const tableClassName = "w-full caption-bottom text-sm";

/** TableRow paints its own hover and selected backgrounds; the cells paint them instead. */
export const rowResetClassName =
  "hover:bg-transparent data-[state=selected]:bg-transparent has-aria-expanded:bg-transparent";

/**
 * The cells at the table's inline edges line up with the header and pagination bands (`px-4`).
 * Header cells mark their edges with `data-edge-start` / `data-edge-end`, because with nested
 * columns the first cell of a header row is not always at the edge.
 */
export const headCellClassName = {
  default: "h-10 px-2 data-edge-start:ps-4 data-edge-end:pe-4",
  compact: "h-8 px-1.5 text-xs data-edge-start:ps-4 data-edge-end:pe-4",
} as const;

/** Body and footer cell padding per density. */
export const bodyCellClassName = {
  default: "p-2 first:ps-4 last:pe-4",
  compact: "px-1.5 py-1 first:ps-4 last:pe-4",
} as const;

/** Text alignment per column alignment. */
export const alignClassName = {
  start: "text-start",
  center: "text-center",
  end: "text-end",
} as const;

/** Flex alignment per column alignment, for sort buttons. */
export const justifyClassName = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
} as const;

/** Keeps the header rows at the top, above the pinned body cells. */
export const stickyHeaderClassName = "sticky top-0 z-20";

/** A pinned body or footer cell, above the other cells. */
export const pinnedCellClassName = "sticky z-10";

/** A pinned header cell, above the sticky header. */
export const pinnedHeaderCellClassName = "sticky z-30";
