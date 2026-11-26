import { cn } from "cn";
import { ChevronRightIcon } from "lucide-react";
import { useCallback, useContext, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useControllableState } from "@/internal/hooks";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/shadcn/ui/collapsible";
import {
  NavListContext,
  SidebarPresentationContext,
  SubmenuContext,
  type SubmenuContextValue,
  useAppLayoutWarnings,
} from "../hooks";
import type { AppLayoutNavSubmenuProps } from "../types";
import {
  menuButtonClassName,
  menuButtonEndPadding,
  menuItemClassName,
  menuSubClassName,
  rowLabelClassName,
  submenuChevronClassName,
} from "../utils";
import { AppLayoutNavActionsMenu, hasVisibleActions } from "./app-layout-nav-actions";
import { AppLayoutNavBadge } from "./app-layout-nav-badge";
import { AppLayoutNavTooltip } from "./app-layout-nav-control";
import { AppLayoutNavFlyout } from "./app-layout-nav-flyout";
import { AppLayoutNavIcon } from "./app-layout-nav-icon";

/**
 * An expandable navigation row with `AppLayoutNavSubItem` children (two levels at most). It is
 * active when a sub-item is active, and an uncontrolled submenu opens when that happens. While the
 * sidebar is collapsed, activating it opens a flyout menu with the sub-items.
 *
 * ```tsx
 * <AppLayoutNavSubmenu label={t("nav.sales")} icon={<ChartIcon />}>
 *   <AppLayoutNavSubItem label={t("nav.invoices")} href="/sales/invoices" />
 *   <AppLayoutNavSubItem label={t("nav.reports")} href="/sales/reports" />
 * </AppLayoutNavSubmenu>
 * ```
 */
export function AppLayoutNavSubmenu({
  label,
  icon,
  badge,
  actions,
  showActionsOnHover = false,
  open,
  defaultOpen = false,
  onOpenChange,
  tooltip,
  children,
  className,
  ...rest
}: AppLayoutNavSubmenuProps) {
  const { collapsed } = useContext(SidebarPresentationContext);
  useAppLayoutWarnings([[!label, "AppLayoutNavSubmenu needs `label`, its accessible name"]]);
  const [isOpen, setOpen] = useControllableState({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });

  const [activeIds, setActiveIds] = useState<ReadonlySet<string>>(() => new Set());
  const reportActive = useCallback((id: string, active: boolean) => {
    setActiveIds((current) => {
      if (current.has(id) === active) return current;
      const next = new Set(current);
      if (active) next.add(id);
      else next.delete(id);
      return next;
    });
  }, []);
  const childActive = activeIds.size > 0;

  // An uncontrolled submenu opens when one of its sub-items becomes active.
  const wasActive = useRef(false);
  useLayoutEffect(() => {
    if (childActive && !wasActive.current && open === undefined && !isOpen) setOpen(true);
    wasActive.current = childActive;
  }, [childActive, open, isOpen, setOpen]);

  const listContext = useMemo<SubmenuContextValue>(
    () => ({ mode: "list", reportActive }),
    [reportActive],
  );
  const registryContext = useMemo<SubmenuContextValue>(
    () => ({ mode: "registry", reportActive }),
    [reportActive],
  );
  const flyoutContext = useMemo<SubmenuContextValue>(
    () => ({ mode: "flyout", reportActive }),
    [reportActive],
  );

  if (collapsed) {
    return (
      <li
        data-slot="app-layout-nav-submenu"
        data-active={childActive}
        className={cn(menuItemClassName, className)}
        {...rest}
      >
        <SubmenuContext.Provider value={flyoutContext}>
          <AppLayoutNavFlyout label={label} icon={icon} tooltip={tooltip} active={childActive}>
            {children}
          </AppLayoutNavFlyout>
        </SubmenuContext.Provider>
        {/* Keeps the sub-items reporting their active state while the flyout is closed. */}
        <SubmenuContext.Provider value={registryContext}>{children}</SubmenuContext.Provider>
      </li>
    );
  }

  const withActions = hasVisibleActions(actions, false);
  const withBadge = badge != null;
  return (
    <Collapsible asChild open={isOpen} onOpenChange={setOpen}>
      <li
        data-slot="app-layout-nav-submenu"
        data-active={childActive}
        className={cn(menuItemClassName, "group/submenu", className)}
        {...rest}
      >
        <AppLayoutNavTooltip label={label} tooltip={tooltip}>
          <CollapsibleTrigger asChild>
            <button
              type="button"
              data-slot="app-layout-nav-submenu-trigger"
              data-active={childActive}
              className={cn(menuButtonClassName, menuButtonEndPadding(withBadge, withActions))}
            >
              <AppLayoutNavIcon icon={icon} label={label} collapsed={false} />
              <span data-slot="app-layout-nav-label" className={rowLabelClassName}>
                {label}
              </span>
              <ChevronRightIcon aria-hidden className={submenuChevronClassName} />
            </button>
          </CollapsibleTrigger>
        </AppLayoutNavTooltip>
        {withBadge ? <AppLayoutNavBadge badge={badge} withActions={withActions} /> : null}
        {actions ? (
          <AppLayoutNavActionsMenu actions={actions} showOnHover={showActionsOnHover} />
        ) : null}
        {/* Always mounted, so sub-items can report their active state while it is closed. */}
        <CollapsibleContent forceMount hidden={!isOpen} data-slot="app-layout-nav-submenu-content">
          <NavListContext.Provider value={true}>
            <SubmenuContext.Provider value={listContext}>
              <ul data-slot="app-layout-nav-sub-menu" className={menuSubClassName}>
                {children}
              </ul>
            </SubmenuContext.Provider>
          </NavListContext.Provider>
        </CollapsibleContent>
      </li>
    </Collapsible>
  );
}
