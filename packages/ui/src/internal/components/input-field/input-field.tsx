import type { ComponentProps, ReactNode } from "react";
import { FieldAction } from "@/internal/components/field-action";
import { FieldLoading } from "@/internal/components/field-loading";
import { FieldShell } from "@/internal/components/field-shell";
import { useFieldA11y } from "@/internal/hooks";
import type { FieldActionProps, FieldBaseProps, FieldStatusInternal } from "@/internal/types";
import { fieldAddonClassName, fieldFrameClassName } from "@/internal/utils/constants";
import { cn } from "@/shadcn/lib/utils";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/shadcn/ui/input-group";

/** Props of `InputField`: the shared field props, native input attributes and the frame's slots. */
export type InputFieldProps = FieldBaseProps &
  FieldStatusInternal &
  Omit<
    ComponentProps<"input">,
    "type" | "size" | "disabled" | "required" | "className" | "children"
  > & {
    /** Name of the public field, for development warnings. */
    componentName: string;
    /** The input type. Set by the public field, never by its consumer. */
    type: "text" | "password";
    /** Button inside the input frame, on its inline-end side. */
    action?: FieldActionProps;
    /** Content before the input (decrease button, currency, prefix). */
    startSlot?: ReactNode;
    /** Content at the start of the inline-end addon, before the spinner and the action (suffix). */
    inputEndSlot?: ReactNode;
    /** Content after the inline-end addon, at the very end of the frame (step buttons). */
    endSlot?: ReactNode;
  };

/**
 * The single-line view every input field shares: field shell (label, info, helper), input frame,
 * input, and an inline-end addon with the loading spinner and the action. Public fields only
 * choose the input type and the action, so they all look the same.
 */
export function InputField({
  label,
  required,
  loading,
  disabled,
  info,
  helperText,
  error,
  errorMessage,
  className,
  classNames,
  loadingLabel,
  infoLabel,
  action,
  startSlot,
  inputEndSlot,
  endSlot,
  componentName,
  type,
  id,
  "aria-describedby": describedBy,
  ...inputProps
}: InputFieldProps) {
  const a11y = useFieldA11y({
    id,
    describedBy,
    required,
    loading,
    disabled,
    error,
    hasHelper: Boolean(helperText || (error && errorMessage)),
    hasInfo: Boolean(info),
  });

  return (
    <FieldShell
      inputId={a11y.inputId}
      helperId={a11y.helperId}
      infoId={a11y.infoId}
      rootProps={a11y.rootProps}
      label={label}
      required={required}
      info={info}
      infoLabel={infoLabel}
      helperText={helperText}
      error={error}
      errorMessage={errorMessage}
      className={className}
      classNames={classNames}
    >
      <InputGroup className={cn(fieldFrameClassName, classNames?.control)}>
        {startSlot}
        <InputGroupInput
          {...inputProps}
          {...a11y.inputProps}
          type={type}
          className={classNames?.input}
        />
        {loading || action || inputEndSlot ? (
          <InputGroupAddon align="inline-end" className={fieldAddonClassName}>
            {inputEndSlot}
            {loading ? <FieldLoading label={loadingLabel} /> : null}
            {action ? (
              <FieldAction
                {...action}
                componentName={componentName}
                disabled={a11y.isDisabled || action.disabled}
                className={cn(classNames?.action, action.className)}
              />
            ) : null}
          </InputGroupAddon>
        ) : null}
        {endSlot}
      </InputGroup>
    </FieldShell>
  );
}
