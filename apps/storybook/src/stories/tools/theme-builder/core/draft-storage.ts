import { normalizeColor } from "./color";
import { createDefaultDraft } from "./default-theme";
import { chartModes, colorTokens, modes, neutralPalettes, type ThemeDraft } from "./theme-types";

/** Versioned so that a future format can discard or migrate old drafts (design D10). */
export const draftStorageKey = "aureus-theme-builder:draft:v1";

export type DraftStorage = Pick<Storage, "getItem" | "setItem" | "removeItem">;

/** `localStorage`, or `undefined` where even touching it throws (privacy modes, sandboxes). */
export function browserStorage(): DraftStorage | undefined {
  try {
    return globalThis.localStorage ?? undefined;
  } catch {
    return undefined;
  }
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const isNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);
const isString = (value: unknown): value is string => typeof value === "string";
const isColor = (value: unknown): value is string =>
  isString(value) && normalizeColor(value) === value;
const oneOf = <T extends string>(values: readonly T[], value: unknown): value is T =>
  isString(value) && (values as readonly string[]).includes(value);

/** The draft if `value` has exactly the expected shape and every color is valid. */
export function validateDraft(value: unknown): ThemeDraft | undefined {
  if (!isRecord(value) || value.version !== 1 || !isString(value.name)) return undefined;
  const { base, inputs, overrides } = value;
  if (!isRecord(base)) return undefined;
  if (!(base.kind === "generated" || (base.kind === "preset" && base.id === "aureus"))) {
    return undefined;
  }
  if (!isRecord(inputs) || !isRecord(overrides)) return undefined;
  const { fonts, shadow } = inputs;
  if (!isRecord(fonts) || !isRecord(shadow) || !isRecord(shadow.color)) return undefined;

  const valid =
    isColor(inputs.primary) &&
    typeof inputs.achromaticPrimary === "boolean" &&
    oneOf(neutralPalettes, inputs.neutral) &&
    isNumber(inputs.tint) &&
    inputs.tint >= 0 &&
    inputs.tint <= 1 &&
    isColor(inputs.destructive) &&
    oneOf(chartModes, inputs.chartMode) &&
    isNumber(inputs.radius) &&
    isString(fonts.sans) &&
    isString(fonts.serif) &&
    isString(fonts.mono) &&
    isColor(shadow.color.light) &&
    isColor(shadow.color.dark) &&
    [shadow.opacity, shadow.blur, shadow.spread, shadow.x, shadow.y].every(isNumber) &&
    isNumber(inputs.spacing) &&
    isNumber(inputs.tracking) &&
    modes.every((mode) => {
      const set = overrides[mode];
      return (
        isRecord(set) &&
        Object.entries(set).every(([token, color]) => oneOf(colorTokens, token) && isColor(color))
      );
    });
  return valid ? (value as unknown as ThemeDraft) : undefined;
}

/** The stored draft, or the default one when there is none, it is invalid or storage fails. */
export function loadDraft(storage: DraftStorage | undefined): ThemeDraft {
  try {
    const raw = storage?.getItem(draftStorageKey);
    if (raw) return validateDraft(JSON.parse(raw)) ?? createDefaultDraft();
  } catch {
    // Corrupt JSON or a throwing storage: start fresh.
  }
  return createDefaultDraft();
}

export function saveDraft(storage: DraftStorage | undefined, draft: ThemeDraft): void {
  try {
    storage?.setItem(draftStorageKey, JSON.stringify(draft));
  } catch {
    // Quota exceeded or storage disabled: the builder keeps working without persistence.
  }
}

export function clearDraft(storage: DraftStorage | undefined): void {
  try {
    storage?.removeItem(draftStorageKey);
  } catch {
    // Same as above.
  }
}

/** Saves at most once per `delay` ms; `flush` writes the pending draft immediately. */
export function createDraftSaver(storage: DraftStorage | undefined, delay = 300) {
  let timer: ReturnType<typeof setTimeout> | undefined;
  let pending: ThemeDraft | undefined;
  const flush = () => {
    if (timer) clearTimeout(timer);
    timer = undefined;
    if (pending) saveDraft(storage, pending);
    pending = undefined;
  };
  return {
    save(draft: ThemeDraft) {
      pending = draft;
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
}
