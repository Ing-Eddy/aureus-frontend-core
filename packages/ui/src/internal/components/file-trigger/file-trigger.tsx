import { type ChangeEvent, type ReactNode, type Ref, useEffect, useMemo, useRef } from "react";
import { mergeRefs } from "@/internal/utils/helpers";
import { cn } from "@/shadcn/lib/utils";
import { buttonVariants } from "@/shadcn/ui/button";

/** Props of `FileTrigger`. */
export interface FileTriggerProps {
  /** Id, describedby and state attributes from `useFieldA11y`. */
  inputProps: {
    /** Id of the input. */
    id: string;
    /** Disables the picker. */
    disabled?: boolean;
    /** Ids that describe the input. */
    "aria-describedby"?: string;
    /** Marks the input as invalid. */
    "aria-invalid"?: boolean;
    /** Marks the input as required. */
    "aria-required"?: boolean;
    /** Marks the input as loading. */
    "aria-busy"?: boolean;
  };
  /** Ids that name the input after the trigger's own text (the field label, for example). */
  labelledBy?: string;
  /** Content of the trigger. */
  children: ReactNode;
  /**
   * `"button"` shows a text button; `"icon"` a small icon button; `"badge"` a round icon button
   * meant to sit on an avatar's corner. With `"icon"` and `"badge"`, the text is visually hidden.
   */
  variant?: "button" | "icon" | "badge";
  /** Types the picker offers. */
  accept?: string;
  /** Whether several files can be picked at once. */
  multiple: boolean;
  /** Opens the camera on devices that have one. */
  capture?: "user" | "environment";
  /** Name of the native input. */
  name?: string;
  /** Files a native form submission carries (the new items' files). */
  newFiles: readonly File[];
  /** Called when files are picked. */
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  /** Reaches the input element. */
  inputRef?: Ref<HTMLInputElement>;
  /** Extra classes of the visible button. */
  className?: string;
  /** Classes of the element that holds the input and its label, for example to position it. */
  wrapperClassName?: string;
}

/**
 * The field's focusable control: the native file input, visually hidden, presented by a label
 * styled as a button. A click on the label, or Enter or Space on the input, opens the picker.
 * Being the real input, it carries the name, the description, `aria-required` and `aria-invalid`
 * (which a `button` cannot), and, with `name`, the new files for a native form submission.
 */
export function FileTrigger({
  inputProps,
  labelledBy,
  children,
  variant = "button",
  accept,
  multiple,
  capture,
  name,
  newFiles,
  onChange,
  inputRef,
  className,
  wrapperClassName,
}: FileTriggerProps) {
  const ownRef = useRef<HTMLInputElement>(null);
  const ref = useMemo(() => mergeRefs(ownRef, inputRef), [inputRef]);
  const textId = `${inputProps.id}-choose`;

  useEffect(() => {
    const input = ownRef.current;
    if (!input || !name || typeof DataTransfer !== "function") return;
    const transfer = new DataTransfer();
    for (const file of newFiles) transfer.items.add(file);
    input.files = transfer.files;
  }, [name, newFiles]);

  return (
    <span data-slot="file-trigger-wrapper" className={cn("relative inline-flex", wrapperClassName)}>
      <input
        {...inputProps}
        ref={ref}
        type="file"
        name={name}
        accept={accept}
        multiple={multiple}
        capture={capture}
        aria-labelledby={[textId, labelledBy].filter(Boolean).join(" ")}
        onChange={onChange}
        className="peer sr-only"
      />
      <label
        id={textId}
        htmlFor={inputProps.id}
        data-slot="file-trigger"
        data-variant={variant}
        className={cn(
          buttonVariants({
            variant: "outline",
            size: variant === "button" ? "sm" : variant === "icon" ? "icon-sm" : "icon-xs",
          }),
          "cursor-pointer",
          variant === "badge"
            ? // The circle may be small on small avatars; an invisible ring around it keeps the
              // target at least 24 px (and larger on coarse pointers).
              "relative min-h-0 min-w-0 rounded-full bg-background p-0 shadow-sm ring-2 ring-background after:absolute after:-inset-[5px] after:rounded-full after:content-[''] hover:bg-muted pointer-coarse:after:-inset-2.5 [&_svg]:size-[60%] dark:bg-background dark:hover:bg-muted"
            : "pointer-coarse:min-h-11 pointer-coarse:min-w-11",
          "peer-focus-visible:border-ring peer-focus-visible:ring-3 peer-focus-visible:ring-ring/50",
          "peer-disabled:pointer-events-none peer-disabled:cursor-default peer-disabled:opacity-50",
          "peer-aria-[invalid=true]:border-destructive",
          className,
        )}
      >
        {children}
      </label>
    </span>
  );
}
