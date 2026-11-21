/**
 * `Intl` formatters are expensive to create and a table can format thousands of cells, so each one
 * is created once per locale and options. The keys are bounded by what an app actually uses (a
 * closed date catalog and a few number and list options), so the caches are never evicted.
 */

type Locale = string | string[] | undefined;

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

export const dateTimeFormat = cached(
  (locale, options: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat(locale, options),
);

export const numberFormat = cached(
  (locale, options: Intl.NumberFormatOptions) => new Intl.NumberFormat(locale, options),
);

export const listFormat = cached(
  (locale, options: Intl.ListFormatOptions) => new Intl.ListFormat(locale, options),
);
