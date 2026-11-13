import {
  blend,
  converter,
  formatHex,
  modeHsl,
  modeLrgb,
  modeOklab,
  modeOklch,
  modeRgb,
  type Oklch,
  parse,
  useMode as registerMode,
  toGamut,
  wcagContrast,
} from "culori/fn";

/**
 * Color helpers on top of culori's tree-shakeable `fn` entry (design D3). Only the modes the
 * builder needs are registered. Every value that enters a draft goes through `normalizeColor`, so
 * it is rounded exactly once and a serialize → parse round trip gives back the same string.
 */
registerMode(modeRgb);
registerMode(modeLrgb);
registerMode(modeHsl);
registerMode(modeOklab);
registerMode(modeOklch);

export interface OklchColor {
  l: number;
  c: number;
  h: number;
  /** 0–1; omitted when opaque. */
  alpha?: number;
}

const toOklch = converter("oklch");
const toRgb = converter("rgb");
const gamutMap = toGamut("rgb", "oklch");

/** shadcn v3 themes store bare HSL channels: `222.2 84% 4.9%` (optionally `/ 50%`). */
const bareHsl = /^-?\d*\.?\d+(deg)?\s+-?\d*\.?\d+%\s+-?\d*\.?\d+%(\s*\/\s*\d*\.?\d+%?)?$/;

const round = (value: number, digits: number) => {
  const factor = 10 ** digits;
  const rounded = Math.round(value * factor) / factor;
  return Object.is(rounded, -0) ? 0 : rounded;
};

function fromCulori(color: Oklch): OklchColor {
  const l = round(Math.min(1, Math.max(0, color.l ?? 0)), 3);
  const c = round(Math.max(0, color.c ?? 0), 3);
  // Achromatic colors have no meaningful hue; print 0 like shadcn does.
  const h = c === 0 ? 0 : round((((color.h ?? 0) % 360) + 360) % 360, 3);
  const alpha = color.alpha === undefined ? undefined : round(color.alpha, 3);
  return alpha === undefined || alpha >= 1 ? { l, c, h } : { l, c, h, alpha };
}

/** Parses hex, rgb, hsl, oklch, named colors or bare HSL channels. `undefined` when invalid. */
export function parseColor(input: string): OklchColor | undefined {
  const value = input.trim();
  if (!value) return undefined;
  const parsed = parse(bareHsl.test(value) ? `hsl(${value})` : value);
  if (!parsed) return undefined;
  const oklch = toOklch(parsed);
  if (!oklch || Number.isNaN(oklch.l)) return undefined;
  return fromCulori(oklch);
}

/** `oklch(L C H)` or `oklch(L C H / N%)`, the notation shadcn uses. */
export function formatOklch(color: OklchColor): string {
  const { l, c, h } = fromCulori({ mode: "oklch", ...color });
  const alpha = color.alpha === undefined ? undefined : round(color.alpha * 100, 1);
  return alpha === undefined || alpha >= 100
    ? `oklch(${l} ${c} ${h})`
    : `oklch(${l} ${c} ${h} / ${alpha}%)`;
}

/** Parses then formats: the single entry point for user-provided colors. */
export function normalizeColor(input: string): string | undefined {
  const color = parseColor(input);
  return color ? formatOklch(color) : undefined;
}

/** Like `parseColor`, for values already normalized by the builder (throws if they are not). */
export function mustParse(value: string): OklchColor {
  const color = parseColor(value);
  if (!color) throw new Error(`Invalid color: ${value}`);
  return color;
}

/** Brings a color inside sRGB by reducing chroma (keeps lightness and hue). */
export function inGamut(color: OklchColor): OklchColor {
  // toGamut returns the color in its destination space (rgb); convert back.
  return fromCulori(toOklch(gamutMap({ mode: "oklch", ...color })));
}

/** `#rrggbb` of the gamut-mapped color, for `<input type="color">` (which has no alpha). */
export function toHex(value: string): string {
  const color = parseColor(value);
  if (!color) return "#000000";
  return formatHex(gamutMap({ mode: "oklch", ...color, alpha: undefined })) ?? "#000000";
}

export function withAlpha(color: OklchColor, alpha: number): OklchColor {
  const clamped = Math.min(1, Math.max(0, alpha));
  const { alpha: _discarded, ...opaque } = color;
  return clamped >= 1 ? opaque : { ...opaque, alpha: clamped };
}

/** Composites `top` over `bottom` in sRGB (how the browser paints a translucent color). */
export function composite(top: OklchColor, bottom: OklchColor): OklchColor {
  if (top.alpha === undefined || top.alpha >= 1) return top;
  const mixed = blend([toRgb({ mode: "oklch", ...bottom }), toRgb({ mode: "oklch", ...top })]);
  return fromCulori(toOklch(mixed));
}

/** WCAG 2 contrast ratio between two opaque colors. */
export function contrastRatio(a: OklchColor, b: OklchColor): number {
  return wcagContrast({ mode: "oklch", ...a }, { mode: "oklch", ...b });
}
