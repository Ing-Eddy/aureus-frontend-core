import type { Locale } from "@sb/i18n/locale-types";

/**
 * Every label, help text, message and report of the theme builder (design D9). `{name}` marks a
 * placeholder filled by `fill()`. The Spanish entry is typed from the English keys, so a missing or
 * extra key is a type error; `theme-builder-strings-tests.ts` also checks emptiness and placeholders.
 */
const en = {
  title: "Theme Builder",
  intro:
    "Create a shadcn theme for Tailwind CSS v4: pick a few colors, adjust any token, check contrast and download a standalone .css file for any shadcn app.",
  reset: "Reset",
  resetConfirm: "Discard every change and go back to the Aureus default theme?",
  resetConfirmYes: "Discard changes",
  cancel: "Cancel",

  sectionColors: "Colors",
  sectionTokens: "Tokens",
  sectionTypography: "Typography",
  sectionEffects: "Shape & effects",
  sectionImport: "Import",
  sectionExport: "Export",

  presetNote:
    "Showing the Aureus default theme. Change any color input to generate a new palette from it.",
  generatedNote: "Colors are generated from the inputs below. Overridden tokens keep their value.",
  primary: "Primary color",
  primaryHelp: "Your brand color. Buttons, rings and the sidebar use it in both modes.",
  achromatic: "Black and white primary",
  achromaticHelp: "Keep shadcn's neutral primary instead of a brand color.",
  neutral: "Neutral palette",
  neutralHelp: "Backgrounds, borders, muted text and surfaces.",
  tint: "Neutral tint",
  tintHelp: "How much the neutrals lean toward the primary hue.",
  tintValue: "{value}%",
  destructive: "Destructive color",
  destructiveHelp: "Errors and destructive actions.",
  charts: "Chart colors",
  chartMonochrome: "Monochrome",
  chartPrimary: "From the primary hue",
  colorText: "{label} value",
  colorPicker: "Pick {label}",
  invalidColor: "Not a valid color. Use hex, rgb(), hsl() or oklch().",

  tokensHelp:
    "Override any generated token. Accepts hex, rgb(), hsl() and oklch(), alpha included.",
  light: "Light",
  dark: "Dark",
  overridden: "Overridden",
  resetToken: "Reset {token}",
  ratio: "{ratio}:1",
  ratioFails: "{ratio}:1, below 4.5:1",

  fontSans: "Sans-serif font",
  fontSerif: "Serif font",
  fontMono: "Monospace font",
  fontStack: "{label} stack",
  fontCustom: "Custom stack",
  fontHelp: "Pick a font or type any CSS font-family stack.",
  fontNetworkNote:
    "Web fonts load from Google Fonts only when you pick one. In your app, install the font yourself (for example with Fontsource).",

  radius: "Radius",
  radiusValue: "{value} rem",
  shadowColorLight: "Shadow color (light)",
  shadowColorDark: "Shadow color (dark)",
  shadowOpacity: "Shadow opacity",
  shadowBlur: "Shadow blur",
  shadowSpread: "Shadow spread",
  shadowX: "Shadow offset X",
  shadowY: "Shadow offset Y",
  pxValue: "{value} px",
  percentValue: "{value}%",
  spacing: "Spacing unit",
  spacingHelp: "Tailwind multiplies it for every spacing utility (p-4 = 4 × unit).",
  tracking: "Letter spacing",
  emValue: "{value} em",

  contrastTitle: "Contrast",
  contrastPass: "Meets WCAG AA for text contrast (4.5:1) in light and dark mode.",
  contrastFail: "{count} text pairs are below 4.5:1.",
  contrastPair: "{foreground} on {surface}",

  importHelp:
    "Paste a shadcn theme (from ui.shadcn.com, tweakcn or a file exported here) or choose a .css file. Colors become token overrides.",
  importPaste: "Theme CSS",
  importButton: "Import pasted CSS",
  importFile: "Or choose a .css file",
  importOk: "Imported {count} values.",
  importMissing: "Not in the file, kept as they were: {list}",
  importIgnored: "Ignored: {list}",
  importError: "No shadcn theme tokens found. Nothing was changed.",

  themeName: "Theme name",
  themeNameHelp: "The file is saved as {file}.",
  code: "Generated CSS",
  download: "Download .css",
  copy: "Copy",
  copied: "Copied",
  copyFailed: "Copy failed: the code is selected, press Ctrl+C (⌘C) to copy it.",
  exportWarning: "This theme fails WCAG AA contrast on: {list}. You can still export it.",

  preview: "Preview",
  previewLight: "Light preview",
  previewDark: "Dark preview",
};

export type ThemeBuilderStrings = typeof en;
export type ThemeBuilderStringKey = keyof ThemeBuilderStrings;

const es: Record<ThemeBuilderStringKey, string> = {
  title: "Creador de temas",
  intro:
    "Crea un tema de shadcn para Tailwind CSS v4: elige unos pocos colores, ajusta cualquier token, comprueba el contraste y descarga un archivo .css independiente para cualquier app con shadcn.",
  reset: "Restablecer",
  resetConfirm: "¿Descartar todos los cambios y volver al tema por defecto de Aureus?",
  resetConfirmYes: "Descartar cambios",
  cancel: "Cancelar",

  sectionColors: "Colores",
  sectionTokens: "Tokens",
  sectionTypography: "Tipografía",
  sectionEffects: "Forma y efectos",
  sectionImport: "Importar",
  sectionExport: "Exportar",

  presetNote:
    "Se muestra el tema por defecto de Aureus. Cambia cualquier color de entrada para generar una paleta nueva a partir de él.",
  generatedNote:
    "Los colores se generan a partir de estas entradas. Los tokens sustituidos conservan su valor.",
  primary: "Color primario",
  primaryHelp:
    "El color de tu marca. Lo usan los botones, los anillos de foco y el sidebar en ambos modos.",
  achromatic: "Primario en blanco y negro",
  achromaticHelp: "Mantiene el primario neutro de shadcn en lugar de un color de marca.",
  neutral: "Paleta neutra",
  neutralHelp: "Fondos, bordes, texto atenuado y superficies.",
  tint: "Tinte de los neutros",
  tintHelp: "Cuánto se inclinan los neutros hacia el tono del primario.",
  tintValue: "{value} %",
  destructive: "Color destructivo",
  destructiveHelp: "Errores y acciones destructivas.",
  charts: "Colores de gráficos",
  chartMonochrome: "Monocromo",
  chartPrimary: "A partir del tono primario",
  colorText: "Valor de {label}",
  colorPicker: "Elegir {label}",
  invalidColor: "No es un color válido. Usa hex, rgb(), hsl() u oklch().",

  tokensHelp:
    "Sustituye cualquier token generado. Acepta hex, rgb(), hsl() y oklch(), con transparencia incluida.",
  light: "Claro",
  dark: "Oscuro",
  overridden: "Sustituido",
  resetToken: "Restablecer {token}",
  ratio: "{ratio}:1",
  ratioFails: "{ratio}:1, por debajo de 4.5:1",

  fontSans: "Fuente sans-serif",
  fontSerif: "Fuente serif",
  fontMono: "Fuente monoespaciada",
  fontStack: "Pila de fuentes ({label})",
  fontCustom: "Pila personalizada",
  fontHelp: "Elige una fuente o escribe cualquier pila de font-family de CSS.",
  fontNetworkNote:
    "Las fuentes web se cargan desde Google Fonts solo cuando eliges una. En tu app, instala la fuente tú mismo (por ejemplo con Fontsource).",

  radius: "Radio",
  radiusValue: "{value} rem",
  shadowColorLight: "Color de sombra (claro)",
  shadowColorDark: "Color de sombra (oscuro)",
  shadowOpacity: "Opacidad de la sombra",
  shadowBlur: "Desenfoque de la sombra",
  shadowSpread: "Extensión de la sombra",
  shadowX: "Desplazamiento X de la sombra",
  shadowY: "Desplazamiento Y de la sombra",
  pxValue: "{value} px",
  percentValue: "{value} %",
  spacing: "Unidad de espaciado",
  spacingHelp: "Tailwind la multiplica en cada utilidad de espaciado (p-4 = 4 × unidad).",
  tracking: "Espaciado entre letras",
  emValue: "{value} em",

  contrastTitle: "Contraste",
  contrastPass: "Cumple WCAG AA de contraste de texto (4.5:1) en modo claro y oscuro.",
  contrastFail: "{count} parejas de texto están por debajo de 4.5:1.",
  contrastPair: "{foreground} sobre {surface}",

  importHelp:
    "Pega un tema de shadcn (de ui.shadcn.com, tweakcn o un archivo exportado aquí) o elige un archivo .css. Los colores pasan a ser tokens sustituidos.",
  importPaste: "CSS del tema",
  importButton: "Importar el CSS pegado",
  importFile: "O elige un archivo .css",
  importOk: "Se importaron {count} valores.",
  importMissing: "No están en el archivo, se mantienen como estaban: {list}",
  importIgnored: "Ignorados: {list}",
  importError: "No se encontraron tokens de un tema de shadcn. No se cambió nada.",

  themeName: "Nombre del tema",
  themeNameHelp: "El archivo se guarda como {file}.",
  code: "CSS generado",
  download: "Descargar .css",
  copy: "Copiar",
  copied: "Copiado",
  copyFailed: "No se pudo copiar: el código está seleccionado, pulsa Ctrl+C (⌘C) para copiarlo.",
  exportWarning: "Este tema no cumple el contraste WCAG AA en: {list}. Aun así puedes exportarlo.",

  preview: "Vista previa",
  previewLight: "Vista previa clara",
  previewDark: "Vista previa oscura",
};

export const themeBuilderStrings: Record<Locale, ThemeBuilderStrings> = { en, es };

/** `{name}` placeholders of a template, sorted. */
export function placeholders(template: string): string[] {
  return [...template.matchAll(/\{(\w+)\}/g)].map((match) => match[1] ?? "").sort();
}

/** Replaces `{name}` placeholders. Unknown placeholders are left as they are. */
export function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (whole, name: string) =>
    name in values ? String(values[name]) : whole,
  );
}
