import { cn } from "cn";
import { Separator } from "@/shadcn/ui/separator";
import { useAppLayoutContext, useAppLayoutTopbarContext, useAppLayoutWarnings } from "../hooks";
import type { AppLayoutBreadcrumbDisplay, AppLayoutTopbarProps } from "../types";
import { topbarActionsClassName, topbarClassName, topbarDividerClassName } from "../utils";
import { AppLayoutBreadcrumb } from "./app-layout-breadcrumb";
import { AppLayoutSidebarTrigger } from "./app-layout-sidebar-trigger";

/**
 * The bar at the top of the inset area: the sidebar trigger, the breadcrumb, the consumer's
 * `children`, and an actions area at the end. The actions area holds what pages add with
 * `AppLayoutTopbarActions`, followed by `actions`.
 *
 * ```tsx
 * <AppLayoutTopbar
 *   triggerLabel={t("layout.toggle")}
 *   breadcrumbLabel={t("layout.breadcrumb")}
 *   breadcrumb={{ maxItems: 4, ellipsisLabel: t("layout.more") }}
 *   divider
 *   actions={<UserMenu />}
 * />
 * ```
 */
export function AppLayoutTopbar({
  trigger = true,
  triggerLabel,
  breadcrumb = true,
  breadcrumbLabel,
  divider = false,
  actions,
  children,
  className,
  ...rest
}: AppLayoutTopbarProps) {
  useAppLayoutContext("AppLayoutTopbar");
  const { setTarget } = useAppLayoutTopbarContext("AppLayoutTopbar");
  const display: AppLayoutBreadcrumbDisplay | undefined =
    typeof breadcrumb === "object" ? breadcrumb : undefined;
  useAppLayoutWarnings([
    [
      trigger !== false && !triggerLabel,
      "AppLayoutTopbar needs `triggerLabel` unless `trigger` is false",
    ],
    [
      breadcrumb !== false && !breadcrumbLabel,
      "AppLayoutTopbar needs `breadcrumbLabel` unless `breadcrumb` is false",
    ],
  ]);
  return (
    <header data-slot="app-layout-topbar" className={cn(topbarClassName, className)} {...rest}>
      {trigger !== false && triggerLabel ? <AppLayoutSidebarTrigger label={triggerLabel} /> : null}
      {divider ? <Separator orientation="vertical" className={topbarDividerClassName} /> : null}
      {breadcrumb !== false && breadcrumbLabel ? (
        <AppLayoutBreadcrumb label={breadcrumbLabel} {...(display as AppLayoutBreadcrumbDisplay)} />
      ) : null}
      {children}
      <div data-slot="app-layout-topbar-actions" className={topbarActionsClassName}>
        <div ref={setTarget} data-slot="app-layout-topbar-actions-slot" className="contents" />
        {actions}
      </div>
    </header>
  );
}
