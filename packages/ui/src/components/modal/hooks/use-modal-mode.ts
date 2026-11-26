import { useEffect, useRef } from "react";
import { useMediaQuery } from "@/internal/hooks";
import type { ModalMode, ModalModeSetting } from "../types";

/** Options of `useModalMode`. */
export interface UseModalModeOptions {
  /** The `mode` prop. */
  mode: ModalModeSetting;
  /** Viewport width from which a responsive modal is a dialog. */
  breakpoint: number;
  /** Keeps the current mode while `open`. */
  lockModeWhileOpen: boolean;
  /** Whether the modal is open. */
  open: boolean;
  /** Called when the returned mode changes, not on mount. */
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
