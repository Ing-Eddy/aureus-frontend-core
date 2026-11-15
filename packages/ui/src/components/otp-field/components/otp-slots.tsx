import { OTPInputContext } from "input-otp";
import { Fragment, type ReactNode, useContext } from "react";
import { cn } from "@/shadcn/lib/utils";
import { InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/shadcn/ui/input-otp";

/**
 * shadcn's `InputOTPSlot` classes (src/shadcn/ui/input-otp.tsx), copied for the masked slot,
 * because shadcn's slot always renders the character. A story compares both computed styles.
 */
const otpSlotClassName =
  "relative flex size-8 items-center justify-center border-y border-r border-input text-sm transition-all outline-none first:rounded-l-lg first:border-l last:rounded-r-lg aria-invalid:border-destructive data-[active=true]:z-10 data-[active=true]:border-ring data-[active=true]:ring-3 data-[active=true]:ring-ring/50 data-[active=true]:aria-invalid:border-destructive data-[active=true]:aria-invalid:ring-destructive/20 dark:bg-input/30 dark:data-[active=true]:aria-invalid:ring-destructive/40";

/** A box that shows a dot instead of its character (masked OTP), with the same caret. */
function OtpMaskedSlot({
  index,
  invalid,
  className,
}: {
  index: number;
  invalid?: boolean;
  className?: string;
}) {
  const context = useContext(OTPInputContext);
  const { char, hasFakeCaret, isActive } = context?.slots[index] ?? {};
  return (
    <div
      data-slot="input-otp-slot"
      data-active={isActive}
      aria-invalid={invalid || undefined}
      className={cn(otpSlotClassName, className)}
    >
      {char ? (
        <span data-slot="otp-slot-dot" className="text-2xl leading-none">
          •
        </span>
      ) : null}
      {hasFakeCaret ? (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-4 w-px animate-caret-blink bg-foreground duration-1000" />
        </div>
      ) : null}
    </div>
  );
}

export interface OtpSlotsProps {
  blocks: number[][];
  masked: boolean;
  invalid?: boolean;
  separator?: ReactNode;
  className?: string;
  slotClassName?: string;
  separatorClassName?: string;
}

/**
 * The decorative boxes of an OTP, in blocks. Hidden from assistive technology: the real input
 * (rendered by `input-otp` next to them) carries the value, name and description.
 */
export function OtpSlots({
  blocks,
  masked,
  invalid,
  separator,
  className,
  slotClassName,
  separatorClassName,
}: OtpSlotsProps) {
  return (
    <div
      aria-hidden="true"
      data-slot="otp-slots"
      // Codes read left to right, also in right-to-left documents (the input mirrors this).
      dir="ltr"
      className={cn("flex flex-wrap items-center gap-x-2 gap-y-2", className)}
    >
      {blocks.map((block, blockIndex) => (
        <Fragment key={block[0]}>
          {blockIndex > 0 ? (
            separator !== undefined ? (
              <div
                data-slot="input-otp-separator"
                className={cn("flex items-center", separatorClassName)}
              >
                {separator}
              </div>
            ) : (
              <InputOTPSeparator className={separatorClassName} />
            )
          ) : null}
          <InputOTPGroup>
            {block.map((index) =>
              masked ? (
                <OtpMaskedSlot
                  key={index}
                  index={index}
                  invalid={invalid}
                  className={slotClassName}
                />
              ) : (
                <InputOTPSlot
                  key={index}
                  index={index}
                  aria-invalid={invalid || undefined}
                  className={slotClassName}
                />
              ),
            )}
          </InputOTPGroup>
        </Fragment>
      ))}
    </div>
  );
}
