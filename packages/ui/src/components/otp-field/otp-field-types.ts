import type { FocusEvent, ReactNode, Ref } from "react";
import type { FieldActionProps, FieldBaseProps, FieldClassNames } from "@/internal/types";
import type { OtpCharset } from "./utils";

/** Extra parts of an OTP field that accept classes. */
export interface OtpFieldClassNames extends FieldClassNames {
  /** The container of all the blocks. */
  slots?: string;
  /** Each character box. */
  slot?: string;
  /** Each separator between blocks. */
  separator?: string;
}

/** Texts of the show/hide toggle of a masked OTP. Both are required. */
export interface OtpReveal {
  /** Accessible name while the characters are hidden. */
  showLabel: string;
  /** Accessible name while the characters are shown. */
  hideLabel: string;
}

/**
 * Props of `OtpField`. Every option is independent and opt-in, and there are no default texts: a
 * text that is not passed is not shown.
 */
export interface OtpFieldProps extends Omit<FieldBaseProps, "classNames"> {
  /** Number of characters (boxes). Required. */
  length: number;
  /** Controlled value. */
  value?: string;
  /** Initial value when uncontrolled. Defaults to `""`. */
  defaultValue?: string;
  /** Called with the value after every change. */
  onValueChange?: (value: string) => void;
  /** Called once each time the last box is filled. */
  onComplete?: (code: string) => void;
  /** Submits the surrounding form after `onComplete`. Defaults to `false`. */
  submitOnComplete?: boolean;
  /**
   * Accepted characters: `"digits"` (the default), `"letters"`, `"alphanumeric"`, or a custom
   * `{ pattern, inputMode? }`. Also sets the mobile keyboard.
   */
  charset?: OtpCharset;
  /** Turns typed and pasted letters into uppercase. Defaults to `false`. */
  uppercase?: boolean;
  /** Block sizes adding up to `length`, such as `[3, 3]`. One block by default. */
  groups?: readonly number[];
  /** Decorative content between blocks. Defaults to shadcn's dash. */
  separator?: ReactNode;
  /** Shows dots instead of the characters, as for a PIN. Defaults to `false`. */
  masked?: boolean;
  /** Adds a show/hide toggle to a masked OTP. Both texts are required. */
  reveal?: OtpReveal;
  /** Focuses the input on mount. Defaults to `false`. */
  autoFocus?: boolean;
  /** Name of the input, for native form submission. */
  name?: string;
  /** Id of the input. Generated when missing. */
  id?: string;
  /** Reaches the input. */
  ref?: Ref<HTMLInputElement>;
  /** Button after the boxes (for example "Resend code"). */
  action?: FieldActionProps;
  /** Called when the input loses focus. */
  onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
  /** Accessible name of the input when there is no `label`. */
  "aria-label"?: string;
  /** Ids of the elements that name the input when there is no `label`. */
  "aria-labelledby"?: string;
  /** Extra ids describing the input. */
  "aria-describedby"?: string;
  /** Extra classes per part. */
  classNames?: OtpFieldClassNames;
}
