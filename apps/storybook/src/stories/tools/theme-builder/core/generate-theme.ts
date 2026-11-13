import { contrastRatio, formatOklch, inGamut, mustParse, type OklchColor } from "./color";
import { contrastPairs, minContrast, pairRatio } from "./contrast";
import { aureusColors } from "./default-theme";
import { type PaletteStep, paletteSteps, palettes } from "./palettes";
import type {
  ColorSet,
  ColorToken,
  Mode,
  ResolvedTheme,
  ThemeDraft,
  ThemeInputs,
} from "./theme-types";

/** Repair aims slightly above 4.5:1 so that rounding the result to 3 decimals cannot drop it below. */
const repairTarget = minContrast + 0.1;
/** Largest chroma (OKLCH) the tint slider adds to a mid-lightness neutral. */
const maxTintChroma = 0.04;

type Ramp = Record<PaletteStep, OklchColor>;

/** Peaks at mid lightness, 0 at black and white, so the extremes stay clean when tinted. */
const bell = (l: number) => Math.max(0, 1 - ((l - 0.5) / 0.5) ** 2);

/** Adds `amount` of chroma toward hue `h` in OKLab, so a palette's own hue blends smoothly. */
function tintToward(color: OklchColor, hue: number, amount: number): OklchColor {
  if (amount <= 0) return color;
  const rad = (deg: number) => (deg * Math.PI) / 180;
  const a = color.c * Math.cos(rad(color.h)) + amount * Math.cos(rad(hue));
  const b = color.c * Math.sin(rad(color.h)) + amount * Math.sin(rad(hue));
  const c = Math.hypot(a, b);
  const h = c === 0 ? 0 : ((((Math.atan2(b, a) * 180) / Math.PI) % 360) + 360) % 360;
  return inGamut({ l: color.l, c, h });
}

function neutralRamp(inputs: ThemeInputs): Ramp {
  const primary = mustParse(inputs.primary);
  const tint = inputs.achromaticPrimary ? 0 : inputs.tint;
  const source = palettes[inputs.neutral];
  return Object.fromEntries(
    paletteSteps.map((step) => {
      const [l, c, h] = source[step];
      const amount = tint * maxTintChroma * bell(l) * Math.min(1, primary.c / 0.05);
      return [step, tintToward({ l, c, h }, primary.h, amount)];
    }),
  ) as Ramp;
}

/** Share of the primary's chroma kept at each step (close to Tailwind's color ramps). */
const brandChroma: Record<PaletteStep, number> = {
  50: 0.1,
  100: 0.2,
  200: 0.38,
  300: 0.6,
  400: 0.85,
  500: 1,
  600: 1,
  700: 0.9,
  800: 0.75,
  900: 0.6,
  950: 0.45,
};

function brandRamp(primary: OklchColor, neutral: Ramp): Ramp {
  return Object.fromEntries(
    paletteSteps.map((step) => [
      step,
      inGamut({ l: neutral[step].l, c: primary.c * brandChroma[step], h: primary.h }),
    ]),
  ) as Ramp;
}

const white: OklchColor = { l: 1, c: 0, h: 0 };
const translucentWhite = (alpha: number): OklchColor => ({ l: 1, c: 0, h: 0, alpha });

const lightChartL = [0.65, 0.6, 0.55, 0.75, 0.7];
const darkChartL = [0.55, 0.7, 0.77, 0.63, 0.65];

function charts(inputs: ThemeInputs, neutral: Ramp, mode: Mode): OklchColor[] {
  const primary = mustParse(inputs.primary);
  if (inputs.chartMode === "monochrome" || inputs.achromaticPrimary) {
    return ([300, 500, 600, 700, 800] as const).map((step) => neutral[step]);
  }
  const lightness = mode === "light" ? lightChartL : darkChartL;
  return lightness.map((l, index) =>
    inGamut({ l, c: Math.max(primary.c, 0.12), h: (primary.h + index * 72) % 360 }),
  );
}

type Colors = Record<ColorToken, OklchColor>;

function baseColors(inputs: ThemeInputs, mode: Mode): Colors {
  const n = neutralRamp(inputs);
  const userPrimary = mustParse(inputs.primary);
  const brand = brandRamp(userPrimary, n);
  const destructiveInput = mustParse(inputs.destructive);
  const light = mode === "light";

  let primary: OklchColor;
  let ring: OklchColor;
  if (inputs.achromaticPrimary) {
    primary = light ? n[900] : n[200];
    ring = light ? n[400] : n[500];
  } else {
    const darkBackground = n[950];
    primary = light
      ? userPrimary
      : contrastRatio(userPrimary, darkBackground) >= 3
        ? userPrimary
        : brand[400];
    ring = light ? brand[400] : brand[500];
  }

  const destructive = light
    ? destructiveInput
    : inGamut({ ...destructiveInput, l: Math.max(destructiveInput.l, brand[400].l) });

  const [chart1, chart2, chart3, chart4, chart5] = charts(inputs, n, mode) as [
    OklchColor,
    OklchColor,
    OklchColor,
    OklchColor,
    OklchColor,
  ];

  return {
    background: light ? white : n[950],
    foreground: light ? n[950] : n[50],
    card: light ? white : n[900],
    "card-foreground": light ? n[950] : n[50],
    popover: light ? white : n[900],
    "popover-foreground": light ? n[950] : n[50],
    primary,
    "primary-foreground": light ? n[50] : n[900],
    secondary: light ? n[100] : n[800],
    "secondary-foreground": light ? n[900] : n[50],
    muted: light ? n[100] : n[800],
    "muted-foreground": light ? n[500] : n[400],
    accent: light ? n[100] : n[800],
    "accent-foreground": light ? n[900] : n[50],
    destructive,
    border: light ? n[200] : translucentWhite(0.1),
    input: light ? n[200] : translucentWhite(0.15),
    ring,
    "chart-1": chart1,
    "chart-2": chart2,
    "chart-3": chart3,
    "chart-4": chart4,
    "chart-5": chart5,
    sidebar: light ? n[50] : n[900],
    "sidebar-foreground": light ? n[950] : n[50],
    "sidebar-primary": primary,
    "sidebar-primary-foreground": light ? n[50] : n[900],
    "sidebar-accent": light ? n[100] : n[800],
    "sidebar-accent-foreground": light ? n[900] : n[50],
    "sidebar-border": light ? n[200] : translucentWhite(0.1),
    "sidebar-ring": ring,
  };
}

/** Foregrounds that sit on a solid brand surface: pick black-ish or white-ish, whichever reads. */
const onSolid: ReadonlySet<ColorToken> = new Set([
  "primary-foreground",
  "sidebar-primary-foreground",
]);

const format = (colors: Colors): ColorSet =>
  Object.fromEntries(
    Object.entries(colors).map(([token, color]) => [token, formatOklch(color)]),
  ) as ColorSet;

/**
 * Step 6 of design D4: every checked foreground reaches 4.5:1 when any lightness can. A foreground
 * that fails moves away from its surface in 0.01 steps of lightness.
 */
function repair(colors: Colors, neutral: Ramp): Colors {
  const result = { ...colors };
  const ratio = (token: ColorToken) =>
    Math.min(
      ...contrastPairs
        .filter((entry) => entry.foreground === token)
        .map((entry) => pairRatio(format(result), entry)),
    );

  for (const token of new Set(contrastPairs.map((entry) => entry.foreground))) {
    if (onSolid.has(token)) {
      const candidates = [neutral[50], neutral[950]].map((candidate) => {
        result[token] = candidate;
        return { candidate, ratio: ratio(token) };
      });
      const best = candidates.reduce((a, b) => (b.ratio > a.ratio ? b : a));
      result[token] = best.candidate;
    }
    if (ratio(token) >= minContrast) continue;

    const surfaces = contrastPairs
      .filter((entry) => entry.foreground === token)
      .map((entry) => mustParse(format(result)[entry.surface]));
    const surfaceL = surfaces.reduce((sum, surface) => sum + surface.l, 0) / surfaces.length;
    const direction = result[token].l >= surfaceL ? 1 : -1;
    const start = result[token];
    // Walk toward black or white; the bound itself is the last (highest-contrast) candidate.
    for (let step = 1; step <= 100; step++) {
      const l = Math.min(
        1,
        Math.max(0, Math.round((start.l + direction * step * 0.01) * 1000) / 1000),
      );
      result[token] = inGamut({ ...start, l });
      if (ratio(token) >= repairTarget || l === 0 || l === 1) break;
    }
  }
  return result;
}

/** Every color token for one mode, derived from the inputs (design D4). */
export function generateColors(inputs: ThemeInputs, mode: Mode): ColorSet {
  return format(repair(baseColors(inputs, mode), neutralRamp(inputs)));
}

/** Base colors (preset or generated) with the user's overrides on top. */
export function resolveTheme(draft: ThemeDraft): ResolvedTheme {
  const base = (mode: Mode): ColorSet =>
    draft.base.kind === "preset" ? aureusColors[mode] : generateColors(draft.inputs, mode);
  const colors = {
    light: { ...base("light"), ...draft.overrides.light },
    dark: { ...base("dark"), ...draft.overrides.dark },
  };
  const { radius, fonts, shadow, spacing, tracking } = draft.inputs;
  return { name: draft.name, colors, radius, fonts, shadow, spacing, tracking };
}

/** Base value of one token, ignoring its override (what "Reset token" restores). */
export function baseColor(draft: ThemeDraft, mode: Mode, token: ColorToken): string {
  return draft.base.kind === "preset"
    ? aureusColors[mode][token]
    : generateColors(draft.inputs, mode)[token];
}
