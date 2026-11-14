import type { TextFieldProps } from "@/components/text-field";

/**
 * Props of `PasswordField`: the same props as `TextField` except `action` (the button is always
 * the show/hide toggle), plus the visibility state and the toggle's accessible names.
 */
export type PasswordFieldProps = Omit<TextFieldProps, "action"> & {
  /** Whether the password is shown. Controls the visibility; pair it with `onVisibleChange`. */
  visible?: boolean;
  /** Initial visibility when uncontrolled. Defaults to `false` (hidden). */
  defaultVisible?: boolean;
  /** Called when the toggle is pressed, and with `false` when the surrounding form is submitted. */
  onVisibleChange?: (visible: boolean) => void;
  /** Accessible name of the toggle while the password is hidden. Defaults to "Show password". */
  showPasswordLabel?: string;
  /** Accessible name of the toggle while the password is shown. Defaults to "Hide password". */
  hidePasswordLabel?: string;
};
