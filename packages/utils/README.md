# @aureus-core/utils

Framework-free utilities shared by every Aureus project. ESM only, no dependencies, no React: the code uses only standard JavaScript and `Intl`, so it runs in browsers and in Node.js 24+.

**Documentation:** <https://ing-eddy.github.io/aureus-frontend-core/> (section **utils**), in English and Spanish, with a live catalog and a playground.

## Install

```sh
pnpm add @aureus-core/utils
```

## Modules

Each module has its own entry point. There is no root import.

| Module         | Import path                       | What it does                                                        |
| -------------- | --------------------------------- | ------------------------------------------------------------------- |
| `date-formats` | `@aureus-core/utils/date-formats` | The single catalog of named date and time formats (`long`, `time`…) |
| `display`      | `@aureus-core/utils/display`      | One function per basic type that turns a value into the text shown  |

## `display`

Create it once per app:

```ts
// src/lib/display.ts
import { createDisplay } from "@aureus-core/utils/display";
import i18n from "./i18n";

export const display = createDisplay({
  empty: "-", // required: shown for null / undefined and for values that cannot be shown
  locale: () => i18n.resolvedLanguage, // read on every call; omitted → the browser's language
  // timeZone: "America/Mexico_City", // optional; omitted → the browser's time zone
});
```

```ts
display.text(user.name, { maxLength: 40, ellipsis: "…" });
display.number(invoice.total, { decimals: 2, padDecimals: true, grouping: true, currency: "EUR" });
display.boolean(user.active, { true: t("common.active"), false: t("common.inactive") });
display.date(order.date, { format: "long" }); // es: 21 de noviembre de 2026 · en: November 21, 2026
display.time("14:30"); // es: 14:30 · en: 2:30 PM
display.dateTime(log.at, { format: "shortDateTime" });
display.list(tags, { maxItems: 2, more: (n) => t("common.more", { count: n }) }); // a, b y 3 más
display.text(note, { empty: t("notes.none") }); // a per-call empty text
```

Every function returns a `string`. Every option is opt-in and independent, and the library ships no texts of its own: `empty`, the boolean labels and `more` are required by TypeScript.

## `date-formats`

The catalog is defined in this package and is the same in every app. An app picks a name and never writes a format. Each name is written the way the active language writes it.

```ts
import { createDateFormatter } from "@aureus-core/utils/date-formats";

const dates = createDateFormatter({ locale: () => i18n.resolvedLanguage });
dates.format(new Date(2026, 10, 1), "monthYear"); // es: noviembre de 2026 · en: November 2026
```

Names:

- **Dates:** `short`, `medium`, `long`, `full`, `numericDate`, `dayMonth`, `monthYear`, `weekday`, `month`, `year`.
- **Times:** `time`, `timeWithSeconds`.
- **Dates and times:** `shortDateTime`, `mediumDateTime`, `longDateTime`.

Values:

- **Local ISO strings** (`2026-11-21`, `14:30`, `2026-11-21T14:30`) are shown exactly as written, in any time zone.
- **Instants** (`Date`, timestamps, ISO with `Z` / an offset) are shown in `timeZone`, or in the browser's time zone.

To add or change a format, change the catalog in this package and release it.

## Development warnings

Invalid values and misuse (`NaN`, an unreadable date, an unknown format name in untyped code) log a `console.warn` once, outside production. The check reads `process.env.NODE_ENV`, which your bundler (Vite) replaces at build time, so production bundles contain no warnings.
