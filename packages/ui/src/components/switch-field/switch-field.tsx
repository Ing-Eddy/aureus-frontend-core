import { type ReactElement, useCallback, useMemo, useRef } from "react";
import { ChoiceRow, FieldAction, FieldShell, SwitchBox } from "@/internal/components";
import { useFieldA11y, useToggleValue } from "@/internal/hooks";
import { mergeRefs } from "@/internal/utils/helpers";
import { cn } from "@/shadcn/lib/utils";
import { useSwitchChange, useSwitchWarnings } from "./hooks";
import type {
  SwitchBooleanProps,
  SwitchCustomProps,
  SwitchFieldProps,
  SwitchValue,
} from "./switch-field-types";

/** Indents the helper under the text in a plain start row: switch width plus the 8px gap. */
const helperIndent = { default: "ps-10", sm: "ps-8" } as const;

/**
 * An on/off switch with the shared field layout, for settings that apply immediately. The value is
 * `boolean` by default, or the custom `checkedValue`/`uncheckedValue`. `label` sits above, as in
 * every field; `switchLabel` sits beside the switch. Every option is opt-in and there are no
 * default texts. `onBeforeChange` can confirm each change, for example after saving it.
 */
export function SwitchField(props: SwitchBooleanProps): ReactElement;
/** With custom values: the value type is inferred from `checkedValue` and `uncheckedValue`. */
export function SwitchField<const V extends SwitchValue>(props: SwitchCustomProps<V>): ReactElement;
export function SwitchField<V extends SwitchValue = boolean>(
  props: SwitchFieldProps<V>,
): ReactElement {
  const {
    label,
    required,
    loading,
    disabled,
    info,
    infoLabel,
    helperText,
    error,
    errorMessage,
    className,
    classNames,
    switchLabel,
    switchPosition = "start",
    appearance = "plain",
    size = "default",
    stateLabels,
    thumbIcons,
    name,
    id,
    ref,
    action,
    onBlur,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    "aria-describedby": describedBy,
  } = props;

  useSwitchWarnings("SwitchField", props);

  const checkedValue = (props.checkedValue ?? true) as V;
  const uncheckedValue = (props.uncheckedValue ?? false) as V;
  const state = useToggleValue<V>({
    value: props.value as V | undefined,
    defaultValue: props.defaultValue as V | undefined,
    onValueChange: props.onValueChange as ((value: V) => void) | undefined,
    checkedValue,
    uncheckedValue,
    componentName: "SwitchField",
  });

  const toValue = useCallback(
    (checked: boolean) => (checked ? checkedValue : uncheckedValue),
    [checkedValue, uncheckedValue],
  );
  const change = useSwitchChange<V>({
    onBeforeChange: props.onBeforeChange as ((next: V) => boolean | Promise<boolean>) | undefined,
    commit: state.setChecked,
    toValue,
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
  const busy = Boolean(loading || change.pending);
  const hasText = Boolean(switchLabel);
  const textId = `${a11y.inputId}-text`;
  // With both texts, the label names the group and the text names the switch.
  const groupLabelled = hasText && Boolean(label);
  const indentHelper =
    hasText && appearance === "plain" && switchPosition === "start" && !stateLabels;

  // Native forms: keep the browser's "on" for booleans, submit the custom checked value otherwise.
  const nativeValue =
    props.checkedValue === undefined || props.checkedValue === true
      ? undefined
      : String(props.checkedValue);

  const box = (
    <SwitchBox
      ref={mergedRef}
      id={a11y.inputId}
      name={name}
      value={nativeValue}
      checked={state.checked}
      onCheckedChange={change.request}
      size={size}
      busy={busy}
      thumbIcons={thumbIcons}
      stateLabels={stateLabels}
      disabled={locked}
      onBlur={onBlur}
      aria-label={ariaLabel}
      aria-labelledby={
        [hasText ? textId : undefined, ariaLabelledBy].filter(Boolean).join(" ") || undefined
      }
      aria-describedby={a11y.inputProps["aria-describedby"]}
      aria-invalid={a11y.inputProps["aria-invalid"]}
      aria-required={a11y.inputProps["aria-required"]}
      aria-busy={busy || undefined}
      // While a change waits for confirmation the switch keeps focus (not `disabled`) but is inert.
      aria-disabled={change.pending || undefined}
      className={classNames?.switch}
      thumbClassName={classNames?.thumb}
      stateLabelClassName={classNames?.stateLabel}
    />
  );

  const end = action ? (
    <FieldAction
      {...action}
      disabled={locked || action.disabled}
      className={cn(classNames?.action, action.className)}
    />
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
        helper: cn(indentHelper && helperIndent[size], classNames?.helper),
      }}
      labelFor={!hasText}
      labelledByRoot={groupLabelled}
    >
      <ChoiceRow
        slot="switch"
        box={box}
        textId={textId}
        boxRef={boxRef}
        text={switchLabel}
        requiredMark={Boolean(required && !label)}
        end={end}
        position={switchPosition}
        appearance={appearance}
        error={error}
        locked={locked}
        className={cn(classNames?.row, classNames?.control)}
        textClassName={classNames?.switchLabel}
        requiredMarkClassName={classNames?.requiredMark}
      />
    </FieldShell>
  );
}
