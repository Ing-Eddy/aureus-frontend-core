import { createStore, type DraftStorage } from "../../shared/storage";
import { normalizeColor } from "./color";
import { createDefaultDraft } from "./default-theme";
import { chartModes, colorTokens, modes, neutralPalettes, type ThemeDraft } from "./theme-types";

export { browserStorage, type DraftStorage } from "../../shared/storage";

/** Versioned so that a later format can migrate or discard this one (design D10, D9). */
export const draftStorageKey = "aureus-theme-builder:draft:v2";
/** Drafts saved before the Typography Builder: they still hold fonts and letter spacing. */
export const legacyDraftStorageKey = "aureus-theme-builder:draft:v1";

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
  if (!isRecord(value) || value.version !== 2 || !isString(value.name)) return undefined;
  const { base, inputs, overrides } = value;
  if (!isRecord(base)) return undefined;
  if (!(base.kind === "generated" || (base.kind === "preset" && base.id === "aureus"))) {
    return undefined;
  }
  if (!isRecord(inputs) || !isRecord(overrides)) return undefined;
  if ("fonts" in inputs || "tracking" in inputs) return undefined;
  const { shadow } = inputs;
  if (!isRecord(shadow) || !isRecord(shadow.color)) return undefined;

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
    isColor(shadow.color.light) &&
    isColor(shadow.color.dark) &&
    [shadow.opacity, shadow.blur, shadow.spread, shadow.x, shadow.y].every(isNumber) &&
    isNumber(inputs.spacing) &&
    modes.every((mode) => {
      const set = overrides[mode];
      return (
        isRecord(set) &&
        Object.entries(set).every(([token, color]) => oneOf(colorTokens, token) && isColor(color))
      );
    });
  return valid ? (value as unknown as ThemeDraft) : undefined;
}

/**
 * A v1 draft as v2: fonts and letter spacing are dropped (the Typography Builder owns them) and
 * everything else is kept. `validateDraft` then checks the result like any stored draft.
 */
export function migrateDraftV1(value: unknown): ThemeDraft | undefined {
  if (!isRecord(value) || value.version !== 1 || !isRecord(value.inputs)) return undefined;
  const { fonts: _fonts, tracking: _tracking, ...inputs } = value.inputs;
  return validateDraft({ ...value, version: 2, inputs });
}

const store = (storage: DraftStorage | undefined) =>
  createStore(storage, {
    key: draftStorageKey,
    validate: validateDraft,
    create: createDefaultDraft,
    legacy: [{ key: legacyDraftStorageKey, migrate: migrateDraftV1 }],
  });

/** The stored draft (migrating a v1 one), or the default when there is none, it is invalid or storage fails. */
export const loadDraft = (storage: DraftStorage | undefined): ThemeDraft => store(storage).load();

export const saveDraft = (storage: DraftStorage | undefined, draft: ThemeDraft): void =>
  store(storage).save(draft);

export const clearDraft = (storage: DraftStorage | undefined): void => store(storage).clear();

/** Saves at most once per `delay` ms; `flush` writes the pending draft immediately. */
export const createDraftSaver = (storage: DraftStorage | undefined, delay = 300) =>
  store(storage).saver(delay);
