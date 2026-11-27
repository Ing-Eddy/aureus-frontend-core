import { Button } from "@/shadcn/ui/button";
import type { ToastAction } from "../types";
import { toastActionsClassName } from "../utils/constants";
import { createToastContext, toast } from "../utils/helpers";

/** The buttons of a toast. Pressing one runs it and closes the toast unless it keeps it open. */
export function ToastActions({ id, actions }: { id: string; actions: ToastAction[] | undefined }) {
  if (!actions?.length) return null;
  return (
    <div data-slot="toast-actions" className={toastActionsClassName}>
      {actions.map((action, index) => (
        <Button
          // The list of a toast is replaced as a whole, so the position identifies each button.
          // biome-ignore lint/suspicious/noArrayIndexKey: actions have no id and are never reordered
          key={index}
          type="button"
          size="sm"
          variant={action.variant ?? "outline"}
          disabled={action.disabled}
          onClick={() => {
            action.onClick?.(createToastContext(id));
            if (!action.keepOpen) toast.dismiss(id);
          }}
        >
          {action.label}
        </Button>
      ))}
    </div>
  );
}
