import { NumberField } from "../../shared/form";
import { Section, type SectionProps } from "./section";

/** `--typography-tracking-normal` (spec: Global letter spacing). */
export function TrackingSection({ draft, dispatch, t }: SectionProps) {
  return (
    <Section title={t.sectionTracking}>
      <NumberField
        label={t.tracking}
        description={t.trackingHelp}
        value={draft.tracking}
        min={-0.2}
        max={0.5}
        step={0.005}
        unit="em"
        onChange={(value) => dispatch({ type: "tracking", value })}
      />
    </Section>
  );
}
