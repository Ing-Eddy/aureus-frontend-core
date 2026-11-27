import { useToasterContext } from "../hooks";
import type { ToastStatus } from "../types";
import { toastIconClassName, toastIcons } from "../utils/constants";

/** The icon column: the toast's icon, else the Toaster's for the status, else the library's. */
export function ToastIcon({ status, icon }: { status: ToastStatus; icon: React.ReactNode }) {
  const { icons } = useToasterContext();
  const content = icon ?? icons?.[status] ?? toastIcons[status];
  if (!content) return null;
  return (
    <div data-slot="toast-icon" className={toastIconClassName}>
      {content}
    </div>
  );
}
