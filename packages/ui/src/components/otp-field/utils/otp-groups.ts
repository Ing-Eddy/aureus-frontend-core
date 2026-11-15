/** Whether `groups` is a usable split of `length` (positive sizes adding up to it). */
export function isValidGroups(length: number, groups?: readonly number[]): boolean {
  return (
    Array.isArray(groups) &&
    groups.length > 0 &&
    groups.every((size) => Number.isInteger(size) && size > 0) &&
    groups.reduce((sum, size) => sum + size, 0) === length
  );
}

/** Slot indexes per block; one block when `groups` is missing or does not split `length`. */
export function toBlocks(length: number, groups?: readonly number[]): number[][] {
  const sizes = groups && isValidGroups(length, groups) ? groups : [length];
  const blocks: number[][] = [];
  let start = 0;
  for (const size of sizes) {
    blocks.push(Array.from({ length: size }, (_, offset) => start + offset));
    start += size;
  }
  return blocks;
}
