import type { FocusEvent, ReactElement } from "react";
import { FileField, type FileFieldProps, type FileItem } from "@/components/file-field";
import { ControlField } from "@/internal/components";
import { mapControllerToValueField } from "@/internal/utils/helpers";
import type {
  FileControlMultipleProps,
  FileControlProps,
  FileControlSingleProps,
} from "./file-control-types";

/** A file field's value: one item, a list or `null`. */
type FileValue = FileItem<unknown> | FileItem<unknown>[] | null;

/**
 * `FileField` bound to the surrounding react-hook-form form. Render it inside a `FormProvider`:
 * the form holds the file items (`[]` or `null` when empty), and its validation message is shown
 * as helper text. With `upload`, a schema can block the submit while uploads are pending
 * (`hasPendingUploads`).
 *
 * ```tsx
 * // Inside <FormProvider {...form}>.
 * <FileControl
 *   name="logo"
 *   label={t("company.logo")}
 *   accept="image/*"
 *   chooseLabel={t("files.choose")}
 *   removeLabel={(name) => t("files.remove", { name })}
 *   getFileInfo={(stored: Attachment) => ({ name: stored.name, url: stored.url })}
 * />
 * ```
 */
export function FileControl<E = unknown>(props: FileControlMultipleProps<E>): ReactElement;
/**
 * Without `multiple`: the form stores one item or `null`. See the first signature for the whole
 * behaviour.
 */
export function FileControl<E = unknown>(props: FileControlSingleProps<E>): ReactElement;
export function FileControl({
  name,
  disabled,
  shouldUnregister,
  onBlur,
  ref,
  ...fieldProps
}: FileControlProps<unknown>): ReactElement {
  const multiple = fieldProps.multiple === true;
  return (
    <ControlField
      componentName="FileControl"
      name={name}
      disabled={disabled}
      shouldUnregister={shouldUnregister}
      render={(context) => {
        const mapped = mapControllerToValueField<HTMLInputElement, FileValue>(
          context,
          {
            onValueChange: fieldProps.onValueChange as ((value: FileValue) => void) | undefined,
            onBlur: onBlur as ((event: FocusEvent<HTMLInputElement>) => void) | undefined,
            ref,
          },
          multiple ? [] : null,
        );
        // The overloads are checked at the call site; inside, the props are the field's own union.
        const props = {
          ...fieldProps,
          ...mapped,
          disabled: mapped.disabled || disabled,
        } as unknown as FileFieldProps<unknown>;
        const Field = FileField as (props: FileFieldProps<unknown>) => ReactElement;
        return <Field {...props} />;
      }}
    />
  );
}
