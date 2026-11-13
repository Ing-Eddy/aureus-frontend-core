/** `{ Item: x }` with prefix "DropdownMenu" → `{ DropdownMenuItem: x }`, keeping exact key types. */
export type Prefixed<P extends string, T> = { [K in keyof T as `${P}${K & string}`]: T[K] };

/**
 * Renames every key of `parts` with `prefix`. Used to share the docs of sub-components that several
 * components have under different names (the items of DropdownMenu, ContextMenu and Menubar).
 */
export function prefixed<P extends string, T extends object>(prefix: P, parts: T): Prefixed<P, T> {
  return Object.fromEntries(
    Object.entries(parts).map(([key, value]) => [`${prefix}${key}`, value]),
  ) as Prefixed<P, T>;
}
