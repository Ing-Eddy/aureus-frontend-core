/** The id apps import: `import resources from "virtual:aureus-i18n"`. */
export const VIRTUAL_MODULE_ID = "virtual:aureus-i18n";

/** The resolved id. The `\0` prefix tells Vite and other plugins that it is not a file on disk. */
export const RESOLVED_VIRTUAL_MODULE_ID = `\0${VIRTUAL_MODULE_ID}`;
