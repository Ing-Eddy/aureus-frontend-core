import type { ToastObject } from "@base-ui/react/toast";
import { useCallback, useEffect, useRef } from "react";
import type { ToastData } from "../types";
import { toTimeout } from "../utils/helpers";
import { toastManager } from "../utils/libs";

/**
 * An expanded toast is being read, so it must not close by itself. Returns what gives it its
 * duration back, from the start, when it is collapsed. It also gets it back if the expanded
 * description goes away, because the toast was changed.
 */
export function useExpandedDuration(toast: ToastObject<ToastData>, expanded: boolean) {
  const { id, timeout, updateKey } = toast;
  // `updateKey` runs it again after the toast is replaced, which gives it a new timer.
  // biome-ignore lint/correctness/useExhaustiveDependencies: updateKey is a trigger, not a value read
  useEffect(() => {
    if (expanded && timeout !== 0) toastManager.update(id, { timeout: 0 });
  }, [id, expanded, timeout, updateKey]);

  // The duration is read from the toast as it is then, which may be newer than this render.
  const restore = useCallback(
    () => toastManager.update(id, (previous) => ({ timeout: toTimeout(previous.data?.duration) })),
    [id],
  );
  const expandedRef = useRef(expanded);
  expandedRef.current = expanded;
  useEffect(
    () => () => {
      if (expandedRef.current) restore();
    },
    [restore],
  );
  return restore;
}
