import { useId, useMemo, useRef, useState } from "react";
import { FieldAction, FieldCounter, FieldLoading, FieldShell } from "@/internal/components";
import { fieldTextChecks, inputNameCheck, useFieldA11y, useMissingTexts } from "@/internal/hooks";
import {
  fieldFooterClassName,
  fieldFrameClassName,
  textareaClassName,
} from "@/internal/utils/constants";
import { mergeRefs } from "@/internal/utils/helpers";
import { cn } from "@/shadcn/lib/utils";
import { InputGroup, InputGroupAddon, InputGroupTextarea } from "@/shadcn/ui/input-group";
import { actionShortcutKeys, useActionShortcut, useTextareaAutosize } from "./hooks";
import type { TextAreaFieldProps } from "./text-area-field-types";

/**
 * A multi-line text input with the same label, required mark, info tooltip, helper text, error,
 * loading and disabled states as every field. It grows with its content (and can be resized),
 * and keeps its spinner, counter and action in a footer bar attached to the bottom edge. It
 * ships no default texts.
 */
export function TextAreaField(props: TextAreaFieldProps) {
  const {
    label,
    required,
    loading,
    disabled,
    info,
    helperText,
    error,
    errorMessage,
    className,
    classNames,
    loadingLabel,
    infoLabel,
    action,
    minRows = 3,
    maxRows = 10,
    resize = true,
    showCount,
    countLabel,
    actionShortcut,
    id,
    "aria-describedby": describedBy,
    ref,
    value,
    defaultValue,
    maxLength,
    onChange,
    onKeyDown,
    ...textareaProps
  } = props;
  useMissingTexts("TextAreaField", [
    inputNameCheck(props, "text area"),
    ...fieldTextChecks(props),
    [showCount && !countLabel, "`showCount` needs `countLabel`"],
  ]);
  const counterId = useId();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const mergedRef = useMemo(() => mergeRefs(textareaRef, ref), [ref]);
  const actionRef = useRef<HTMLButtonElement>(null);
  const actionUserRef = action?.ref;
  const mergedActionRef = useMemo(() => mergeRefs(actionRef, actionUserRef), [actionUserRef]);

  useTextareaAutosize({ ref: textareaRef, minRows, maxRows });
  const shortcut = useActionShortcut({ enabled: Boolean(actionShortcut && action), actionRef });

  // The counter follows `value` when controlled, and the typed text otherwise.
  const [typedLength, setTypedLength] = useState(() => String(defaultValue ?? "").length);
  const length = value !== undefined ? String(value).length : typedLength;
  const announcement = countLabel ? countLabel(length, maxLength) : "";

  const a11y = useFieldA11y({
    id,
    describedBy:
      [describedBy, showCount ? counterId : undefined].filter(Boolean).join(" ") || undefined,
    required,
    loading,
    disabled,
    error,
    hasHelper: Boolean(helperText || (error && errorMessage)),
    hasInfo: Boolean(info),
  });

  return (
    <FieldShell
      inputId={a11y.inputId}
      helperId={a11y.helperId}
      infoId={a11y.infoId}
      rootProps={a11y.rootProps}
      label={label}
      required={required}
      info={info}
      infoLabel={infoLabel}
      helperText={helperText}
      error={error}
      errorMessage={errorMessage}
      className={className}
      classNames={classNames}
    >
      <InputGroup className={cn(fieldFrameClassName, classNames?.control)}>
        <InputGroupTextarea
          {...textareaProps}
          {...a11y.inputProps}
          ref={mergedRef}
          rows={minRows}
          value={value}
          defaultValue={defaultValue}
          maxLength={maxLength}
          onChange={(event) => {
            if (value === undefined) setTypedLength(event.target.value.length);
            onChange?.(event);
          }}
          onKeyDown={(event) => {
            onKeyDown?.(event);
            if (!event.defaultPrevented) shortcut(event);
          }}
          className={cn(textareaClassName, resize ? "resize-y" : "resize-none", classNames?.input)}
        />
        {loading || action || showCount ? (
          <InputGroupAddon
            align="block-end"
            className={cn(fieldFooterClassName, classNames?.footer)}
          >
            {loading ? <FieldLoading label={loadingLabel} /> : null}
            {showCount ? (
              <FieldCounter
                count={length}
                max={maxLength}
                describedById={counterId}
                announcement={announcement}
              />
            ) : null}
            {action ? (
              <FieldAction
                {...action}
                componentName="TextAreaField"
                ref={mergedActionRef}
                aria-keyshortcuts={
                  actionShortcut ? actionShortcutKeys : action["aria-keyshortcuts"]
                }
                disabled={a11y.isDisabled || action.disabled}
                className={cn("ms-auto", classNames?.action, action.className)}
              />
            ) : null}
          </InputGroupAddon>
        ) : null}
      </InputGroup>
    </FieldShell>
  );
}
