import { Button } from "@aureus-core/ui/shadcn/button";
import { fill } from "../../shared/i18n";
import { type FontPairing, fontPairings } from "../core/font-pairings";
import type { TypographyDraft } from "../core/typography-types";
import { Section, type SectionProps } from "./section";

const applied = (draft: TypographyDraft, pairing: FontPairing) =>
  Object.entries(pairing.fonts).every(
    ([role, choice]) =>
      JSON.stringify(draft.fonts[role as keyof TypographyDraft["fonts"]]) ===
      JSON.stringify(choice),
  );

/** One-click pairings: they only dispatch fonts (spec: Font pairings). */
export function PairingsSection({ draft, dispatch, t }: SectionProps) {
  return (
    <Section title={t.sectionPairings}>
      <p className="text-sm text-muted-foreground">{t.pairingsHelp}</p>
      <div className="flex flex-wrap gap-2">
        {fontPairings.map((pairing) => {
          const active = applied(draft, pairing);
          return (
            <Button
              key={pairing.id}
              size="sm"
              variant={active ? "secondary" : "outline"}
              aria-pressed={active}
              aria-label={fill(active ? t.pairingActive : t.pairingApply, { label: pairing.label })}
              onClick={() => dispatch({ type: "fonts", fonts: pairing.fonts })}
            >
              {pairing.label}
            </Button>
          );
        })}
      </div>
    </Section>
  );
}
