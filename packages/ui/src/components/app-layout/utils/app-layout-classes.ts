import type {
  AppLayoutCollapsible,
  AppLayoutMaxWidth,
  AppLayoutSide,
  AppLayoutSidebarVariant,
} from "../types";

/**
 * Classes of the layout parts. Most are shadcn's, copied from `src/shadcn/ui/sidebar.tsx` (the
 * part each one comes from is named), because the shadcn parts carry fixed English texts, a
 * cookie, a fixed shortcut and a physical side. Compare them after `shadcn:update`. The changes:
 * - physical utilities (`left`, `right`, `border-r`, `pr-8`, `text-left`) are logical
 *   (`start`, `end`, `border-e`, `pe-8`, `text-start`), so a side follows the text direction;
 * - the collapsed presentation is chosen in code instead of `group-data-[collapsible=icon]`;
 * - the sidebar is a flex child of the shell instead of a `fixed` element beside a gap.
 */

/** Root shell: full height, no page scroll. */
export const rootClassName = "group/app-layout relative flex h-svh w-full overflow-hidden";

/** `SidebarProvider` wrapper: the inset variant shows the sidebar colour behind the card. */
export const rootInsetClassName = "bg-sidebar";

/** Desktop sidebar box. Its width animates; the container inside keeps the content's width. */
export const sidebarClassName =
  "group/app-layout-sidebar relative h-full shrink-0 text-sidebar-foreground transition-[width] duration-200 ease-linear motion-reduce:transition-none";

/** `order` places the sidebar on its logical side without changing the JSX order. */
export const sidebarOrderClassNames: Record<AppLayoutSide, string> = {
  start: "order-first",
  end: "order-last",
};

const detachedCollapsedWidth = "w-[calc(var(--app-layout-sidebar-width-icon)+(--spacing(4)))]";

/**
 * The attached variant draws a 1px edge border inside its width, so it adds that pixel: the
 * content keeps exactly `collapsedWidth`, and the icons stay centred.
 */
const attachedCollapsedWidth = "w-[calc(var(--app-layout-sidebar-width-icon)+1px)]";

/** Width of the sidebar box (`Sidebar` gap) by presentation. */
export function sidebarWidthClassName(
  collapsed: boolean,
  collapsible: AppLayoutCollapsible,
  variant: AppLayoutSidebarVariant,
): string {
  if (!collapsed || collapsible === "none") return "w-(--app-layout-sidebar-width)";
  if (collapsible === "offcanvas") return "w-0";
  return variant === "sidebar" ? attachedCollapsedWidth : detachedCollapsedWidth;
}

/**
 * `Sidebar` container. It is anchored to the inner edge of the box, so when the box shrinks to
 * zero (offcanvas) the container slides out through the shell's outer edge, which clips it.
 */
export const sidebarContainerClassName =
  "absolute inset-y-0 z-10 flex transition-[width] duration-200 ease-linear motion-reduce:transition-none";

export const sidebarContainerAnchorClassNames: Record<AppLayoutSide, string> = {
  start: "end-0",
  end: "start-0",
};

/** Container width: the content's width, except when collapsed to icons. */
export function sidebarContainerWidthClassName(
  collapsed: boolean,
  collapsible: AppLayoutCollapsible,
  variant: AppLayoutSidebarVariant,
): string {
  if (collapsed && collapsible === "icon") return sidebarWidthClassName(true, "icon", variant);
  return "w-(--app-layout-sidebar-width)";
}

/** `Sidebar` container: the edge border of the attached variant, padding of the detached ones. */
export function sidebarContainerVariantClassName(
  variant: AppLayoutSidebarVariant,
  side: AppLayoutSide,
): string {
  if (variant !== "sidebar") return "p-2";
  return side === "start" ? "border-e border-sidebar-border" : "border-s border-sidebar-border";
}

/** `Sidebar` inner panel. */
export const sidebarInnerClassName = "flex size-full flex-col bg-sidebar";

export const sidebarInnerFloatingClassName = "rounded-lg shadow-sm ring-1 ring-sidebar-border";

/** `Sidebar` mobile `SheetContent`, with the sheet's own width and `max-w-sm` replaced. */
export const sheetClassName =
  "gap-0 bg-sidebar p-0 text-sidebar-foreground data-[side=left]:w-(--app-layout-sidebar-width-mobile) data-[side=right]:w-(--app-layout-sidebar-width-mobile) data-[side=left]:max-w-[calc(100vw-2rem)] data-[side=right]:max-w-[calc(100vw-2rem)] data-[side=left]:sm:max-w-[calc(100vw-2rem)] data-[side=right]:sm:max-w-[calc(100vw-2rem)]";

export const sheetCloseButtonClassName = "absolute top-2 end-2 pointer-coarse:size-11";

/** `SidebarRail`, positioned on the inner edge of the sidebar box. */
export const railClassName =
  "absolute inset-y-0 z-20 w-4 cursor-ew-resize transition-all ease-linear after:absolute after:inset-y-0 after:start-1/2 after:w-[2px] hover:after:bg-sidebar-border motion-reduce:transition-none";

export const railSideClassNames: Record<AppLayoutSide, string> = {
  start: "-end-2",
  end: "-start-2",
};

/** `SidebarHeader`, `SidebarFooter`. */
export const sidebarHeaderClassName = "flex shrink-0 flex-col gap-2 p-2";
export const sidebarFooterClassName = "flex shrink-0 flex-col gap-2 p-2";

/** Collapsed to icons, the sections centre what they hold. */
export const sidebarSectionCollapsedClassName = "items-center";

/** `SidebarContent`: the only part of the sidebar that scrolls. */
export const sidebarContentClassName =
  "flex min-h-0 flex-1 flex-col gap-0 overflow-x-hidden overflow-y-auto overscroll-contain [scrollbar-width:thin]";

/**
 * Collapsed to icons, the scrollbar would take the end side of a narrow column and push the icons
 * off centre, so it is hidden; the content still scrolls with the wheel, touch and keyboard.
 */
export const sidebarContentCollapsedClassName =
  "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden";

/** `SidebarTrigger`. */
export const triggerClassName = "rtl:[&>svg]:-scale-x-100";

/** `SidebarInset`. */
export const insetClassName = "relative flex min-w-0 flex-1 flex-col overflow-hidden bg-background";

/** `SidebarInset` beside an inset sidebar on desktop: a card with no margin towards the sidebar. */
export function insetVariantClassName(side: AppLayoutSide, collapsed: boolean): string {
  const towardsSidebar = side === "start" ? "ms-0" : "me-0";
  const collapsedMargin = side === "start" ? "ms-2" : "me-2";
  return `m-2 rounded-xl shadow-sm ${collapsed ? collapsedMargin : towardsSidebar}`;
}

/** Top bar (the shadcn blocks' `header`). */
export const topbarClassName =
  "flex h-14 shrink-0 items-center gap-2 border-b border-border bg-background px-4";

export const topbarDividerClassName = "mx-1 data-vertical:h-4 data-vertical:self-center";

export const topbarActionsClassName = "ms-auto flex shrink-0 items-center gap-2";

/** Main area: the only part of the inset that scrolls. */
export const mainClassName =
  "min-h-0 flex-1 overflow-y-auto overscroll-contain outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset";

/** Padded content box: the minimum separation from every edge of the main area. */
export const mainContentClassName = "p-4 md:p-6";

export const mainMaxWidthClassNames: Record<AppLayoutMaxWidth, string> = {
  sm: "mx-auto w-full max-w-sm",
  md: "mx-auto w-full max-w-md",
  lg: "mx-auto w-full max-w-lg",
  xl: "mx-auto w-full max-w-xl",
  "2xl": "mx-auto w-full max-w-2xl",
  "3xl": "mx-auto w-full max-w-3xl",
  "4xl": "mx-auto w-full max-w-4xl",
  "5xl": "mx-auto w-full max-w-5xl",
  "6xl": "mx-auto w-full max-w-6xl",
  "7xl": "mx-auto w-full max-w-7xl",
  full: "mx-auto w-full max-w-full",
};

export const skipLinkClassName =
  "sr-only rounded-md bg-background px-3 py-2 text-sm font-medium text-foreground shadow-md ring-2 ring-ring focus:not-sr-only focus:absolute focus:start-2 focus:top-2 focus:z-50";

/** `SidebarGroup`. When collapsed, groups after the first are separated by a line. */
export const groupClassName = "relative flex w-full min-w-0 flex-col p-2";
export const groupCollapsedClassName = "not-first:border-t not-first:border-sidebar-border";

/** `SidebarGroupLabel`. */
export const groupLabelClassName =
  "flex h-8 w-full shrink-0 items-center gap-2 rounded-md px-2 text-start text-xs font-medium text-sidebar-foreground/70 ring-sidebar-ring outline-hidden focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0";

export const groupLabelButtonClassName =
  "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground";

/** `SidebarMenu`. */
export const menuClassName = "flex w-full min-w-0 flex-col gap-0.5";

/** Collapsed to icons, the rows (squares) are centred in the column. */
export const menuCollapsedClassName = "items-center";

/** `SidebarMenuItem`. */
export const menuItemClassName = "group/menu-item relative";

/** `SidebarMenuButton` (`sidebarMenuButtonVariants`, default variant and size). */
export const menuButtonClassName =
  "peer/menu-button flex h-8 w-full items-center gap-2 overflow-hidden rounded-md p-2 text-start text-sm ring-sidebar-ring outline-hidden transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[state=open]:hover:bg-sidebar-accent data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground [&_svg]:size-4 [&_svg]:shrink-0";

/** The collapsed button: a square that shows only the icon or the letter. */
export const menuButtonCollapsedClassName = "size-8 justify-center p-2";

/** Room at the end of a row for the badge and the actions button. */
export function menuButtonEndPadding(hasBadge: boolean, hasActions: boolean): string {
  if (hasBadge && hasActions) return "pe-14";
  if (hasBadge || hasActions) return "pe-8";
  return "";
}

/** `SidebarMenuAction`. */
export const menuActionClassName =
  "absolute top-1.5 end-1 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground ring-sidebar-ring outline-hidden transition-transform peer-hover/menu-button:text-sidebar-accent-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 after:absolute after:-inset-2 md:after:hidden [&>svg]:size-4 [&>svg]:shrink-0";

export const menuActionOnHoverClassName =
  "group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 aria-expanded:opacity-100 pointer-fine:opacity-0";

export const menuSubActionClassName = "top-1";

/** `SidebarMenuBadge`. */
export const menuBadgeClassName =
  "pointer-events-none absolute top-1.5 flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-xs font-medium text-sidebar-foreground tabular-nums select-none peer-hover/menu-button:text-sidebar-accent-foreground";

export function menuBadgeOffsetClassName(hasActions: boolean): string {
  return hasActions ? "end-7" : "end-1";
}

/** The letter shown instead of a missing icon while collapsed. */
export const letterClassName =
  "flex size-4 shrink-0 items-center justify-center text-xs font-semibold leading-none";

/** The chevron of a submenu: points to the end when closed and down when open. */
export const submenuChevronClassName =
  "ms-auto transition-transform duration-200 rtl:-scale-x-100 motion-reduce:transition-none group-data-[state=open]/submenu:rotate-90";

/** `SidebarMenuSub`. */
export const menuSubClassName =
  "mx-3.5 flex min-w-0 flex-col gap-1 border-s border-sidebar-border px-2.5 py-0.5";

/** `SidebarMenuSubItem`. */
export const menuSubItemClassName = "group/menu-item relative";

/** `SidebarMenuSubButton` (size `md`). */
export const menuSubButtonClassName =
  "peer/menu-button flex h-7 w-full min-w-0 items-center gap-2 overflow-hidden rounded-md px-2 text-start text-sm text-sidebar-foreground ring-sidebar-ring outline-hidden hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground [&>svg]:size-4 [&>svg]:shrink-0";

/** A navigation separator (`SidebarSeparator`). */
export const navSeparatorClassName = "mx-2 my-1 h-px shrink-0 bg-sidebar-border";

/** `SidebarMenuSkeleton`. */
export const skeletonClassName = "flex h-8 items-center gap-2 rounded-md px-2";

/** The flyout of a collapsed submenu. */
export const flyoutClassName = "w-auto min-w-48";

/** The label of a row: truncated when expanded, only for assistive technology when collapsed. */
export const rowLabelClassName = "min-w-0 flex-1 truncate";

/** Breadcrumb parts. */
export const breadcrumbItemContentClassName = "inline-flex items-center gap-1.5 [&>svg]:size-4";
export const breadcrumbButtonClassName =
  "inline-flex items-center gap-1.5 rounded-sm outline-hidden focus-visible:ring-2 focus-visible:ring-ring [&>svg]:size-4";
export const breadcrumbPageClassName =
  "inline-flex items-center gap-1.5 font-normal text-foreground [&>svg]:size-4";
export const breadcrumbSeparatorIconClassName = "rtl:-scale-x-100";
export const breadcrumbEllipsisClassName = "size-7";
