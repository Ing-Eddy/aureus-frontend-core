import type { UseAppLayoutSidebarResult } from "../types";
import { useAppLayoutContext } from "./use-app-layout-context";

/**
 * The sidebar of the surrounding `AppLayout`: its desktop state, the mobile sheet, its side and its
 * configuration, with functions to change them from any component inside the layout.
 *
 * ```tsx
 * const { side, setSide } = useAppLayoutSidebar();
 *
 * <Button onClick={() => setSide(side === "start" ? "end" : "start")}>
 *   {t("layout.moveSidebar")}
 * </Button>;
 * ```
 */
export function useAppLayoutSidebar(): UseAppLayoutSidebarResult {
  const context = useAppLayoutContext("useAppLayoutSidebar");
  return {
    state: context.state,
    open: context.open,
    setOpen: context.setOpen,
    toggle: context.toggle,
    isMobile: context.isMobile,
    mobileOpen: context.mobileOpen,
    setMobileOpen: context.setMobileOpen,
    side: context.side,
    setSide: context.setSide,
    collapsible: context.collapsible,
    variant: context.variant,
  };
}
