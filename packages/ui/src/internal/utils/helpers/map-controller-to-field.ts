import type { ChangeEvent, FocusEvent, Ref } from "react";
import type { ControllerFieldState, ControllerRenderProps, FieldValues } from "react-hook-form";
import { mergeRefs } from "./merge-refs";

/** What react-hook-form's `Controller` passes to its `render` function. */
export interface ControllerContext {
  /** The field's value and handlers. */
  field: ControllerRenderProps<FieldValues, string>;
  /** The field's validation state. */
  fieldState: ControllerFieldState;
}

/** Props of the field that the control composes with react-hook-form's own handlers. */
export interface ComposableFieldProps<E extends HTMLElement> {
  /** The consumer's handler, run after the form stores the value. */
  onChange?: (event: ChangeEvent<E>) => void;
  /** The consumer's handler, run after the form marks the field as touched. */
  onBlur?: (event: FocusEvent<E>) => void;
  /** The consumer's ref, set together with the form's. */
  ref?: Ref<E>;
}

/**
 * Maps `Controller`'s render props to the props of a field component. The user's `onChange`,
 * `onBlur` and `ref` run after react-hook-form's. `emptyValue` replaces `null`/`undefined`, so
 * the field never switches from uncontrolled to controlled.
 */
export function mapControllerToField<E extends HTMLElement, V = string>(
  { field, fieldState }: ControllerContext,
  props: ComposableFieldProps<E>,
  emptyValue: V = "" as V,
) {
  return {
    name: field.name,
    value: (field.value ?? emptyValue) as V,
    onChange: (event: ChangeEvent<E>) => {
      field.onChange(event);
      props.onChange?.(event);
    },
    onBlur: (event: FocusEvent<E>) => {
      field.onBlur();
      props.onBlur?.(event);
    },
    ref: mergeRefs<E>(field.ref, props.ref),
    disabled: field.disabled,
    error: fieldState.invalid,
    errorMessage: fieldState.error?.message,
  };
}
