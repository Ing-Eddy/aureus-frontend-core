import type { ComponentProps, ReactNode } from "react";
import type { InputGroupButton } from "@/shadcn/ui/input-group";

/** Sizes that fit inside the input frame. `xs`/`sm` for text, `icon-xs`/`icon-sm` for icons. */
export type FieldActionSize = "xs" | "sm" | "icon-xs" | "icon-sm";

/**
 * The integrated button on the inline-end side of the input. Accepts every button prop
 * (`onClick`, `aria-label`, `variant`, `disabled`, `type`…).
 */
export type FieldActionProps = Omit<ComponentProps<typeof InputGroupButton>, "size"> & {
  /** Content of a tooltip shown on hover and focus. Not shown while the button is disabled. */
  tooltip?: ReactNode;
  /** Defaults to `icon-xs` when `children` is a single element (an icon), `xs` otherwise. */
  size?: FieldActionSize;
};
