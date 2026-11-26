import type { I18nResourceContent } from "@aureus-core/i18n/runtime";

/**
 * The example app's locale files: what `src/common/locales/*.json` and
 * `src/features/payments/locales/*.json` would hold in a real app. Language → namespace → content.
 */
export const exampleLocales: Record<string, Record<string, I18nResourceContent>> = {
  en: {
    common: { greeting: "Welcome back, {{name}}", direction: "Text direction: {{dir}}" },
    payments: {
      title: "Payments",
      pending_one: "{{count}} pending payment",
      pending_other: "{{count}} pending payments",
    },
  },
  es: {
    common: {
      greeting: "Bienvenida de nuevo, {{name}}",
      direction: "Dirección del texto: {{dir}}",
    },
    payments: {
      title: "Pagos",
      pending_one: "{{count}} pago pendiente",
      pending_other: "{{count}} pagos pendientes",
    },
  },
  ar: {
    common: { greeting: "مرحبًا بعودتك يا {{name}}", direction: "اتجاه النص: {{dir}}" },
    payments: { title: "المدفوعات", pending_other: "المدفوعات المعلقة: {{count}}" },
  },
};

/** Endonyms of the example app's languages, shown in its language selector. */
export const exampleLanguageNames: Record<string, string> = {
  en: "English",
  es: "Español",
  ar: "العربية",
};
