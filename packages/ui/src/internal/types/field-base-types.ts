import type { ReactNode } from "react";

/** Parts of a field that accept extra classes. Each value is merged after the default classes. */
export interface FieldClassNames {
  /** The root element. Same target as `className`. */
  root?: string;
  /** The row that holds the label and the info button. */
  header?: string;
  /** The label. */
  label?: string;
  /** The red asterisk shown when `required` is true. */
  requiredMark?: string;
  /** The info button. */
  info?: string;
  /** The frame around the input and its addons (border, ring, background). */
  control?: string;
  /** The input element. */
  input?: string;
  /** The helper text, or the error message that replaces it. */
  helper?: string;
  /** The integrated action button. */
  action?: string;
}

/** Props shared by every field and control. */
export interface FieldBaseProps {
  /** Text shown above the input. It becomes the input's accessible name. */
  label?: ReactNode;
  /**
   * Shows a red asterisk next to the label and sets `aria-required` on the input. It only marks
   * the field: it adds no validation rule and no native `required` attribute.
   */
  required?: boolean;
  /** Disables the input and the action and shows a spinner inside the input frame. */
  loading?: boolean;
  /** Disables the input and the action and dims the label. */
  disabled?: boolean;
  /**
   * Content of the info tooltip. Shows an info button at the far end of the label row and adds
   * the content to the input's accessible description.
   */
  info?: ReactNode;
  /** Text shown below the input. It is part of the input's accessible description. */
  helperText?: ReactNode;
  /** Shows the error state: destructive input frame, label and helper text, and `aria-invalid`. */
  error?: boolean;
  /** Message shown in place of `helperText` while `error` is true. It is announced as an alert. */
  errorMessage?: ReactNode;
  /** Extra classes for the root element. */
  className?: string;
  /** Extra classes for each part of the field. */
  classNames?: FieldClassNames;
  /** Accessible label of the loading spinner. Defaults to "Loading". */
  loadingLabel?: string;
  /** Accessible name of the info button. Defaults to "More information". */
  infoLabel?: string;
}
