import { Toast } from "@base-ui/react/toast";
import { isDev } from "@/internal/utils/constants";
import type { ToastData } from "../../types";

/**
 * The one Base UI manager of the library, so `toast` works outside React. Base UI's manager has no
 * memory (a call made before a provider subscribes is lost), so operations wait here until a
 * `Toaster` is connected, for example when a page shows a toast from its first effect.
 */
export const toastManager = Toast.createToastManager<ToastData>();

/** One call waiting for a Toaster. */
interface PendingOperation {
  id: string;
  run: () => void;
}

let connected = 0;
let pending: PendingOperation[] = [];

/** Runs an operation on toast `id` now, or when a Toaster connects. */
export function dispatchToast(id: string, run: () => void) {
  if (connected > 0) run();
  else pending.push({ id, run });
}

/** Closes one toast or all of them; before a Toaster connects it forgets their operations. */
export function closeToast(id?: string) {
  if (connected > 0) toastManager.close(id);
  else pending = id === undefined ? [] : pending.filter((operation) => operation.id !== id);
}

/**
 * Called by `Toaster` once its provider has subscribed. Delivers what was waiting and returns the
 * disconnection.
 */
export function connectToaster(): () => void {
  connected += 1;
  if (connected > 1 && isDev) {
    console.warn(
      "toast: more than one `Toaster` is mounted, so every toast appears in each of them. Mount one.",
    );
  }
  const waiting = pending;
  pending = [];
  for (const operation of waiting) operation.run();
  return () => {
    connected -= 1;
  };
}
