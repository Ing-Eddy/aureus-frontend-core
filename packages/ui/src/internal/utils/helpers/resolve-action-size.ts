import { isValidElement, type ReactNode } from "react";
import type { FieldActionSize } from "@/internal/types";

/**
 * Size of the action button: the explicit one if given, `icon-xs` when the content is a single
 * element (an icon), `xs` for text or mixed content.
 */
export function resolveActionSize(children: ReactNode, size?: FieldActionSize): FieldActionSize {
  if (size) return size;
  return isValidElement(children) ? "icon-xs" : "xs";
}
