import type { ToastObject } from "@base-ui/react/toast";
import { useEffect } from "react";
import type { ToastData } from "../types";
import { toTimeout } from "../utils/helpers";
import { toastManager } from "../utils/libs";

/**
 * An expanded toast is being read, so it must not close by itself. Returns what gives it its
 * duration back, from the start, when it is collapsed.
 */
export function useExpandedDuration(toast: ToastObject<ToastData>, expanded: boolean) {
  const { id, timeout, updateKey } = toast;
  // `updateKey` runs it again after the toast is replaced, which gives it a new timer.
  // biome-ignore lint/correctness/useExhaustiveDependencies: updateKey is a trigger, not a value read
  useEffect(() => {
    if (expanded && timeout !== 0) toastManager.update(id, { timeout: 0 });
  }, [id, expanded, timeout, updateKey]);
  return () => toastManager.update(id, { timeout: toTimeout(toast.data?.duration) });
}
