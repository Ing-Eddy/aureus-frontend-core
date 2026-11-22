import { cn } from "cn";
import { useContext, useId, useLayoutEffect } from "react";
import { DropdownMenuItem } from "@/shadcn/ui/dropdown-menu";
import { SubmenuContext, useAppLayoutWarnings } from "../hooks";
import type { AppLayoutNavSubItemProps } from "../types";
import { menuButtonEndPadding, menuSubItemClassName } from "../utils";
import { AppLayoutLink } from "./app-layout-link";
import { AppLayoutNavActionsMenu, hasVisibleActions } from "./app-layout-nav-actions";
import { AppLayoutNavBadge } from "./app-layout-nav-badge";
import { AppLayoutNavControl, useResolvedActive } from "./app-layout-nav-control";

/**
 * A row inside an `AppLayoutNavSubmenu`, with the same options as an item. It reports whether it
 * is active, so the submenu is marked active and opens. While the sidebar is collapsed it is shown
 * in the submenu's flyout menu, without badge or actions.
 */
export function AppLayoutNavSubItem({
  label,
  icon,
  href,
  onSelect,
  active,
  disabled,
  badge,
  actions,
  showActionsOnHover = false,
  asChild = false,
  children,
  className,
  ...rest
}: AppLayoutNavSubItemProps) {
  const submenu = useContext(SubmenuContext);
  useAppLayoutWarnings([[!label, "AppLayoutNavSubItem needs `label`, its accessible name"]]);
  const resolvedActive = useResolvedActive(active, href);
  const instanceId = useId();
  useLayoutEffect(() => {
    if (!submenu) return;
    submenu.reportActive(instanceId, resolvedActive);
    return () => submenu.reportActive(instanceId, false);
  }, [submenu, instanceId, resolvedActive]);

  const mode = submenu?.mode ?? "list";
  if (mode === "registry") return null;

  if (mode === "flyout") {
    const itemContent = (
      <>
        {icon ? (
          <span aria-hidden="true" className="contents">
            {icon}
          </span>
        ) : null}
        {label}
      </>
    );
    if (href !== undefined && !disabled) {
      return (
        <DropdownMenuItem asChild onSelect={onSelect} data-active={resolvedActive}>
          <AppLayoutLink href={href} aria-current={resolvedActive ? "page" : undefined}>
            {itemContent}
          </AppLayoutLink>
        </DropdownMenuItem>
      );
    }
    return (
      <DropdownMenuItem disabled={disabled} onSelect={onSelect} data-active={resolvedActive}>
        {itemContent}
      </DropdownMenuItem>
    );
  }

  const withActions = hasVisibleActions(actions, false);
  const withBadge = badge != null;
  return (
    <li
      data-slot="app-layout-nav-sub-item"
      data-active={resolvedActive}
      className={cn(menuSubItemClassName, className)}
      {...rest}
    >
      <AppLayoutNavControl
        kind="sub"
        label={label}
        icon={icon}
        href={href}
        onSelect={onSelect}
        active={resolvedActive}
        disabled={disabled}
        asChild={asChild}
        collapsed={false}
        className={menuButtonEndPadding(withBadge, withActions)}
      >
        {children}
      </AppLayoutNavControl>
      {withBadge ? <AppLayoutNavBadge badge={badge} withActions={withActions} sub /> : null}
      {actions ? (
        <AppLayoutNavActionsMenu actions={actions} showOnHover={showActionsOnHover} sub />
      ) : null}
    </li>
  );
}
