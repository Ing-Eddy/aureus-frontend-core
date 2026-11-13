import { defineComponentDocs } from "@sb/docs/define-component-docs";

const variant = '"default" | "outline"';
const size = '"default" | "sm" | "lg"';

export const docs = defineComponentDocs({
  name: "Toggle",
  importPath: "@aureus-core/ui/shadcn/toggle",
  exports: ["Toggle", "toggleVariants"],
  primitive: {
    label: "Radix UI Toggle",
    href: "https://www.radix-ui.com/primitives/docs/components/toggle",
  },
  api: {
    Toggle: {
      pressed: { type: "boolean" },
      defaultPressed: { type: "boolean", default: "false" },
      onPressedChange: { type: "(pressed: boolean) => void" },
      variant: { type: variant, default: '"default"' },
      size: { type: size, default: '"default"' },
      disabled: { type: "boolean", default: "false" },
    },
    toggleVariants: {
      variant: { type: variant },
      size: { type: size },
    },
  },
  stories: ["Variants", "Sizes", "WithText", "Disabled"],
  keyboard: ["Tab", "Space / Enter"],
  links: [
    { label: "shadcn/ui: Toggle", href: "https://ui.shadcn.com/docs/components/toggle" },
    { label: "Radix: Toggle", href: "https://www.radix-ui.com/primitives/docs/components/toggle" },
  ],
  en: {
    summary:
      "A two-state button that stays pressed or unpressed, like Bold in a text editor. It exposes its state with `aria-pressed`.",
    whenToUse: [
      "For a toolbar option that is on or off: bold, mute, show grid.",
      "Alone; for a set of related toggles use ToggleGroup.",
    ],
    whenNotToUse: [
      "For a setting in a form or settings list: use Switch or Checkbox.",
      "For a one-off action: use Button.",
    ],
    anatomy: {
      Toggle: '`<button aria-pressed>` with `data-state="on" | "off"`.',
      toggleVariants: "The class generator, shared with ToggleGroupItem.",
    },
    props: {
      Toggle: {
        pressed: "Controlled pressed state.",
        defaultPressed: "Initial pressed state.",
        onPressedChange: "Called with the new pressed state.",
        variant: "`outline` adds a border.",
        size: "Height: `sm` 28px, `default` 32px, `lg` 36px.",
        disabled: "Prevents toggling and dims the button.",
      },
      toggleVariants: { variant: "Same values as Toggle.", size: "Same values as Toggle." },
    },
    stories: {
      Variants: "`default` and `outline`, each shown on and off.",
      Sizes: "`sm`, `default` and `lg`.",
      WithText: "An icon plus a label.",
      Disabled: "A disabled toggle cannot change state.",
    },
    keyboard: {
      Tab: "Moves focus to the toggle.",
      "Space / Enter": "Toggles the pressed state.",
    },
    aria: [
      'A native `<button>` with `aria-pressed="true" | "false"`; screen readers announce “toggle button, pressed”.',
      "Icon-only toggles need `aria-label`, and the label must not change with the state.",
      "Use the same label for both states (“Bold”), not opposites (“Bold”/“Not bold”).",
    ],
    theming: [
      "Pressed and hover background: `--muted`; text: `--foreground`. Outline border: `--input`.",
      'Style the pressed state with `data-[state=on]:` utilities or `[data-slot="toggle"][data-state="on"]`.',
    ],
  },
  es: {
    summary:
      "Un botón de dos estados que se queda pulsado o no, como Negrita en un editor de texto. Expone su estado con `aria-pressed`.",
    whenToUse: [
      "Para una opción de barra de herramientas activada o desactivada: negrita, silenciar, mostrar cuadrícula.",
      "Suelto; para un conjunto de toggles relacionados usa ToggleGroup.",
    ],
    whenNotToUse: [
      "Para un ajuste en un formulario o lista de ajustes: usa Switch o Checkbox.",
      "Para una acción puntual: usa Button.",
    ],
    anatomy: {
      Toggle: '`<button aria-pressed>` con `data-state="on" | "off"`.',
      toggleVariants: "El generador de clases, compartido con ToggleGroupItem.",
    },
    props: {
      Toggle: {
        pressed: "Estado pulsado controlado.",
        defaultPressed: "Estado pulsado inicial.",
        onPressedChange: "Se llama con el nuevo estado pulsado.",
        variant: "`outline` añade un borde.",
        size: "Altura: `sm` 28px, `default` 32px, `lg` 36px.",
        disabled: "Impide cambiar el estado y atenúa el botón.",
      },
      toggleVariants: {
        variant: "Los mismos valores que Toggle.",
        size: "Los mismos valores que Toggle.",
      },
    },
    stories: {
      Variants: "`default` y `outline`, cada uno activado y desactivado.",
      Sizes: "`sm`, `default` y `lg`.",
      WithText: "Un icono más una etiqueta.",
      Disabled: "Un toggle deshabilitado no puede cambiar de estado.",
    },
    keyboard: {
      Tab: "Mueve el foco al toggle.",
      "Space / Enter": "Cambia el estado pulsado.",
    },
    aria: [
      'Un `<button>` nativo con `aria-pressed="true" | "false"`; los lectores anuncian “botón de alternancia, pulsado”.',
      "Los toggles solo con icono necesitan `aria-label`, y la etiqueta no debe cambiar con el estado.",
      "Usa la misma etiqueta en ambos estados (“Negrita”), no opuestos (“Negrita”/“Sin negrita”).",
    ],
    theming: [
      "Fondo pulsado y al pasar el ratón: `--muted`; texto: `--foreground`. Borde outline: `--input`.",
      'Estiliza el estado pulsado con utilidades `data-[state=on]:` o `[data-slot="toggle"][data-state="on"]`.',
    ],
  },
});
