# typography Specification

## Purpose
Defines the typography system of `@aureus-core/ui`. It covers the fixed catalog of named text styles and its default values, the runtime tokens that apps override, the font roles, and the `Typography` component that renders text with those styles, semantic elements and independent modifiers.

## Requirements

### Requirement: Variant catalog
The package SHALL define exactly these typography variants, in this order: `display`, `h1`, `h2`, `h3`, `h4`, `h5`, `h6`, `lead`, `body-lg`, `body`, `body-sm`, `label`, `caption`, `overline` and `code`.

`@aureus-core/ui/components/typography` MUST export the ordered list as `typographyVariants` and its union type as `TypographyVariant`. Every variant MUST define six properties:
- a font role, one of `sans`, `heading`, `serif` or `mono`;
- a font size;
- a line height;
- a font weight;
- a letter spacing;
- a text transform.

#### Scenario: Catalog is exported
- **WHEN** a consumer imports `typographyVariants`
- **THEN** it receives the 15 variant names in the order above

#### Scenario: Every variant has its tokens
- **WHEN** the shipped stylesheet is inspected
- **THEN** each variant in `typographyVariants` has one runtime variable per property and one style class

### Requirement: Default typography values
Without any override, the stylesheet SHALL apply these values:

| Variant | Role | Size | Line height | Weight | Letter spacing | Transform |
|---|---|---|---|---|---|---|
| `display` | heading | `clamp(2.5rem, 1.75rem + 2.5vw, 3.75rem)` | 1.1 | 700 | -0.03em | none |
| `h1` | heading | `clamp(2rem, 1.6rem + 1.5vw, 2.5rem)` | 1.15 | 700 | -0.025em | none |
| `h2` | heading | `clamp(1.625rem, 1.4rem + 0.9vw, 1.875rem)` | 1.2 | 600 | -0.02em | none |
| `h3` | heading | 1.5rem | 1.3 | 600 | -0.015em | none |
| `h4` | heading | 1.25rem | 1.4 | 600 | -0.01em | none |
| `h5` | heading | 1.125rem | 1.45 | 600 | -0.005em | none |
| `h6` | heading | 1rem | 1.5 | 600 | 0em | none |
| `lead` | sans | 1.25rem | 1.6 | 400 | -0.005em | none |
| `body-lg` | sans | 1.125rem | 1.65 | 400 | 0em | none |
| `body` | sans | 1rem | 1.6 | 400 | 0em | none |
| `body-sm` | sans | 0.875rem | 1.5 | 400 | 0em | none |
| `label` | sans | 0.875rem | 1.25 | 500 | 0em | none |
| `caption` | sans | 0.75rem | 1.4 | 400 | 0.01em | none |
| `overline` | sans | 0.75rem | 1.4 | 600 | 0.08em | uppercase |
| `code` | mono | 0.875em | inherit | 400 | 0em | none |

Every fluid size MUST include a `rem` term, so the text grows with the browser's font-size setting and page zoom.

#### Scenario: Default heading
- **WHEN** an element with the `h3` style renders with no overrides
- **THEN** its computed font size is 1.5rem, its line height 1.3, its weight 600 and its font the heading font

#### Scenario: Fluid size respects zoom
- **WHEN** the user doubles the browser's default font size
- **THEN** the minimum and maximum sizes of `display`, `h1` and `h2` double as well

#### Scenario: Code follows its context
- **WHEN** the `code` style is used inside text sized 1.25rem
- **THEN** its font size is 0.875 times that size

### Requirement: Font roles
The stylesheet SHALL define four font roles with these defaults:
- `sans`: Geist Variable followed by a system sans fallback;
- `heading`: the `sans` family;
- `serif`: the system serif stack;
- `mono`: Geist Mono Variable followed by a system monospace fallback.

The package MUST bundle the Geist and Geist Mono font files, so the defaults work with no extra install. Tailwind's `font-sans`, `font-heading`, `font-serif` and `font-mono` utilities MUST resolve to the same roles at runtime. Overriding a role therefore also changes every component that uses those utilities. The page's base letter spacing MUST follow a global tracking variable, `0em` by default. Tailwind's `tracking-*` utilities MUST be offsets from it.

#### Scenario: Heading font override
- **WHEN** an app sets the heading font variable to another family in `:root`
- **THEN** variants with the `heading` role and shadcn titles that use `font-heading` (card, dialog, sheet) render with that family, and body text keeps the `sans` family

#### Scenario: Defaults need no install
- **WHEN** a consumer imports only `@aureus-core/ui/styles.css`
- **THEN** body text renders in Geist and `code` renders in Geist Mono with no extra font package

### Requirement: Runtime overrides
Every font role, the global tracking and every property of every variant SHALL be a CSS custom property that is read at runtime. An app MUST be able to change any of them by redefining the variable in a stylesheet loaded after the package stylesheet, without rebuilding the package and without a Tailwind configuration.

#### Scenario: Override one variant
- **WHEN** an app redefines the size and weight variables of `h2` in `:root`
- **THEN** every `h2`-styled element uses the new size and weight, and every other variant is unchanged

### Requirement: Style classes
The stylesheet SHALL provide one class per variant, named `typography-<variant>`, which applies all six properties of that variant. The classes MUST be usable on any element without the component. Any Tailwind utility on the same element MUST take precedence over the class, whatever the order of the classes, because the classes belong to a lower cascade layer than the utilities.

#### Scenario: Class without the component
- **WHEN** an app renders `<p class="typography-caption">`
- **THEN** the paragraph has the `caption` size, line height, weight, letter spacing and font

#### Scenario: Utility wins
- **WHEN** an element has both `typography-body` and the `font-bold` utility
- **THEN** its weight is bold

### Requirement: Typography component
`@aureus-core/ui/components/typography` SHALL export `Typography` and its public types. `Typography` MUST:
- apply the style class of its `variant`, which defaults to `body`;
- render the variant's natural element when neither `as` nor `asChild` is given:
  - `h1` for `display` and `h1`, and `h2`–`h6` for `h2`–`h6`;
  - `p` for `lead`, `body-lg`, `body` and `body-sm`;
  - `span` for `label`, `caption` and `overline`;
  - `code` for `code`;
- set `data-slot="typography"` and `data-variant`;
- forward its ref and every native attribute to the rendered element.

#### Scenario: Bare component
- **WHEN** `<Typography>Text</Typography>` renders
- **THEN** it renders a `p` element with the `body` style and no color, alignment or wrapping class

#### Scenario: Natural element of a heading
- **WHEN** `<Typography variant="h2">` renders
- **THEN** it renders an `h2` element with the `h2` style

### Requirement: Element override
`as` SHALL change only the rendered element, never the style. It MUST accept only these text elements: `h1`–`h6`, `p`, `span`, `div`, `label`, `strong`, `em`, `small`, `code`, `blockquote`, `figcaption`, `legend`, `li`, `dt`, `dd`, `time`, `cite`, `q` and `abbr`. The native props MUST be typed for the chosen element: for example, `htmlFor` exists only with `as="label"` and `dateTime` only with `as="time"`.

`asChild` MUST render the only child instead of an element of its own, merging the style classes, data attributes and props into it. `as` and `asChild` MUST NOT be combined: TypeScript rejects it.

#### Scenario: Visual level differs from semantic level
- **WHEN** `<Typography variant="h2" as="h3">` renders
- **THEN** it renders an `h3` element with the `h2` style

#### Scenario: Unsupported element is a type error
- **WHEN** a consumer writes `<Typography as="button">`
- **THEN** TypeScript reports an error

#### Scenario: Link with a text style
- **WHEN** `<Typography asChild variant="body" tone="primary"><a href="/help">Help</a></Typography>` renders
- **THEN** a single `a` element renders with the `body` style, the primary color and `href="/help"`

### Requirement: Independent modifiers
`Typography` SHALL accept these opt-in modifiers, each with no effect when it is omitted:
- `tone`: `default`, `muted`, `primary` or `destructive`, using the theme's color tokens. When it is omitted, the color is inherited.
- `weight`: `regular`, `medium`, `semibold` or `bold`. When it is omitted, the variant's weight applies.
- `align`: `start`, `center`, `end` or `justify`. These are logical values that follow the text direction.
- `wrap`: `balance`, `pretty` or `nowrap`.
- `truncate`: one line with an ellipsis.
- `lineClamp`: an integer from 1 to 6, the number of visible lines, with an ellipsis. `truncate` and `lineClamp` MUST NOT be combined: TypeScript rejects it.
- `italic`.
- `tabularNums`: fixed-width digits.

Each modifier MUST change only its own property. No modifier, and neither `variant` nor `as`, MAY change another modifier's default or effect. `className` MUST be applied last and take precedence over every modifier.

#### Scenario: Tone does not change the weight or the element
- **WHEN** `<Typography variant="caption" tone="muted">` renders
- **THEN** it renders a `span` with the `caption` weight and the muted color

#### Scenario: Weight does not change the size
- **WHEN** `<Typography variant="body-sm" weight="bold">` renders
- **THEN** the text is bold and keeps the `body-sm` size, line height and letter spacing

#### Scenario: Truncation combined with a variant
- **WHEN** `<Typography variant="h4" lineClamp={2}>` renders long text
- **THEN** at most two lines are visible and the last one ends with an ellipsis, with the `h4` style

#### Scenario: Consumer class wins
- **WHEN** `<Typography tone="muted" className="text-foreground">` renders
- **THEN** the text uses the foreground color

### Requirement: No default texts
`Typography` SHALL render only its children. It MUST NOT add any visible or accessible text of its own: no `aria-label`, `title` or placeholder content.

#### Scenario: Empty component
- **WHEN** `<Typography variant="label" />` renders with no children
- **THEN** it renders an empty `span` with no text and no text attributes
