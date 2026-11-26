import { SelectField, type SelectFieldProps } from "@/components/select-field";
import { ControlField } from "@/internal/components";
import { mapControllerToValueField } from "@/internal/utils/helpers";
import type { SelectControlProps } from "./select-control-types";

/**
 * `SelectField` bound to the surrounding react-hook-form form. Render it inside a `FormProvider`:
 * the form holds `string | null` (single) or `string[]` (multiple), and its validation message is
 * shown as helper text.
 *
 * ```tsx
 * // Inside <FormProvider {...form}>.
 * <SelectControl
 *   name="tags"
 *   label={t("product.tags")}
 *   options={tags}
 *   multiple
 *   multipleDisplay="chips"
 *   removeChipLabel={(tag) => t("common.remove", { name: tag.label })}
 * />
 * ```
 */
export function SelectControl({
  name,
  disabled,
  shouldUnregister,
  onBlur,
  ref,
  ...fieldProps
}: SelectControlProps) {
  const multiple = fieldProps.multiple === true;
  return (
    <ControlField
      componentName="SelectControl"
      name={name}
      disabled={disabled}
      shouldUnregister={shouldUnregister}
      render={(context) => {
        const mapped = mapControllerToValueField<HTMLButtonElement, string | null | string[]>(
          context,
          {
            onValueChange: fieldProps.onValueChange as (value: string | null | string[]) => void,
            onBlur,
            ref,
          },
          multiple ? [] : null,
        );
        const props = {
          ...fieldProps,
          ...mapped,
          disabled: mapped.disabled || disabled,
        } as SelectFieldProps;
        return <SelectField {...props} />;
      }}
    />
  );
}
