import type { ModalMode, ModalSize } from "../types";

/**
 * Classes of the modal parts. The panel classes are shadcn's, copied from
 * `src/shadcn/ui/dialog.tsx` (`DialogContent`, `DialogHeader`, `DialogFooter`) and
 * `src/shadcn/ui/drawer.tsx` (`DrawerContent`, `DrawerHeader`, `DrawerFooter`), because those
 * parts bundle a portal, an overlay and a fixed English "Close" text. Compare them after
 * `shadcn:update`. The changes: the panel is a flex column that never exceeds the viewport, the
 * body scrolls on its own, and the drawer respects the safe-area inset.
 */

export const dialogContentClassName =
  "fixed top-1/2 left-1/2 z-50 flex max-h-[calc(100dvh-2rem)] w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 flex-col gap-4 rounded-xl bg-popover p-4 text-sm text-popover-foreground ring-1 ring-foreground/10 duration-100 outline-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 motion-reduce:animate-none";

/** Dialog width per size. Only the dialog uses it. */
export const dialogSizeClassNames: Record<ModalSize, string> = {
  sm: "sm:max-w-sm",
  md: "sm:max-w-lg",
  lg: "sm:max-w-2xl",
  xl: "sm:max-w-4xl",
  full: "h-[calc(100dvh-2rem)]",
};

/** shadcn's `DrawerContent`, placed by Vaul's direction attribute. */
export const drawerContentClassName =
  "group/drawer-content fixed z-50 flex h-auto flex-col bg-popover text-sm text-popover-foreground outline-none data-[vaul-drawer-direction=bottom]:inset-x-0 data-[vaul-drawer-direction=bottom]:bottom-0 data-[vaul-drawer-direction=bottom]:mt-24 data-[vaul-drawer-direction=bottom]:max-h-[85dvh] data-[vaul-drawer-direction=bottom]:rounded-t-xl data-[vaul-drawer-direction=bottom]:border-t data-[vaul-drawer-direction=bottom]:pb-[env(safe-area-inset-bottom)] data-[vaul-drawer-direction=left]:inset-y-0 data-[vaul-drawer-direction=left]:left-0 data-[vaul-drawer-direction=left]:w-3/4 data-[vaul-drawer-direction=left]:rounded-r-xl data-[vaul-drawer-direction=left]:border-r data-[vaul-drawer-direction=right]:inset-y-0 data-[vaul-drawer-direction=right]:right-0 data-[vaul-drawer-direction=right]:w-3/4 data-[vaul-drawer-direction=right]:rounded-l-xl data-[vaul-drawer-direction=right]:border-l data-[vaul-drawer-direction=top]:inset-x-0 data-[vaul-drawer-direction=top]:top-0 data-[vaul-drawer-direction=top]:mb-24 data-[vaul-drawer-direction=top]:max-h-[85dvh] data-[vaul-drawer-direction=top]:rounded-b-xl data-[vaul-drawer-direction=top]:border-b data-[vaul-drawer-direction=top]:pt-[env(safe-area-inset-top)] data-[vaul-drawer-direction=left]:sm:max-w-sm data-[vaul-drawer-direction=right]:sm:max-w-sm";

/** The grab handle of a top or bottom drawer. */
export const drawerHandleClassName = "mx-auto h-1 w-[100px] shrink-0 rounded-full bg-muted";

/** The close button in the top end corner, larger on touch screens. */
export const closeButtonClassName = "absolute top-2 end-2 pointer-coarse:size-11";

/** The look of each section in each presentation. */
export const sectionClassNames: Record<"header" | "body" | "footer", Record<ModalMode, string>> = {
  header: {
    dialog: "flex flex-col gap-2",
    drawer:
      "flex flex-col gap-0.5 p-4 group-data-[vaul-drawer-direction=bottom]/drawer-content:text-center group-data-[vaul-drawer-direction=top]/drawer-content:text-center md:gap-0.5 md:text-start",
  },
  body: {
    dialog: "-mx-4 min-h-0 flex-1 overflow-y-auto px-4",
    drawer: "min-h-0 flex-1 overflow-y-auto px-4 last:pb-4",
  },
  footer: {
    dialog:
      "-mx-4 -mb-4 flex flex-wrap items-center justify-end gap-2 rounded-b-xl border-t bg-muted/50 p-4",
    drawer: "mt-auto flex flex-col gap-2 p-4",
  },
};

/** Hides a title or description from view; assistive technology still reads it. */
export const visuallyHiddenClassName = "sr-only";
