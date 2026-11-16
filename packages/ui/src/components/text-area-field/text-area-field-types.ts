import type { ComponentProps } from "react";
import type { FieldActionProps, FieldBaseProps, FieldTexts } from "@/internal/types";

/**
 * The character counter. Turning it on requires `countLabel`, the text assistive technology
 * hears; no text is generated.
 */
export type TextAreaCountTexts =
  | {
      /** Shows a character counter in the footer bar: "count/maxLength", or the count alone. */
      showCount?: false;
      /** Only allowed together with `showCount`. */
      countLabel?: never;
    }
  | {
      /** Shows a character counter in the footer bar: "count/maxLength", or the count alone. */
      showCount: true;
      /**
       * What assistive technology hears for the counter, in the developer's language. It gets the
       * current count and the field's `maxLength` (when set), so it can say what remains, for
       * example "Quedan 120 caracteres" when `maxLength` is set and "380 caracteres" otherwise.
       */
      countLabel: (count: number, maxLength?: number) => string;
    };

/**
 * Props of `TextAreaField` without the text unions: the shared field props, an optional
 * `action` (shown in the footer bar), sizing and shortcut options, and every other native
 * `<textarea>` prop (`value`, `defaultValue`, `onChange`, `placeholder`, `name`, `maxLength`,
 * `ref`…) except `rows`, which `minRows` replaces.
 */
export type TextAreaFieldBaseProps = FieldBaseProps &
  Omit<ComponentProps<"textarea">, "disabled" | "required" | "className" | "children" | "rows"> & {
    /** Button at the inline end of the footer bar, below the text. */
    action?: FieldActionProps;
    /** Lines shown when empty; the field never gets shorter. Defaults to 3. */
    minRows?: number;
    /** Lines the field grows to before it scrolls. Defaults to 10; `Infinity` for no limit. */
    maxRows?: number;
    /**
     * Lets the user drag the field taller or shorter (within `minRows` and `maxRows`). The
     * dragged height becomes the new minimum. Defaults to `true`.
     */
    resize?: boolean;
    /** Ctrl+Enter / Cmd+Enter presses the action. Enter alone still adds a new line. */
    actionShortcut?: boolean;
  };

/**
 * Props of `TextAreaField`. `loading` requires `loadingLabel`, `info` requires `infoLabel` and
 * `showCount` requires `countLabel`; no text is generated.
 */
export type TextAreaFieldProps = TextAreaFieldBaseProps & FieldTexts & TextAreaCountTexts;
