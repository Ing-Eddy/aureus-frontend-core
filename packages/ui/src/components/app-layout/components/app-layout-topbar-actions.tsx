import { createPortal } from "react-dom";
import { useAppLayoutTopbarContext } from "../hooks";
import type { AppLayoutTopbarActionsProps } from "../types";

/**
 * Renders its children in the top bar's actions area while it is mounted, from anywhere inside
 * the layout (usually a page). Several instances appear in mount order, before the top bar's own
 * `actions`. The children keep the React context of the place where they are written.
 */
export function AppLayoutTopbarActions({ children }: AppLayoutTopbarActionsProps) {
  const { target } = useAppLayoutTopbarContext("AppLayoutTopbarActions");
  if (!target) return null;
  return createPortal(
    <div data-slot="app-layout-topbar-actions-item" className="contents">
      {children}
    </div>,
    target,
  );
}
