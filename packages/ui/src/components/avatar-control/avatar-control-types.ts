import type { AvatarFieldProps } from "@/components/avatar-field";
import type { ControlBaseProps, DistributiveOmit } from "@/internal/types";

/** Field props that come from the surrounding form instead. */
type FormOwned = "name" | "value" | "defaultValue" | "error" | "errorMessage" | "disabled";

/**
 * Props of `AvatarControl`: the field `name` and binding options, plus every `AvatarField` prop
 * except the value and error, which come from the surrounding form. Update forms put the stored
 * photo in the form's `defaultValues` (see `toExistingFile`).
 */
export type AvatarControlProps<E = unknown> = ControlBaseProps &
  DistributiveOmit<AvatarFieldProps<E>, FormOwned>;
