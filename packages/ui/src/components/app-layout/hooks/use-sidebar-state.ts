import { useCallback, useEffect, useMemo, useState } from "react";
import { useControllableState, useMediaQuery } from "@/internal/hooks";
import type { AppLayoutProps, AppLayoutSide } from "../types";
import { readPersistedState, writePersistedState } from "../utils";

type SidebarStateOptions = Pick<
  AppLayoutProps,
  | "open"
  | "defaultOpen"
  | "onOpenChange"
  | "mobileOpen"
  | "defaultMobileOpen"
  | "onMobileOpenChange"
  | "side"
  | "defaultSide"
  | "onSideChange"
  | "breakpoint"
  | "persistKey"
>;

/**
 * The sidebar's three states (desktop open, sheet open, side), each controllable, plus whether the
 * viewport is below the breakpoint. With `persistKey`, the stored desktop state and side are the
 * initial uncontrolled values (no change callback is called for them) and every change is saved.
 */
export function useSidebarState({
  open: openProp,
  defaultOpen = true,
  onOpenChange,
  mobileOpen: mobileOpenProp,
  defaultMobileOpen = false,
  onMobileOpenChange,
  side: sideProp,
  defaultSide = "start",
  onSideChange,
  breakpoint = 768,
  persistKey,
}: SidebarStateOptions) {
  // Read once, on the first render: the stored values replace the defaults.
  const [persisted] = useState(() => readPersistedState(persistKey));

  const [open, setOpen] = useControllableState({
    value: openProp,
    defaultValue: persisted?.open ?? defaultOpen,
    onChange: onOpenChange,
  });
  const [mobileOpen, setMobileOpen] = useControllableState({
    value: mobileOpenProp,
    defaultValue: defaultMobileOpen,
    onChange: onMobileOpenChange,
  });
  const [side, setSide] = useControllableState<AppLayoutSide>({
    value: sideProp,
    defaultValue: persisted?.side ?? defaultSide,
    onChange: onSideChange,
  });

  const isDesktop = useMediaQuery(`(min-width: ${breakpoint}px)`, true);
  const isMobile = !isDesktop;

  useEffect(() => {
    if (persistKey) writePersistedState(persistKey, { open, side });
  }, [persistKey, open, side]);

  const toggle = useCallback(() => {
    if (isMobile) setMobileOpen(!mobileOpen);
    else setOpen(!open);
  }, [isMobile, mobileOpen, open, setMobileOpen, setOpen]);

  return useMemo(
    () => ({ open, setOpen, mobileOpen, setMobileOpen, side, setSide, isMobile, toggle }),
    [open, setOpen, mobileOpen, setMobileOpen, side, setSide, isMobile, toggle],
  );
}
