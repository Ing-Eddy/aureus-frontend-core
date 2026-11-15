import { defineComponentDocs } from "@sb/docs/define-component-docs";

export const docs = defineComponentDocs({
  name: "Switch Field",
  importPath: "@aureus-core/ui/components/switch-field",
  exports: ["SwitchField", "SwitchFieldProps", "SwitchValue"],
  primitive: {
    label: "Radix: Switch (shadcn/ui look)",
    href: "https://www.radix-ui.com/primitives/docs/components/switch",
  },
  providers: [{ name: "TooltipProvider", importPath: "@aureus-core/ui/shadcn/tooltip" }],
  api: {
    SwitchField: {
      switchLabel: { type: "ReactNode", default: "none" },
      label: { type: "ReactNode", default: "none" },
      value: { type: "boolean | V" },
      defaultValue: { type: "boolean | V", default: "false / uncheckedValue" },
      onValueChange: { type: "(value: boolean | V) => void" },
      checkedValue: { type: "V (string | number | boolean)", default: "true" },
      uncheckedValue: { type: "V (string | number | boolean)", default: "false" },
      onBeforeChange: { type: "(next: boolean | V) => boolean | Promise<boolean>" },
      switchPosition: { type: '"start" | "end"', default: '"start"' },
      appearance: { type: '"plain" | "card"', default: '"plain"' },
      size: { type: '"default" | "sm"', default: '"default"' },
      stateLabels: { type: "{ on: ReactNode; off: ReactNode }" },
      thumbIcons: { type: "{ on: ReactNode; off: ReactNode }" },
      name: { type: "string" },
      required: { type: "boolean", default: "false" },
      loading: { type: "boolean", default: "false" },
      disabled: { type: "boolean", default: "false" },
      info: { type: "ReactNode" },
      helperText: { type: "ReactNode" },
      error: { type: "boolean", default: "false" },
      errorMessage: { type: "ReactNode" },
      action: { type: "FieldActionProps" },
      "aria-label": { type: "string" },
      className: { type: "string" },
      classNames: { type: "SwitchFieldClassNames" },
      ref: { type: "Ref<HTMLButtonElement>" },
    },
  },
  stories: [
    "Basic",
    "LabelAndText",
    "SettingsList",
    "Cards",
    "StateLabels",
    "ThumbIcons",
    "CustomValues",
    "AsyncChange",
    "Keyboard",
    "States",
    "Rtl",
    "Responsive",
    "ShadcnParity",
  ],
  keyboard: ["Space", "Enter", "Tab"],
  links: [
    { label: "Guide: Fields & controls", href: "?path=/docs/guides-fields-controls--docs" },
    { label: "Switch Control", href: "?path=/docs/components-forms-switch-control--docs" },
    { label: "Checkbox Field", href: "?path=/docs/components-forms-checkbox-field--docs" },
    { label: "WAI-ARIA: Switch pattern", href: "https://www.w3.org/WAI/ARIA/apg/patterns/switch/" },
  ],
  en: {
    summary:
      "An on/off switch with the shared field layout, for settings that apply immediately. `label` sits above, as in every field; `switchLabel` sits beside the switch. The value is a `boolean`, or the custom values you choose. `onBeforeChange` can confirm each change, for example after saving it on a server, with a spinner in the thumb meanwhile. Every option is opt-in and it ships no texts of its own.",
    whenToUse: [
      "For a setting that takes effect as soon as it changes: notifications, dark mode, public profile.",
      "With `onBeforeChange` when the change must be saved before it is shown as done.",
    ],
    whenNotToUse: [
      "When the choice is confirmed later with a Save or Submit button (terms, consent in a form step): a Checkbox Field reads better.",
      "Inside a react-hook-form `FormProvider`: use Switch Control.",
      "For more than two states: use a Radio Group Field (segmented).",
    ],
    anatomy: {
      SwitchField:
        "Field header (`label`, required mark, info), a row with the switch (its thumb can hold an icon or a spinner), an optional state label, `switchLabel` and an optional action, and the helper or error text below.",
    },
    props: {
      SwitchField: {
        switchLabel:
          "Text beside the switch. Clicking it toggles the switch; links inside it navigate without toggling. No default.",
        label:
          "Field label above the row. With `switchLabel` too, it names the group and `switchLabel` names the switch; alone, it names the switch.",
        value: "Controlled value: `boolean`, or one of your custom values.",
        defaultValue: "Initial value when uncontrolled.",
        onValueChange:
          "Called with the new value once the change is applied (after `onBeforeChange` confirms it).",
        checkedValue:
          "Value stored when on. Pass it together with `uncheckedValue` (TypeScript requires both); the type is inferred.",
        uncheckedValue: "Value stored when off. Pass it together with `checkedValue`.",
        onBeforeChange:
          "Called with the value the switch would change to. Return `true` to apply it, `false` to keep the current state, or a promise: while it is pending the switch stays put, shows a spinner in the thumb, sets `aria-busy` and ignores toggles; a rejection keeps the state. Show any error message yourself (for example with `error`/`errorMessage`).",
        switchPosition:
          "`end` places the switch after its text (mirrored in RTL), as in settings lists.",
        appearance:
          "`card` wraps the row in a bordered card, clickable everywhere and highlighted when on.",
        size: "`sm` uses the smaller track; the touch target stays at least 24 px.",
        stateLabels:
          "Decorative text of the current state, after the switch (for example Yes / No). Both texts are required; hidden from assistive technology.",
        thumbIcons:
          "Decorative icon of the current state, inside the thumb. Both icons are required; hidden from assistive technology.",
        name: "Name of the native checkbox, for native forms. With custom values it submits `checkedValue`.",
        required: "Shows the required mark and sets `aria-required`. It adds no validation.",
        loading: "Shows a spinner inside the thumb, locks the switch and sets `aria-busy`.",
        disabled: "Locks the switch and dims it.",
        info: "Content of the info tooltip next to the label; part of the switch's description.",
        helperText: "Text below the row; part of the switch's description.",
        error: "Error state: destructive outline and `aria-invalid`.",
        errorMessage: "Message shown in place of the helper text while `error` is true.",
        action: "A button at the end of the row.",
        "aria-label": "Accessible name when there is no visible text.",
        className: "Extra classes for the root.",
        classNames:
          "Extra classes per part: `switch`, `thumb`, `switchLabel`, `stateLabel`, `row` plus the family's parts.",
        ref: 'Reaches the switch (`button role="switch"`).',
      },
    },
    stories: {
      Basic: "The minimum: a `switchLabel` and a boolean value.",
      LabelAndText: "A label above and a text beside the switch.",
      SettingsList: "Settings rows with small switches at the end.",
      Cards: "Settings as clickable cards, highlighted when on.",
      StateLabels: "Yes / No next to the switch, following its state.",
      ThumbIcons: "A check and a cross inside the thumb.",
      CustomValues: 'The value is `"public"` or `"private"`; the stored value is shown below.',
      AsyncChange:
        "The first switch saves successfully after a delay; the second one fails and goes back.",
      Keyboard: "Space and Enter toggle the focused switch.",
      States: "Required with info, helper, error with message, loading and disabled.",
      Rtl: "In a right-to-left container the thumb of an enabled switch rests on the left.",
      Responsive: "A long text wraps next to the switch in a narrow container.",
      ShadcnParity:
        "Drift guard: the switch next to shadcn's Switch in both sizes and states; their computed sizes, colours and thumb positions must match.",
    },
    keyboard: {
      Space: "Toggles the switch (unless it is locked or a change is pending).",
      Enter: "Toggles the switch too, as buttons do.",
      Tab: "Moves to the next control.",
    },
    aria: [
      'The switch is a `button role="switch"` with `aria-checked`; state labels and thumb icons are `aria-hidden`, because the state is already announced.',
      "Naming follows Checkbox Field: with `label` and `switchLabel`, the group is named by `label` and the switch by `switchLabel`; with one of them, that one names the switch. With neither, pass `aria-label`; a development warning reminds you.",
      "While `onBeforeChange` is pending the switch keeps focus, has `aria-busy` and `aria-disabled`, and ignores toggles; with `loading` it is disabled.",
      "The thumb's direction follows the document: in RTL, on is on the left.",
    ],
    theming: [
      "The track and thumb copy shadcn's Switch look: `--primary` when on, `--input` when off, `--background` for the thumb.",
      "Parts carry `data-slot`: `switch`, `switch-thumb`, `switch-spinner`, `switch-state-label`, `switch-row`, `switch-label`.",
      "Use `classNames.switch`, `thumb`, `switchLabel`, `stateLabel` and `row` to restyle single parts.",
    ],
  },
  es: {
    summary:
      "Un switch de encendido/apagado con la estructura común de los fields, para ajustes que se aplican al momento. `label` va arriba, como en todo field; `switchLabel` va junto al switch. El valor es un `boolean`, o los valores que elijas. `onBeforeChange` puede confirmar cada cambio, por ejemplo después de guardarlo en un servidor, con un spinner en el thumb mientras tanto. Cada opción es opcional y no trae textos propios.",
    whenToUse: [
      "Para un ajuste que tiene efecto en cuanto cambia: notificaciones, modo oscuro, perfil público.",
      "Con `onBeforeChange` cuando el cambio debe guardarse antes de mostrarse como hecho.",
    ],
    whenNotToUse: [
      "Cuando la elección se confirma después con un botón Guardar o Enviar (términos, consentimiento en un paso de formulario): un Checkbox Field se entiende mejor.",
      "Dentro de un `FormProvider` de react-hook-form: usa Switch Control.",
      "Para más de dos estados: usa un Radio Group Field (segmentado).",
    ],
    anatomy: {
      SwitchField:
        "Cabecera del field (`label`, asterisco, info), una fila con el switch (su thumb puede llevar un icono o un spinner), un texto de estado opcional, `switchLabel` y una acción opcional, y debajo la ayuda o el error.",
    },
    props: {
      SwitchField: {
        switchLabel:
          "Texto junto al switch. Al pulsarlo cambia el switch; los enlaces que contenga navegan sin cambiarlo. Sin valor por defecto.",
        label:
          "Label del field sobre la fila. Si también hay `switchLabel`, nombra el grupo y `switchLabel` nombra el switch; solo, nombra el switch.",
        value: "Valor controlado: `boolean`, o uno de tus valores personalizados.",
        defaultValue: "Valor inicial sin controlar.",
        onValueChange:
          "Se llama con el nuevo valor cuando el cambio se aplica (después de que `onBeforeChange` lo confirme).",
        checkedValue:
          "Valor que se guarda al activarlo. Se pasa junto con `uncheckedValue` (TypeScript exige los dos); el tipo se infiere.",
        uncheckedValue: "Valor que se guarda al desactivarlo. Se pasa junto con `checkedValue`.",
        onBeforeChange:
          "Se llama con el valor al que cambiaría el switch. Devuelve `true` para aplicarlo, `false` para mantener el estado, o una promesa: mientras está pendiente el switch no se mueve, muestra un spinner en el thumb, pone `aria-busy` e ignora los cambios; si la promesa falla, mantiene el estado. El mensaje de error lo muestras tú (por ejemplo con `error`/`errorMessage`).",
        switchPosition:
          "`end` pone el switch después de su texto (se refleja en RTL), como en las listas de ajustes.",
        appearance:
          "`card` envuelve la fila en una tarjeta con borde, clicable entera y resaltada cuando está activado.",
        size: "`sm` usa el track pequeño; el área táctil sigue siendo de al menos 24 px.",
        stateLabels:
          "Texto decorativo del estado actual, después del switch (por ejemplo Sí / No). Los dos textos son obligatorios; oculto para tecnologías de asistencia.",
        thumbIcons:
          "Icono decorativo del estado actual, dentro del thumb. Los dos iconos son obligatorios; oculto para tecnologías de asistencia.",
        name: "Nombre del checkbox nativo, para formularios nativos. Con valores personalizados envía `checkedValue`.",
        required: "Muestra el asterisco y pone `aria-required`. No añade validación.",
        loading: "Muestra un spinner dentro del thumb, bloquea el switch y pone `aria-busy`.",
        disabled: "Bloquea el switch y lo atenúa.",
        info: "Contenido del tooltip de información junto al label; forma parte de la descripción del switch.",
        helperText: "Texto bajo la fila; forma parte de la descripción del switch.",
        error: "Estado de error: contorno destructivo y `aria-invalid`.",
        errorMessage: "Mensaje que sustituye a la ayuda mientras `error` es true.",
        action: "Un botón al final de la fila.",
        "aria-label": "Nombre accesible cuando no hay texto visible.",
        className: "Clases extra para la raíz.",
        classNames:
          "Clases extra por parte: `switch`, `thumb`, `switchLabel`, `stateLabel`, `row` y las partes de la familia.",
        ref: 'Llega al switch (`button role="switch"`).',
      },
    },
    stories: {
      Basic: "Lo mínimo: un `switchLabel` y un valor booleano.",
      LabelAndText: "Un label arriba y un texto junto al switch.",
      SettingsList: "Filas de ajustes con switches pequeños al final.",
      Cards: "Ajustes como tarjetas clicables, resaltadas cuando están activados.",
      StateLabels: "Sí / No junto al switch, siguiendo su estado.",
      ThumbIcons: "Un check y una cruz dentro del thumb.",
      CustomValues: 'El valor es `"public"` o `"private"`; debajo se ve el valor guardado.',
      AsyncChange:
        "El primer switch se guarda bien tras una espera; el segundo falla y vuelve atrás.",
      Keyboard: "Espacio y Enter cambian el switch enfocado.",
      States: "Obligatorio con info, ayuda, error con mensaje, cargando y deshabilitado.",
      Rtl: "En un contenedor de derecha a izquierda, el thumb de un switch activado queda a la izquierda.",
      Responsive: "Un texto largo salta de línea junto al switch en un contenedor estrecho.",
      ShadcnParity:
        "Control de desviaciones: el switch junto al Switch de shadcn en los dos tamaños y estados; sus tamaños, colores y posición del thumb calculados deben coincidir.",
    },
    keyboard: {
      Space: "Cambia el switch (salvo que esté bloqueado o con un cambio pendiente).",
      Enter: "También cambia el switch, como en los botones.",
      Tab: "Pasa al siguiente control.",
    },
    aria: [
      'El switch es un `button role="switch"` con `aria-checked`; los textos de estado y los iconos del thumb son `aria-hidden`, porque el estado ya se anuncia.',
      "El nombre sigue a Checkbox Field: con `label` y `switchLabel`, el grupo se nombra con `label` y el switch con `switchLabel`; con uno solo, ese nombra el switch. Sin ninguno, pasa `aria-label`; un aviso en desarrollo te lo recuerda.",
      "Mientras `onBeforeChange` está pendiente el switch conserva el foco, tiene `aria-busy` y `aria-disabled` e ignora los cambios; con `loading` queda deshabilitado.",
      "La dirección del thumb sigue la del documento: en RTL, activado queda a la izquierda.",
    ],
    theming: [
      "El track y el thumb copian el aspecto del Switch de shadcn: `--primary` activado, `--input` desactivado, `--background` para el thumb.",
      "Las partes llevan `data-slot`: `switch`, `switch-thumb`, `switch-spinner`, `switch-state-label`, `switch-row`, `switch-label`.",
      "Usa `classNames.switch`, `thumb`, `switchLabel`, `stateLabel` y `row` para reestilizar partes concretas.",
    ],
  },
});
