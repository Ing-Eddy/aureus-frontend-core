/** Classes shared by both select roots, mirroring shadcn's combobox and menu look. */
export const selectStyles = {
  trigger:
    "flex min-h-8 min-w-0 flex-1 cursor-default items-center gap-2 bg-transparent px-2.5 py-1 text-start text-base outline-none select-none md:text-sm",
  placeholder: "truncate text-muted-foreground",
  value: "truncate",
  /** The list is `contents`, so each chip wraps in the frame and the button fills the last line. */
  chips: "contents",
  /** Added to the frame when chips are shown. */
  chipsFrame: "h-auto min-h-8 flex-wrap gap-1 py-1 ps-1.5",
  /** Added to the button when chips are shown: keeps a clickable area beside the last chip. */
  chipsTrigger: "min-h-6 min-w-12 py-0 ps-1",
  chip: "inline-flex max-w-full items-center gap-1 rounded-md bg-muted py-0.5 ps-1.5 pe-0.5 text-xs font-medium text-foreground",
  chipRemove:
    "inline-flex size-5 shrink-0 items-center justify-center rounded-sm text-muted-foreground outline-none hover:bg-background hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none [&_svg]:size-3",
  chevron:
    "inline-flex cursor-default items-center text-muted-foreground transition-transform group-data-[open=true]/select:rotate-180 [&_svg]:size-4",
  popup:
    "z-50 max-h-(--available-height) w-(--anchor-width) max-w-(--available-width) origin-(--transform-origin) overflow-hidden rounded-lg bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10 outline-none",
  search:
    "flex h-9 w-full min-w-0 border-b border-input bg-transparent px-2.5 text-base outline-none placeholder:text-muted-foreground md:text-sm",
  status: "px-2.5 py-2 text-center text-sm text-muted-foreground empty:p-0",
  limit: "border-b border-input px-2.5 py-1.5 text-xs text-muted-foreground",
  list: "max-h-72 scroll-py-1 overflow-y-auto overscroll-contain p-1 empty:p-0",
  groupLabel: "px-2 py-1.5 text-xs font-medium text-muted-foreground",
  option:
    "group/option relative flex min-h-9 w-full cursor-default items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none select-none pointer-coarse:min-h-11 data-disabled:pointer-events-none data-disabled:opacity-50 data-highlighted:bg-accent data-highlighted:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0",
  indicator: "inline-flex size-4 shrink-0 items-center justify-center [&_svg]:size-4",
  checkbox:
    "inline-flex size-4 shrink-0 items-center justify-center rounded-[4px] border border-input [&_svg]:size-3",
} as const;
