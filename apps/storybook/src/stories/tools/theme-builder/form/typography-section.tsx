import { Field, FieldDescription, FieldGroup, FieldLabel } from "@aureus-core/ui/shadcn/field";
import { Input } from "@aureus-core/ui/shadcn/input";
import { NativeSelect, NativeSelectOption } from "@aureus-core/ui/shadcn/native-select";
import { useId } from "react";
import { type FontRole, findFontOption, fontOptions, fontRoles } from "../core/font-options";
import { fill } from "../i18n/theme-builder-strings";
import { Section, type SectionProps } from "./section";

const customValue = "__custom__";

function FontField({
  role,
  label,
  stack,
  onChange,
  t,
}: {
  role: FontRole;
  label: string;
  stack: string;
  onChange: (stack: string) => void;
  t: SectionProps["t"];
}) {
  const id = useId();
  const selected = findFontOption(role, stack)?.stack ?? customValue;
  return (
    <Field>
      <FieldLabel htmlFor={`${id}-preset`}>{label}</FieldLabel>
      <NativeSelect
        id={`${id}-preset`}
        className="w-full"
        value={selected}
        onChange={(event) => {
          if (event.target.value !== customValue) onChange(event.target.value);
        }}
      >
        {fontOptions[role].map((option) => (
          <NativeSelectOption key={option.label} value={option.stack}>
            {option.label}
          </NativeSelectOption>
        ))}
        <NativeSelectOption value={customValue}>{t.fontCustom}</NativeSelectOption>
      </NativeSelect>
      <Input
        value={stack}
        spellCheck={false}
        aria-label={fill(t.fontStack, { label })}
        onChange={(event) => {
          if (event.target.value.trim()) onChange(event.target.value);
        }}
        className="font-mono text-xs"
      />
    </Field>
  );
}

export function TypographySection({ draft, dispatch, t }: SectionProps) {
  const labels: Record<FontRole, string> = {
    sans: t.fontSans,
    serif: t.fontSerif,
    mono: t.fontMono,
  };
  return (
    <Section title={t.sectionTypography}>
      <FieldGroup>
        {fontRoles.map((role) => (
          <FontField
            key={role}
            role={role}
            label={labels[role]}
            stack={draft.inputs.fonts[role]}
            t={t}
            onChange={(stack) => dispatch({ type: "font", role, stack })}
          />
        ))}
      </FieldGroup>
      <FieldDescription>{t.fontHelp}</FieldDescription>
      <FieldDescription>{t.fontNetworkNote}</FieldDescription>
    </Section>
  );
}
