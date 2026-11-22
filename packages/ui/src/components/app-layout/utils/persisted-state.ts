import type { AppLayoutSide } from "../types";

/** What `persistKey` saves: the desktop state and the side. */
export interface PersistedLayoutState {
  open?: boolean;
  side?: AppLayoutSide;
}

function storage(): Storage | undefined {
  try {
    return typeof window === "undefined" ? undefined : window.localStorage;
  } catch {
    // Access can throw (blocked site data, sandboxed frames).
    return undefined;
  }
}

/** The saved state under `key`, or `undefined` when there is none, it is invalid or unreadable. */
export function readPersistedState(key: string | undefined): PersistedLayoutState | undefined {
  if (!key) return undefined;
  try {
    const raw = storage()?.getItem(key);
    if (!raw) return undefined;
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) return undefined;
    const { open, side } = parsed as Record<string, unknown>;
    return {
      open: typeof open === "boolean" ? open : undefined,
      side: side === "start" || side === "end" ? side : undefined,
    };
  } catch {
    return undefined;
  }
}

/** Saves the state under `key`. Failures (full or blocked storage) are ignored. */
export function writePersistedState(key: string, state: PersistedLayoutState): void {
  try {
    storage()?.setItem(key, JSON.stringify(state));
  } catch {
    // Storage is a convenience: the layout keeps working without it.
  }
}
