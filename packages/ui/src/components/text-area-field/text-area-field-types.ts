import type { ComponentProps } from "react";
import type { FieldActionProps, FieldBaseProps } from "@/internal/types";

/**
 * Props of `TextAreaField`: the shared field props, an optional `action` (shown in the footer
 * bar), sizing, counter and shortcut options, and every other native `<textarea>` prop
 * (`value`, `defaultValue`, `onChange`, `placeholder`, `name`, `maxLength`, `ref`…) except
 * `rows`, which `minRows` replaces.
 */
export type TextAreaFieldProps = FieldBaseProps &
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
    /** Shows a character counter in the footer bar: "count/maxLength", or the count alone. */
    showCount?: boolean;
    /** What assistive technology hears for the counter. Defaults to "n characters remaining". */
    countLabel?: (remaining: number) => string;
    /** Ctrl+Enter / Cmd+Enter presses the action. Enter alone still adds a new line. */
    actionShortcut?: boolean;
  };
