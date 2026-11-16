import { type ChangeEvent, type ReactNode, type Ref, useEffect, useMemo, useRef } from "react";
import { mergeRefs } from "@/internal/utils/helpers";
import { cn } from "@/shadcn/lib/utils";
import { buttonVariants } from "@/shadcn/ui/button";

export interface FileTriggerProps {
  /** Id, describedby and state attributes from `useFieldA11y`. */
  inputProps: {
    id: string;
    disabled?: boolean;
    "aria-describedby"?: string;
    "aria-invalid"?: boolean;
    "aria-required"?: boolean;
    "aria-busy"?: boolean;
  };
  /** Ids that name the input after the trigger's own text (the field label, for example). */
  labelledBy?: string;
  /** Content of the trigger. */
  children: ReactNode;
  /** `"button"` shows a text button; `"icon"` a small icon button (its text is visually hidden). */
  variant?: "button" | "icon";
  accept?: string;
  multiple: boolean;
  capture?: "user" | "environment";
  name?: string;
  /** Files a native form submission carries (the new items' files). */
  newFiles: readonly File[];
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  inputRef?: Ref<HTMLInputElement>;
  className?: string;
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
    <span data-slot="file-trigger-wrapper" className="relative inline-flex">
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
        className={cn(
          buttonVariants({ variant: "outline", size: variant === "icon" ? "icon-sm" : "sm" }),
          "cursor-pointer pointer-coarse:min-h-11 pointer-coarse:min-w-11",
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
