import type { ReactElement } from "react";
import { Controller } from "react-hook-form";
import { useRequiredFormContext, useUnknownFieldWarning } from "@/internal/hooks";
import type { ControlBaseProps } from "@/internal/types";
import type { ControllerContext } from "@/internal/utils/helpers";

/** Props of `ControlField`: the control's binding props plus how to render the field. */
export interface ControlFieldProps extends ControlBaseProps {
  /** Name used in error messages and warnings, e.g. `"TextControl"`. */
  componentName: string;
  /** Renders the field from react-hook-form's state. */
  render: (context: ControllerContext) => ReactElement;
}

/**
 * Binds a field to the surrounding react-hook-form form: takes `control` from the `FormProvider`
 * context and renders a `Controller`. Every `*-control` is built on it.
 */
export function ControlField({
  componentName,
  name,
  disabled,
  shouldUnregister,
  render,
}: ControlFieldProps) {
  const { control } = useRequiredFormContext(componentName);
  useUnknownFieldWarning(control, name, componentName);

  return (
    <Controller
      control={control}
      name={name}
      disabled={disabled}
      shouldUnregister={shouldUnregister}
      render={({ field, fieldState }) => render({ field, fieldState })}
    />
  );
}
