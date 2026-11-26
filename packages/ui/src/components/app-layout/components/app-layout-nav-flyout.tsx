import { cn } from "cn";
import { type ReactNode, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/shadcn/ui/dropdown-menu";
import { useAppLayoutContext } from "../hooks";
import {
  flyoutClassName,
  menuButtonClassName,
  menuButtonCollapsedClassName,
  oppositeSide,
} from "../utils";
import { AppLayoutNavTooltip } from "./app-layout-nav-control";
import { AppLayoutNavIcon } from "./app-layout-nav-icon";

/**
 * A collapsed submenu: its icon (or letter) opens a menu beside the sidebar, towards the content,
 * with the submenu's label as heading and its sub-items.
 */
export function AppLayoutNavFlyout({
  label,
  icon,
  tooltip,
  active,
  children,
}: {
  /** The submenu's label: accessible name of its button and heading of the menu. */
  label: string;
  /** Decorative icon; without it the first letter of `label` is shown. */
  icon?: ReactNode;
  /** Tooltip content, or `false` for none. Defaults to `label`. */
  tooltip?: ReactNode | false;
  /** Whether one of the sub-items is the current page. */
  active: boolean;
  /** The sub-items, rendered as menu entries. */
  children?: ReactNode;
}) {
  const { direction, physicalSide } = useAppLayoutContext("AppLayoutNavSubmenu");
  const [open, setOpen] = useState(false);
  return (
    <DropdownMenu dir={direction} open={open} onOpenChange={setOpen}>
      <AppLayoutNavTooltip label={label} tooltip={tooltip}>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            data-slot="app-layout-nav-submenu-trigger"
            data-active={active}
            className={cn(menuButtonClassName, menuButtonCollapsedClassName)}
          >
            <AppLayoutNavIcon icon={icon} label={label} collapsed />
            <span data-slot="app-layout-nav-label" className="sr-only">
              {label}
            </span>
          </button>
        </DropdownMenuTrigger>
      </AppLayoutNavTooltip>
      <DropdownMenuContent
        data-slot="app-layout-nav-flyout"
        side={oppositeSide(physicalSide)}
        align="start"
        className={flyoutClassName}
      >
        <DropdownMenuLabel>{label}</DropdownMenuLabel>
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
