import type { FileFieldMultipleProps, FileFieldSingleProps } from "@/components/file-field";
import type { ControlBaseProps, DistributiveOmit } from "@/internal/types";

/** Field props that come from the surrounding form instead. */
type FormOwned = "name" | "value" | "defaultValue" | "error" | "errorMessage" | "disabled";

/** `FileControl` holding one file: the form stores an item or `null`. */
export type FileControlSingleProps<E> = ControlBaseProps &
  DistributiveOmit<FileFieldSingleProps<E>, FormOwned>;

/** `FileControl` holding several files: the form stores an array of items. */
export type FileControlMultipleProps<E> = ControlBaseProps &
  DistributiveOmit<FileFieldMultipleProps<E>, FormOwned>;

/**
 * Props of `FileControl`: the field `name` and binding options, plus every `FileField` prop except
 * the value and error, which come from the surrounding form. Update forms put the stored files in
 * the form's `defaultValues` (see `toExistingFiles`).
 */
export type FileControlProps<E = unknown> = FileControlSingleProps<E> | FileControlMultipleProps<E>;
