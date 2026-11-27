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
