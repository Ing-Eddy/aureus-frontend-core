import type { ReactNode } from "react";

/** One choice of a checkbox group. */
export interface CheckboxGroupOption {
  /** Stored in the value array when checked; submitted as the box's value in native forms. */
  value: string;
  /** Names the box. Clicking it toggles the box; links inside it navigate without toggling. */
  label: ReactNode;
  /** Muted second line under the label; describes the box. */
  description?: ReactNode;
  /** Keeps the box from changing. Select all and the limit leave it as it is. */
  disabled?: boolean;
}
