---
"@aureus-core/utils": minor
---

New package `@aureus-core/utils`: framework-free utilities for every Aureus project. It is ESM only, has no dependencies and no React, and gives one entry point per module.

- **`@aureus-core/utils/date-formats`.** One closed catalog of named date and time formats, defined by the library:
  - names: `short`, `medium`, `long`, `full`, `numericDate`, `dayMonth`, `monthYear`, `weekday`, `month`, `year`, `time`, `timeWithSeconds`, `shortDateTime`, `mediumDateTime` and `longDateTime`;
  - each name is written the way the active language writes it;
  - `createDateFormatter({ locale?, timeZone? }).format(value, name, overrides?)`, `dateFormatNames`, and the `DateFormatName`, `CalendarFormatName`, `TimeFormatName` and `DateTimeFormatName` types;
  - local ISO strings (`YYYY-MM-DD`, `HH:mm[:ss]`, `YYYY-MM-DDTHH:mm[:ss]`) are shown exactly as written in any time zone;
  - a `Date`, a timestamp or an ISO string with a zone is an instant, shown in `timeZone` or in the runtime's zone.
- **`@aureus-core/utils/display`.** `createDisplay({ empty, locale?, timeZone? })` returns `text`, `number`, `boolean`, `date`, `time`, `dateTime` and `list`:
  - each returns a string, and `null`/`undefined` give the `empty` text;
  - **text:** always trimmed; `maxLength` counts graphemes, plus `ellipsis` and `blankAsEmpty`;
  - **numbers:** neutral by default; `decimals`, `padDecimals`, `grouping`, `currency` (symbol only) and `negativeFormat`, each independent;
  - **booleans:** the two labels are required;
  - **dates:** catalog names, restricted by group;
  - **lists:** `Intl.ListFormat`, with `maxItems` and a required `more`.
- **Locale and time zone are never fixed.** `locale` may be a getter evaluated on every call (`() => i18n.resolvedLanguage`), and both default to the runtime's.
- **No default texts.** Development warnings (outside production, once each) report invalid values and misuse.
