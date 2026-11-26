import { useLayoutEffect } from "react";
import { useAppLayoutContext, useAppLayoutWarnings } from "../hooks";
import type { AppLayoutSidebarProps } from "../types";
import { AppLayoutSidebarDesktop } from "./app-layout-sidebar-desktop";
import { AppLayoutSidebarSheet } from "./app-layout-sidebar-sheet";

/**
 * The navigation sidebar, with `AppLayoutSidebarHeader`, `AppLayoutSidebarContent` and
 * `AppLayoutSidebarFooter`. Below the layout's breakpoint it is a sheet on the same side. Its
 * content remounts when the viewport crosses the breakpoint. Use one per layout: it tells the
 * layout its `variant` and `collapsible`.
 *
 * ```tsx
 * <AppLayoutSidebar
 *   mobileTitle={t("layout.navigation")}
 *   variant="floating"
 *   rail
 *   railLabel={t("layout.toggle")}
 * >
 *   <AppLayoutSidebarContent>
 *     <AppLayoutNav items={items} />
 *   </AppLayoutSidebarContent>
 * </AppLayoutSidebar>
 * ```
 */
export function AppLayoutSidebar(props: AppLayoutSidebarProps) {
  const { variant = "sidebar", collapsible = "icon" } = props;
  const { isMobile, registerSidebar } = useAppLayoutContext("AppLayoutSidebar");
  useAppLayoutWarnings([
    [!props.mobileTitle, "AppLayoutSidebar needs `mobileTitle`, the name of the mobile sheet"],
    [props.rail && !props.railLabel, "AppLayoutSidebar `rail` needs `railLabel`"],
    [
      props.mobileCloseButton && !props.mobileCloseLabel,
      "AppLayoutSidebar `mobileCloseButton` needs `mobileCloseLabel`",
    ],
  ]);
  useLayoutEffect(() => {
    registerSidebar({ variant, collapsible });
  }, [registerSidebar, variant, collapsible]);
  return isMobile ? <AppLayoutSidebarSheet {...props} /> : <AppLayoutSidebarDesktop {...props} />;
}
