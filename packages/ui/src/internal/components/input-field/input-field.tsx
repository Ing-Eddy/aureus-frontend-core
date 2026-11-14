import type { ComponentProps } from "react";
import { FieldAction } from "@/internal/components/field-action";
import { FieldLoading } from "@/internal/components/field-loading";
import { FieldShell } from "@/internal/components/field-shell";
import { useFieldA11y } from "@/internal/hooks";
import type { FieldActionProps, FieldBaseProps } from "@/internal/types";
import { fieldAddonClassName, fieldFrameClassName } from "@/internal/utils/constants";
import { cn } from "@/shadcn/lib/utils";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/shadcn/ui/input-group";

export type InputFieldProps = FieldBaseProps &
  Omit<
    ComponentProps<"input">,
    "type" | "size" | "disabled" | "required" | "className" | "children"
  > & {
    /** The input type. Set by the public field, never by its consumer. */
    type: "text" | "password";
    /** Button inside the input frame, on its inline-end side. */
    action?: FieldActionProps;
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
        <InputGroupInput
          {...inputProps}
          {...a11y.inputProps}
          type={type}
          className={classNames?.input}
        />
        {loading || action ? (
          <InputGroupAddon align="inline-end" className={fieldAddonClassName}>
            {loading ? <FieldLoading label={loadingLabel} /> : null}
            {action ? (
              <FieldAction
                {...action}
                disabled={a11y.isDisabled || action.disabled}
                className={cn(classNames?.action, action.className)}
              />
            ) : null}
          </InputGroupAddon>
        ) : null}
      </InputGroup>
    </FieldShell>
  );
}
