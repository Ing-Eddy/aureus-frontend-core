/** Created on first use and reused for every call. */
let segmenter: Intl.Segmenter | undefined;

/** The user-perceived characters of `text` (an emoji with its modifiers, a letter with its marks). */
export function graphemes(text: string): string[] {
  segmenter ??= new Intl.Segmenter(undefined, { granularity: "grapheme" });
  return Array.from(segmenter.segment(text), ({ segment }) => segment);
}

/**
 * `text` cut to at most `maxLength` graphemes, `ellipsis` included. Whitespace at the end of the
 * cut is removed, and the ellipsis is added only when something is cut. The ellipsis must be
 * shorter than `maxLength`; `displayText` guarantees it.
 */
export function truncateGraphemes(text: string, maxLength: number, ellipsis = ""): string {
  // A string never has more graphemes than UTF-16 code units.
  if (text.length <= maxLength) return text;
  const parts = graphemes(text);
  if (parts.length <= maxLength) return text;
  const keep = maxLength - graphemes(ellipsis).length;
  return `${parts.slice(0, keep).join("").trimEnd()}${ellipsis}`;
}
