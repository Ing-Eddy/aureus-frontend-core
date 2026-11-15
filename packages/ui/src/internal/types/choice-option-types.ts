import type { ReactNode } from "react";

/** One option of a choice group (checkbox group or radio group). */
export interface ChoiceOption {
  /** Stored in the value when chosen; submitted as the control's value in native forms. */
  value: string;
  /** Names the control. Clicking it chooses the option; links inside it navigate without choosing. */
  label: ReactNode;
  /** Muted second line under the label; describes the control. */
  description?: ReactNode;
  /** Keeps the option from changing. */
  disabled?: boolean;
}
