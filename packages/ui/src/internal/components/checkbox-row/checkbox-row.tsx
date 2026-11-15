import type { MouseEvent, ReactNode, RefObject } from "react";
import { RequiredMark } from "@/internal/components/field-shell";
import { cn } from "@/shadcn/lib/utils";
import { checkboxStyles } from "./checkbox-styles";

export interface CheckboxRowProps {
  /** The box element. */
  box: ReactNode;
  /** Id of the text element; the box is named by it through `aria-labelledby`. */
  textId: string;
  /** Used to forward clicks on the text (and on a card) to the box. */
  boxRef: RefObject<HTMLButtonElement | null>;
  /** The text beside the box. */
  text?: ReactNode;
  /** A muted second line under the text. Clicking it toggles the box, like the text. */
  description?: ReactNode;
  /** Id of the description, referenced by the box's `aria-describedby`. */
  descriptionId?: string;
  /** Shows the required mark after the text (when there is no header label to carry it). */
  requiredMark?: boolean;
  /** Spinner and action, at the inline end. */
  end?: ReactNode;
  position: "start" | "end";
  appearance: "plain" | "card";
  error?: boolean;
  locked: boolean;
  className?: string;
  textClassName?: string;
  descriptionClassName?: string;
  requiredMarkClassName?: string;
}

/** Elements that keep their own click: a link inside the text navigates without toggling. */
const INTERACTIVE = "a, button, input, select, textarea, label, [role=checkbox], [tabindex]";

/** Parts whose clicks toggle the box in a plain row. */
const TEXT_PARTS = "[data-slot=checkbox-label], [data-slot=checkbox-description]";

/**
 * The row of a checkbox: box, text (with an optional description) and end slot; a bordered
 * clickable card on demand.
 *
 * The text is not a `<label>`: browsers activate a label's control even when a link inside the
 * label is clicked. Instead the text names the box (`aria-labelledby`) and the row forwards
 * pointer clicks on the text, or anywhere on a card, to the box, skipping interactive elements.
 */
export function CheckboxRow({
  box,
  textId,
  boxRef,
  text,
  description,
  descriptionId,
  requiredMark,
  end,
  position,
  appearance,
  error,
  locked,
  className,
  textClassName,
  descriptionClassName,
  requiredMarkClassName,
}: CheckboxRowProps) {
  const card = appearance === "card";
  const pointer = locked ? checkboxStyles.textLocked : checkboxStyles.textInteractive;

  // Pointer enhancement only: keyboard and assistive technology use the box itself.
  const forwardClick = (event: MouseEvent<HTMLDivElement>) => {
    const target = event.target as Element;
    if (target.closest(INTERACTIVE)) return;
    if (card || target.closest(TEXT_PARTS)) boxRef.current?.click();
  };

  const label = text ? (
    <span
      id={textId}
      data-slot="checkbox-label"
      className={cn(checkboxStyles.text, pointer, textClassName)}
    >
      {text}
      {requiredMark ? (
        <>
          {" "}
          <RequiredMark className={requiredMarkClassName} />
        </>
      ) : null}
    </span>
  ) : null;

  let content: ReactNode = <span className="flex-1" />;
  if (label && description) {
    // The text and its description share one column; the box stays on the first line.
    content = (
      <span data-slot="checkbox-text" className={checkboxStyles.textColumn}>
        {label}
        <span
          id={descriptionId}
          data-slot="checkbox-description"
          // No extra dimming: the description often explains why the option is unavailable.
          className={cn(
            checkboxStyles.description,
            locked ? "cursor-not-allowed" : checkboxStyles.textInteractive,
            descriptionClassName,
          )}
        >
          {description}
        </span>
      </span>
    );
  } else if (label) {
    content = label;
  }

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: pointer shortcut; the box is the keyboard target.
    // biome-ignore lint/a11y/useKeyWithClickEvents: the box inside the row handles the keyboard.
    <div
      data-slot="checkbox-row"
      data-position={position}
      data-appearance={appearance}
      className={cn(
        checkboxStyles.row,
        card && checkboxStyles.card,
        card && error && checkboxStyles.cardError,
        card && !locked && "cursor-pointer",
        className,
      )}
      onClick={forwardClick}
    >
      <span
        data-slot="checkbox-box-slot"
        className={cn(checkboxStyles.boxSlot, position === "end" && "order-last")}
      >
        {box}
      </span>
      {content}
      {end ? (
        <span data-slot="checkbox-end" className={checkboxStyles.end}>
          {end}
        </span>
      ) : null}
    </div>
  );
}
