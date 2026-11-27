import type { ToastExpandOptions, ToasterExpandOptions } from "../../types";

/** The expansion settings of one toast, its own values over its Toaster's. */
export function resolveExpandable(
  toaster: ToasterExpandOptions | undefined,
  own: false | ToastExpandOptions | undefined,
) {
  if (own === false || (!own && !toaster)) return undefined;
  return {
    lines: own?.lines ?? toaster?.lines ?? 2,
    defaultExpanded: own?.defaultExpanded ?? false,
    expandLabel: own?.expandLabel ?? toaster?.expandLabel,
    collapseLabel: own?.collapseLabel ?? toaster?.collapseLabel,
  };
}
