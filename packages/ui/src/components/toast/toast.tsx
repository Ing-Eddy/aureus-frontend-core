import { Toast } from "@base-ui/react/toast";
import { useEffect, useMemo } from "react";
import { cn } from "@/shadcn/lib/utils";
import { ToastList } from "./components";
import { ToasterContext, type ToasterContextValue, useToasterWarnings } from "./hooks";
import type { ToasterProps } from "./types";
import { toTimeout } from "./utils/helpers";
import { connectToaster, toastManager } from "./utils/libs";

/**
 * Shows the notifications that `toast` creates. Mount it once, inside the app's providers: the
 * content of a toast renders here, with this place's React context. It renders no text of its own.
 * Pressing F6 moves the focus to the notifications.
 *
 * ```tsx
 * <Toaster
 *   label={t("toast.region")}
 *   closeButton
 *   closeLabel={t("toast.close")}
 *   expandable={{ expandLabel: t("toast.more"), collapseLabel: t("toast.less") }}
 * />
 * ```
 */
export function Toaster(props: ToasterProps) {
  const {
    label,
    position = "bottom-end",
    duration = 5000,
    limit = 3,
    appearance = "card",
    closeButton = false,
    closeLabel,
    expandable,
    icons,
    className,
  } = props;
  useToasterWarnings(props);
  // Effects of children run first, so the provider has subscribed to the manager by now.
  useEffect(() => connectToaster(), []);

  const context = useMemo<ToasterContextValue>(
    () => ({ position, appearance, closeButton, closeLabel, expandable, icons }),
    [position, appearance, closeButton, closeLabel, expandable, icons],
  );

  return (
    <Toast.Provider toastManager={toastManager} timeout={toTimeout(duration)} limit={limit}>
      <ToasterContext.Provider value={context}>
        <Toast.Portal>
          <Toast.Viewport
            data-slot="toast-viewport"
            data-position={position}
            aria-label={label}
            className={cn(className)}
          >
            <ToastList />
          </Toast.Viewport>
        </Toast.Portal>
      </ToasterContext.Provider>
    </Toast.Provider>
  );
}
