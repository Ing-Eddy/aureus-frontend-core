import { cn } from "cn";
import { PanelLeftIcon, PanelRightIcon } from "lucide-react";
import type { MouseEvent } from "react";
import { Button } from "@/shadcn/ui/button";
import { useAppLayoutContext, useAppLayoutWarnings } from "../hooks";
import type { AppLayoutSidebarTriggerProps } from "../types";

/**
 * Toggles the sidebar: collapses or expands it on desktop and opens or closes the sheet on mobile.
 * Named by `label`; its default icon follows the sidebar's side. An `onClick` that prevents the
 * default stops the toggle.
 *
 * ```tsx
 * <AppLayoutSidebarTrigger label={t("layout.toggle")} />
 * ```
 */
export function AppLayoutSidebarTrigger({
  label,
  icon,
  className,
  onClick,
  ...rest
}: AppLayoutSidebarTriggerProps) {
  const { toggle, isMobile, mobileOpen, state, physicalSide, sidebarId } =
    useAppLayoutContext("AppLayoutSidebarTrigger");
  useAppLayoutWarnings([[!label, "AppLayoutSidebarTrigger needs `label`, its accessible name"]]);
  const expanded = isMobile ? mobileOpen : state === "expanded";
  // The sheet is only in the document while it is open.
  const controls = !isMobile || mobileOpen ? sidebarId : undefined;
  const Icon = physicalSide === "left" ? PanelLeftIcon : PanelRightIcon;
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    if (!event.defaultPrevented) toggle();
  };
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      data-slot="app-layout-sidebar-trigger"
      aria-label={label}
      aria-expanded={expanded}
      aria-controls={controls}
      className={cn(className)}
      onClick={handleClick}
      {...rest}
    >
      {icon ?? <Icon aria-hidden />}
    </Button>
  );
}
