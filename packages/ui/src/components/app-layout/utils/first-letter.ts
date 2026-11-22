/**
 * The first user-perceived character of a label, upper-cased for the runtime locale: the letter
 * a collapsed navigation row shows when it has no icon. Leading whitespace is skipped. Accents and
 * emoji (including joined sequences such as a family emoji) stay one character. Without
 * `Intl.Segmenter` it falls back to the first code point.
 */
export function firstLetter(label: string): string {
  const text = label.trimStart();
  if (!text) return "";
  let first: string | undefined;
  if (typeof Intl !== "undefined" && typeof Intl.Segmenter === "function") {
    const segments = new Intl.Segmenter(undefined, { granularity: "grapheme" }).segment(text);
    first = segments[Symbol.iterator]().next().value?.segment;
  }
  first ??= Array.from(text)[0] ?? "";
  return first.toLocaleUpperCase();
}
