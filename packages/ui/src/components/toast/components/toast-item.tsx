import { Toast, type ToastObject } from "@base-ui/react/toast";
import { useRef } from "react";
import { useInheritedDirection } from "@/internal/hooks";
import { cn } from "@/shadcn/lib/utils";
import { useToasterContext } from "../hooks";
import type { ToastData } from "../types";
import { toastContentClassName } from "../utils/constants";
import { resolveSwipeDirections } from "../utils/helpers";
import { ToastStandardBody } from "./toast-standard-body";

/** One notification: the engine's root and content around its layout. */
export function ToastItem({ toast }: { toast: ToastObject<ToastData> }) {
  const toaster = useToasterContext();
  const ref = useRef<HTMLDivElement>(null);
  const direction = useInheritedDirection(ref) ?? "ltr";
  const data = toast.data ?? {};
  return (
    <Toast.Root
      ref={ref}
      toast={toast}
      data-slot="toast"
      data-appearance={data.appearance ?? toaster.appearance}
      className={cn(data.className)}
      swipeDirection={resolveSwipeDirections(toaster.position, direction)}
    >
      <Toast.Content data-slot="toast-content" className={toastContentClassName}>
        <ToastStandardBody toast={toast} />
      </Toast.Content>
    </Toast.Root>
  );
}
