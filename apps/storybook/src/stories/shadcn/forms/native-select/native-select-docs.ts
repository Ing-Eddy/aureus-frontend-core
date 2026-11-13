import { defineComponentDocs } from "@sb/docs/define-component-docs";

export const docs = defineComponentDocs({
  name: "Native Select",
  importPath: "@aureus-core/ui/shadcn/native-select",
  exports: ["NativeSelect", "NativeSelectOption", "NativeSelectOptGroup"],
  primitive: {
    label: "<select> (HTML)",
    href: "https://developer.mozilla.org/docs/Web/HTML/Element/select",
  },
  api: {
    NativeSelect: {
      size: { type: '"sm" | "default"', default: '"default"' },
      value: { type: "string" },
      defaultValue: { type: "string" },
      disabled: { type: "boolean", default: "false" },
      "aria-invalid": { type: "boolean" },
      onChange: { type: "(event: ChangeEvent<HTMLSelectElement>) => void" },
      className: { type: "string" },
    },
    NativeSelectOption: {
      value: { type: "string", required: true },
      disabled: { type: "boolean", default: "false" },
    },
    NativeSelectOptGroup: {
      label: { type: "string", required: true },
      disabled: { type: "boolean", default: "false" },
    },
  },
  stories: ["Sizes", "OptionGroups", "Disabled", "Invalid"],
  keyboard: ["Tab", "Space / Alt + ↓", "↑ / ↓", "Type a letter"],
  links: [
    {
      label: "shadcn/ui: Native Select",
      href: "https://ui.shadcn.com/docs/components/native-select",
    },
    { label: "MDN: <select>", href: "https://developer.mozilla.org/docs/Web/HTML/Element/select" },
  ],
  en: {
    summary:
      "A styled native `<select>`. The option list is drawn by the browser and the operating system, so it is fast, works with any form library and feels native on mobile.",
    whenToUse: [
      "For a plain choice from a list, especially on mobile, where the OS picker is the best experience.",
      "In forms that submit natively or use `FormData`: the value is a regular form field.",
      "When the list is long and needs no icons or rich content.",
    ],
    whenNotToUse: [
      "When options need icons, descriptions or custom styling: use Select.",
      "When the user should search or type a new value: use Combobox.",
      "For two to five options that fit on screen: RadioGroup shows them all at once.",
    ],
    anatomy: {
      NativeSelect:
        'A wrapper `<div data-slot="native-select-wrapper">` holding the `<select>` and a chevron icon. `className` goes on the wrapper; other props go on the `<select>`.',
      NativeSelectOption:
        "An `<option>`. Its colors use the system `Canvas` colors so the list stays readable.",
      NativeSelectOptGroup: "An `<optgroup>` that groups options under a non-selectable label.",
    },
    props: {
      NativeSelect: {
        size: "`sm` is 28px tall, `default` is 32px.",
        value: "Controlled value. Pair it with `onChange`.",
        defaultValue: "Initial value when uncontrolled.",
        disabled: "Disables the select and dims the wrapper.",
        "aria-invalid": "Shows the destructive border and ring.",
        onChange: "Fires when the selection changes; read `event.target.value`.",
        className: "Classes for the wrapper, for example `w-full`.",
      },
      NativeSelectOption: {
        value: "The submitted value.",
        disabled: "Shows the option but prevents choosing it.",
      },
      NativeSelectOptGroup: {
        label: "Group heading shown in the list.",
        disabled: "Disables every option in the group.",
      },
    },
    stories: {
      Sizes: "The two heights next to each other.",
      OptionGroups:
        "`NativeSelectOptGroup` groups options under headings; a disabled option stays visible.",
      Disabled: "The whole select is disabled and dimmed.",
      Invalid: "`aria-invalid` with an error message linked through `aria-describedby`.",
    },
    keyboard: {
      Tab: "Moves focus to the select.",
      "Space / Alt + ↓": "Opens the native option list (varies by browser and OS).",
      "↑ / ↓": "Moves through options; on some platforms it changes the value without opening.",
      "Type a letter": "Jumps to the next option starting with that letter.",
    },
    aria: [
      "A native `<select>`: role `combobox` (or `listbox`), options and value are exposed by the browser.",
      "Name it with a `<Label htmlFor>`; the chevron icon is `aria-hidden`.",
      "Use a first empty option such as “Select a fruit” instead of a placeholder attribute, which `<select>` does not support.",
    ],
    theming: [
      "Tokens: `--input` (border), `--ring` (focus), `--destructive` (invalid).",
      "The open list is drawn by the OS; only option colors (`Canvas`/`CanvasText`) can be influenced.",
    ],
  },
  es: {
    summary:
      "Un `<select>` nativo con estilos. La lista de opciones la dibujan el navegador y el sistema operativo, así que es rápida, funciona con cualquier librería de formularios y se siente nativa en móvil.",
    whenToUse: [
      "Para elegir de una lista sencilla, sobre todo en móvil, donde el selector del sistema es la mejor experiencia.",
      "En formularios que se envían de forma nativa o usan `FormData`: el valor es un campo normal.",
      "Cuando la lista es larga y no necesita iconos ni contenido enriquecido.",
    ],
    whenNotToUse: [
      "Cuando las opciones necesitan iconos, descripciones o estilos propios: usa Select.",
      "Cuando el usuario debe buscar o escribir un valor nuevo: usa Combobox.",
      "Para dos a cinco opciones que caben en pantalla: RadioGroup las muestra todas a la vez.",
    ],
    anatomy: {
      NativeSelect:
        'Un contenedor `<div data-slot="native-select-wrapper">` con el `<select>` y un icono de flecha. `className` va al contenedor; el resto de props al `<select>`.',
      NativeSelectOption:
        "Un `<option>`. Sus colores usan los colores de sistema `Canvas` para que la lista siga legible.",
      NativeSelectOptGroup:
        "Un `<optgroup>` que agrupa opciones bajo una etiqueta no seleccionable.",
    },
    props: {
      NativeSelect: {
        size: "`sm` mide 28px de alto, `default` 32px.",
        value: "Valor controlado. Úsalo junto con `onChange`.",
        defaultValue: "Valor inicial cuando no está controlado.",
        disabled: "Deshabilita el select y atenúa el contenedor.",
        "aria-invalid": "Muestra el borde y el anillo destructivos.",
        onChange: "Se dispara cuando cambia la selección; lee `event.target.value`.",
        className: "Clases para el contenedor, por ejemplo `w-full`.",
      },
      NativeSelectOption: {
        value: "El valor que se envía.",
        disabled: "Muestra la opción pero impide elegirla.",
      },
      NativeSelectOptGroup: {
        label: "Encabezado del grupo que se muestra en la lista.",
        disabled: "Deshabilita todas las opciones del grupo.",
      },
    },
    stories: {
      Sizes: "Las dos alturas una junto a otra.",
      OptionGroups:
        "`NativeSelectOptGroup` agrupa opciones bajo encabezados; una opción deshabilitada sigue visible.",
      Disabled: "Todo el select está deshabilitado y atenuado.",
      Invalid: "`aria-invalid` con un mensaje de error enlazado mediante `aria-describedby`.",
    },
    keyboard: {
      Tab: "Mueve el foco al select.",
      "Space / Alt + ↓": "Abre la lista nativa de opciones (depende del navegador y del sistema).",
      "↑ / ↓": "Recorre las opciones; en algunas plataformas cambia el valor sin abrir la lista.",
      "Type a letter": "Salta a la siguiente opción que empieza por esa letra.",
    },
    aria: [
      "Un `<select>` nativo: el navegador expone el rol `combobox` (o `listbox`), las opciones y el valor.",
      "Ponle nombre con un `<Label htmlFor>`; el icono de flecha es `aria-hidden`.",
      "Usa una primera opción vacía como “Elige una fruta” en lugar de un placeholder, que `<select>` no admite.",
    ],
    theming: [
      "Tokens: `--input` (borde), `--ring` (foco), `--destructive` (inválido).",
      "La lista abierta la dibuja el sistema; solo se pueden influir los colores de las opciones (`Canvas`/`CanvasText`).",
    ],
  },
});
