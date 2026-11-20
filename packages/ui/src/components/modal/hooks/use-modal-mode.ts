import { useEffect, useRef } from "react";
import { useMediaQuery } from "@/internal/hooks";
import type { ModalMode, ModalModeSetting } from "../types";

export interface UseModalModeOptions {
  mode: ModalModeSetting;
  breakpoint: number;
  lockModeWhileOpen: boolean;
  open: boolean;
  onModeChange?: (mode: ModalMode) => void;
}

/**
 * The presentation to render. A responsive modal is a dialog from `breakpoint` up, and a dialog
 * when the width cannot be measured (server, no `matchMedia`). With `lockModeWhileOpen`, the mode
 * the modal opened with is kept until it closes.
 */
export function useModalMode({
  mode,
  breakpoint,
  lockModeWhileOpen,
  open,
  onModeChange,
}: UseModalModeOptions): ModalMode {
  const wide = useMediaQuery(`(min-width: ${breakpoint}px)`, true);
  const live: ModalMode = mode === "responsive" ? (wide ? "dialog" : "drawer") : mode;

  const lockedRef = useRef(live);
  if (!(lockModeWhileOpen && open)) lockedRef.current = live;
  const resolved = lockedRef.current;

  const onModeChangeRef = useRef(onModeChange);
  onModeChangeRef.current = onModeChange;
  const reportedRef = useRef(resolved);
  useEffect(() => {
    if (reportedRef.current === resolved) return;
    reportedRef.current = resolved;
    onModeChangeRef.current?.(resolved);
  }, [resolved]);

  return resolved;
}
