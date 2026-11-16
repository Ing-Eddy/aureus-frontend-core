import { type ReactElement, useMemo, useRef } from "react";
import {
  CheckboxBox,
  ChoiceRow,
  choiceStyles,
  FieldAction,
  FieldLoading,
  FieldShell,
} from "@/internal/components";
import { useFieldA11y, useToggleValue } from "@/internal/hooks";
import type { FieldTexts } from "@/internal/types";
import { mergeRefs } from "@/internal/utils/helpers";
import { cn } from "@/shadcn/lib/utils";
import type {
  CheckboxBooleanValueProps,
  CheckboxCustomValueProps,
  CheckboxFieldBaseProps,
  CheckboxFieldProps,
  CheckboxValue,
} from "./checkbox-field-types";
import { useCheckboxWarnings } from "./hooks";

/**
 * A checkbox with the shared field layout. The value is `boolean` by default, or the custom
 * `checkedValue`/`uncheckedValue`. `label` sits above, as in every field; `checkboxLabel` sits
 * beside the box. Every option is opt-in and there are no default texts.
 */
export function CheckboxField(
  props: CheckboxFieldBaseProps & FieldTexts & CheckboxBooleanValueProps,
): ReactElement;
/** With custom values: the value type is inferred from `checkedValue` and `uncheckedValue`. */
export function CheckboxField<const V extends CheckboxValue>(
  props: CheckboxFieldBaseProps & FieldTexts & CheckboxCustomValueProps<V>,
): ReactElement;
export function CheckboxField<V extends CheckboxValue = boolean>(
  props: CheckboxFieldProps<V>,
): ReactElement {
  const {
    label,
    required,
    loading,
    disabled,
    info,
    infoLabel,
    loadingLabel,
    helperText,
    error,
    errorMessage,
    className,
    classNames,
    checkboxLabel,
    indeterminate,
    checkboxPosition = "start",
    appearance = "plain",
    name,
    id,
    ref,
    action,
    onBlur,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    "aria-describedby": describedBy,
  } = props;

  useCheckboxWarnings("CheckboxField", props);

  const state = useToggleValue<V>({
    value: props.value as V | undefined,
    defaultValue: props.defaultValue as V | undefined,
    onValueChange: props.onValueChange as ((value: V) => void) | undefined,
    checkedValue: props.checkedValue as V | undefined,
    uncheckedValue: props.uncheckedValue as V | undefined,
    componentName: "CheckboxField",
  });

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

  const boxRef = useRef<HTMLButtonElement>(null);
  const mergedRef = useMemo(() => mergeRefs(boxRef, ref), [ref]);
  const locked = Boolean(disabled || loading);
  const hasText = Boolean(checkboxLabel);
  const textId = `${a11y.inputId}-text`;
  // With both texts, the label names the group and the text names the box.
  const groupLabelled = hasText && Boolean(label);
  const indentHelper = hasText && appearance === "plain" && checkboxPosition === "start";

  // Native forms: keep the browser's "on" for booleans, submit the custom checked value otherwise.
  const nativeValue =
    props.checkedValue === undefined || props.checkedValue === true
      ? undefined
      : String(props.checkedValue);

  const box = (
    <CheckboxBox
      ref={mergedRef}
      id={a11y.inputId}
      name={name}
      value={nativeValue}
      checked={state.checked}
      indeterminate={indeterminate}
      onCheckedChange={(checked) => state.setChecked(checked === true)}
      disabled={locked}
      onBlur={onBlur}
      aria-label={ariaLabel}
      aria-labelledby={
        [hasText ? textId : undefined, ariaLabelledBy].filter(Boolean).join(" ") || undefined
      }
      aria-describedby={a11y.inputProps["aria-describedby"]}
      aria-invalid={a11y.inputProps["aria-invalid"]}
      aria-required={a11y.inputProps["aria-required"]}
      aria-busy={a11y.inputProps["aria-busy"]}
      className={classNames?.checkbox}
    />
  );

  const end =
    loading || action ? (
      <>
        {loading ? <FieldLoading label={loadingLabel} /> : null}
        {action ? (
          <FieldAction
            {...action}
            componentName="CheckboxField"
            disabled={locked || action.disabled}
            className={cn(classNames?.action, action.className)}
          />
        ) : null}
      </>
    ) : null;

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
      classNames={{
        ...classNames,
        helper: cn(indentHelper && choiceStyles.helperIndent, classNames?.helper),
      }}
      labelFor={!hasText}
      labelledByRoot={groupLabelled}
    >
      <ChoiceRow
        box={box}
        textId={textId}
        boxRef={boxRef}
        text={checkboxLabel}
        requiredMark={Boolean(required && !label)}
        end={end}
        position={checkboxPosition}
        appearance={appearance}
        error={error}
        locked={locked}
        className={cn(classNames?.row, classNames?.control)}
        textClassName={classNames?.checkboxLabel}
        requiredMarkClassName={classNames?.requiredMark}
      />
    </FieldShell>
  );
}
