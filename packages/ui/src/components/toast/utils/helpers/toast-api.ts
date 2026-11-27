import { isValidElement, type ReactNode } from "react";
import type { ToastApi, ToastPromiseContent, ToastStatus, ToastStatusMethod } from "../../types";
import { closeToast, dispatchToast, toastManager } from "../libs";
import { createToastId } from "./create-toast-id";
import { toManagerOptions, toManagerPatch, toTimeout } from "./to-manager-options";

function statusMethod(status: ToastStatus): ToastStatusMethod {
  return (title, options = {}) => {
    const id = options.id ?? createToastId();
    dispatchToast(id, () => toastManager.add(toManagerOptions(id, status, title, options)));
    return id;
  };
}

/** Tells a `{ title, ...options }` state of `toast.promise` from a bare title, which may be JSX. */
function isPromiseContent(value: unknown): value is ToastPromiseContent {
  return typeof value === "object" && value !== null && !isValidElement(value) && "title" in value;
}

/** Shows one state of a promise, replacing the previous one. */
function showState(id: string, status: ToastStatus, state: ReactNode | ToastPromiseContent) {
  const { title, ...options } = isPromiseContent(state) ? state : { title: state };
  statusMethod(status)(title, { ...options, id });
}

/**
 * Shows notifications from anywhere, also outside React. A `Toaster` must be mounted once in the
 * app; calls made before it mounts are delivered when it does.
 *
 * ```ts
 * toast.success(t("invoice.saved"), { description: t("invoice.savedDetail") });
 * toast.neutral(t("item.deleted"), {
 *   actions: [{ label: t("common.undo"), onClick: () => restore(item.id) }],
 * });
 * ```
 */
export const toast: ToastApi = {
  neutral: statusMethod("neutral"),
  success: statusMethod("success"),
  info: statusMethod("info"),
  warning: statusMethod("warning"),
  danger: statusMethod("danger"),
  loading: statusMethod("loading"),
  custom(render, options) {
    const id = options.id ?? createToastId();
    const {
      id: _id,
      onClose,
      onRemove,
      "aria-label": ariaLabel,
      duration = Number.POSITIVE_INFINITY,
      ...data
    } = options;
    dispatchToast(id, () =>
      toastManager.add({
        id,
        type: "neutral",
        title: undefined,
        description: undefined,
        timeout: toTimeout(duration),
        priority: "low",
        onClose,
        onRemove,
        data: { ...data, duration, render, ariaLabel },
      }),
    );
    return id;
  },
  promise(promise, options) {
    const id = createToastId();
    showState(id, "loading", options.loading);
    // The outcome is shown even when the loading toast was dismissed: a failure must not be lost.
    promise.then(
      (value) => {
        const { success } = options;
        showState(id, "success", typeof success === "function" ? success(value) : success);
      },
      (error: unknown) => {
        const { danger } = options;
        showState(id, "danger", typeof danger === "function" ? danger(error) : danger);
      },
    );
    return id;
  },
  update(id, patch) {
    dispatchToast(id, () => toastManager.update(id, (previous) => toManagerPatch(previous, patch)));
  },
  dismiss(id) {
    closeToast(id);
  },
};
