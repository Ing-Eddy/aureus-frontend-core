/** Ids of the synthetic list items. The NUL character never appears in real option ids. */
export const SELECT_ALL_ID = "\u0000all";
/** Id of the row that creates the typed value. */
export const CREATE_ID = "\u0000create";

/** Whether an id belongs to a synthetic row, which never enters the value. */
export const isSentinel = (id: string) => id === SELECT_ALL_ID || id === CREATE_ID;
