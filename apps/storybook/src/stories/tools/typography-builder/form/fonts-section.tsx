import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@aureus-core/ui/shadcn/field";
import {
  NativeSelect,
  NativeSelectOptGroup,
  NativeSelectOption,
} from "@aureus-core/ui/shadcn/native-select";
import { useId } from "react";
import { SelectField, TextField } from "../../shared/form";
import { fill } from "../../shared/i18n";
import { fontCatalog, fontCategories } from "../core/font-catalog";
import { guessFontsource, isValidFamily, isValidFontsource } from "../core/font-stack";
import { type FontChoice, type FontRole, fontRoles } from "../core/typography-types";
import type { TypographyBuilderStrings } from "../i18n/typography-builder-strings";
import { roleLabel, Section, type SectionProps } from "./section";

type ChoiceKind = FontChoice["kind"];

/** The catalog font a role switches to when "catalog" is picked. */
const firstCatalogFont: Record<FontRole, string> = {
  sans: "inter",
  heading: "inter",
  serif: "source-serif-4",
  mono: "jetbrains-mono",
};

/** A valid family to start from when "custom" is picked, so the draft always stays valid. */
const firstCustomFamily: Record<FontRole, string> = {
  sans: "Albert Sans",
  heading: "Bitter",
  serif: "Bitter",
  mono: "Overpass Mono",
};

function choiceFor(role: FontRole, kind: ChoiceKind): FontChoice {
  switch (kind) {
    case "bundled":
    case "system":
      return { kind };
    case "catalog":
      return { kind, id: firstCatalogFont[role] };
    case "custom": {
      const family = firstCustomFamily[role];
      return { kind, family, fontsource: guessFontsource(family) };
    }
  }
}

export const categoryLabel = (t: TypographyBuilderStrings) =>
  ({
    sans: t.categorySans,
    serif: t.categorySerif,
    display: t.categoryDisplay,
    mono: t.categoryMono,
  }) as const;

const keepText = (text: string) => (isValidFamily(text) ? text.trim() : undefined);
const keepPackage = (text: string) => (isValidFontsource(text) ? text.trim() : undefined);
const asIs = (value: string) => value;

function RoleField({
  role,
  choice,
  onChange,
  t,
}: {
  role: FontRole;
  choice: FontChoice;
  onChange: (choice: FontChoice) => void;
  t: TypographyBuilderStrings;
}) {
  const id = useId();
  const label = roleLabel(t)[role];
  const bundledLabel = {
    sans: t.choiceBundledSans,
    heading: t.choiceBundledHeading,
    serif: t.choiceBundledSerif,
    mono: t.choiceBundledMono,
  }[role];
  const categories = categoryLabel(t);

  return (
    <FieldSet className="gap-3" data-testid={`font-role-${role}`}>
      <SelectField<ChoiceKind>
        label={fill(t.choiceKind, { role: label })}
        value={choice.kind}
        options={[
          { value: "bundled", label: bundledLabel },
          // A separate system choice would duplicate the bundled serif stack.
          ...(role === "serif" ? [] : [{ value: "system" as const, label: t.choiceSystem }]),
          { value: "catalog", label: t.choiceCatalog },
          { value: "custom", label: t.choiceCustom },
        ]}
        onChange={(kind) => kind !== choice.kind && onChange(choiceFor(role, kind))}
      />
      {choice.kind === "catalog" ? (
        <Field>
          <FieldLabel htmlFor={`${id}-catalog`}>{fill(t.catalogFont, { role: label })}</FieldLabel>
          <NativeSelect
            id={`${id}-catalog`}
            value={choice.id}
            onChange={(event) => onChange({ kind: "catalog", id: event.target.value })}
          >
            {fontCategories.map((category) => (
              <NativeSelectOptGroup key={category} label={categories[category]}>
                {fontCatalog
                  .filter((font) => font.category === category)
                  .map((font) => (
                    <NativeSelectOption key={font.id} value={font.id}>
                      {font.family}
                    </NativeSelectOption>
                  ))}
              </NativeSelectOptGroup>
            ))}
          </NativeSelect>
        </Field>
      ) : null}
      {choice.kind === "custom" ? (
        <>
          <TextField
            label={fill(t.customFamily, { role: label })}
            value={choice.family}
            parse={keepText}
            format={asIs}
            invalidMessage={t.customFamilyInvalid}
            onChange={(family) =>
              onChange({
                kind: "custom",
                family,
                // Keep the package in sync while it is still the guess for the old family.
                fontsource:
                  choice.fontsource === guessFontsource(choice.family)
                    ? guessFontsource(family)
                    : choice.fontsource,
              })
            }
          />
          <TextField
            label={fill(t.customPackage, { role: label })}
            value={choice.fontsource}
            parse={keepPackage}
            format={asIs}
            invalidMessage={t.customPackageInvalid}
            description={t.customPackageNote}
            onChange={(fontsource) => onChange({ ...choice, fontsource })}
          />
        </>
      ) : null}
    </FieldSet>
  );
}

/** The four font roles (spec: Font roles and font explorer). */
export function FontsSection({ draft, dispatch, t }: SectionProps) {
  return (
    <Section title={t.sectionFonts}>
      <p className="text-sm text-muted-foreground">{t.fontsHelp}</p>
      <FieldGroup>
        {fontRoles.map((role) => (
          <RoleField
            key={role}
            role={role}
            choice={draft.fonts[role]}
            t={t}
            onChange={(choice) => dispatch({ type: "font", role, choice })}
          />
        ))}
      </FieldGroup>
      <FieldDescription>{t.fontNetworkNote}</FieldDescription>
    </Section>
  );
}
