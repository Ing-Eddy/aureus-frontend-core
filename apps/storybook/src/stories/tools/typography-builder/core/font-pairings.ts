import type { FontChoice, FontRole } from "./typography-types";

export interface FontPairing {
  id: string;
  /** Font names only: not translated. */
  label: string;
  /** Roles the pairing sets; the others keep their choice. */
  fonts: Partial<Record<FontRole, FontChoice>>;
}

const bundled: FontChoice = { kind: "bundled" };
const font = (id: string): FontChoice => ({ kind: "catalog", id });

/** One-click pairings (spec: Font pairings). Aureus first; they never touch sizes or overrides. */
export const fontPairings: readonly FontPairing[] = [
  {
    id: "aureus",
    label: "Geist + Geist Mono (Aureus)",
    fonts: { sans: bundled, heading: bundled, mono: bundled },
  },
  {
    id: "inter-jetbrains",
    label: "Inter + JetBrains Mono",
    fonts: { sans: font("inter"), heading: bundled, mono: font("jetbrains-mono") },
  },
  {
    id: "ibm-plex",
    label: "IBM Plex Sans + IBM Plex Mono",
    fonts: { sans: font("ibm-plex-sans"), heading: bundled, mono: font("ibm-plex-mono") },
  },
  {
    id: "dm",
    label: "DM Sans + DM Mono",
    fonts: { sans: font("dm-sans"), heading: bundled, mono: font("dm-mono") },
  },
  {
    id: "manrope-fira",
    label: "Manrope + Fira Code",
    fonts: { sans: font("manrope"), heading: bundled, mono: font("fira-code") },
  },
  {
    id: "source",
    label: "Source Sans 3 + Source Serif 4 + Source Code Pro",
    fonts: {
      sans: font("source-sans-3"),
      heading: font("source-serif-4"),
      serif: font("source-serif-4"),
      mono: font("source-code-pro"),
    },
  },
  {
    id: "editorial",
    label: "Fraunces + Inter (editorial)",
    fonts: { sans: font("inter"), heading: font("fraunces"), mono: font("jetbrains-mono") },
  },
  {
    id: "grotesk",
    label: "Space Grotesk + Inter",
    fonts: { sans: font("inter"), heading: font("space-grotesk"), mono: font("jetbrains-mono") },
  },
];
