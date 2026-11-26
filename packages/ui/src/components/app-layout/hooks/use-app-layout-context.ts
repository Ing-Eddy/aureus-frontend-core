import { createContext, type ReactNode, type RefObject, useContext } from "react";
import type {
  AppLayoutBreadcrumbItem,
  AppLayoutCollapsible,
  AppLayoutLinkProps,
  AppLayoutSide,
  AppLayoutSidebarState,
  AppLayoutSidebarVariant,
  UseAppLayoutBreadcrumbResult,
} from "../types";
import type { PhysicalSide } from "../utils";

/** What the sidebar tells the root, so the hook and the inset know it. */
export interface SidebarConfig {
  /** The sidebar's `variant`, with its default applied. */
  variant: AppLayoutSidebarVariant;
  /** The sidebar's `collapsible`, with its default applied. */
  collapsible: AppLayoutCollapsible;
}

/** Everything the parts of one layout share. Changes with the sidebar state and the side. */
export interface AppLayoutContextValue {
  /** Whether the desktop sidebar is expanded, as set by the user or props. */
  open: boolean;
  /** Changes `open`. */
  setOpen: (open: boolean) => void;
  /** Whether the mobile sheet is open. */
  mobileOpen: boolean;
  /** Changes `mobileOpen`. */
  setMobileOpen: (open: boolean) => void;
  /** Toggles the sheet in mobile mode and the desktop state otherwise. */
  toggle: () => void;
  /** Whether the viewport is below the breakpoint. */
  isMobile: boolean;
  /** The logical side of the sidebar. */
  side: AppLayoutSide;
  /** Changes `side`. */
  setSide: (side: AppLayoutSide) => void;
  /** The screen edge of `side` in the measured text direction. */
  physicalSide: PhysicalSide;
  /** The text direction measured on the root, passed to menus and sheets that render outside it. */
  direction: "ltr" | "rtl";
  /** `"expanded"` when `collapsible` is `"none"`. */
  state: AppLayoutSidebarState;
  /** The registered sidebar's variant. */
  variant: AppLayoutSidebarVariant;
  /** The registered sidebar's collapsing mode. */
  collapsible: AppLayoutCollapsible;
  /** Called by the sidebar with its configuration. */
  registerSidebar: (config: SidebarConfig) => void;
  /** Whether choosing a row closes the mobile sheet. */
  closeMobileOnNavigate: boolean;
  /** The consumer's link renderer. */
  renderLink?: (props: AppLayoutLinkProps) => ReactNode;
  /** The consumer's current-page test. */
  isActive?: (href: string) => boolean;
  /** Element id of the sidebar or sheet, for `aria-controls`. */
  sidebarId: string;
  /** Element id of the main area, the target of the skip link. */
  mainId: string;
  /** The main area's scrolling element. */
  mainRef: RefObject<HTMLElement | null>;
}

/** The shared state of a layout; `null` outside an `AppLayout`. */
export const AppLayoutContext = createContext<AppLayoutContextValue | null>(null);

/** The breadcrumb state: the public functions plus the layers of `useAppLayoutBreadcrumbItems`. */
export interface AppLayoutBreadcrumbContextValue extends UseAppLayoutBreadcrumbResult {
  /**
   * Adds a caller's trail at its place in the stack (`order`, higher is on top), replacing a
   * previous layer with the same token.
   */
  pushLayer: (token: string, order: number, items: readonly AppLayoutBreadcrumbItem[]) => void;
  /** Replaces the items of a caller's layer without moving it. */
  updateLayer: (token: string, items: readonly AppLayoutBreadcrumbItem[]) => void;
  /** Removes a caller's layer, so the one below is shown again. */
  removeLayer: (token: string) => void;
}

/**
 * The breadcrumb state, in its own context so that trail changes do not re-render the rest of the
 * layout's parts.
 */
export const AppLayoutBreadcrumbContext = createContext<AppLayoutBreadcrumbContextValue | null>(
  null,
);

/** The node of the top bar's actions area, where `AppLayoutTopbarActions` portals render. */
export interface AppLayoutTopbarContextValue {
  /** The node, or `null` while no top bar is mounted. */
  target: HTMLElement | null;
  /** Ref callback with which the top bar registers the node. */
  setTarget: (node: HTMLElement | null) => void;
}

/** The actions target, in its own context so that only the top bar and its portals depend on it. */
export const AppLayoutTopbarContext = createContext<AppLayoutTopbarContextValue | null>(null);

/** How the navigation parts are being shown. Outside a sidebar, as expanded. */
export interface SidebarPresentation {
  /** The desktop sidebar is collapsed to icons. */
  collapsed: boolean;
  /** Rendered inside the mobile sheet. */
  mobile: boolean;
}

/** Set by the desktop sidebar and the sheet for the parts inside them. */
export const SidebarPresentationContext = createContext<SidebarPresentation>({
  collapsed: false,
  mobile: false,
});

/** True inside a navigation list (`ul`), where separators must be list items. */
export const NavListContext = createContext(false);

/**
 * Where sub-items are rendered: in the submenu's list, in the collapsed flyout menu, or only to
 * report whether they are active (while the list is not shown).
 */
export type SubItemMode = "list" | "flyout" | "registry";

/** What a submenu tells its sub-items. */
export interface SubmenuContextValue {
  /** Where this copy of the sub-items is rendered. */
  mode: SubItemMode;
  /** Reports whether a sub-item (by its instance id) is active. */
  reportActive: (id: string, active: boolean) => void;
}

/**
 * The surrounding submenu; `null` for a sub-item used outside one, which is shown as a list row.
 */
export const SubmenuContext = createContext<SubmenuContextValue | null>(null);

/** The developer error of a part or hook used outside an `AppLayout`. */
function insideError(partName: string): Error {
  return new Error(`${partName} must be used inside AppLayout.`);
}

/** The layout a part belongs to. Throws a developer error outside an `AppLayout`. */
export function useAppLayoutContext(partName: string): AppLayoutContextValue {
  const context = useContext(AppLayoutContext);
  if (!context) throw insideError(partName);
  return context;
}

/** The breadcrumb state. Throws a developer error outside an `AppLayout`. */
export function useAppLayoutBreadcrumbContext(partName: string): AppLayoutBreadcrumbContextValue {
  const context = useContext(AppLayoutBreadcrumbContext);
  if (!context) throw insideError(partName);
  return context;
}

/** The top bar's actions target. Throws a developer error outside an `AppLayout`. */
export function useAppLayoutTopbarContext(partName: string): AppLayoutTopbarContextValue {
  const context = useContext(AppLayoutTopbarContext);
  if (!context) throw insideError(partName);
  return context;
}
