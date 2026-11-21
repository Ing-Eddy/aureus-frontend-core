import type { Locale } from "@sb/i18n/locale-types";

/** UI strings of the display playground. Spanish is typed from the English keys. */
const en = {
  call: "Call",
  result: "Result",
};

const es: Record<keyof typeof en, string> = {
  call: "Llamada",
  result: "Resultado",
};

export const displayStrings: Record<Locale, typeof en> = { en, es };
