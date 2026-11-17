/** Marks every 25 from 0 to 100, labelled at the ends. */
export const quarterMarks = [
  { value: 0, label: "0" },
  { value: 25 },
  { value: 50, label: "50" },
  { value: 75 },
  { value: 100, label: "100" },
];

/** Price marks for a 0–1000 range in euros. */
export const priceMarks = [
  { value: 0, label: "0 €" },
  { value: 250 },
  { value: 500, label: "500 €" },
  { value: 750 },
  { value: 1000, label: "1000 €" },
];

export const euros: Intl.NumberFormatOptions = {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
};

/** The centre of an element on the page. */
export function centre(element: Element) {
  const box = element.getBoundingClientRect();
  return { x: box.left + box.width / 2, y: box.top + box.height / 2 };
}

/** The point at `percent` of a slider's track, from its start (left in LTR, bottom in vertical). */
export function trackPoint(slider: Element, percent: number) {
  const track = slider.querySelector("[data-orientation]:not([role=slider])") ?? slider;
  const box = track.getBoundingClientRect();
  const vertical = slider.getAttribute("data-orientation") === "vertical";
  const rtl = getComputedStyle(slider).direction === "rtl";
  if (vertical)
    return { x: box.left + box.width / 2, y: box.bottom - (box.height * percent) / 100 };
  const fromLeft = rtl ? 100 - percent : percent;
  return { x: box.left + (box.width * fromLeft) / 100, y: box.top + box.height / 2 };
}

/**
 * Drags a thumb with native pointer events through the given points. Radix moves a thumb only
 * while it holds pointer capture, which synthetic events never get, so the thumb's capture methods
 * are replaced for the drag (the events and the positions are real). It waits a frame between
 * events, as a person's drag does, so React renders each move before the next one.
 */
export async function dragThumb(thumb: HTMLElement, points: { x: number; y: number }[]) {
  let captured = false;
  const original = {
    setPointerCapture: thumb.setPointerCapture,
    hasPointerCapture: thumb.hasPointerCapture,
    releasePointerCapture: thumb.releasePointerCapture,
  };
  Object.assign(thumb, {
    setPointerCapture: () => {
      captured = true;
    },
    hasPointerCapture: () => captured,
    releasePointerCapture: () => {
      captured = false;
    },
  });
  const start = centre(thumb);
  const fire = (type: string, point: { x: number; y: number }, buttons: number) =>
    thumb.dispatchEvent(
      new PointerEvent(type, {
        bubbles: true,
        cancelable: true,
        composed: true,
        pointerId: 1,
        pointerType: "mouse",
        isPrimary: true,
        button: 0,
        buttons,
        clientX: point.x,
        clientY: point.y,
      }),
    );
  const frame = () => new Promise((resolve) => requestAnimationFrame(resolve));
  fire("pointerdown", start, 1);
  await frame();
  for (const point of points) {
    fire("pointermove", point, 1);
    await frame();
  }
  fire("pointerup", points.at(-1) ?? start, 0);
  await frame();
  Object.assign(thumb, original);
}
