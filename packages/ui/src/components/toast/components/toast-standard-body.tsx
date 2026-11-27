import { Toast, type ToastObject } from "@base-ui/react/toast";
import type { ToastData, ToastStatus } from "../types";
import { toastBodyClassName, toastTitleButtonClassName } from "../utils/constants";
import { ToastActions } from "./toast-actions";
import { ToastCloseButton } from "./toast-close-button";
import { ToastDescription } from "./toast-description";
import { ToastIcon } from "./toast-icon";

/** What the standard layout renders. */
interface ToastStandardBodyProps {
  /** The toast to render. */
  toast: ToastObject<ToastData>;
  /** Present on a clickable toast: opens it, from the title button. */
  onActivate: (() => void) | undefined;
}

/** The standard layout: icon, then title, description and actions, then the close button. */
export function ToastStandardBody({ toast, onActivate }: ToastStandardBodyProps) {
  const data = toast.data ?? {};
  return (
    <>
      <ToastIcon status={toast.type as ToastStatus} icon={data.icon} />
      <div data-slot="toast-body" className={toastBodyClassName}>
        {data.iconLabel ? <span className="sr-only">{data.iconLabel}</span> : null}
        {/* A div instead of a heading, so notifications stay out of the page's outline. */}
        <Toast.Title data-slot="toast-title" className="typography-label" render={<div />}>
          {onActivate ? (
            <button
              type="button"
              data-slot="toast-click"
              className={toastTitleButtonClassName}
              onClick={onActivate}
            >
              {toast.title}
            </button>
          ) : (
            toast.title
          )}
        </Toast.Title>
        <ToastDescription toast={toast} />
        <ToastActions id={toast.id} actions={data.actions} />
      </div>
      <ToastCloseButton data={data} />
    </>
  );
}
