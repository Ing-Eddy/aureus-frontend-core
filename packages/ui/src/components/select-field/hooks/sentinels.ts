/** Ids of the synthetic list items. The NUL character never appears in real option ids. */
export const SELECT_ALL_ID = "\u0000all";
export const CREATE_ID = "\u0000create";

export const isSentinel = (id: string) => id === SELECT_ALL_ID || id === CREATE_ID;
