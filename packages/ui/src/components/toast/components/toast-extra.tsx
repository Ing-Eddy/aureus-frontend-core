import type { ToastData } from "../types";
import { toastExtraClassName } from "../utils/constants";
import { createToastContext } from "../utils/helpers";

/** The consumer's own content under the description, which keeps its drags and presses. */
export function ToastExtra({ id, content }: { id: string; content: ToastData["content"] }) {
  const node = typeof content === "function" ? content(createToastContext(id)) : content;
  if (node === undefined || node === null || node === false) return null;
  return (
    <div data-slot="toast-extra" data-base-ui-swipe-ignore="" className={toastExtraClassName}>
      {node}
    </div>
  );
}
