import { Toast, type ToastObject } from "@base-ui/react/toast";
import { type CSSProperties, useId, useRef, useState } from "react";
import { useMissingTexts } from "@/internal/hooks";
import { useExpandedDuration, useTextOverflow, useToasterContext } from "../hooks";
import type { ToastData } from "../types";
import { toastDescriptionClassName, toastExpandClassName } from "../utils/constants";
import { resolveExpandable } from "../utils/helpers";

/** The description of a toast: expandable when it is turned on and both button texts exist. */
export function ToastDescription({ toast }: { toast: ToastObject<ToastData> }) {
  const toaster = useToasterContext();
  const settings = resolveExpandable(toaster.expandable, toast.data?.expandable);
  const { expandLabel, collapseLabel } = settings ?? {};
  useMissingTexts("toast", [
    [
      settings && toast.description && !(expandLabel && collapseLabel),
      "`expandable` needs `expandLabel` and `collapseLabel`",
    ],
  ]);
  // Without both texts there would be no way to read the rest, so nothing is cut.
  if (!settings || !expandLabel || !collapseLabel || !toast.description) {
    return (
      <Toast.Description
        data-slot="toast-description"
        className={toastDescriptionClassName}
        render={<div />}
      />
    );
  }
  return (
    <ExpandableDescription
      toast={toast}
      lines={settings.lines}
      defaultExpanded={settings.defaultExpanded}
      expandLabel={expandLabel}
      collapseLabel={collapseLabel}
    />
  );
}

/** What an expandable description needs, already resolved. */
interface ExpandableDescriptionProps {
  /** The toast whose description it is. */
  toast: ToastObject<ToastData>;
  /** Lines shown while collapsed. */
  lines: number;
  /** Whether it starts expanded. */
  defaultExpanded: boolean;
  /** Text of the button while collapsed. */
  expandLabel: string;
  /** Text of the button while expanded. */
  collapseLabel: string;
}

/** A clamped description with the button that shows the rest, only when there is a rest. */
function ExpandableDescription({
  toast,
  lines,
  defaultExpanded,
  expandLabel,
  collapseLabel,
}: ExpandableDescriptionProps) {
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(defaultExpanded);
  const { overflows, scrolls } = useTextOverflow(ref, expanded);
  const restoreDuration = useExpandedDuration(toast, expanded);
  return (
    <>
      <Toast.Description
        ref={ref}
        id={id}
        data-slot="toast-description"
        data-clamped={expanded ? undefined : ""}
        data-open={expanded ? "" : undefined}
        // Dragging inside the expanded text scrolls and selects instead of swiping the toast.
        data-base-ui-swipe-ignore={expanded ? "" : undefined}
        // A scrolling area must be reachable with the keyboard.
        tabIndex={scrolls ? 0 : undefined}
        style={{ "--toast-lines": lines } as CSSProperties}
        className={toastDescriptionClassName}
        render={<div />}
      />
      {expanded || overflows ? (
        <button
          type="button"
          data-slot="toast-expand"
          aria-expanded={expanded}
          aria-controls={id}
          className={toastExpandClassName}
          onClick={() => {
            if (expanded) restoreDuration();
            setExpanded(!expanded);
          }}
        >
          {expanded ? collapseLabel : expandLabel}
        </button>
      ) : null}
    </>
  );
}
