/** The content of one language of one namespace: the parsed object of its JSON file. */
export type I18nResourceContent = Record<string, unknown>;

/** A change to one locale file, sent during development so the texts update without a reload. */
export interface I18nUpdate {
  /** The language whose file changed (`"es"`). */
  readonly language: string;
  /** The namespace whose file changed (`"auth"`). */
  readonly namespace: string;
  /** The new content of the file. */
  readonly content: I18nResourceContent;
}

/**
 * The resources the `@aureus-core/i18n/vite` plugin discovered, as served by `virtual:aureus-i18n`.
 * The plugin writes this object and `createI18n` consumes it; apps only pass it along:
 *
 * ```ts
 * import resources from "virtual:aureus-i18n";
 * export const i18n = createI18n({ resources, fallbackLng: "es" });
 * ```
 */
export interface I18nResources {
  /** Every discovered language, sorted (`["en", "es"]`). */
  readonly languages: readonly string[];
  /** Every discovered namespace, sorted (`["auth", "common"]`). */
  readonly namespaces: readonly string[];
  /** The `defaultNamespace` configured in the plugin, if any. */
  readonly defaultNamespace?: string;
  /**
   * Loads the content of one language of one namespace, on demand. Resolves to an empty object
   * when that file does not exist.
   */
  load(language: string, namespace: string): Promise<I18nResourceContent>;
  /**
   * Subscribes to locale file changes during development. Returns the function that unsubscribes.
   * Never called in production builds.
   */
  onUpdate(listener: (update: I18nUpdate) => void): () => void;
}
