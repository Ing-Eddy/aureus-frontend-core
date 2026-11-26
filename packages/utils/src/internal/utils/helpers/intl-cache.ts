/**
 * `Intl` formatters are expensive to create and a table can format thousands of cells, so each one
 * is created once per locale and options. The keys are bounded by what an app actually uses (a
 * closed date catalog and a few number and list options), so the caches are never evicted.
 */

/** A locale as `Intl` accepts it; `undefined` is the runtime's default. */
type Locale = string | string[] | undefined;

/**
 * Wraps a formatter constructor with a cache keyed by the locale and the options. An error thrown
 * by the constructor reaches the caller and nothing is cached.
 */
function cached<T, O extends object>(create: (locale: Locale, options: O) => T) {
  const cache = new Map<string, T>();
  return (locale: Locale, options: O): T => {
    const key = JSON.stringify([locale, options]);
    let formatter = cache.get(key);
    if (formatter === undefined) {
      formatter = create(locale, options);
      cache.set(key, formatter);
    }
    return formatter;
  };
}

/** The cached `Intl.DateTimeFormat` for a locale and options. */
export const dateTimeFormat = cached(
  (locale, options: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat(locale, options),
);

/** The cached `Intl.NumberFormat` for a locale and options. */
export const numberFormat = cached(
  (locale, options: Intl.NumberFormatOptions) => new Intl.NumberFormat(locale, options),
);

/** The cached `Intl.ListFormat` for a locale and options. */
export const listFormat = cached(
  (locale, options: Intl.ListFormatOptions) => new Intl.ListFormat(locale, options),
);
