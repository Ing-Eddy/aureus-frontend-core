import { typographyVariants } from "@aureus-core/ui/components/typography";
import { createStore, type DraftStorage } from "../../shared/storage";
import { createDefaultDraft } from "./default-typography";
import { findCatalogFont } from "./font-catalog";
import { isValidFamily, isValidFontsource } from "./font-stack";
import {
  type FontChoice,
  fontRoles,
  type SizeValue,
  type TypographyDraft,
  textTransforms,
  type VariantStyle,
} from "./typography-types";

export const typographyStorageKey = "aureus-typography-builder:draft:v1";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const isNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);
const inRange = (value: unknown, min: number, max: number): value is number =>
  isNumber(value) && value >= min && value <= max;

function isFontChoice(value: unknown): value is FontChoice {
  if (!isRecord(value)) return false;
  switch (value.kind) {
    case "bundled":
    case "system":
      return Object.keys(value).length === 1;
    case "catalog":
      return typeof value.id === "string" && findCatalogFont(value.id) !== undefined;
    case "custom":
      return (
        typeof value.family === "string" &&
        isValidFamily(value.family) &&
        typeof value.fontsource === "string" &&
        isValidFontsource(value.fontsource)
      );
    default:
      return false;
  }
}

function isSize(value: unknown): value is SizeValue {
  if (!isRecord(value)) return false;
  if (value.kind === "fixed") {
    return inRange(value.value, 0.01, 20) && (value.unit === "rem" || value.unit === "em");
  }
  return (
    value.kind === "fluid" &&
    inRange(value.min, 0.01, 20) &&
    inRange(value.max, 0.01, 20) &&
    (value.max as number) >= (value.min as number) &&
    isNumber(value.intercept) &&
    inRange(value.slope, 0, 100)
  );
}

const propertyChecks: { [K in keyof VariantStyle]: (value: unknown) => boolean } = {
  font: (value) => (fontRoles as readonly unknown[]).includes(value),
  size: isSize,
  lineHeight: (value) => value === "inherit" || inRange(value, 0.5, 4),
  weight: (value) => inRange(value, 1, 1000) && Number.isInteger(value),
  tracking: (value) => inRange(value, -1, 1),
  transform: (value) => (textTransforms as readonly unknown[]).includes(value),
};

function isOverride(value: unknown): boolean {
  if (!isRecord(value)) return false;
  return Object.entries(value).every(([key, property]) => {
    const check = propertyChecks[key as keyof VariantStyle];
    return check?.(property) ?? false;
  });
}

/** The draft if `value` has exactly the expected shape; anything else is discarded (design D9). */
export function validateTypographyDraft(value: unknown): TypographyDraft | undefined {
  if (!isRecord(value) || value.version !== 1 || typeof value.name !== "string") return undefined;
  const { base, fonts, scale, overrides } = value;
  if (
    !isRecord(base) ||
    !(base.kind === "generated" || (base.kind === "preset" && base.id === "aureus"))
  ) {
    return undefined;
  }
  if (!isRecord(fonts) || !fontRoles.every((role) => isFontChoice(fonts[role]))) return undefined;
  if (
    !isRecord(scale) ||
    !inRange(scale.basePx, 14, 20) ||
    !inRange(scale.ratio, 1.05, 1.8) ||
    typeof scale.fluid !== "boolean" ||
    !inRange(scale.minViewport, 240, 1920) ||
    !inRange(scale.maxViewport, 240, 3840) ||
    (scale.maxViewport as number) <= (scale.minViewport as number) ||
    !inRange(scale.minRatio, 1, 1.8)
  ) {
    return undefined;
  }
  if (!inRange(value.tracking, -0.2, 0.5)) return undefined;
  if (!isRecord(overrides)) return undefined;
  const known = new Set<string>(typographyVariants);
  if (
    !Object.entries(overrides).every(([variant, patch]) => known.has(variant) && isOverride(patch))
  ) {
    return undefined;
  }
  return value as unknown as TypographyDraft;
}

/** The typography builder's draft store (shared helper, its own key and validation). */
export const typographyStore = (storage: DraftStorage | undefined) =>
  createStore(storage, {
    key: typographyStorageKey,
    validate: validateTypographyDraft,
    create: createDefaultDraft,
  });
