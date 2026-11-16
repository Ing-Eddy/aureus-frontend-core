import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { FieldAction, FieldLoading, FieldShell } from "@/internal/components";
import { useControllableState, useFieldA11y } from "@/internal/hooks";
import { mergeRefs } from "@/internal/utils/helpers";
import { cn } from "@/shadcn/lib/utils";
import { Button } from "@/shadcn/ui/button";
import { InputOTP } from "@/shadcn/ui/input-otp";
import { OtpSlots } from "./components";
import { useOtpWarnings } from "./hooks";
import type { OtpFieldProps } from "./otp-field-types";
import { resolveCharset, sanitizeOtp, toBlocks, transformPastedOtp } from "./utils";

/**
 * A one-time code (OTP, PIN) field with the shared field layout: `length` boxes over a single real
 * input, so SMS autofill (`autocomplete="one-time-code"`), pasting and screen readers work as with
 * any input. Every option is opt-in and there are no default texts.
 */
export function OtpField(props: OtpFieldProps) {
  const {
    label,
    required,
    loading,
    disabled,
    info,
    infoLabel,
    loadingLabel,
    helperText,
    error,
    errorMessage,
    className,
    classNames,
    length,
    value,
    defaultValue,
    onValueChange,
    onComplete,
    submitOnComplete,
    charset,
    uppercase,
    groups,
    separator,
    masked,
    reveal,
    autoFocus,
    name,
    id,
    ref,
    action,
    onBlur,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    "aria-describedby": describedBy,
  } = props;

  const sanitizeOptions = { length, charset, uppercase };
  const rawValue = value ?? defaultValue;
  const sanitizedRaw = rawValue === undefined ? undefined : sanitizeOtp(rawValue, sanitizeOptions);
  useOtpWarnings("OtpField", {
    label,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    length,
    groups,
    masked,
    reveal,
    rawValue,
    sanitizedValue: sanitizedRaw,
    loading,
    loadingLabel,
    info,
    infoLabel,
  });

  const [current, setCurrent] = useControllableState<string>({
    value: value === undefined ? undefined : sanitizedRaw,
    defaultValue: defaultValue === undefined ? "" : (sanitizedRaw ?? ""),
    onChange: onValueChange,
  });

  const a11y = useFieldA11y({
    id,
    describedBy,
    required,
    loading,
    disabled,
    error,
    hasHelper: Boolean(helperText || (error && errorMessage)),
    hasInfo: Boolean(info),
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const mergedRef = useMemo(() => mergeRefs(inputRef, ref), [ref]);
  const locked = Boolean(disabled || loading);
  const { pattern, inputMode } = resolveCharset(charset);
  const blocks = toBlocks(length, groups);
  const [revealed, setRevealed] = useState(false);
  const hidden = Boolean(masked) && !revealed;

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  const handleChange = (next: string) => {
    const sanitized = sanitizeOtp(next, sanitizeOptions);
    if (sanitized === current) return;
    setCurrent(sanitized);
    // Completion is reported once, when the value reaches `length`.
    if (sanitized.length === length && current.length < length) {
      onComplete?.(sanitized);
      if (submitOnComplete) {
        // After the value commits, so a form library sees the full code.
        queueMicrotask(() => inputRef.current?.form?.requestSubmit());
      }
    }
  };

  const toggle =
    masked && reveal ? (
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        data-slot="otp-reveal"
        aria-label={revealed ? reveal.hideLabel : reveal.showLabel}
        aria-pressed={revealed}
        disabled={disabled}
        // Keeps focus in the input.
        onMouseDown={(event) => event.preventDefault()}
        onClick={() => setRevealed((shown) => !shown)}
      >
        {revealed ? <EyeOffIcon aria-hidden="true" /> : <EyeIcon aria-hidden="true" />}
      </Button>
    ) : null;

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
      <div
        data-slot="otp-row"
        className={cn("flex min-w-0 flex-wrap items-center gap-2", classNames?.control)}
      >
        <InputOTP
          ref={mergedRef}
          id={a11y.inputId}
          name={name}
          value={current}
          onChange={handleChange}
          maxLength={length}
          // With `uppercase`, characters are filtered here after uppercasing, so lowercase typing
          // reaches the filter; without it, `input-otp` also rejects them as they are typed.
          pattern={uppercase ? undefined : pattern}
          inputMode={inputMode}
          autoComplete="one-time-code"
          type={hidden ? "password" : "text"}
          pasteTransformer={(pasted) => transformPastedOtp(pasted, sanitizeOptions)}
          disabled={locked}
          onBlur={onBlur}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          aria-describedby={a11y.inputProps["aria-describedby"]}
          aria-invalid={a11y.inputProps["aria-invalid"]}
          aria-required={a11y.inputProps["aria-required"]}
          aria-busy={a11y.inputProps["aria-busy"]}
          // Codes read left to right, also in right-to-left documents.
          dir="ltr"
          containerClassName={cn("max-w-full", classNames?.slots)}
        >
          <OtpSlots
            blocks={blocks}
            masked={hidden}
            invalid={error}
            separator={separator}
            slotClassName={classNames?.slot}
            separatorClassName={classNames?.separator}
          />
        </InputOTP>
        {toggle}
        {loading ? <FieldLoading label={loadingLabel} /> : null}
        {action ? (
          <FieldAction
            {...action}
            componentName="OtpField"
            disabled={locked || action.disabled}
            className={cn(classNames?.action, action.className)}
          />
        ) : null}
      </div>
    </FieldShell>
  );
}
