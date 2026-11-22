import type { TypographyVariant } from "@aureus-core/ui/components/typography";
import { useEffect, useMemo, useReducer, useRef } from "react";
import type { DraftStorage } from "../shared/storage";
import { createDefaultDraft } from "./core/default-typography";
import { baseVariants } from "./core/resolve-typography";
import { typographyStore } from "./core/typography-storage";
import type {
  FontChoice,
  FontRole,
  ScaleInputs,
  TypographyDraft,
  VariantProperty,
  VariantStyle,
} from "./core/typography-types";

export type TypographyAction =
  | { type: "font"; role: FontRole; choice: FontChoice }
  /** A pairing: several roles at once, nothing else (spec: Font pairings). */
  | { type: "fonts"; fonts: Partial<Record<FontRole, FontChoice>> }
  | { type: "scale"; patch: Partial<ScaleInputs> }
  | { type: "override"; variant: TypographyVariant; patch: Partial<VariantStyle> }
  | { type: "resetOverride"; variant: TypographyVariant; property: VariantProperty }
  | { type: "tracking"; value: number }
  | { type: "name"; name: string }
  | { type: "replace"; draft: TypographyDraft }
  | { type: "reset" };

const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

/** Drops the properties of `overrides` that equal the base, so only real changes are marked. */
function clean(
  draft: TypographyDraft,
  variant: TypographyVariant,
  overrides: Partial<VariantStyle>,
): TypographyDraft["overrides"] {
  const base = baseVariants(draft)[variant];
  const kept = Object.fromEntries(
    Object.entries(overrides).filter(([key, value]) => !same(value, base[key as VariantProperty])),
  ) as Partial<VariantStyle>;
  const { [variant]: _previous, ...rest } = draft.overrides;
  return Object.keys(kept).length ? { ...rest, [variant]: kept } : rest;
}

export function typographyReducer(
  draft: TypographyDraft,
  action: TypographyAction,
): TypographyDraft {
  switch (action.type) {
    case "font":
      return { ...draft, fonts: { ...draft.fonts, [action.role]: action.choice } };
    case "fonts":
      return { ...draft, fonts: { ...draft.fonts, ...action.fonts } };
    case "scale":
      // Editing the scale leaves the preset: sizes are generated from now on (design D2).
      return { ...draft, base: { kind: "generated" }, scale: { ...draft.scale, ...action.patch } };
    case "override":
      return {
        ...draft,
        overrides: clean(draft, action.variant, {
          ...draft.overrides[action.variant],
          ...action.patch,
        }),
      };
    case "resetOverride": {
      const { [action.property]: _removed, ...rest } = draft.overrides[action.variant] ?? {};
      return { ...draft, overrides: clean(draft, action.variant, rest) };
    }
    case "tracking":
      return { ...draft, tracking: action.value };
    case "name":
      return { ...draft, name: action.name };
    case "replace":
      return action.draft;
    case "reset":
      return createDefaultDraft();
  }
}

/** The draft, restored from storage on first render and saved (debounced) on every change. */
export function useTypographyDraft(storage: DraftStorage | undefined) {
  const store = useMemo(() => typographyStore(storage), [storage]);
  const [draft, dispatch] = useReducer(typographyReducer, store, (initial) => initial.load());
  const saver = useMemo(() => store.saver(), [store]);
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
    store.clear();
    dispatch({ type: "reset" });
    // The reset itself must not be saved back as a draft.
    first.current = true;
  };

  return { draft, dispatch, reset };
}
