/** A plain object (`{}` or `Object.create(null)`), as opposed to arrays, dates, class instances or files. */
export function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== "object") return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

/**
 * Deep-merges `values` over `defaults`, without mutating either:
 * - plain objects are merged recursively;
 * - arrays, dates and primitives replace the default;
 * - `undefined` keeps the default, and `null` is kept.
 */
export function mergeValues<T>(defaults: T, values: unknown): T {
  if (values === undefined) return defaults;
  if (!isPlainObject(defaults) || !isPlainObject(values)) return values as T;

  const result: Record<string, unknown> = { ...defaults };
  for (const [key, value] of Object.entries(values)) {
    if (value === undefined) continue;
    result[key] = mergeValues(result[key], value);
  }
  return result as T;
}
