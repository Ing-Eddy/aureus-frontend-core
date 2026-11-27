import type { ToastObject } from "@base-ui/react/toast";
import type { ReactNode } from "react";
import { isDev } from "@/internal/utils/constants";
import type { ToastData, ToastOptions, ToastStatus, ToastUpdate } from "../../types";

/** The engine's timeout: `Infinity` is its `0`, and `undefined` the Toaster's duration. */
export function toTimeout(duration: number | undefined): number | undefined {
  if (duration === undefined) return undefined;
  if (duration === Number.POSITIVE_INFINITY) return 0;
  if (duration > 0) return duration;
  if (isDev) {
    console.warn("toast: `duration` must be a positive number of milliseconds or `Infinity`.");
  }
  return undefined;
}

/**
 * A new toast for the engine. Every key is always written, so showing a toast with the id of an
 * open one replaces it completely instead of merging with it.
 */
export function toManagerOptions(
  id: string,
  status: ToastStatus,
  title: ReactNode,
  options: ToastOptions,
) {
  const { id: _id, description, priority = "low", onClose, onRemove, ...data } = options;
  return {
    id,
    type: status as string,
    title,
    description,
    timeout: toTimeout(data.duration),
    priority,
    onClose,
    onRemove,
    data: data as ToastData,
  };
}

/** The engine keys a patch may replace, besides `type` and `timeout`. */
const engineKeys = ["title", "description", "priority", "onClose", "onRemove"] as const;

/** A patch merged into the toast the engine holds. Only the keys present in the patch change. */
export function toManagerPatch(previous: ToastObject<ToastData>, patch: ToastUpdate) {
  const { status, title, description, priority, onClose, onRemove, ...dataPatch } = patch;
  const next: Record<string, unknown> = {};
  for (const key of engineKeys) {
    if (key in patch) next[key] = patch[key];
  }
  if ("status" in patch) next.type = status;
  if ("duration" in patch) next.timeout = toTimeout(patch.duration);
  const data: ToastData = { ...previous.data, ...dataPatch };
  // A status or a title only exist in the standard layout, so they leave the custom one.
  if ("status" in patch || "title" in patch) {
    data.render = undefined;
    data.ariaLabel = undefined;
  }
  next.data = data;
  return next;
}
