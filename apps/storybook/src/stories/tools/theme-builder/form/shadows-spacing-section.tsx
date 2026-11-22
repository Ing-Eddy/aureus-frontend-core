import { FieldGroup } from "@aureus-core/ui/shadcn/field";
import { fill } from "../../shared/i18n";
import { ColorField, NumberField, SliderField } from "./fields";
import { Section, type SectionProps } from "./section";

/** Radius, shadow definition, spacing unit and letter spacing (spec: mode-independent values). */
export function ShadowsSpacingSection({ draft, dispatch, t }: SectionProps) {
  const { inputs } = draft;
  const { shadow } = inputs;
  return (
    <Section title={t.sectionEffects}>
      <FieldGroup>
        <NumberField
          label={t.radius}
          value={inputs.radius}
          min={0}
          max={2}
          step={0.025}
          unit="rem"
          onChange={(value) => dispatch({ type: "input", key: "radius", value })}
        />
        <ColorField
          label={t.shadowColorLight}
          value={shadow.color.light}
          t={t}
          onChange={(color) => dispatch({ type: "shadowColor", mode: "light", color })}
        />
        <ColorField
          label={t.shadowColorDark}
          value={shadow.color.dark}
          t={t}
          onChange={(color) => dispatch({ type: "shadowColor", mode: "dark", color })}
        />
        <SliderField
          label={t.shadowOpacity}
          value={shadow.opacity}
          display={fill(t.percentValue, { value: Math.round(shadow.opacity * 100) })}
          onChange={(opacity) => dispatch({ type: "shadow", patch: { opacity } })}
        />
        <div className="grid grid-cols-2 gap-4">
          <NumberField
            label={t.shadowBlur}
            value={shadow.blur}
            min={0}
            max={100}
            step={1}
            unit="px"
            onChange={(blur) => dispatch({ type: "shadow", patch: { blur } })}
          />
          <NumberField
            label={t.shadowSpread}
            value={shadow.spread}
            min={-50}
            max={50}
            step={1}
            unit="px"
            onChange={(spread) => dispatch({ type: "shadow", patch: { spread } })}
          />
          <NumberField
            label={t.shadowX}
            value={shadow.x}
            min={-50}
            max={50}
            step={1}
            unit="px"
            onChange={(x) => dispatch({ type: "shadow", patch: { x } })}
          />
          <NumberField
            label={t.shadowY}
            value={shadow.y}
            min={-50}
            max={50}
            step={1}
            unit="px"
            onChange={(y) => dispatch({ type: "shadow", patch: { y } })}
          />
        </div>
        <NumberField
          label={t.spacing}
          description={t.spacingHelp}
          value={inputs.spacing}
          min={0.1}
          max={1}
          step={0.01}
          unit="rem"
          onChange={(value) => dispatch({ type: "input", key: "spacing", value })}
        />
      </FieldGroup>
    </Section>
  );
}
