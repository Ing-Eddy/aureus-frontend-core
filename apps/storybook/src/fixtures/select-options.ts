/** Local option sets for the select stories. */

export const countries = [
  { value: "es", label: "España", group: "Europa" },
  { value: "fr", label: "Francia", group: "Europa" },
  { value: "de", label: "Alemania", group: "Europa" },
  { value: "mx", label: "México", group: "América", description: "Peso mexicano (MXN)" },
  { value: "co", label: "Colombia", group: "América", description: "Peso colombiano (COP)" },
  { value: "cl", label: "Chile", group: "América", disabled: true },
  { value: "jp", label: "Japón", group: "Asia" },
];

export const colors = [
  { value: "red", label: "Rojo" },
  { value: "blue", label: "Azul" },
  { value: "green", label: "Verde" },
  { value: "yellow", label: "Amarillo" },
  { value: "purple", label: "Morado" },
];

export const currencies = [
  { value: "USD", label: "US Dollar" },
  { value: "EUR", label: "Euro" },
  { value: "MXN", label: "Mexican Peso" },
  { value: "GBP", label: "Pound Sterling" },
  { value: "JPY", label: "Japanese Yen", disabled: true },
];

/** A larger list to search on the "server" (filtered locally after a delay). */
export const cities = [
  "Lima",
  "Limerick",
  "Lisbon",
  "Liverpool",
  "London",
  "Los Angeles",
  "Madrid",
  "Málaga",
  "Medellín",
  "Mexico City",
  "Milan",
  "Monterrey",
  "Montreal",
].map((city) => ({ value: city.toLowerCase().replace(/\s/g, "-"), label: city }));
