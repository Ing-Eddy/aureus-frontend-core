import { cn } from "cn";
import { useContext } from "react";
import { SidebarPresentationContext, useAppLayoutWarnings } from "../hooks";
import type { AppLayoutNavItemProps } from "../types";
import { menuButtonEndPadding, menuItemClassName } from "../utils";
import { AppLayoutNavActionsMenu, hasVisibleActions } from "./app-layout-nav-actions";
import { AppLayoutNavBadge } from "./app-layout-nav-badge";
import {
  AppLayoutNavControl,
  AppLayoutNavTooltip,
  useResolvedActive,
} from "./app-layout-nav-control";

/**
 * A simple navigation row: a link (`href`) or a button (`onSelect`), with an optional icon, badge
 * and "more actions" menu. While the sidebar is collapsed it shows only its icon (or the first
 * letter of `label`) and the label as a tooltip. Place it inside an `AppLayoutNavGroup`.
 *
 * ```tsx
 * <AppLayoutNavItem
 *   label={t("nav.invoices")}
 *   icon={<ReceiptIcon />}
 *   href="/invoices"
 *   badge={pending}
 *   actions={{
 *     label: t("nav.moreActions"),
 *     items: [{ id: "new", label: t("nav.newInvoice"), onSelect: createInvoice }],
 *   }}
 * />
 * ```
 */
export function AppLayoutNavItem({
  label,
  icon,
  href,
  onSelect,
  active,
  disabled,
  badge,
  tooltip,
  actions,
  showActionsOnHover = false,
  asChild = false,
  children,
  className,
  ...rest
}: AppLayoutNavItemProps) {
  const { collapsed } = useContext(SidebarPresentationContext);
  useAppLayoutWarnings([[!label, "AppLayoutNavItem needs `label`, its accessible name"]]);
  const resolvedActive = useResolvedActive(active, href);
  const withActions = hasVisibleActions(actions, collapsed);
  const withBadge = !collapsed && badge != null;
  return (
    <li
      data-slot="app-layout-nav-item"
      data-active={resolvedActive}
      className={cn(menuItemClassName, className)}
      {...rest}
    >
      <AppLayoutNavTooltip label={label} tooltip={tooltip}>
        <AppLayoutNavControl
          kind="item"
          label={label}
          icon={icon}
          href={href}
          onSelect={onSelect}
          active={resolvedActive}
          disabled={disabled}
          asChild={asChild}
          collapsed={collapsed}
          className={menuButtonEndPadding(withBadge, withActions)}
        >
          {children}
        </AppLayoutNavControl>
      </AppLayoutNavTooltip>
      {withBadge ? <AppLayoutNavBadge badge={badge} withActions={withActions} /> : null}
      {actions ? (
        <AppLayoutNavActionsMenu actions={actions} showOnHover={showActionsOnHover} />
      ) : null}
    </li>
  );
}
