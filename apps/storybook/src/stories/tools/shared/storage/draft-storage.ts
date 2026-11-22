/** The part of `Storage` a tool needs; tests pass an in-memory one. */
export type DraftStorage = Pick<Storage, "getItem" | "setItem" | "removeItem">;

/** `localStorage`, or `undefined` where even touching it throws (privacy modes, sandboxes). */
export function browserStorage(): DraftStorage | undefined {
  try {
    return globalThis.localStorage ?? undefined;
  } catch {
    return undefined;
  }
}

/** An older stored format that can be turned into the current one. */
export interface LegacyDraft<T> {
  key: string;
  /** The current draft built from the old stored value, or `undefined` to discard it. */
  migrate: (value: unknown) => T | undefined;
}

export interface StoreOptions<T> {
  /** Versioned key, so that a later format can migrate or discard this one. */
  key: string;
  /** The draft if `value` has exactly the expected shape. */
  validate: (value: unknown) => T | undefined;
  /** The draft used when nothing valid is stored. */
  create: () => T;
  /** Older keys, tried in order when the current key holds nothing. */
  legacy?: readonly LegacyDraft<T>[];
}

export interface DraftStore<T> {
  load: () => T;
  save: (draft: T) => void;
  clear: () => void;
  /** Saves at most once per `delay` ms; `flush` writes the pending draft immediately. */
  saver: (delay?: number) => DraftSaver<T>;
}

export interface DraftSaver<T> {
  save: (draft: T) => void;
  flush: () => void;
  cancel: () => void;
}

const read = (storage: DraftStorage | undefined, key: string): unknown => {
  const raw = storage?.getItem(key);
  return raw ? JSON.parse(raw) : undefined;
};

/**
 * Load, save and clear one tool's draft. Every storage access is guarded: a throwing storage, corrupt
 * JSON or an invalid shape all fall back to `create()`, so the tool stays usable without persistence.
 */
export function createStore<T>(
  storage: DraftStorage | undefined,
  options: StoreOptions<T>,
): DraftStore<T> {
  const save = (draft: T) => {
    try {
      storage?.setItem(options.key, JSON.stringify(draft));
    } catch {
      // Quota exceeded or storage disabled: keep working without persistence.
    }
  };
  const remove = (key: string) => {
    try {
      storage?.removeItem(key);
    } catch {
      // Same as above.
    }
  };

  const load = (): T => {
    try {
      const current = read(storage, options.key);
      if (current !== undefined) return options.validate(current) ?? options.create();
    } catch {
      return options.create();
    }
    for (const legacy of options.legacy ?? []) {
      try {
        const old = read(storage, legacy.key);
        if (old === undefined) continue;
        const migrated = legacy.migrate(old);
        const valid = migrated === undefined ? undefined : options.validate(migrated);
        remove(legacy.key);
        if (valid !== undefined) {
          save(valid);
          return valid;
        }
      } catch {
        remove(legacy.key);
      }
    }
    return options.create();
  };

  const saver = (delay = 300): DraftSaver<T> => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    let pending: { draft: T } | undefined;
    const flush = () => {
      if (timer) clearTimeout(timer);
      timer = undefined;
      if (pending) save(pending.draft);
      pending = undefined;
    };
    return {
      save(draft) {
        pending = { draft };
        if (timer) clearTimeout(timer);
        timer = setTimeout(flush, delay);
      },
      flush,
      cancel() {
        if (timer) clearTimeout(timer);
        timer = undefined;
        pending = undefined;
      },
    };
  };

  return { load, save, clear: () => remove(options.key), saver };
}
