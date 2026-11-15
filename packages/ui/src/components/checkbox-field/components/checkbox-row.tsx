import type { MouseEvent, ReactNode, RefObject } from "react";
import { RequiredMark } from "@/internal/components";
import { cn } from "@/shadcn/lib/utils";
import { checkboxStyles } from "./styles";

export interface CheckboxRowProps {
  /** The box element. */
  box: ReactNode;
  /** Id of the text element; the box is named by it through `aria-labelledby`. */
  textId: string;
  /** Used to forward clicks on the text (and on a card) to the box. */
  boxRef: RefObject<HTMLButtonElement | null>;
  /** The text beside the box. */
  text?: ReactNode;
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
  requiredMarkClassName?: string;
}

/** Elements that keep their own click: a link inside the text navigates without toggling. */
const INTERACTIVE = "a, button, input, select, textarea, label, [role=checkbox], [tabindex]";

/**
 * The row of a checkbox field: box, text and end slot; a bordered clickable card on demand.
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
  requiredMark,
  end,
  position,
  appearance,
  error,
  locked,
  className,
  textClassName,
  requiredMarkClassName,
}: CheckboxRowProps) {
  const card = appearance === "card";

  // Pointer enhancement only: keyboard and assistive technology use the box itself.
  const forwardClick = (event: MouseEvent<HTMLDivElement>) => {
    const target = event.target as Element;
    if (target.closest(INTERACTIVE)) return;
    const onText = Boolean(target.closest("[data-slot=checkbox-label]"));
    if (onText || card) boxRef.current?.click();
  };

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
      {text ? (
        <span
          id={textId}
          data-slot="checkbox-label"
          className={cn(
            checkboxStyles.text,
            locked ? checkboxStyles.textLocked : checkboxStyles.textInteractive,
            textClassName,
          )}
        >
          {text}
          {requiredMark ? (
            <>
              {" "}
              <RequiredMark className={requiredMarkClassName} />
            </>
          ) : null}
        </span>
      ) : (
        <span className="flex-1" />
      )}
      {end ? (
        <span data-slot="checkbox-end" className={checkboxStyles.end}>
          {end}
        </span>
      ) : null}
    </div>
  );
}
