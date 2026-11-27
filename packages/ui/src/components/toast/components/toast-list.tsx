import { Toast } from "@base-ui/react/toast";
import type { ToastData } from "../types";
import { ToastItem } from "./toast-item";

/** Every toast the engine holds, newest first. */
export function ToastList() {
  const { toasts } = Toast.useToastManager<ToastData>();
  return toasts.map((toast) => <ToastItem key={toast.id} toast={toast} />);
}
