/** The rules of an `accept` string: MIME types, `type/*` wildcards and `.ext` extensions. */
export function parseAccept(accept: string | undefined): string[] {
  if (!accept) return [];
  return accept
    .split(",")
    .map((rule) => rule.trim().toLowerCase())
    .filter(Boolean);
}

/**
 * Whether a file matches an `accept` string, as the native picker does: by extension (`.pdf`),
 * by exact MIME type (`application/pdf`) or by MIME family (`image/*`). Case is ignored. An empty
 * `accept` matches every file.
 */
export function acceptMatches(file: File, accept: string | undefined): boolean {
  const rules = parseAccept(accept);
  if (rules.length === 0) return true;
  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();
  return rules.some((rule) => {
    if (rule.startsWith(".")) return name.endsWith(rule);
    if (rule.endsWith("/*")) return type.startsWith(rule.slice(0, -1));
    return type === rule;
  });
}
