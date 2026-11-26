import type { FocusEvent, Ref } from "react";
import type { ControllerContext } from "./map-controller-to-field";
import { mergeRefs } from "./merge-refs";

/** Props of a value-based field that the control composes with react-hook-form's handlers. */
export interface ComposableValueFieldProps<E extends HTMLElement, V> {
  /** The consumer's handler, run after the form stores the value. */
  onValueChange?: (value: V) => void;
  /** The consumer's handler, run after the form marks the field as touched. */
  onBlur?: (event: FocusEvent<E>) => void;
  /** The consumer's ref, set together with the form's. */
  ref?: Ref<E>;
}

/**
 * Maps `Controller`'s render props to a field that reports values (not events), such as a number
 * field: react-hook-form stores the value itself. The user's handlers run after the form's.
 * `emptyValue` replaces `undefined` (for example `null` for an empty number).
 */
export function mapControllerToValueField<E extends HTMLElement, V>(
  { field, fieldState }: ControllerContext,
  props: ComposableValueFieldProps<E, V>,
  emptyValue: V,
) {
  return {
    name: field.name,
    value: (field.value ?? emptyValue) as V,
    onValueChange: (value: V) => {
      field.onChange(value);
      props.onValueChange?.(value);
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
