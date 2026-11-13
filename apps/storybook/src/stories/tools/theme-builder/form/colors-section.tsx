import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@aureus-core/ui/shadcn/field";
import { NativeSelect, NativeSelectOption } from "@aureus-core/ui/shadcn/native-select";
import { Switch } from "@aureus-core/ui/shadcn/switch";
import { useId } from "react";
import {
  type ChartMode,
  chartModes,
  type NeutralPalette,
  neutralPalettes,
} from "../core/theme-types";
import { fill } from "../i18n/theme-builder-strings";
import { ColorField, SliderField } from "./fields";
import { Section, type SectionProps } from "./section";

const paletteLabel = (palette: NeutralPalette) => palette[0]?.toUpperCase() + palette.slice(1);

/** Generation inputs (design D4). Any change here switches the draft from the preset to generated. */
export function ColorsSection({ draft, dispatch, t }: SectionProps) {
  const id = useId();
  const { inputs } = draft;
  const chartLabels: Record<ChartMode, string> = {
    monochrome: t.chartMonochrome,
    primary: t.chartPrimary,
  };

  return (
    <Section title={t.sectionColors}>
      <p className="text-sm text-muted-foreground" data-testid="base-note">
        {draft.base.kind === "preset" ? t.presetNote : t.generatedNote}
      </p>
      <FieldGroup>
        <ColorField
          label={t.primary}
          description={t.primaryHelp}
          value={inputs.primary}
          t={t}
          onChange={(value) => {
            dispatch({ type: "input", key: "primary", value });
            if (inputs.achromaticPrimary) {
              dispatch({ type: "input", key: "achromaticPrimary", value: false });
            }
          }}
        />
        <Field orientation="horizontal">
          <Switch
            id={`${id}-achromatic`}
            checked={inputs.achromaticPrimary}
            aria-describedby={`${id}-achromatic-help`}
            onCheckedChange={(value) =>
              dispatch({ type: "input", key: "achromaticPrimary", value })
            }
          />
          <FieldContent>
            <FieldLabel htmlFor={`${id}-achromatic`}>{t.achromatic}</FieldLabel>
            <FieldDescription id={`${id}-achromatic-help`}>{t.achromaticHelp}</FieldDescription>
          </FieldContent>
        </Field>
        <Field>
          <FieldLabel htmlFor={`${id}-neutral`}>{t.neutral}</FieldLabel>
          <NativeSelect
            id={`${id}-neutral`}
            className="w-full"
            value={inputs.neutral}
            aria-describedby={`${id}-neutral-help`}
            onChange={(event) =>
              dispatch({
                type: "input",
                key: "neutral",
                value: event.target.value as NeutralPalette,
              })
            }
          >
            {neutralPalettes.map((palette) => (
              <NativeSelectOption key={palette} value={palette}>
                {paletteLabel(palette)}
              </NativeSelectOption>
            ))}
          </NativeSelect>
          <FieldDescription id={`${id}-neutral-help`}>{t.neutralHelp}</FieldDescription>
        </Field>
        <SliderField
          label={t.tint}
          description={t.tintHelp}
          value={inputs.tint}
          disabled={inputs.achromaticPrimary}
          display={fill(t.tintValue, { value: Math.round(inputs.tint * 100) })}
          onChange={(value) => dispatch({ type: "input", key: "tint", value })}
        />
        <ColorField
          label={t.destructive}
          description={t.destructiveHelp}
          value={inputs.destructive}
          t={t}
          onChange={(value) => dispatch({ type: "input", key: "destructive", value })}
        />
        <Field>
          <FieldLabel htmlFor={`${id}-charts`}>{t.charts}</FieldLabel>
          <NativeSelect
            id={`${id}-charts`}
            className="w-full"
            value={inputs.chartMode}
            onChange={(event) =>
              dispatch({
                type: "input",
                key: "chartMode",
                value: event.target.value as ChartMode,
              })
            }
          >
            {chartModes.map((mode) => (
              <NativeSelectOption key={mode} value={mode}>
                {chartLabels[mode]}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </Field>
      </FieldGroup>
    </Section>
  );
}
