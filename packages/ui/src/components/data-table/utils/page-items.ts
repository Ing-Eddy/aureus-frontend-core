/** A page number, or a gap between page numbers. */
export type PageItem = number | "start-gap" | "end-gap";

/** The integers from `from` to `to`, both included. */
const range = (from: number, to: number) =>
  Array.from({ length: to - from + 1 }, (_, index) => from + index);

/**
 * The page buttons to show (1-based): always the first and last pages, `siblings` pages on each
 * side of the current one, and a gap where pages are left out. The list keeps the same length
 * (`2 × siblings + 5`) while the current page moves, so the buttons do not jump.
 */
export function pageItems(current: number, count: number, siblings: number): PageItem[] {
  const slots = siblings * 2 + 5;
  if (count <= slots) return range(1, count);

  // Pages listed together at each end (the first or last one included).
  const side = siblings * 2 + 3;
  if (current + siblings <= side) return [...range(1, side), "end-gap", count];
  if (current - siblings >= count - side + 1) {
    return [1, "start-gap", ...range(count - side + 1, count)];
  }
  return [1, "start-gap", ...range(current - siblings, current + siblings), "end-gap", count];
}
