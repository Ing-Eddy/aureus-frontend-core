/** Lowercase, accent-free kebab-case for a download name. `fallback` when nothing is left. */
export function toFileName(name: string, fallback = "custom"): string {
  const slug = name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `${slug || fallback}.css`;
}
