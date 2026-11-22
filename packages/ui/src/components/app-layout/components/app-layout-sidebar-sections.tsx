import { cn } from "cn";
import { Slot } from "radix-ui";
import { useContext } from "react";
import { SidebarPresentationContext, useAppLayoutContext } from "../hooks";
import type { AppLayoutSectionProps } from "../types";
import {
  sidebarContentClassName,
  sidebarContentCollapsedClassName,
  sidebarFooterClassName,
  sidebarHeaderClassName,
  sidebarSectionCollapsedClassName,
} from "../utils";

/** The top of the sidebar. It stays in place while the content scrolls; collapsed, it centres. */
export function AppLayoutSidebarHeader({ asChild, className, ...rest }: AppLayoutSectionProps) {
  useAppLayoutContext("AppLayoutSidebarHeader");
  const { collapsed } = useContext(SidebarPresentationContext);
  const Comp = asChild ? Slot.Root : "div";
  return (
    <Comp
      data-slot="app-layout-sidebar-header"
      className={cn(
        sidebarHeaderClassName,
        collapsed && sidebarSectionCollapsedClassName,
        className,
      )}
      {...rest}
    />
  );
}

/** The middle of the sidebar, usually the navigation. The only part of it that scrolls. */
export function AppLayoutSidebarContent({ asChild, className, ...rest }: AppLayoutSectionProps) {
  useAppLayoutContext("AppLayoutSidebarContent");
  const { collapsed } = useContext(SidebarPresentationContext);
  const Comp = asChild ? Slot.Root : "div";
  return (
    <Comp
      data-slot="app-layout-sidebar-content"
      className={cn(
        sidebarContentClassName,
        collapsed && sidebarContentCollapsedClassName,
        className,
      )}
      {...rest}
    />
  );
}

/** The bottom of the sidebar. It stays in place while the content scrolls; collapsed, it centres. */
export function AppLayoutSidebarFooter({ asChild, className, ...rest }: AppLayoutSectionProps) {
  useAppLayoutContext("AppLayoutSidebarFooter");
  const { collapsed } = useContext(SidebarPresentationContext);
  const Comp = asChild ? Slot.Root : "div";
  return (
    <Comp
      data-slot="app-layout-sidebar-footer"
      className={cn(
        sidebarFooterClassName,
        collapsed && sidebarSectionCollapsedClassName,
        className,
      )}
      {...rest}
    />
  );
}
