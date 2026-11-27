import { Toast, type ToastObject } from "@base-ui/react/toast";
import { useRef } from "react";
import { useInheritedDirection } from "@/internal/hooks";
import { cn } from "@/shadcn/lib/utils";
import { useToastClick, useToasterContext } from "../hooks";
import type { ToastData } from "../types";
import { toastContentClassName } from "../utils/constants";
import { resolveSwipeDirections } from "../utils/helpers";
import { ToastCustomBody } from "./toast-custom-body";
import { ToastStandardBody } from "./toast-standard-body";

/** One notification: the engine's root and content around the standard or the custom layout. */
export function ToastItem({ toast }: { toast: ToastObject<ToastData> }) {
  const toaster = useToasterContext();
  const ref = useRef<HTMLDivElement>(null);
  const direction = useInheritedDirection(ref) ?? "ltr";
  const data = toast.data ?? {};
  // Handled by the root, not the content: while swiping, the engine captures the pointer on the
  // root, so the browser sends the click there.
  const click = useToastClick(toast.id, data);
  return (
    <Toast.Root
      ref={ref}
      toast={toast}
      data-slot="toast"
      data-appearance={data.appearance ?? toaster.appearance}
      aria-label={data.ariaLabel}
      className={cn(data.className)}
      swipeDirection={resolveSwipeDirections(toaster.position, direction)}
      data-clickable={click.activate ? "" : undefined}
      {...click.rootProps}
    >
      <Toast.Content
        data-slot="toast-content"
        className={data.render ? undefined : toastContentClassName}
      >
        {data.render ? (
          <ToastCustomBody id={toast.id} render={data.render} data={data} />
        ) : (
          <ToastStandardBody toast={toast} onActivate={click.activate} />
        )}
      </Toast.Content>
    </Toast.Root>
  );
}
