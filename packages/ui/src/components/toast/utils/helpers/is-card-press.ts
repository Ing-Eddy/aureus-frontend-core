/** How far the pointer may travel, in pixels, and still count as a press rather than a drag. */
const dragTolerance = 5;

/**
 * Elements that handle their own presses, the areas of a toast that hold custom content, and the row
 * of actions: a disabled button takes no pointer events, so its press lands on the row.
 */
const ownPressSelector =
  'a,button,input,select,textarea,label,summary,[role="button"],[data-base-ui-swipe-ignore],[data-slot="toast-actions"]';

/** A point of the viewport. */
export interface Point {
  /** Horizontal position. */
  x: number;
  /** Vertical position. */
  y: number;
}

/** What a click on a toast carries. */
export interface CardClick {
  /** Where the click ended. */
  point: Point;
  /** Where the pointer went down, when it did on this toast. */
  origin: Point | null;
  /** The element clicked. */
  target: Element;
  /** The toast that handles the click. */
  card: Element;
}

/**
 * Whether a click on a toast means "open this notification": not a press on a control or on custom
 * content, not the end of a drag (such as a swipe that did not dismiss) and not a text selection.
 */
export function isCardPress({ point, origin, target, card }: CardClick): boolean {
  const own = target.closest(ownPressSelector);
  if (own && card.contains(own)) return false;
  if (origin && Math.hypot(point.x - origin.x, point.y - origin.y) > dragTolerance) return false;
  return !window.getSelection()?.toString();
}
