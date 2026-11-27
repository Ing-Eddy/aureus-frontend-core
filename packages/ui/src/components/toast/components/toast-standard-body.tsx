import { Toast, type ToastObject } from "@base-ui/react/toast";
import type { ToastData, ToastStatus } from "../types";
import { toastBodyClassName } from "../utils/constants";
import { ToastCloseButton } from "./toast-close-button";
import { ToastIcon } from "./toast-icon";

/** The standard layout: icon, then title and description, then the close button. */
export function ToastStandardBody({ toast }: { toast: ToastObject<ToastData> }) {
  const data = toast.data ?? {};
  return (
    <>
      <ToastIcon status={toast.type as ToastStatus} icon={data.icon} />
      <div data-slot="toast-body" className={toastBodyClassName}>
        {data.iconLabel ? <span className="sr-only">{data.iconLabel}</span> : null}
        {/* A div instead of a heading, so notifications stay out of the page's outline. */}
        <Toast.Title data-slot="toast-title" className="typography-label" render={<div />} />
        <Toast.Description
          data-slot="toast-description"
          className="typography-body-sm w-full"
          render={<div />}
        />
      </div>
      <ToastCloseButton data={data} />
    </>
  );
}
