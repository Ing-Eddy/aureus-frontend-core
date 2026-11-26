import type { MouseEvent, ReactNode, RefObject } from "react";
import { RequiredMark } from "@/internal/components/field-shell";
import { cn } from "@/shadcn/lib/utils";
import { choiceStyles } from "./choice-styles";

/** Props of `ChoiceRow`. */
export interface ChoiceRowProps {
  /** Prefix of every part's `data-slot` (`checkbox-row`, `radio-label`…). Defaults to `"checkbox"`. */
  slot?: "checkbox" | "radio" | "switch";
  /** The control element (a checkbox or a radio). */
  box: ReactNode;
  /** Id of the text element; the control is named by it through `aria-labelledby`. */
  textId: string;
  /** Used to forward clicks on the text (and on a card) to the control. */
  boxRef: RefObject<HTMLButtonElement | null>;
  /** The text beside the control. */
  text?: ReactNode;
  /** A muted second line under the text. Clicking it toggles the control, like the text. */
  description?: ReactNode;
  /** Id of the description, referenced by the control's `aria-describedby`. */
  descriptionId?: string;
  /** Extra content under the text and description (for example an input). Its clicks are its own. */
  after?: ReactNode;
  /** Shows the required mark after the text (when there is no header label to carry it). */
  requiredMark?: boolean;
  /** Spinner and action, at the inline end. */
  end?: ReactNode;
  /** The side of the text the control is on, following the text direction. */
  position: "start" | "end";
  /** A plain row, or a bordered card that toggles the control wherever it is clicked. */
  appearance: "plain" | "card";
  /** Draws the card's border as destructive. */
  error?: boolean;
  /** The control cannot be changed: the text is dimmed and does not look clickable. */
  locked: boolean;
  /** Extra classes of the row. */
  className?: string;
  /** Extra classes of the text. */
  textClassName?: string;
  /** Extra classes of the description. */
  descriptionClassName?: string;
  /** Extra classes of the required mark. */
  requiredMarkClassName?: string;
}

/** Elements that keep their own click: a link inside the text navigates without toggling. */
const INTERACTIVE =
  "a, button, input, select, textarea, label, [role=checkbox], [role=radio], [tabindex]";

/**
 * The row of a choice control (checkbox or radio): control, text (with an optional description
 * and extra content) and end slot; a bordered clickable card on demand.
 *
 * The text is not a `<label>`: browsers activate a label's control even when a link inside the
 * label is clicked. Instead the text names the control (`aria-labelledby`) and the row forwards
 * pointer clicks on the text, or anywhere on a card, to the control, skipping interactive elements.
 */
export function ChoiceRow({
  slot = "checkbox",
  box,
  textId,
  boxRef,
  text,
  description,
  descriptionId,
  after,
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
}: ChoiceRowProps) {
  const card = appearance === "card";
  const pointer = locked ? choiceStyles.textLocked : choiceStyles.textInteractive;
  // Text parts whose clicks toggle the control (a switch's state label is one too).
  const textParts = `[data-slot=${slot}-label], [data-slot=${slot}-description], [data-slot=${slot}-state-label]`;

  // Pointer enhancement only: keyboard and assistive technology use the control itself.
  const forwardClick = (event: MouseEvent<HTMLDivElement>) => {
    const target = event.target as Element;
    // Only interactive elements inside the row count: an ancestor (such as a radiogroup, which has
    // a tabindex) must not swallow the click.
    const interactive = target.closest(INTERACTIVE);
    if (interactive && event.currentTarget.contains(interactive)) return;
    if (card || target.closest(textParts)) boxRef.current?.click();
  };

  const label = text ? (
    <span
      id={textId}
      data-slot={`${slot}-label`}
      className={cn(choiceStyles.text, pointer, textClassName)}
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
  if (label && (description || after)) {
    // The text, its description and any extra content share one column; the control stays on the
    // first line.
    content = (
      <span data-slot={`${slot}-text`} className={choiceStyles.textColumn}>
        {label}
        {description ? (
          <span
            id={descriptionId}
            data-slot={`${slot}-description`}
            // No extra dimming: the description often explains why the option is unavailable.
            className={cn(
              choiceStyles.description,
              locked ? "cursor-not-allowed" : choiceStyles.textInteractive,
              descriptionClassName,
            )}
          >
            {description}
          </span>
        ) : null}
        {after}
      </span>
    );
  } else if (label) {
    content = label;
  }

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: pointer shortcut; the control is the keyboard target.
    // biome-ignore lint/a11y/useKeyWithClickEvents: the control inside the row handles the keyboard.
    <div
      data-slot={`${slot}-row`}
      data-position={position}
      data-appearance={appearance}
      className={cn(
        choiceStyles.row,
        card && choiceStyles.card,
        card && error && choiceStyles.cardError,
        card && !locked && "cursor-pointer",
        className,
      )}
      onClick={forwardClick}
    >
      <span
        data-slot={`${slot}-box-slot`}
        className={cn(choiceStyles.boxSlot, position === "end" && "order-last")}
      >
        {box}
      </span>
      {content}
      {end ? (
        <span data-slot={`${slot}-end`} className={choiceStyles.end}>
          {end}
        </span>
      ) : null}
    </div>
  );
}
