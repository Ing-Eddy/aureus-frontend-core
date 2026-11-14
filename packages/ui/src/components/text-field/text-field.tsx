import { FieldAction, FieldLoading, FieldShell } from "@/internal/components";
import { useFieldA11y } from "@/internal/hooks";
import { fieldAddonClassName, fieldFrameClassName } from "@/internal/utils/constants";
import { cn } from "@/shadcn/lib/utils";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/shadcn/ui/input-group";
import type { TextFieldProps } from "./text-field-types";

/**
 * A text input with label, required mark, info tooltip, helper text, error, loading and disabled
 * states, and an optional integrated action button. Works controlled and uncontrolled.
 */
export function TextField({
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
  id,
  "aria-describedby": describedBy,
  ...inputProps
}: TextFieldProps) {
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
          type="text"
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
