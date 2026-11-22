import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@aureus-core/ui/shadcn/field";
import { Switch } from "@aureus-core/ui/shadcn/switch";
import { useId, useState } from "react";
import { NumberField, SelectField } from "../../shared/form";
import type { ScaleInputs } from "../core/typography-types";
import type { TypographyBuilderStrings } from "../i18n/typography-builder-strings";
import { Section, type SectionProps } from "./section";

/** Named musical ratios (spec: Scale generation). The augmented fourth is exactly √2. */
export const ratioPresets = (t: TypographyBuilderStrings) =>
  [
    [1.125, t.ratioMajorSecond],
    [1.2, t.ratioMinorThird],
    [1.25, t.ratioMajorThird],
    [1.333, t.ratioPerfectFourth],
    [Math.SQRT2, t.ratioAugmentedFourth],
  ] as const;

const custom = "custom";

/** Base size, ratio and fluid headings. Any edit switches to the generated base. */
export function ScaleSection({ draft, dispatch, t }: SectionProps) {
  const id = useId();
  const { scale } = draft;
  const presets = ratioPresets(t);
  const preset = presets.find(([value]) => Math.abs(value - scale.ratio) < 1e-9);
  const [customRatio, setCustomRatio] = useState(!preset);
  const selected = customRatio || !preset ? custom : String(preset[0]);
  const set = (patch: Partial<ScaleInputs>) => dispatch({ type: "scale", patch });

  return (
    <Section title={t.sectionScale}>
      <p className="text-sm text-muted-foreground">{t.scaleHelp}</p>
      <p className="text-sm font-medium" data-testid="base-note">
        {draft.base.kind === "preset" ? t.basePreset : t.baseGenerated}
      </p>
      <FieldGroup>
        <NumberField
          label={t.basePx}
          value={scale.basePx}
          min={14}
          max={20}
          step={1}
          unit="px"
          onChange={(basePx) => set({ basePx })}
        />
        <SelectField
          label={t.ratio}
          value={selected}
          options={[
            ...presets.map(([value, name]) => ({
              value: String(value),
              label: `${name} (${Math.round(value * 1000) / 1000})`,
            })),
            { value: custom, label: t.ratioOther },
          ]}
          onChange={(value) => {
            if (value === custom) {
              setCustomRatio(true);
              return;
            }
            setCustomRatio(false);
            const ratio = Number(value);
            set({ ratio, minRatio: Math.min(scale.minRatio, ratio) });
          }}
        />
        {selected === custom ? (
          <NumberField
            label={t.ratioCustom}
            value={scale.ratio}
            min={1.05}
            max={1.8}
            step={0.001}
            unit="×"
            onChange={(ratio) => set({ ratio, minRatio: Math.min(scale.minRatio, ratio) })}
          />
        ) : null}
        <Field orientation="horizontal">
          <Switch
            id={`${id}-fluid`}
            checked={scale.fluid}
            aria-describedby={`${id}-fluid-help`}
            onCheckedChange={(fluid) => set({ fluid })}
          />
          <FieldContent>
            <FieldLabel htmlFor={`${id}-fluid`}>{t.fluid}</FieldLabel>
            <FieldDescription id={`${id}-fluid-help`}>{t.fluidHelp}</FieldDescription>
          </FieldContent>
        </Field>
        {scale.fluid ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <NumberField
              label={t.minViewport}
              value={scale.minViewport}
              min={240}
              max={1920}
              step={1}
              unit="px"
              onChange={(minViewport) => minViewport < scale.maxViewport && set({ minViewport })}
            />
            <NumberField
              label={t.maxViewport}
              value={scale.maxViewport}
              min={240}
              max={3840}
              step={1}
              unit="px"
              onChange={(maxViewport) => maxViewport > scale.minViewport && set({ maxViewport })}
            />
            <NumberField
              label={t.minRatio}
              value={scale.minRatio}
              min={1}
              max={1.8}
              step={0.001}
              unit="×"
              onChange={(minRatio) => set({ minRatio: Math.min(minRatio, scale.ratio) })}
            />
          </div>
        ) : null}
      </FieldGroup>
    </Section>
  );
}
