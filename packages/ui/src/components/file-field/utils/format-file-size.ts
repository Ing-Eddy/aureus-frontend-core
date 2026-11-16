const units = [
  { unit: "gigabyte", size: 1e9 },
  { unit: "megabyte", size: 1e6 },
  { unit: "kilobyte", size: 1e3 },
] as const;

/**
 * A size formatted with `Intl` for `locale` (the browser's when omitted), in the largest decimal
 * unit that fits (`512 byte`, `1.5 kB`, `2 MB`), with at most one fraction digit. The unit names
 * come from `Intl`, so no language is hard-coded.
 */
export function formatFileSize(bytes: number, locale?: string): string {
  const match = units.find(({ size }) => bytes >= size);
  const unit = match?.unit ?? "byte";
  const value = match ? bytes / match.size : bytes;
  return new Intl.NumberFormat(locale, {
    style: "unit",
    unit,
    unitDisplay: "short",
    maximumFractionDigits: 1,
  }).format(value);
}
