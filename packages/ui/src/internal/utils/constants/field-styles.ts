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

/** The row that holds the label and the info button. */
export const fieldHeaderClassName = "flex min-w-0 items-center gap-2";

/** Label text: wraps instead of overflowing, with the asterisk right after it. */
export const fieldLabelClassName = "min-w-0 gap-0.5 break-words";
