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
  variant: AppLayoutSidebarVariant;
  collapsible: AppLayoutCollapsible;
}

/** Everything the parts of one layout share. Changes with the sidebar state and the side. */
export interface AppLayoutContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  toggle: () => void;
  isMobile: boolean;
  side: AppLayoutSide;
  setSide: (side: AppLayoutSide) => void;
  /** The screen edge of `side` in the measured text direction. */
  physicalSide: PhysicalSide;
  direction: "ltr" | "rtl";
  /** `"expanded"` when `collapsible` is `"none"`. */
  state: AppLayoutSidebarState;
  variant: AppLayoutSidebarVariant;
  collapsible: AppLayoutCollapsible;
  registerSidebar: (config: SidebarConfig) => void;
  closeMobileOnNavigate: boolean;
  renderLink?: (props: AppLayoutLinkProps) => ReactNode;
  isActive?: (href: string) => boolean;
  sidebarId: string;
  mainId: string;
  mainRef: RefObject<HTMLElement | null>;
}

export const AppLayoutContext = createContext<AppLayoutContextValue | null>(null);

/** The breadcrumb state: the public functions plus the layers of `useAppLayoutBreadcrumbItems`. */
export interface AppLayoutBreadcrumbContextValue extends UseAppLayoutBreadcrumbResult {
  pushLayer: (token: string, items: readonly AppLayoutBreadcrumbItem[]) => void;
  updateLayer: (token: string, items: readonly AppLayoutBreadcrumbItem[]) => void;
  removeLayer: (token: string) => void;
}

export const AppLayoutBreadcrumbContext = createContext<AppLayoutBreadcrumbContextValue | null>(
  null,
);

/** The node of the top bar's actions area, where `AppLayoutTopbarActions` portals render. */
export interface AppLayoutTopbarContextValue {
  target: HTMLElement | null;
  setTarget: (node: HTMLElement | null) => void;
}

export const AppLayoutTopbarContext = createContext<AppLayoutTopbarContextValue | null>(null);

/** How the navigation parts are being shown. Outside a sidebar, as expanded. */
export interface SidebarPresentation {
  /** The desktop sidebar is collapsed to icons. */
  collapsed: boolean;
  /** Rendered inside the mobile sheet. */
  mobile: boolean;
}

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

export interface SubmenuContextValue {
  mode: SubItemMode;
  /** Reports whether a sub-item (by its instance id) is active. */
  reportActive: (id: string, active: boolean) => void;
}

export const SubmenuContext = createContext<SubmenuContextValue | null>(null);

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
