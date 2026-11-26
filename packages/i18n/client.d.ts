// Types of the virtual module served by the `@aureus-core/i18n/vite` plugin. Add this file to the
// `types` of the app's tsconfig: `"types": ["vite/client", "@aureus-core/i18n/client"]`.
// It is a script (no top-level import or export), so the module declaration below is ambient.

declare module "virtual:aureus-i18n" {
  /** The discovered languages, namespaces and lazy loaders. Pass it to `createI18n({ resources })`. */
  const resources: import("@aureus-core/i18n/runtime").I18nResources;
  export default resources;
}
