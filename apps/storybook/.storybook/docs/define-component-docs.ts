import { type Locale, locales } from "../i18n/locale-types";

/** Language-neutral facts about one prop. Its description is localized in `LocaleContent.props`. */
export interface PropSpec {
  type: string;
  default?: string;
  required?: boolean;
}

/** Sub-component name → prop name → spec. A sub-component with no own props maps to `{}`. */
export type ApiSpec = Record<string, Record<string, PropSpec>>;

export interface Link {
  label: string;
  href: string;
}

/**
 * Prose in one language. Keys are derived from the neutral spec, so TypeScript rejects a locale
 * that is missing (or adds) a sub-component, prop, story or keyboard entry.
 */
export interface LocaleContent<A extends ApiSpec, S extends string, K extends string> {
  summary: string;
  whenToUse: string[];
  whenNotToUse: string[];
  /** One line per sub-component describing its role in the composition. */
  anatomy: { [Sub in keyof A]: string };
  /** Description of every prop listed in the neutral `api`. */
  props: { [Sub in keyof A]: { [Prop in keyof A[Sub]]: string } };
  /** Description shown above each example story, keyed by story export name. */
  stories: { [Story in S]: string };
  /** What each key in the neutral `keyboard` list does. */
  keyboard: { [Key in K]: string };
  aria: string[];
  theming: string[];
}

export interface ComponentDocsMeta<A extends ApiSpec, S extends string, K extends string> {
  /** Display name, e.g. "Dropdown Menu". */
  name: string;
  /** Public import path, e.g. "@aureus-core/ui/shadcn/dropdown-menu". */
  importPath: string;
  /** Named exports shown in the import snippet. */
  exports: readonly string[];
  /** Underlying primitive whose props every sub-component also accepts. */
  primitive?: Link;
  /** Providers that must wrap the component in an app. */
  providers?: readonly { name: string; importPath: string }[];
  api: A;
  /** Story export names that get a localized description in the Examples section. */
  stories: readonly S[];
  /** Keys (or chords) documented in the keyboard table, e.g. "Enter", "Shift + Tab". */
  keyboard: readonly K[];
  links: readonly Link[];
}

/** Neutral facts plus one `LocaleContent` per locale. */
export type ComponentDocsInput<
  A extends ApiSpec,
  S extends string,
  K extends string,
> = ComponentDocsMeta<A, S, K> & { [L in Locale]: LocaleContent<A, S, K> };

export type ComponentDocs = ComponentDocsInput<ApiSpec, string, string>;

/** Typed identity: infers the neutral keys and checks both locales against them. */
export function defineComponentDocs<
  const A extends ApiSpec,
  const S extends string = never,
  const K extends string = never,
>(
  // Keys are inferred from the neutral fields only; every locale is then checked against them.
  docs: ComponentDocsMeta<A, S, K> & { [L in Locale]: NoInfer<LocaleContent<A, S, K>> },
): ComponentDocs {
  return docs as unknown as ComponentDocs;
}

/**
 * Runtime checks that types cannot express: empty prose, and list sections that one locale fills
 * and the other leaves empty. Returns human-readable problems ("es.props.Button.variant is empty").
 */
export function validateComponentDocs(docs: ComponentDocs): string[] {
  const problems: string[] = [];
  const isBlank = (value: unknown) => typeof value !== "string" || value.trim() === "";

  for (const locale of locales) {
    const content = docs[locale];
    if (!content) {
      problems.push(`${locale}: missing locale`);
      continue;
    }
    if (isBlank(content.summary)) problems.push(`${locale}.summary is empty`);
    for (const section of ["whenToUse", "whenNotToUse", "aria", "theming"] as const) {
      if (content[section].length === 0) problems.push(`${locale}.${section} has no entries`);
      content[section].forEach((entry, index) => {
        if (isBlank(entry)) problems.push(`${locale}.${section}[${index}] is empty`);
      });
    }
    for (const [sub, props] of Object.entries(docs.api)) {
      if (isBlank(content.anatomy[sub])) problems.push(`${locale}.anatomy.${sub} is empty`);
      for (const prop of Object.keys(props)) {
        if (isBlank(content.props[sub]?.[prop]))
          problems.push(`${locale}.props.${sub}.${prop} is empty`);
      }
    }
    for (const story of docs.stories) {
      if (isBlank(content.stories[story])) problems.push(`${locale}.stories.${story} is empty`);
    }
    for (const key of docs.keyboard) {
      if (isBlank(content.keyboard[key])) problems.push(`${locale}.keyboard["${key}"] is empty`);
    }
  }

  const [first, ...others] = locales;
  for (const locale of others) {
    for (const section of ["whenToUse", "whenNotToUse", "aria", "theming"] as const) {
      const expected = docs[first][section].length;
      const actual = docs[locale][section].length;
      if (actual !== expected) {
        problems.push(`${locale}.${section} has ${actual} entries, ${first} has ${expected}`);
      }
    }
  }
  return problems;
}
