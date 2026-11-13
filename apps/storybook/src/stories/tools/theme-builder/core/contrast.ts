import { composite, contrastRatio, mustParse, type OklchColor } from "./color";
import {
  type ColorSet,
  type ColorToken,
  type Mode,
  modes,
  type ResolvedTheme,
} from "./theme-types";

/** WCAG 2 AA for normal text. */
export const minContrast = 4.5;

export interface ContrastPair {
  /** Stable id, e.g. `muted-foreground/muted`. */
  id: string;
  surface: ColorToken;
  foreground: ColorToken;
}

const pair = (foreground: ColorToken, surface: ColorToken): ContrastPair => ({
  id: `${foreground}/${surface}`,
  surface,
  foreground,
});

/** Text pairs checked in both modes (spec: Contrast validation). */
export const contrastPairs: readonly ContrastPair[] = [
  pair("foreground", "background"),
  pair("card-foreground", "card"),
  pair("popover-foreground", "popover"),
  pair("primary-foreground", "primary"),
  pair("secondary-foreground", "secondary"),
  pair("muted-foreground", "muted"),
  pair("accent-foreground", "accent"),
  pair("sidebar-foreground", "sidebar"),
  pair("sidebar-primary-foreground", "sidebar-primary"),
  pair("sidebar-accent-foreground", "sidebar-accent"),
  pair("muted-foreground", "background"),
  pair("destructive", "background"),
];

export interface ContrastResult {
  pair: ContrastPair;
  mode: Mode;
  /** Rounded to 2 decimals. */
  ratio: number;
  passes: boolean;
}

const white: OklchColor = { l: 1, c: 0, h: 0 };

/** The color actually painted for a token: translucent colors are composited over what is below. */
function painted(colors: ColorSet, token: ColorToken, below?: OklchColor): OklchColor {
  const color = mustParse(colors[token]);
  const backdrop = below ?? composite(mustParse(colors.background), white);
  return composite(color, backdrop);
}

/** Ratio between a foreground token and a surface token of one color set. */
export function pairRatio(colors: ColorSet, { surface, foreground }: ContrastPair): number {
  const surfaceColor = painted(colors, surface);
  const foregroundColor = painted(colors, foreground, surfaceColor);
  return contrastRatio(foregroundColor, surfaceColor);
}

export function checkContrast(theme: Pick<ResolvedTheme, "colors">): ContrastResult[] {
  return modes.flatMap((mode) =>
    contrastPairs.map((entry) => {
      const ratio = pairRatio(theme.colors[mode], entry);
      return {
        pair: entry,
        mode,
        ratio: Math.floor(ratio * 100) / 100,
        passes: ratio >= minContrast,
      };
    }),
  );
}

export const failingPairs = (results: readonly ContrastResult[]) =>
  results.filter((result) => !result.passes);
