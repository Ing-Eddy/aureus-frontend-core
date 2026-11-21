/** `true` for `null` and `undefined`: the values every formatter shows as missing. */
export function isNil(value: unknown): value is null | undefined {
  return value === null || value === undefined;
}
