import { Toast } from "@base-ui/react/toast";
import { XIcon } from "lucide-react";
import { useMissingTexts } from "@/internal/hooks";
import { Button } from "@/shadcn/ui/button";
import { useToasterContext } from "../hooks";
import type { ToastData } from "../types";
import { toastCloseClassName } from "../utils/constants";

/** The close button, when the toast or its Toaster turns it on and one of them names it. */
export function ToastCloseButton({ data }: { data: ToastData }) {
  const toaster = useToasterContext();
  const shown = data.closeButton ?? toaster.closeButton;
  const label = data.closeLabel ?? toaster.closeLabel;
  useMissingTexts("toast", [[shown && !label, "`closeButton` needs `closeLabel`"]]);
  if (!shown || !label) return null;
  return (
    <Toast.Close
      data-slot="toast-close"
      aria-label={label}
      // Base UI hides it from readers while the stack is collapsed, but it stays focusable.
      aria-hidden={false}
      className={toastCloseClassName}
      render={<Button variant="ghost" size="icon-xs" />}
    >
      <XIcon aria-hidden="true" />
    </Toast.Close>
  );
}
