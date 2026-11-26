import { cn } from "cn";
import { EllipsisIcon } from "lucide-react";
import { useContext } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shadcn/ui/dropdown-menu";
import { SidebarPresentationContext, useAppLayoutContext, useAppLayoutWarnings } from "../hooks";
import type { AppLayoutNavActions } from "../types";
import {
  menuActionClassName,
  menuActionOnHoverClassName,
  menuSubActionClassName,
  oppositeSide,
} from "../utils";

/** Whether a row shows its actions button: not collapsed, and at least one visible action. */
export function hasVisibleActions(actions: AppLayoutNavActions | undefined, collapsed: boolean) {
  return !collapsed && !!actions && actions.items.some((action) => !action.hidden);
}

/**
 * A row's "more actions" button and its menu. Hidden while collapsed or with no visible action. The
 * menu opens below the button in the sheet, and towards the content beside the sidebar.
 */
export function AppLayoutNavActionsMenu({
  actions,
  showOnHover,
  sub = false,
}: {
  /** The menu's button name and entries. */
  actions: AppLayoutNavActions;
  /** Shows the button only on hover or focus, on devices that can hover. */
  showOnHover: boolean;
  /** Places the button for a sub-item row, which is shorter. Defaults to `false`. */
  sub?: boolean;
}) {
  const { direction, physicalSide } = useAppLayoutContext("AppLayoutNavItem");
  const { collapsed, mobile } = useContext(SidebarPresentationContext);
  useAppLayoutWarnings([
    [!actions.label, "AppLayoutNavItem `actions` needs `label`, the name of its menu button"],
  ]);
  if (!hasVisibleActions(actions, collapsed)) return null;
  return (
    <DropdownMenu dir={direction}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          data-slot="app-layout-nav-action"
          aria-label={actions.label}
          className={cn(
            menuActionClassName,
            sub && menuSubActionClassName,
            showOnHover && menuActionOnHoverClassName,
          )}
        >
          <EllipsisIcon aria-hidden />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side={mobile ? "bottom" : oppositeSide(physicalSide)} align="start">
        {actions.items
          .filter((action) => !action.hidden)
          .map((action) => (
            <DropdownMenuItem
              key={action.id}
              variant={action.variant}
              disabled={action.disabled}
              onSelect={action.onSelect}
            >
              {action.icon}
              {action.label}
            </DropdownMenuItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
