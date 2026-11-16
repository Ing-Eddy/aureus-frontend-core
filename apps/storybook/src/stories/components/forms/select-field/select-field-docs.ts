import { defineComponentDocs } from "@sb/docs/define-component-docs";

export const docs = defineComponentDocs({
  name: "Select Field",
  importPath: "@aureus-core/ui/components/select-field",
  exports: ["SelectField", "SelectFieldProps", "SelectOption"],
  primitive: {
    label: "Base UI: Select & Combobox",
    href: "https://base-ui.com/react/components/select",
  },
  providers: [{ name: "TooltipProvider", importPath: "@aureus-core/ui/shadcn/tooltip" }],
  api: {
    SelectField: {
      options: { type: "SelectOption[]", required: true },
      value: { type: "string | null | string[]" },
      defaultValue: { type: "string | null | string[]", default: "null / []" },
      onValueChange: { type: "(value: string | null | string[]) => void" },
      multiple: { type: "boolean", default: "false" },
      multipleDisplay: { type: '"chips" | "summary"', required: true },
      removeChipLabel: { type: "(option: SelectOption) => string" },
      renderSummary: { type: "(selected: SelectOption[]) => ReactNode" },
      placeholder: { type: "ReactNode", default: "none" },
      emptyMessage: { type: "ReactNode", default: "none" },
      searchable: { type: "boolean", default: "false" },
      searchLabel: { type: "string" },
      searchPlaceholder: { type: "string" },
      filter: { type: "boolean", default: "true" },
      onSearchChange: { type: "(query: string) => void" },
      noResultsMessage: { type: "ReactNode", default: "none" },
      optionsLoading: { type: "boolean", default: "false" },
      optionsLoadingMessage: { type: "ReactNode", default: "none" },
      clearable: { type: "boolean", default: "false" },
      clearLabel: { type: "string" },
      maxSelected: { type: "number" },
      maxSelectedMessage: { type: "ReactNode", default: "none" },
      selectAll: { type: "{ label: ReactNode }" },
      creatable: { type: "boolean", default: "false" },
      createLabel: { type: "(query: string) => ReactNode" },
      onCreate: { type: "(query: string) => void" },
      closeOnSelect: { type: "boolean", default: "single: true, multiple: false" },
      onOpenChange: { type: "(open: boolean) => void" },
      name: { type: "string" },
      label: { type: "ReactNode" },
      required: { type: "boolean", default: "false" },
      loading: { type: "boolean", default: "false" },
      disabled: { type: "boolean", default: "false" },
      info: { type: "ReactNode" },
      helperText: { type: "ReactNode" },
      error: { type: "boolean", default: "false" },
      errorMessage: { type: "ReactNode" },
      action: { type: "FieldActionProps" },
      className: { type: "string" },
      classNames: { type: "SelectFieldClassNames" },
      loadingLabel: { type: "string" },
      infoLabel: { type: "string" },
      id: { type: "string" },
      onBlur: { type: "(event: FocusEvent) => void" },
      "aria-label": { type: "string" },
      "aria-labelledby": { type: "string" },
      ref: { type: "Ref<HTMLButtonElement>" },
    },
    SelectOption: {
      value: { type: "string", required: true },
      label: { type: "string", required: true },
      description: { type: "ReactNode" },
      icon: { type: "ReactNode" },
      disabled: { type: "boolean" },
      group: { type: "string" },
    },
  },
  stories: [
    "Single",
    "Multiple",
    "MultipleSummary",
    "Searchable",
    "GroupsAndDescriptions",
    "Messages",
    "ServerSearch",
    "LimitAndSelectAll",
    "Creatable",
    "Keyboard",
    "States",
    "Rtl",
    "Responsive",
  ],
  keyboard: [
    "Enter / Space / Arrow Down",
    "Arrow Up / Arrow Down",
    "Home / End",
    "Letters",
    "Escape",
    "Backspace",
    "Tab",
  ],
  links: [
    { label: "Guide: Fields & controls", href: "?path=/docs/guides-fields-controls--docs" },
    { label: "Select Control", href: "?path=/docs/components-forms-select-control--docs" },
    {
      label: "WAI-ARIA: Combobox pattern",
      href: "https://www.w3.org/WAI/ARIA/apg/patterns/combobox/",
    },
  ],
  en: {
    summary:
      "Pick one option or several from a list, with the shared field layout. It ships no default texts: every message is yours, shown only when you pass it, and a feature that needs a text (search, clear, chips, summary, select all, create) requires it as soon as you turn the feature on.",
    whenToUse: [
      "To choose from a known set of values: a country, a currency, a category, several tags.",
      "With `searchable` when the list is long enough that scrolling is slow.",
      "With `filter={false}` and `onSearchChange` when the options come from a server.",
    ],
    whenNotToUse: [
      "Inside a react-hook-form `FormProvider`: use Select Control.",
      "For two to five always-visible choices: radio buttons or checkboxes are faster.",
      "For free text with suggestions: a text field with autocomplete fits better than `creatable`.",
    ],
    anatomy: {
      SelectField:
        "The shared header, a frame holding the chips (multiple, chips display), the button with the value, summary or placeholder, then the spinner, action, clear button and chevron; and a popup with the search box (searchable), the limit message, a status region for your messages and the list, with optional group titles.",
      SelectOption:
        "One choice: its id (`value`), the text shown and searched (`label`), and optional description, icon, disabled state and group title.",
    },
    props: {
      SelectField: {
        options: "The choices.",
        value:
          "Controlled value: an option id or `null` in single mode, an array of ids in multiple mode.",
        defaultValue: "Initial value when uncontrolled.",
        onValueChange: "Called with the new value. Ids not present in `options` are kept.",
        multiple: "Allows several values.",
        multipleDisplay:
          "Required with `multiple`: `chips` (removable chips; the field grows) or `summary` (one line from `renderSummary`).",
        removeChipLabel: "Required with chips: the accessible name of each chip's remove button.",
        renderSummary: "Required with summary: the content of the field for the selected options.",
        placeholder: "Text of the empty field. No default: nothing is shown without it.",
        emptyMessage: "Text of an open list with no options. No default.",
        searchable: "Adds a search box inside the list.",
        searchLabel: "Required with `searchable`: the accessible name of the search box.",
        searchPlaceholder: "Hint inside the search box.",
        filter:
          "Filters options locally by label, ignoring case and accents. `false` for server search.",
        onSearchChange: "Called with the search text on every change.",
        noResultsMessage: "Text when the search matches nothing. No default.",
        optionsLoading: "Options are loading (server search).",
        optionsLoadingMessage: "Text while `optionsLoading`. No default.",
        clearable: "Adds a button that empties the field.",
        clearLabel: "Required with `clearable`: the clear button's accessible name.",
        maxSelected: "Most values that can be selected; other options are disabled at the limit.",
        maxSelectedMessage: "Text above the list at the limit. No default.",
        selectAll:
          "Adds a first option that selects every enabled option (up to the limit), or none.",
        creatable: "With `searchable`: offers to create the typed text when it matches no option.",
        createLabel: "Required with `creatable`: the content of the create option.",
        onCreate:
          "Required with `creatable`: called with the typed text; add the option and select it if you want.",
        closeOnSelect: "Closes the list after a pick.",
        onOpenChange: "Called when the list opens or closes.",
        name: "Name of the hidden input, for native form submission.",
        label: "Text above the field; the button's accessible name.",
        required: "Red asterisk and `aria-required`. No validation.",
        loading: "Shows a spinner; the list cannot be opened.",
        disabled: "The field cannot be used.",
        info: "Info tooltip content, also part of the accessible description.",
        helperText: "Text below the field.",
        error: "Destructive frame and `aria-invalid`.",
        errorMessage: "Replaces `helperText` while `error` is true.",
        action: "A button inside the frame, before the clear button.",
        className: "Extra classes for the root.",
        classNames: "Extra classes per part, including `trigger`, `popup`, `option` and `chip`.",
        loadingLabel:
          "Accessible name of the loading spinner, in your language. Required with `loading`; there is no default.",
        infoLabel:
          "Accessible name of the info button, in your language. Required with `info`; there is no default.",
        id: "Id of the field's control. Generated when missing; the ids of the label, helper text and info derive from it.",
        onBlur: "Called when focus leaves the field.",
        "aria-label":
          "Accessible name of the field's button and list, for a select without a visible `label`.",
        "aria-labelledby":
          "Id of an element that names the field's button and list, instead of `label`.",
        ref: "Reaches the field's button.",
      },
      SelectOption: {
        value: "Unique id, stored as the value.",
        label: "Text shown and used for search and typeahead.",
        description: "Secondary line under the label.",
        icon: "Icon before the label.",
        disabled: "Shown but not selectable.",
        group: "Group title; groups keep their order of first appearance.",
      },
    },
    stories: {
      Rtl: "In a right-to-left container the chevron sits at the left of the selected value.",
      Single: "Pick one country. No placeholder, no messages: only what you pass is shown.",
      Multiple:
        "Several colors as removable chips; each remove button is named by `removeChipLabel`.",
      MultipleSummary: "Several currencies summarized on one line by `renderSummary`.",
      Searchable: 'A search box inside the list; typing "espana" finds "España".',
      GroupsAndDescriptions: "Options grouped by region, with descriptions and a disabled option.",
      Messages:
        "Each situation (empty list, no results) with its message, and the same situation without a message: nothing is shown.",
      ServerSearch:
        "Options loaded after a delay while typing, with `filter={false}` and a loading message.",
      LimitAndSelectAll: "At most three colors, a message at the limit, and a select-all option.",
      Creatable: "Typing a tag that does not exist offers to create it.",
      Keyboard:
        "Open, move, typeahead, select and close with Escape, focus returning to the field.",
      States: "Required with info, helper, error with message, loading and disabled.",
      Responsive: "In a narrow container the chips wrap and the list matches the field's width.",
    },
    keyboard: {
      "Enter / Space / Arrow Down": "Opens the list.",
      "Arrow Up / Arrow Down": "Moves through the options (from the search box too).",
      "Home / End": "Goes to the first or last option.",
      Letters: "Without search, jumps to the option that starts with them.",
      Escape: "Closes the list and returns focus to the field.",
      Backspace: "With chips and the list closed, removes the last chip.",
      Tab: "Closes the list and moves on.",
    },
    aria: [
      'Without search the field is a listbox select (Base UI Select); with search it is a combobox whose input lives in the popup (Base UI Combobox). Both expose `role="combobox"` and `aria-expanded` on the field\'s button.',
      "The label names the button; helper text and info are in its `aria-describedby`; `aria-invalid` and `aria-required` follow the field's state.",
      "Chips and the clear button sit beside the button, never inside it, and are named by your texts. With chips, the button also lists the selected labels for screen readers.",
      "Your empty, no-results and loading messages are rendered in a `status` region, so they are announced. Without your text, nothing is announced.",
      "The select-all option exposes `aria-checked`, `mixed` when only some options are selected.",
    ],
    theming: [
      "The frame shares the field tokens (`--input`, `--ring`, `--destructive`); the list uses `--popover`, and highlighted options `--accent`.",
      "Parts carry `data-slot`: `select-chips`, `select-chip`, `select-clear`, `select-chevron`, `select-popup`, `select-status`, `select-limit`, `select-placeholder`.",
      "Use `classNames.trigger`, `popup`, `option` and `chip` to restyle single parts.",
    ],
  },
  es: {
    summary:
      "Elige una opción o varias de una lista, con la estructura común de los fields. No trae textos por defecto: cada mensaje es tuyo y solo se muestra si lo pasas, y una función que necesita un texto (buscar, limpiar, chips, resumen, seleccionar todo, crear) lo exige en cuanto la activas.",
    whenToUse: [
      "Para elegir entre valores conocidos: un país, una moneda, una categoría, varias etiquetas.",
      "Con `searchable` cuando la lista es tan larga que desplazarse resulta lento.",
      "Con `filter={false}` y `onSearchChange` cuando las opciones vienen de un servidor.",
    ],
    whenNotToUse: [
      "Dentro de un `FormProvider` de react-hook-form: usa Select Control.",
      "Para dos a cinco opciones siempre visibles: los radios o casillas son más rápidos.",
      "Para texto libre con sugerencias: un campo de texto con autocompletado encaja mejor que `creatable`.",
    ],
    anatomy: {
      SelectField:
        "La cabecera común, un marco con los chips (múltiple con chips), el botón con el valor, el resumen o el placeholder, y después el spinner, la acción, el botón de limpiar y el chevron; y un desplegable con el buscador (searchable), el mensaje de límite, una región de estado para tus mensajes y la lista, con títulos de grupo opcionales.",
      SelectOption:
        "Una opción: su id (`value`), el texto que se muestra y se busca (`label`), y una descripción, un icono, el estado deshabilitado y el título de grupo opcionales.",
    },
    props: {
      SelectField: {
        options: "Las opciones.",
        value: "Valor controlado: un id o `null` en simple, un array de ids en múltiple.",
        defaultValue: "Valor inicial en modo no controlado.",
        onValueChange:
          "Se llama con el nuevo valor. Los ids que no están en `options` se conservan.",
        multiple: "Permite varios valores.",
        multipleDisplay:
          "Obligatorio con `multiple`: `chips` (etiquetas removibles; el campo crece) o `summary` (una línea con `renderSummary`).",
        removeChipLabel:
          "Obligatorio con chips: el nombre accesible del botón para quitar cada chip.",
        renderSummary:
          "Obligatorio con summary: el contenido del campo para las opciones elegidas.",
        placeholder: "Texto del campo vacío. Sin valor por defecto: sin él no se muestra nada.",
        emptyMessage: "Texto de la lista abierta sin opciones. Sin valor por defecto.",
        searchable: "Añade un buscador dentro de la lista.",
        searchLabel: "Obligatorio con `searchable`: el nombre accesible del buscador.",
        searchPlaceholder: "Pista dentro del buscador.",
        filter:
          "Filtra en local por label, sin distinguir mayúsculas ni acentos. `false` para buscar en servidor.",
        onSearchChange: "Se llama con el texto de búsqueda en cada cambio.",
        noResultsMessage: "Texto cuando la búsqueda no encuentra nada. Sin valor por defecto.",
        optionsLoading: "Las opciones se están cargando (búsqueda en servidor).",
        optionsLoadingMessage: "Texto mientras `optionsLoading`. Sin valor por defecto.",
        clearable: "Añade un botón que vacía el campo.",
        clearLabel: "Obligatorio con `clearable`: el nombre accesible del botón de limpiar.",
        maxSelected:
          "Máximo de valores elegibles; al llegar al límite, el resto de opciones se deshabilita.",
        maxSelectedMessage: "Texto sobre la lista al llegar al límite. Sin valor por defecto.",
        selectAll:
          "Añade una primera opción que elige todas las opciones habilitadas (hasta el límite), o ninguna.",
        creatable:
          "Con `searchable`: ofrece crear el texto escrito cuando no coincide con ninguna opción.",
        createLabel: "Obligatorio con `creatable`: el contenido de la opción de crear.",
        onCreate:
          "Obligatorio con `creatable`: se llama con el texto escrito; añade la opción y selecciónala si quieres.",
        closeOnSelect: "Cierra la lista tras elegir.",
        onOpenChange: "Se llama cuando la lista se abre o se cierra.",
        name: "Nombre del input oculto, para formularios nativos.",
        label: "Texto sobre el campo; el nombre accesible del botón.",
        required: "Asterisco rojo y `aria-required`. No valida.",
        loading: "Muestra un spinner; la lista no se puede abrir.",
        disabled: "El campo no se puede usar.",
        info: "Contenido del tooltip de información, también parte de la descripción accesible.",
        helperText: "Texto bajo el campo.",
        error: "Marco en color destructivo y `aria-invalid`.",
        errorMessage: "Sustituye a `helperText` mientras `error` es true.",
        action: "Un botón dentro del marco, antes del botón de limpiar.",
        className: "Clases extra para la raíz.",
        classNames: "Clases extra por parte, incluidas `trigger`, `popup`, `option` y `chip`.",
        loadingLabel:
          "Nombre accesible del spinner de carga, en tu idioma. Obligatorio con `loading`; no hay valor por defecto.",
        infoLabel:
          "Nombre accesible del botón de información, en tu idioma. Obligatorio con `info`; no hay valor por defecto.",
        id: "Id del control del field. Se genera si falta; los ids del label, el texto de ayuda y la info se derivan de él.",
        onBlur: "Se llama cuando el foco sale del field.",
        "aria-label":
          "Nombre accesible del botón y de la lista, para un select sin `label` visible.",
        "aria-labelledby":
          "Id de un elemento que da nombre al botón y a la lista, en lugar de `label`.",
        ref: "Apunta al botón del campo.",
      },
      SelectOption: {
        value: "Id único, que se guarda como valor.",
        label: "Texto que se muestra y que se usa para buscar y para el salto por letra.",
        description: "Línea secundaria bajo el label.",
        icon: "Icono antes del label.",
        disabled: "Se muestra pero no se puede elegir.",
        group: "Título de grupo; los grupos mantienen su orden de aparición.",
      },
    },
    stories: {
      Rtl: "En un contenedor de derecha a izquierda, el chevron queda a la izquierda del valor seleccionado.",
      Single: "Elige un país. Sin placeholder ni mensajes: solo se muestra lo que pasas.",
      Multiple:
        "Varios colores como chips removibles; cada botón de quitar lo nombra `removeChipLabel`.",
      MultipleSummary: "Varias monedas resumidas en una línea por `renderSummary`.",
      Searchable: 'Un buscador dentro de la lista; escribir "espana" encuentra "España".',
      GroupsAndDescriptions:
        "Opciones agrupadas por región, con descripciones y una opción deshabilitada.",
      Messages:
        "Cada situación (lista vacía, sin resultados) con su mensaje, y la misma situación sin mensaje: no se muestra nada.",
      ServerSearch:
        "Opciones que se cargan con retardo mientras escribes, con `filter={false}` y un mensaje de carga.",
      LimitAndSelectAll:
        "Como máximo tres colores, un mensaje al llegar al límite y una opción de seleccionar todo.",
      Creatable: "Escribir una etiqueta que no existe ofrece crearla.",
      Keyboard:
        "Abrir, moverse, saltar por letra, elegir y cerrar con Escape, volviendo el foco al campo.",
      States: "Obligatorio con información, ayuda, error con mensaje, cargando y deshabilitado.",
      Responsive:
        "En un contenedor estrecho los chips pasan de línea y la lista mide lo mismo que el campo.",
    },
    keyboard: {
      "Enter / Space / Arrow Down": "Abre la lista.",
      "Arrow Up / Arrow Down": "Recorre las opciones (también desde el buscador).",
      "Home / End": "Va a la primera o a la última opción.",
      Letters: "Sin búsqueda, salta a la opción que empieza por ellas.",
      Escape: "Cierra la lista y devuelve el foco al campo.",
      Backspace: "Con chips y la lista cerrada, quita el último chip.",
      Tab: "Cierra la lista y pasa al siguiente control.",
    },
    aria: [
      'Sin búsqueda el campo es un select de tipo listbox (Base UI Select); con búsqueda es un combobox cuyo input vive en el desplegable (Base UI Combobox). Los dos exponen `role="combobox"` y `aria-expanded` en el botón del campo.',
      "El label nombra el botón; la ayuda y la información están en su `aria-describedby`; `aria-invalid` y `aria-required` siguen el estado del campo.",
      "Los chips y el botón de limpiar están al lado del botón, nunca dentro, y los nombran tus textos. Con chips, el botón también lista las opciones elegidas para lectores de pantalla.",
      "Tus mensajes de vacío, sin resultados y carga se muestran en una región `status`, así se anuncian. Sin tu texto no se anuncia nada.",
      "La opción de seleccionar todo expone `aria-checked`, `mixed` cuando solo hay algunas elegidas.",
    ],
    theming: [
      "El marco comparte los tokens de los fields (`--input`, `--ring`, `--destructive`); la lista usa `--popover` y las opciones resaltadas `--accent`.",
      "Las partes llevan `data-slot`: `select-chips`, `select-chip`, `select-clear`, `select-chevron`, `select-popup`, `select-status`, `select-limit`, `select-placeholder`.",
      "Usa `classNames.trigger`, `popup`, `option` y `chip` para cambiar el estilo de partes concretas.",
    ],
  },
});
