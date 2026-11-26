import { cn } from "cn";
import { Slot } from "radix-ui";
import { type MouseEvent, useContext, useId, useLayoutEffect } from "react";
import { DropdownMenuItem } from "@/shadcn/ui/dropdown-menu";
import { SubmenuContext, useAppLayoutWarnings } from "../hooks";
import type { AppLayoutNavSubItemProps } from "../types";
import { menuButtonEndPadding, menuSubItemClassName } from "../utils";
import { AppLayoutLink } from "./app-layout-link";
import { AppLayoutNavActionsMenu, hasVisibleActions } from "./app-layout-nav-actions";
import { AppLayoutNavBadge } from "./app-layout-nav-badge";
import { AppLayoutNavControl, useResolvedActive } from "./app-layout-nav-control";

/**
 * A row inside an `AppLayoutNavSubmenu`, with the options of an item except `tooltip`. It reports
 * whether it is active, so the submenu is marked active and opens. While the sidebar is collapsed
 * it is shown in the submenu's flyout menu, without badge or actions; `className` and other
 * element attributes are not applied there.
 *
 * ```tsx
 * <AppLayoutNavSubItem label={t("nav.reports")} href="/sales/reports" />
 * ```
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
    if (asChild) {
      // The consumer's element is the menu entry, so choosing it does what it does when expanded.
      return (
        <DropdownMenuItem
          asChild
          disabled={disabled}
          onSelect={onSelect}
          onClickCapture={
            disabled
              ? (event: MouseEvent) => {
                  event.preventDefault();
                  event.stopPropagation();
                }
              : undefined
          }
          data-active={resolvedActive}
        >
          <Slot.Root aria-current={resolvedActive ? "page" : undefined}>
            {icon ? (
              <span aria-hidden="true" className="contents">
                {icon}
              </span>
            ) : null}
            <Slot.Slottable>{children}</Slot.Slottable>
            {label}
          </Slot.Root>
        </DropdownMenuItem>
      );
    }
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
