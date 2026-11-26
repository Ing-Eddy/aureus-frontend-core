import { cn } from "cn";
import type { CSSProperties } from "react";
import { SidebarPresentationContext, useAppLayoutContext } from "../hooks";
import type { AppLayoutSidebarProps } from "../types";
import {
  sidebarClassName,
  sidebarContainerAnchorClassNames,
  sidebarContainerClassName,
  sidebarContainerVariantClassName,
  sidebarContainerWidthClassName,
  sidebarInnerClassName,
  sidebarInnerFloatingClassName,
  sidebarOrderClassNames,
  sidebarWidthClassName,
} from "../utils";
import { AppLayoutSidebarRail } from "./app-layout-sidebar-rail";

/**
 * The desktop sidebar: a box whose width animates, with the content's container inside.
 * `className`, `style` and other attributes go to the container. Collapsed off screen, the
 * container is inert, so it takes no focus.
 */
export function AppLayoutSidebarDesktop({
  children,
  className,
  style,
  variant = "sidebar",
  collapsible = "icon",
  width = "16rem",
  collapsedWidth = "3rem",
  mobileWidth: _mobileWidth,
  mobileTitle: _mobileTitle,
  mobileDescription: _mobileDescription,
  mobileClassName: _mobileClassName,
  mobileCloseButton: _mobileCloseButton,
  mobileCloseLabel: _mobileCloseLabel,
  rail,
  railLabel,
  ...rest
}: AppLayoutSidebarProps) {
  const { side, state, sidebarId } = useAppLayoutContext("AppLayoutSidebar");
  const collapsed = state === "collapsed";
  const iconCollapsed = collapsed && collapsible === "icon";
  const offscreen = collapsed && collapsible === "offcanvas";
  return (
    <SidebarPresentationContext.Provider value={{ collapsed: iconCollapsed, mobile: false }}>
      <div
        data-slot="app-layout-sidebar"
        data-state={state}
        data-collapsible={collapsed ? collapsible : ""}
        data-variant={variant}
        data-side={side}
        className={cn(
          sidebarClassName,
          sidebarOrderClassNames[side],
          sidebarWidthClassName(collapsed, collapsible, variant),
        )}
        style={
          {
            "--app-layout-sidebar-width": width,
            "--app-layout-sidebar-width-icon": collapsedWidth,
          } as CSSProperties
        }
      >
        <div
          id={sidebarId}
          data-slot="app-layout-sidebar-container"
          inert={offscreen || undefined}
          className={cn(
            sidebarContainerClassName,
            sidebarContainerAnchorClassNames[side],
            sidebarContainerWidthClassName(collapsed, collapsible, variant),
            sidebarContainerVariantClassName(variant, side),
            className,
          )}
          style={style}
          {...rest}
        >
          <div
            data-slot="app-layout-sidebar-inner"
            className={cn(
              sidebarInnerClassName,
              variant === "floating" && sidebarInnerFloatingClassName,
            )}
          >
            {children}
          </div>
        </div>
        {rail && railLabel ? <AppLayoutSidebarRail label={railLabel} /> : null}
      </div>
    </SidebarPresentationContext.Provider>
  );
}
