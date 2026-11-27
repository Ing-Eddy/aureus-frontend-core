import { useMissingTexts } from "@/internal/hooks";
import type { ToastContentRender, ToastData } from "../types";
import { createToastContext } from "../utils/helpers";

/** The layout of a custom toast: only what its render function returns. */
export function ToastCustomBody({
  id,
  render,
  data,
}: {
  id: string;
  render: ToastContentRender;
  data: ToastData;
}) {
  useMissingTexts("toast", [[!data.ariaLabel, "`custom` needs `aria-label`"]]);
  return (
    <div data-slot="toast-custom" data-base-ui-swipe-ignore="">
      {render(createToastContext(id))}
    </div>
  );
}
