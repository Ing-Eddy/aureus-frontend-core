/** Number of decimal places of `value` as written ("1.25" → 2, 1e-7 → 7). */
export function decimalPlaces(value: number): number {
  if (!Number.isFinite(value)) return 0;
  const text = String(value);
  const exponent = text.match(/e-(\d+)$/);
  if (exponent) {
    const mantissa = text.slice(0, text.indexOf("e"));
    return Number(exponent[1]) + (mantissa.split(".")[1]?.length ?? 0);
  }
  return text.split(".")[1]?.length ?? 0;
}

/**
 * Rounds half away from zero to `decimals` places without binary artefacts (`1.005` → `1.01`),
 * by shifting the decimal point in the string form instead of multiplying.
 */
export function round(value: number, decimals?: number): number {
  if (decimals === undefined || !Number.isFinite(value)) return value;
  const sign = value < 0 ? -1 : 1;
  const abs = Math.abs(value);
  const shifted = String(abs).includes("e")
    ? Math.round(abs * 10 ** decimals)
    : Math.round(Number(`${abs}e${decimals}`));
  const result = Number(`${shifted}e-${decimals}`);
  return result === 0 ? 0 : sign * result;
}

/** Exact sum of two decimals (`0.1 + 0.2` → `0.3`): adds them as scaled integers. */
export function addScaled(a: number, b: number): number {
  const factor = 10 ** Math.max(decimalPlaces(a), decimalPlaces(b));
  return Math.round(a * factor + b * factor) / factor;
}

/** `value` limited to `[min, max]` (either bound may be missing). */
export function clamp(value: number, min?: number, max?: number): number {
  return Math.min(
    Math.max(value, min ?? Number.NEGATIVE_INFINITY),
    max ?? Number.POSITIVE_INFINITY,
  );
}

/** Largest absolute value that `number` still holds exactly with `decimals` places. */
export function maxSafe(decimals = 0): number {
  return Number.MAX_SAFE_INTEGER / 10 ** decimals;
}
