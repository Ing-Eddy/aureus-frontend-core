/** One BCP 47 language tag (`"es"`, `"en-US"`) or a list of them, in order of preference. */
export type LocaleTags = string | readonly string[];

/**
 * The locale of a formatter: tags, or a function evaluated on every call (for example
 * `() => i18n.resolvedLanguage`), so the output follows a language that changes at runtime.
 * `undefined`, or a function returning `undefined`, means the runtime's default locale.
 */
export type LocaleInput = LocaleTags | (() => LocaleTags | undefined);
