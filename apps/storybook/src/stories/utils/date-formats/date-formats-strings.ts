import type { Locale } from "@sb/i18n/locale-types";

/** UI strings of the catalog story. Spanish is typed from the English keys. */
const en = {
  caption: "Every catalog name, written in the toolbar's language",
  name: "Name",
  group: "Group",
  local: "Local value",
  instant: "Instant (UTC)",
  calendar: "Date",
  time: "Time",
  dateTime: "Date and time",
};

const es: Record<keyof typeof en, string> = {
  caption: "Cada nombre del catálogo, escrito en el idioma del toolbar",
  name: "Nombre",
  group: "Grupo",
  local: "Valor local",
  instant: "Instante (UTC)",
  calendar: "Fecha",
  time: "Hora",
  dateTime: "Fecha y hora",
};

export const dateFormatsStrings: Record<Locale, typeof en> = { en, es };
