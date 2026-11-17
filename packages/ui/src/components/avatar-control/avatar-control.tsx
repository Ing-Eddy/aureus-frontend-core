import type { FocusEvent, ReactElement } from "react";
import { AvatarField, type AvatarFieldProps } from "@/components/avatar-field";
import { ControlField } from "@/internal/components";
import type { FileItem } from "@/internal/types";
import { mapControllerToValueField } from "@/internal/utils/helpers";
import type { AvatarControlProps } from "./avatar-control-types";

type PhotoValue = FileItem<unknown> | null;

/**
 * `AvatarField` bound to the surrounding react-hook-form form. Render it inside a `FormProvider`:
 * the form holds the photo item (or `null`), and its validation message is shown as helper text.
 */
export function AvatarControl<E = unknown>(props: AvatarControlProps<E>): ReactElement;
export function AvatarControl({
  name,
  disabled,
  shouldUnregister,
  onBlur,
  ref,
  ...fieldProps
}: AvatarControlProps<unknown>): ReactElement {
  return (
    <ControlField
      componentName="AvatarControl"
      name={name}
      disabled={disabled}
      shouldUnregister={shouldUnregister}
      render={(context) => {
        const mapped = mapControllerToValueField<HTMLInputElement, PhotoValue>(
          context,
          {
            onValueChange: fieldProps.onValueChange as ((value: PhotoValue) => void) | undefined,
            onBlur: onBlur as ((event: FocusEvent<HTMLInputElement>) => void) | undefined,
            ref,
          },
          null,
        );
        // The union is checked at the call site; inside, the props are the field's own.
        const props = {
          ...fieldProps,
          ...mapped,
          disabled: mapped.disabled || disabled,
        } as unknown as AvatarFieldProps<unknown>;
        return <AvatarField {...props} />;
      }}
    />
  );
}
