import type { TypographyVariant } from "@aureus-core/ui/components/typography";
import { Badge } from "@aureus-core/ui/shadcn/badge";
import { Button } from "@aureus-core/ui/shadcn/button";
import { RotateCcwIcon } from "lucide-react";
import type { ReactNode } from "react";
import { NumberField, SelectField, TextField } from "../../shared/form";
import { fill } from "../../shared/i18n";
import { fluidSize, formatNumber, formatSize, parseSize } from "../core/fluid-size";
import {
  fontRoles,
  type ScaleInputs,
  type SizeValue,
  type TextTransform,
  textTransforms,
  type VariantProperty,
  type VariantStyle,
} from "../core/typography-types";
import type { TypographyBuilderStrings } from "../i18n/typography-builder-strings";
import type { SectionProps } from "./section";

interface VariantEditorProps extends Pick<SectionProps, "dispatch" | "t"> {
  variant: TypographyVariant;
  style: VariantStyle;
  overridden: Partial<VariantStyle> | undefined;
  scale: ScaleInputs;
}

const parseLineHeight = (text: string): VariantStyle["lineHeight"] | undefined => {
  const value = text.trim();
  if (value === "inherit") return "inherit";
  const number = Number(value);
  return /^\d*\.?\d+$/.test(value) && number >= 0.5 && number <= 4 ? number : undefined;
};
const formatLineHeight = (value: VariantStyle["lineHeight"]) =>
  value === "inherit" ? value : formatNumber(value);

export const propertyLabel = (t: TypographyBuilderStrings): Record<VariantProperty, string> => ({
  font: t.propertyFont,
  size: t.propertySize,
  lineHeight: t.propertyLineHeight,
  weight: t.propertyWeight,
  tracking: t.propertyTracking,
  transform: t.propertyTransform,
});

/** All six properties of one variant, each marked and resettable when overridden. */
export function VariantEditor({
  variant,
  style,
  overridden,
  scale,
  dispatch,
  t,
}: VariantEditorProps) {
  const labels = propertyLabel(t);
  const set = (patch: Partial<VariantStyle>) => dispatch({ type: "override", variant, patch });

  /** A property row: the field, then the overridden badge and its reset button. */
  const row = (property: VariantProperty, field: ReactNode) => {
    const isOverridden = overridden?.[property] !== undefined;
    return (
      <div
        className="flex items-end gap-2"
        data-property={property}
        data-overridden={isOverridden || undefined}
      >
        <div className="min-w-0 flex-1">{field}</div>
        {isOverridden ? (
          <div className="flex items-center gap-1 pb-1">
            <Badge variant="secondary">{t.overridden}</Badge>
            <Button
              size="icon-sm"
              variant="ghost"
              aria-label={fill(t.resetProperty, { property: labels[property], variant })}
              onClick={() => dispatch({ type: "resetOverride", variant, property })}
            >
              <RotateCcwIcon />
            </Button>
          </div>
        ) : null}
      </div>
    );
  };

  const roleShort = {
    sans: t.roleSansShort,
    heading: t.roleHeadingShort,
    serif: t.roleSerifShort,
    mono: t.roleMonoShort,
  };
  const transforms: Record<TextTransform, string> = {
    none: t.transformNone,
    uppercase: t.transformUppercase,
    lowercase: t.transformLowercase,
    capitalize: t.transformCapitalize,
  };
  const { size } = style;
  const setFluid = (min: number, max: number) =>
    max >= min && set({ size: fluidSize(min, max, scale.minViewport, scale.maxViewport) });

  return (
    <div className="flex flex-col gap-3">
      {row(
        "font",
        <SelectField
          label={labels.font}
          value={style.font}
          options={fontRoles.map((value) => ({ value, label: roleShort[value] }))}
          onChange={(font) => set({ font })}
        />,
      )}
      {row(
        "size",
        <div className="flex flex-col gap-3">
          <TextField<SizeValue>
            label={labels.size}
            value={size}
            parse={parseSize}
            format={formatSize}
            invalidMessage={t.propertySizeInvalid}
            description={t.propertySizeHelp}
            onChange={(next) => set({ size: next })}
          />
          {size.kind === "fluid" ? (
            <div className="grid grid-cols-2 gap-3">
              <NumberField
                label={t.propertyMin}
                value={size.min}
                min={0.5}
                max={20}
                step={0.0625}
                unit="rem"
                onChange={(min) => setFluid(min, size.max)}
              />
              <NumberField
                label={t.propertyMax}
                value={size.max}
                min={0.5}
                max={20}
                step={0.0625}
                unit="rem"
                onChange={(max) => setFluid(size.min, max)}
              />
            </div>
          ) : null}
        </div>,
      )}
      {row(
        "lineHeight",
        <TextField
          label={labels.lineHeight}
          value={style.lineHeight}
          parse={parseLineHeight}
          format={formatLineHeight}
          invalidMessage={t.propertyLineHeightInvalid}
          onChange={(lineHeight) => set({ lineHeight })}
        />,
      )}
      {row(
        "weight",
        <NumberField
          label={labels.weight}
          value={style.weight}
          min={100}
          max={900}
          step={50}
          unit=""
          onChange={(weight) => set({ weight: Math.round(weight) })}
        />,
      )}
      {row(
        "tracking",
        <NumberField
          label={labels.tracking}
          value={style.tracking}
          min={-0.2}
          max={0.5}
          step={0.005}
          unit="em"
          onChange={(tracking) => set({ tracking })}
        />,
      )}
      {row(
        "transform",
        <SelectField
          label={labels.transform}
          value={style.transform}
          options={textTransforms.map((value) => ({ value, label: transforms[value] }))}
          onChange={(transform) => set({ transform })}
        />,
      )}
    </div>
  );
}
