// Layout classes of the parts of a toast. Positions, stacking, motion and colors are in
// styles/toast.css, so utilities passed by an app still win over them.

/** The row of icon, body and close button. */
export const toastContentClassName = "flex items-start gap-3 p-4";

/** Aligns the icon with the first line of the title. */
export const toastIconClassName = "mt-0.5 flex shrink-0 [&_svg]:size-4";

/** The column of title, description and the rest. */
export const toastBodyClassName = "flex min-w-0 flex-1 flex-col items-start gap-1";

/** Pulls the close button into the corner padding. */
export const toastCloseClassName = "-me-1.5 -mt-1 shrink-0";

/** The title of a clickable toast: it looks like the title and shows a focus ring. */
export const toastTitleButtonClassName =
  "cursor-pointer rounded-sm text-start outline-none [font:inherit] focus-visible:ring-3 focus-visible:ring-ring/50";

/** The row of action buttons, which wraps when they do not fit. */
export const toastActionsClassName = "flex flex-wrap gap-2 pt-1";

/** The description, which takes the width of the body. */
export const toastDescriptionClassName = "typography-body-sm w-full rounded-sm";

/** The button that expands and collapses a long description. */
export const toastExpandClassName =
  "typography-label cursor-pointer rounded-sm text-primary underline-offset-4 outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50";

/** The slot of the consumer's content. */
export const toastExtraClassName = "w-full pt-1";
