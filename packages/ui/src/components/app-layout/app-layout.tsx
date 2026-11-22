import { cn } from "cn";
import { useCallback, useId, useMemo, useRef, useState } from "react";
import { useInheritedDirection } from "@/internal/hooks";
import { TooltipProvider } from "@/shadcn/ui/tooltip";
import { AppLayoutSkipLink } from "./components/app-layout-skip-link";
import {
  AppLayoutBreadcrumbContext,
  AppLayoutContext,
  type AppLayoutContextValue,
  AppLayoutTopbarContext,
  type SidebarConfig,
  useBreadcrumbState,
  useKeyboardShortcut,
  useSidebarState,
} from "./hooks";
import type { AppLayoutProps } from "./types";
import { resolvePhysicalSide, rootClassName, rootInsetClassName } from "./utils";

const DEFAULT_SIDEBAR: SidebarConfig = { variant: "sidebar", collapsible: "icon" };

/**
 * An application shell: a navigation sidebar (a sheet below `breakpoint`), and an inset area with
 * a top bar and a main area that scrolls on its own. `AppLayout` holds the sidebar state, the
 * side, the breadcrumb trail and the link settings; compose it with `AppLayoutSidebar` and
 * `AppLayoutInset`. The document body never scrolls. It renders no text of its own.
 */
export function AppLayout({
  children,
  className,
  open,
  defaultOpen,
  onOpenChange,
  mobileOpen,
  defaultMobileOpen,
  onMobileOpenChange,
  side,
  defaultSide,
  onSideChange,
  breakpoint,
  keyboardShortcut,
  persistKey,
  closeMobileOnNavigate = true,
  renderLink,
  isActive,
  defaultBreadcrumb,
  skipLinkLabel,
  ...rest
}: AppLayoutProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const direction = useInheritedDirection(rootRef) ?? "ltr";
  const sidebarState = useSidebarState({
    open,
    defaultOpen,
    onOpenChange,
    mobileOpen,
    defaultMobileOpen,
    onMobileOpenChange,
    side,
    defaultSide,
    onSideChange,
    breakpoint,
    persistKey,
  });
  useKeyboardShortcut(keyboardShortcut, sidebarState.toggle);

  const [sidebarConfig, setSidebarConfig] = useState<SidebarConfig>(DEFAULT_SIDEBAR);
  const registerSidebar = useCallback((config: SidebarConfig) => {
    setSidebarConfig((current) =>
      current.variant === config.variant && current.collapsible === config.collapsible
        ? current
        : config,
    );
  }, []);

  const breadcrumb = useBreadcrumbState(defaultBreadcrumb);
  const [actionsTarget, setActionsTarget] = useState<HTMLElement | null>(null);
  const topbar = useMemo(
    () => ({ target: actionsTarget, setTarget: setActionsTarget }),
    [actionsTarget],
  );

  const sidebarId = useId();
  const mainId = useId();
  const mainRef = useRef<HTMLElement | null>(null);
  const state =
    sidebarConfig.collapsible === "none" || sidebarState.open ? "expanded" : "collapsed";

  const value = useMemo<AppLayoutContextValue>(
    () => ({
      ...sidebarState,
      physicalSide: resolvePhysicalSide(sidebarState.side, direction),
      direction,
      state,
      variant: sidebarConfig.variant,
      collapsible: sidebarConfig.collapsible,
      registerSidebar,
      closeMobileOnNavigate,
      renderLink,
      isActive,
      sidebarId,
      mainId,
      mainRef,
    }),
    [
      sidebarState,
      direction,
      state,
      sidebarConfig,
      registerSidebar,
      closeMobileOnNavigate,
      renderLink,
      isActive,
      sidebarId,
      mainId,
    ],
  );

  return (
    <AppLayoutContext.Provider value={value}>
      <AppLayoutBreadcrumbContext.Provider value={breadcrumb}>
        <AppLayoutTopbarContext.Provider value={topbar}>
          <TooltipProvider delayDuration={0}>
            <div
              ref={rootRef}
              data-slot="app-layout"
              data-state={state}
              data-side={sidebarState.side}
              data-variant={sidebarConfig.variant}
              data-mobile={sidebarState.isMobile || undefined}
              className={cn(
                rootClassName,
                sidebarConfig.variant === "inset" && !sidebarState.isMobile && rootInsetClassName,
                className,
              )}
              {...rest}
            >
              {skipLinkLabel ? <AppLayoutSkipLink label={skipLinkLabel} /> : null}
              {children}
            </div>
          </TooltipProvider>
        </AppLayoutTopbarContext.Provider>
      </AppLayoutBreadcrumbContext.Provider>
    </AppLayoutContext.Provider>
  );
}
