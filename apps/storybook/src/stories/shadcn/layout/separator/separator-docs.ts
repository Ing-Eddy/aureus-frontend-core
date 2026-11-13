import { defineComponentDocs } from "@sb/docs/define-component-docs";

export const docs = defineComponentDocs({
  name: "Separator",
  importPath: "@aureus-core/ui/shadcn/separator",
  exports: ["Separator"],
  primitive: {
    label: "Radix UI Separator",
    href: "https://www.radix-ui.com/primitives/docs/components/separator",
  },
  api: {
    Separator: {
      orientation: { type: '"horizontal" | "vertical"', default: '"horizontal"' },
      decorative: { type: "boolean", default: "true" },
    },
  },
  stories: ["Vertical", "Semantic"],
  keyboard: [],
  links: [
    { label: "shadcn/ui: Separator", href: "https://ui.shadcn.com/docs/components/separator" },
    {
      label: "Radix: Separator",
      href: "https://www.radix-ui.com/primitives/docs/components/separator",
    },
  ],
  en: {
    summary:
      "A thin line that visually or semantically separates content, horizontally or vertically.",
    whenToUse: [
      "Between groups of content or actions that need a visual break.",
      "Between inline items, such as links in a toolbar (vertical).",
    ],
    whenNotToUse: [
      "Where spacing alone separates the content clearly.",
      "Inside menus: use the menu's own Separator component.",
    ],
    anatomy: { Separator: 'A 1px line (`data-slot="separator"`) in `--border` color.' },
    props: {
      Separator: {
        orientation: "`vertical` needs a height from its container (it stretches in flex rows).",
        decorative:
          'When `true` (default) it is hidden from assistive technology; set `false` for a semantic `role="separator"`.',
      },
    },
    stories: {
      Vertical: "Vertical separators between inline links.",
      Semantic: '`decorative={false}` exposes `role="separator"` between two sections.',
    },
    keyboard: {},
    aria: [
      'Decorative separators get `role="none"` and are skipped by screen readers.',
      "Use `decorative={false}` only when the separation carries meaning, e.g. between thematic sections.",
      'A vertical semantic separator also gets `aria-orientation="vertical"`.',
    ],
    theming: [
      "Color: `--border`. Thickness: `h-px` / `w-px`.",
      "Override with `className`, e.g. `bg-primary` or `my-6`.",
    ],
  },
  es: {
    summary:
      "Una línea fina que separa contenido visual o semánticamente, en horizontal o en vertical.",
    whenToUse: [
      "Entre grupos de contenido o acciones que necesitan una pausa visual.",
      "Entre elementos en línea, como enlaces en una barra (vertical).",
    ],
    whenNotToUse: [
      "Donde el espaciado basta para separar el contenido con claridad.",
      "Dentro de menús: usa el Separator propio del menú.",
    ],
    anatomy: { Separator: 'Una línea de 1px (`data-slot="separator"`) del color `--border`.' },
    props: {
      Separator: {
        orientation: "`vertical` necesita una altura de su contenedor (se estira en filas flex).",
        decorative:
          'Con `true` (por defecto) se oculta a las tecnologías de asistencia; pon `false` para un `role="separator"` semántico.',
      },
    },
    stories: {
      Vertical: "Separadores verticales entre enlaces en línea.",
      Semantic: '`decorative={false}` expone `role="separator"` entre dos secciones.',
    },
    keyboard: {},
    aria: [
      'Los separadores decorativos reciben `role="none"` y los lectores de pantalla los saltan.',
      "Usa `decorative={false}` solo cuando la separación tiene significado, p. ej. entre secciones temáticas.",
      'Un separador semántico vertical recibe además `aria-orientation="vertical"`.',
    ],
    theming: [
      "Color: `--border`. Grosor: `h-px` / `w-px`.",
      "Cámbialo con `className`, p. ej. `bg-primary` o `my-6`.",
    ],
  },
});
