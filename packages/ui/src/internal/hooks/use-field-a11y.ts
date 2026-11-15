import { useId } from "react";

export interface UseFieldA11yOptions {
  /** The consumer's `id` for the input. A stable id is generated when it is missing. */
  id?: string;
  /** The consumer's own `aria-describedby`, kept first. */
  describedBy?: string;
  required?: boolean;
  loading?: boolean;
  disabled?: boolean;
  error?: boolean;
  /** Whether a helper text or error message is rendered below the input. */
  hasHelper: boolean;
  /** Whether an info tooltip is rendered. */
  hasInfo: boolean;
}

/**
 * Ids, ARIA attributes and state flags shared by every field, so the whole family exposes the
 * same accessibility contract.
 */
export function useFieldA11y(options: UseFieldA11yOptions) {
  const generatedId = useId();
  const inputId = options.id ?? generatedId;
  const helperId = `${inputId}-helper`;
  const infoId = `${inputId}-info`;
  /** The label's id, for elements that must be named by it (such as a select's listbox). */
  const labelId = `${inputId}-label`;
  const isDisabled = Boolean(options.disabled || options.loading);

  const describedBy =
    [
      options.describedBy,
      options.hasHelper ? helperId : undefined,
      options.hasInfo ? infoId : undefined,
    ]
      .filter(Boolean)
      .join(" ") || undefined;

  return {
    inputId,
    helperId,
    infoId,
    labelId,
    isDisabled,
    /** Spread on the input element. */
    inputProps: {
      id: inputId,
      disabled: isDisabled,
      "aria-describedby": describedBy,
      "aria-invalid": options.error || undefined,
      "aria-required": options.required || undefined,
      "aria-busy": options.loading || undefined,
    },
    /** Spread on the root element; `data-*` hooks for styling. */
    rootProps: {
      "data-invalid": options.error || undefined,
      "data-disabled": options.disabled || undefined,
      "data-loading": options.loading || undefined,
    },
  };
}
