/**
 * The initials of a name: the first letter of the first word and, when there are several, of the
 * last one, uppercased for `locale`. Letters outside the Basic Multilingual Plane are kept whole.
 */
export function initials(name: string | undefined, locale?: string): string {
  const words = (name ?? "").trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "";
  const first = Array.from(words[0] as string)[0] ?? "";
  const last = words.length > 1 ? (Array.from(words[words.length - 1] as string)[0] ?? "") : "";
  return `${first}${last}`.toLocaleUpperCase(locale);
}
