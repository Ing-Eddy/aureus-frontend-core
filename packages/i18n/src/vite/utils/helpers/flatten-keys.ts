const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

/**
 * The keys of a translation object as dot paths, sorted. Nested objects are walked; any other
 * value (string, array, number…) is a leaf.
 *
 * ```ts
 * flattenKeys({ login: { title: "Entrar", submit: "Enviar" } }); // ["login.submit", "login.title"]
 * ```
 */
export function flattenKeys(content: Record<string, unknown>, prefix = ""): string[] {
  return Object.entries(content)
    .flatMap(([key, value]) => {
      const path = prefix ? `${prefix}.${key}` : key;
      return isPlainObject(value) ? flattenKeys(value, path) : [path];
    })
    .sort();
}
