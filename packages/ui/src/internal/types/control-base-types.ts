/** Props shared by every control: the binding to the surrounding react-hook-form form. */
export interface ControlBaseProps {
  /** Path of the field in the form values, for example `"username"` or `"address.city"`. */
  name: string;
  /** Disables the field. react-hook-form then leaves its value out of the submitted data. */
  disabled?: boolean;
  /** Unregisters the field, and drops its value, when the control unmounts. */
  shouldUnregister?: boolean;
}
