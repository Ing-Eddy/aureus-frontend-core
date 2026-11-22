import { useEffect, useMemo, useReducer, useRef } from "react";
import { createDefaultDraft } from "./core/default-theme";
import { clearDraft, createDraftSaver, type DraftStorage, loadDraft } from "./core/draft-storage";
import {
  type ColorToken,
  colorInputKeys,
  type Mode,
  type ShadowInputs,
  type ThemeDraft,
  type ThemeInputs,
} from "./core/theme-types";

type ScalarInputKey = Exclude<keyof ThemeInputs, "shadow">;

export type DraftAction =
  | { type: "input"; key: ScalarInputKey; value: ThemeInputs[ScalarInputKey] }
  | { type: "shadow"; patch: Partial<Omit<ShadowInputs, "color">> }
  | { type: "shadowColor"; mode: Mode; color: string }
  | { type: "override"; mode: Mode; token: ColorToken; value: string | undefined }
  | { type: "name"; name: string }
  | { type: "replace"; draft: ThemeDraft }
  | { type: "reset" };

const colorInputs: ReadonlySet<string> = new Set(colorInputKeys);

export function draftReducer(draft: ThemeDraft, action: DraftAction): ThemeDraft {
  switch (action.type) {
    case "input":
      return {
        ...draft,
        // Editing a color input leaves the preset: colors are generated from now on (design D2).
        base: colorInputs.has(action.key) ? { kind: "generated" } : draft.base,
        inputs: { ...draft.inputs, [action.key]: action.value },
      };
    case "shadow":
      return {
        ...draft,
        inputs: { ...draft.inputs, shadow: { ...draft.inputs.shadow, ...action.patch } },
      };
    case "shadowColor":
      return {
        ...draft,
        inputs: {
          ...draft.inputs,
          shadow: {
            ...draft.inputs.shadow,
            color: { ...draft.inputs.shadow.color, [action.mode]: action.color },
          },
        },
      };
    case "override": {
      const { [action.token]: _previous, ...rest } = draft.overrides[action.mode];
      const set = action.value === undefined ? rest : { ...rest, [action.token]: action.value };
      return { ...draft, overrides: { ...draft.overrides, [action.mode]: set } };
    }
    case "name":
      return { ...draft, name: action.name };
    case "replace":
      return action.draft;
    case "reset":
      return createDefaultDraft();
  }
}

/** The draft, restored from storage on first render and saved (debounced) on every change. */
export function useThemeDraft(storage: DraftStorage | undefined) {
  const [draft, dispatch] = useReducer(draftReducer, storage, loadDraft);
  const saver = useMemo(() => createDraftSaver(storage), [storage]);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    saver.save(draft);
  }, [draft, saver]);

  useEffect(() => {
    const flush = () => saver.flush();
    globalThis.addEventListener?.("pagehide", flush);
    return () => {
      globalThis.removeEventListener?.("pagehide", flush);
      saver.flush();
    };
  }, [saver]);

  const reset = () => {
    saver.cancel();
    clearDraft(storage);
    dispatch({ type: "reset" });
    // The reset itself must not be saved back as a draft.
    first.current = true;
  };

  return { draft, dispatch, reset };
}
