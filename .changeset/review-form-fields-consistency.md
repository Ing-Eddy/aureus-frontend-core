---
"@aureus-core/ui": minor
---

**Breaking (pre-1.0): the form fields ship no default texts.** Every visible or accessible text comes from props, in the developer's language. The texts a feature needs are required by TypeScript when the feature is on, and untyped code gets a development warning that names the missing prop.

Migration:

| Before | After |
| ------ | ----- |
| `loading` without a label | `loading loadingLabel="Cargando"` (also with a runtime boolean such as `loading={isSaving}`) |
| `info` without a label | `info="…" infoLabel="Más información"` |
| `PasswordField` / `PasswordControl` | `showPasswordLabel="Mostrar contraseña" hidePasswordLabel="Ocultar contraseña"`, always |
| `TextAreaField showCount` | `showCount countLabel={(count, maxLength) => …}`; `countLabel` now gets the count and the `maxLength` instead of the remaining characters |
| `NumberField` / `NumberControl` | `incrementLabel="Aumentar" decrementLabel="Disminuir"`, or `stepper={false}` |
| `NumberField expressions` | `expressions invalidExpressionLabel="…" calculatedFromLabel={(expression) => …}` |
| `NumberField minusLabel` | removed: `aria-valuetext` is the `Intl`-formatted number with its minus sign ("-$1,234.50"), which screen readers speak in their own language |

The Switch's loading spinner stays decorative and needs no text.

Other changes from the family review:

- `SelectField` accepts `aria-label` and `aria-labelledby` for a select without a visible label.
- Text, password, text area, number and select fields warn in development when they have no accessible name, like the other families.
- One wording for the unknown-value warning in every family with options, and action warnings start with the name of the field that renders them.
- `RadioGroupField` follows the page's direction: in a right-to-left page its radios sit on the right and the arrow keys follow the reading direction (it used to be forced to left to right).
- Transitions respect `prefers-reduced-motion`.
- A source test fails when a component ships a hard-coded user-facing text.
