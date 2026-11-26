const baseOf = (code: string) => code.toLowerCase().split(/[-_]/)[0] ?? "";

/**
 * The first candidate that matches a supported language, as written in `supported`. Each
 * candidate is tried in order: an exact match (ignoring case), then its base language
 * (`es-MX` → `es`), then a supported language with the same base (`pt` → `pt-BR`).
 */
export function matchLanguage(
  candidates: readonly string[],
  supported: readonly string[],
): string | undefined {
  for (const candidate of candidates) {
    const lower = candidate.toLowerCase();
    const base = baseOf(candidate);
    const match =
      supported.find((language) => language.toLowerCase() === lower) ??
      supported.find((language) => language.toLowerCase() === base) ??
      supported.find((language) => baseOf(language) === base);
    if (match) return match;
  }
  return undefined;
}
