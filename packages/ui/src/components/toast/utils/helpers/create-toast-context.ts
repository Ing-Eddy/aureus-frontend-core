import type { ToastContext } from "../../types";
import { toast } from "./toast-api";

/** What the handlers and the content of one toast receive to act on it. */
export function createToastContext(id: string): ToastContext {
  return {
    id,
    dismiss: () => toast.dismiss(id),
    update: (patch) => toast.update(id, patch),
  };
}
