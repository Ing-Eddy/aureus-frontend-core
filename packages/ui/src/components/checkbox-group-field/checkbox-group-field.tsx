import { FieldLoading, FieldShell } from "@/internal/components";
import { useFieldA11y } from "@/internal/hooks";
import { CheckboxGroupOptions } from "./components";
import { useCheckboxGroupValue, useCheckboxGroupWarnings } from "./hooks";
import type { CheckboxGroupFieldProps } from "./types";

/**
 * Several checkboxes holding a `string[]`, with the shared field layout. The value always follows
 * the order of `options`. Every extra (select all, limit, layout, cards) is opt-in, and there are
 * no default texts.
 *
 * ```tsx
 * <CheckboxGroupField
 *   label={t("user.permissions")}
 *   options={permissions}
 *   selectAll={{ label: t("common.selectAll") }}
 *   value={selected}
 *   onValueChange={setSelected}
 * />
 * ```
 */
export function CheckboxGroupField(props: CheckboxGroupFieldProps) {
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
    options,
    value,
    defaultValue,
    onValueChange,
    selectAll,
    maxSelected,
    maxSelectedMessage,
    orientation = "vertical",
    columns,
    appearance = "plain",
    checkboxPosition = "start",
    name,
    id,
    ref,
    onBlur,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    "aria-describedby": describedBy,
  } = props;

  useCheckboxGroupWarnings("CheckboxGroupField", props);

  const group = useCheckboxGroupValue({
    options,
    value,
    defaultValue,
    onValueChange,
    maxSelected,
    componentName: "CheckboxGroupField",
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

  const locked = Boolean(disabled || loading);
  const enabledCount = options.filter((option) => !option.disabled).length;

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
      labelFor={false}
      labelledByRoot
      rootAria={{
        "aria-describedby": a11y.inputProps["aria-describedby"],
        "aria-busy": loading || undefined,
        // The whole group is unavailable: also exempts its dimmed label from contrast checks.
        "aria-disabled": locked || undefined,
        "aria-label": label ? undefined : ariaLabel,
        "aria-labelledby": label ? undefined : ariaLabelledBy,
      }}
      headerEnd={loading ? <FieldLoading label={loadingLabel} /> : null}
    >
      <CheckboxGroupOptions
        ref={ref}
        onBlur={onBlur}
        baseId={a11y.inputId}
        options={options}
        boxState={(option) => ({
          checked: group.isChecked(option.value),
          locked: locked || group.isLocked(option),
          onChange: (checked) => group.toggle(option.value, checked),
        })}
        selectAll={
          selectAll
            ? {
                label: selectAll.label,
                state: group.selectAllState,
                locked: locked || enabledCount === 0,
                onToggle: group.toggleAll,
              }
            : undefined
        }
        limitMessage={group.atLimit ? maxSelectedMessage : undefined}
        name={name}
        error={error}
        orientation={orientation}
        columns={columns}
        appearance={appearance}
        checkboxPosition={checkboxPosition}
        classNames={classNames}
      />
    </FieldShell>
  );
}
