import { cn } from "cn";
import type { ReactNode } from "react";
import { menuBadgeClassName, menuBadgeOffsetClassName } from "../utils";

/** A row's badge, beside the actions button when there is one. */
export function AppLayoutNavBadge({
  badge,
  withActions,
  sub = false,
}: {
  badge: ReactNode;
  withActions: boolean;
  sub?: boolean;
}) {
  return (
    <span
      data-slot="app-layout-nav-badge"
      className={cn(menuBadgeClassName, menuBadgeOffsetClassName(withActions), sub && "top-1")}
    >
      {badge}
    </span>
  );
}
