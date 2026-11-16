import type { ComponentProps } from "react";
import type { FieldActionProps, FieldBaseProps, FieldTexts } from "@/internal/types";

/**
 * Props of `TextField`: the shared field props, an optional integrated `action`, and every other
 * native `<input>` prop (`value`, `defaultValue`, `onChange`, `placeholder`, `name`, `ref`…).
 * There is no `type`: the input is always `type="text"`. Other input types (email, password,
 * number…) bring their own browser behaviour and belong to dedicated fields. `loading` requires
 * `loadingLabel` and `info` requires `infoLabel`; no text is generated.
 */
export type TextFieldProps = FieldBaseProps &
  FieldTexts &
  Omit<
    ComponentProps<"input">,
    "type" | "size" | "disabled" | "required" | "className" | "children"
  > & {
    /** Button inside the input frame, on its inline-end side. */
    action?: FieldActionProps;
  };
