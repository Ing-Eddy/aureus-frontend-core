import type { TextFieldProps } from "@/components/text-field";
import type { DistributiveOmit } from "@/internal/types";

/**
 * Props of `PasswordField`: the same props as `TextField` except `action` (the button is always
 * the show/hide toggle), plus the visibility state and the toggle's accessible names, which are
 * always required because the toggle is always shown.
 */
export type PasswordFieldProps = DistributiveOmit<TextFieldProps, "action"> & {
  /** Whether the password is shown. Controls the visibility; pair it with `onVisibleChange`. */
  visible?: boolean;
  /** Initial visibility when uncontrolled. Defaults to `false` (hidden). */
  defaultVisible?: boolean;
  /** Called when the toggle is pressed, and with `false` when the surrounding form is submitted. */
  onVisibleChange?: (visible: boolean) => void;
  /** Accessible name of the toggle while the password is hidden (for example "Show password"). */
  showPasswordLabel: string;
  /** Accessible name of the toggle while the password is shown (for example "Hide password"). */
  hidePasswordLabel: string;
};
