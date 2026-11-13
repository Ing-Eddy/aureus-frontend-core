import { defineComponentDocs } from "@sb/docs/define-component-docs";

export const docs = defineComponentDocs({
  name: "Switch",
  importPath: "@aureus-core/ui/shadcn/switch",
  exports: ["Switch"],
  primitive: {
    label: "Radix UI Switch",
    href: "https://www.radix-ui.com/primitives/docs/components/switch",
  },
  api: {
    Switch: {
      size: { type: '"sm" | "default"', default: '"default"' },
      checked: { type: "boolean" },
      defaultChecked: { type: "boolean" },
      onCheckedChange: { type: "(checked: boolean) => void" },
      disabled: { type: "boolean", default: "false" },
      required: { type: "boolean", default: "false" },
      name: { type: "string" },
      "aria-invalid": { type: "boolean" },
    },
  },
  stories: ["Sizes", "Controlled", "Disabled", "SettingsList"],
  keyboard: ["Tab", "Space", "Enter"],
  links: [
    { label: "shadcn/ui: Switch", href: "https://ui.shadcn.com/docs/components/switch" },
    { label: "Radix: Switch", href: "https://www.radix-ui.com/primitives/docs/components/switch" },
    { label: "WAI-ARIA APG: Switch", href: "https://www.w3.org/WAI/ARIA/apg/patterns/switch/" },
  ],
  en: {
    summary:
      "An on/off control that takes effect immediately, like a physical switch. It reads as a toggle, not as a form answer.",
    whenToUse: [
      "For settings that apply right away: dark mode, notifications, airplane mode.",
      "In settings lists, next to a label and description (horizontal Field).",
    ],
    whenNotToUse: [
      "For choices confirmed by a submit button: use Checkbox.",
      "For a pressed toolbar button: use Toggle.",
    ],
    anatomy: {
      Switch:
        'A `<button role="switch">` track with `data-slot="switch"`, containing the moving thumb (`data-slot="switch-thumb"`).',
    },
    props: {
      Switch: {
        size: "`default` is 32×18px; `sm` is 24×14px.",
        checked: "Controlled state.",
        defaultChecked: "Initial state when uncontrolled.",
        onCheckedChange: "Called with the new boolean on every toggle.",
        disabled: "Prevents toggling and dims the switch.",
        required: "Marks it required in native forms.",
        name: "Form field name; submitted as `on` when checked.",
        "aria-invalid": "Shows the destructive border and ring.",
      },
    },
    stories: {
      Sizes: "The two sizes, `sm` and `default`.",
      Controlled: "React state owns `checked`; the label text follows it.",
      Disabled: "Disabled switches, on and off.",
      SettingsList:
        "Horizontal Fields with title, description and a switch: the typical settings screen.",
    },
    keyboard: {
      Tab: "Moves focus to the switch.",
      Space: "Toggles the switch.",
      Enter: "Toggles the switch.",
    },
    aria: [
      "Role `switch` with `aria-checked`; screen readers announce “on” or “off”.",
      "Name it with a Label; a description can be linked with `aria-describedby`.",
      "Do not change the label text with the state (“Enable”/“Disable”): the state is already announced.",
    ],
    theming: [
      "On: `--primary` track. Off: `--input` track. Thumb: `--background` (dark: `--primary-foreground`/`--foreground`).",
      'Style states with `[data-slot="switch"][data-state="checked"]`.',
    ],
  },
  es: {
    summary:
      "Un control de encendido/apagado que se aplica al momento, como un interruptor físico. Se percibe como un ajuste, no como una respuesta de formulario.",
    whenToUse: [
      "Para ajustes que se aplican al instante: modo oscuro, notificaciones, modo avión.",
      "En listas de ajustes, junto a una etiqueta y una descripción (Field horizontal).",
    ],
    whenNotToUse: [
      "Para opciones que se confirman con un botón de enviar: usa Checkbox.",
      "Para un botón pulsado de una barra de herramientas: usa Toggle.",
    ],
    anatomy: {
      Switch:
        'Un carril `<button role="switch">` con `data-slot="switch"`, que contiene el pulgar móvil (`data-slot="switch-thumb"`).',
    },
    props: {
      Switch: {
        size: "`default` mide 32×18px; `sm` mide 24×14px.",
        checked: "Estado controlado.",
        defaultChecked: "Estado inicial cuando no está controlado.",
        onCheckedChange: "Se llama con el nuevo booleano en cada cambio.",
        disabled: "Impide cambiarlo y lo atenúa.",
        required: "Lo marca como obligatorio en formularios nativos.",
        name: "Nombre del campo; se envía como `on` cuando está activado.",
        "aria-invalid": "Muestra el borde y el anillo destructivos.",
      },
    },
    stories: {
      Sizes: "Los dos tamaños, `sm` y `default`.",
      Controlled: "El estado de React controla `checked`; el texto lo refleja.",
      Disabled: "Switches deshabilitados, encendido y apagado.",
      SettingsList:
        "Fields horizontales con título, descripción y un switch: la típica pantalla de ajustes.",
    },
    keyboard: {
      Tab: "Mueve el foco al switch.",
      Space: "Cambia el switch.",
      Enter: "Cambia el switch.",
    },
    aria: [
      "Rol `switch` con `aria-checked`; los lectores de pantalla anuncian “activado” o “desactivado”.",
      "Ponle nombre con un Label; puedes enlazar una descripción con `aria-describedby`.",
      "No cambies el texto de la etiqueta con el estado (“Activar”/“Desactivar”): el estado ya se anuncia.",
    ],
    theming: [
      "Encendido: carril `--primary`. Apagado: carril `--input`. Pulgar: `--background` (oscuro: `--primary-foreground`/`--foreground`).",
      'Estiliza los estados con `[data-slot="switch"][data-state="checked"]`.',
    ],
  },
});
