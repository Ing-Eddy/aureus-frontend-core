/**
 * Classes added to shadcn's `InputGroup`, the frame around the input.
 *
 * `InputGroup` dims itself with `has-disabled:*`, which also matches a disabled button inside it,
 * so disabling only the action would dim the whole field. These classes reset that and dim the
 * frame only when the input itself is disabled. While the field is loading, the frame shows a
 * progress cursor.
 */
export const fieldFrameClassName = [
  "has-disabled:bg-transparent has-disabled:opacity-100 dark:has-disabled:bg-input/30",
  "has-[[data-slot=input-group-control]:disabled]:bg-input/50",
  "has-[[data-slot=input-group-control]:disabled]:opacity-50",
  "dark:has-[[data-slot=input-group-control]:disabled]:bg-input/80",
  "group-data-[loading=true]/field:cursor-progress",
].join(" ");

/**
 * Classes added to the inline-end `InputGroupAddon`. shadcn pulls an addon that holds a button
 * outwards with a negative margin, so its box sticks out of the frame and can cause horizontal
 * overflow in narrow containers. The same button position is kept with padding instead.
 */
export const fieldAddonClassName = "has-[>button]:mr-0 has-[>button]:pr-[0.2rem]";

/**
 * Classes added to a password input. Some browsers (Edge) draw their own reveal and clear buttons
 * inside `type="password"` inputs; the field already has its own toggle, so they are hidden.
 */
export const passwordInputClassName = "[&::-ms-clear]:hidden [&::-ms-reveal]:hidden";

/**
 * Classes added to the footer bar of a multi-line field (`InputGroupAddon align="block-end"`).
 * shadcn's addon already pads the top when it has `border-t`; the bar is a single row.
 */
export const fieldFooterClassName = "cursor-default flex-wrap gap-2 border-t";

/**
 * Classes added to a textarea whose height is managed by `useTextareaAutosize`: cancels the
 * content-based sizing and minimum height of shadcn's Textarea (not supported everywhere), and
 * replaces `InputGroupTextarea`'s `flex-1`: once the footer bar turns the frame into a column, a
 * zero flex-basis would override the computed height.
 */
export const textareaClassName = "field-sizing-fixed min-h-0 flex-none";

/** Shared look of the step buttons: quiet, full frame height, separated from the text. */
const stepperButtonBase =
  "inline-flex items-center justify-center text-muted-foreground outline-none transition-colors motion-reduce:transition-none select-none hover:bg-muted hover:text-foreground active:bg-muted disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-3.5";

/** Column of stacked ▲▼ buttons at the inline end of the frame. */
export const fieldStepperStackedClassName =
  "order-last flex w-7 shrink-0 flex-col self-stretch overflow-hidden rounded-e-[calc(var(--radius-lg)-1px)] border-s border-input";

/** One button in the stacked column; the first one gets a divider below. */
export const fieldStepperStackedButtonClassName = `${stepperButtonBase} min-h-0 flex-1 first:border-b first:border-input`;

/** Split layout: − at the inline start, + at the inline end, each a full-height square. */
export const fieldStepperSplitButtonClassName = {
  start: `${stepperButtonBase} order-first w-8 shrink-0 self-stretch rounded-s-[calc(var(--radius-lg)-1px)] border-e border-input [&_svg]:size-4`,
  end: `${stepperButtonBase} order-last w-8 shrink-0 self-stretch rounded-e-[calc(var(--radius-lg)-1px)] border-s border-input [&_svg]:size-4`,
} as const;

/** The row that holds the label and the info button. */
export const fieldHeaderClassName = "flex min-w-0 items-center gap-2";

/** Label text: wraps instead of overflowing, with the asterisk right after it. */
export const fieldLabelClassName = "min-w-0 gap-0.5 break-words";
