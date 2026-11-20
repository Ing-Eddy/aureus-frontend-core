import { defineComponentDocs } from "@sb/docs/define-component-docs";

export const docs = defineComponentDocs({
  name: "Date Selection Field",
  importPath: "@aureus-core/ui/components/date-selection-field",
  exports: [
    "DateSelectionField",
    "DateSelectionFieldProps",
    "DateRangeValue",
    "DateSelectionPreset",
    "DateSelectionFieldClassNames",
  ],
  primitive: {
    label: "shadcn/ui: Calendar (react-day-picker) and Popover",
    href: "https://ui.shadcn.com/docs/components/calendar",
  },
  providers: [{ name: "TooltipProvider", importPath: "@aureus-core/ui/shadcn/tooltip" }],
  api: {
    DateSelectionField: {
      selection: { type: '"range" | "multiple"', required: true },
      value: { type: "DateRangeValue | null | string[]" },
      defaultValue: { type: "DateRangeValue | null | string[]", default: "null | []" },
      onValueChange: { type: "(value: DateRangeValue | null | string[]) => void" },
      locale: { type: "string" },
      weekStartsOn: { type: "0 | 1 | 2 | 3 | 4 | 5 | 6" },
      min: { type: "string" },
      max: { type: "string" },
      disabledDates: { type: "string[]" },
      isDateDisabled: { type: "(date: string) => boolean" },
      minDays: { type: "number" },
      maxDays: { type: "number" },
      excludeDisabled: { type: "boolean", default: "false" },
      maxSelected: { type: "number" },
      formatSummary: { type: "(dates: readonly string[]) => string" },
      placeholder: { type: "ReactNode" },
      presets: { type: "DateSelectionPreset[]" },
      presetsLabel: { type: "string" },
      openCalendarLabel: { type: "string" },
      startLabel: { type: "string" },
      endLabel: { type: "string" },
      previousMonthLabel: { type: "string", required: true },
      nextMonthLabel: { type: "string", required: true },
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
      onBlur: { type: "(event: FocusEvent) => void" },
      "aria-label": { type: "string" },
      "aria-labelledby": { type: "string" },
      className: { type: "string" },
      classNames: { type: "DateSelectionFieldClassNames" },
      loadingLabel: { type: "string" },
      infoLabel: { type: "string" },
      id: { type: "string" },
      ref: { type: "Ref<HTMLElement>" },
    },
    DateRangeValue: {
      from: { type: "string", required: true },
      to: { type: "string | null", required: true },
    },
  },
  stories: ["Range", "Multiple", "Limits", "Presets", "Keyboard", "States", "Rtl", "Responsive"],
  keyboard: [
    "Tab / Shift + Tab",
    "Segments",
    "Calendar: arrows",
    "Calendar: Page Up / Page Down",
    "Calendar: Home / End",
    "Enter / Space",
    "Escape",
  ],
  links: [
    { label: "Guide: Fields & controls", href: "?path=/docs/guides-fields-controls--docs" },
    {
      label: "Date Selection Control",
      href: "?path=/docs/components-forms-date-selection-control--docs",
    },
    { label: "Date Time Field", href: "?path=/docs/components-forms-date-time-field--docs" },
    {
      label: "WAI-ARIA: Grid pattern",
      href: "https://www.w3.org/WAI/ARIA/apg/patterns/grid/",
    },
  ],
  en: {
    summary:
      'Several days in a calendar. With `selection="range"` the value is `{ from, to }` (`to` is `null` while the end is chosen), typed in two groups of segments or chosen in the calendar. With `selection="multiple"` it is a sorted list of ISO dates, chosen in the calendar from a summary button. Limits, blocked days, range lengths, a maximum number of days and presets are opt-in and independent. It ships no texts of its own: the calendar requires its month button names, and a range the names of its ends and of its calendar button.',
    whenToUse: [
      "For a span of days: a stay, a report period, a holiday (1 to 27 August).",
      "For any set of separate days: shifts, days off, delivery days.",
    ],
    whenNotToUse: [
      "Inside a react-hook-form `FormProvider`: use Date Selection Control.",
      "For one date or one time: use Date Time Field.",
      "For a range with times: not supported; use two Date Time Fields in `datetime` mode.",
    ],
    anatomy: {
      DateSelectionField:
        "Field header (`label`, required mark, info), a frame with either the start and end segments and the calendar button (range) or the summary button (several days), the spinner and the optional action, the popover with the calendar and the presets, and the helper or error text below.",
      DateRangeValue: "A range: its start, and its end or `null` while the end is chosen.",
    },
    props: {
      DateSelectionField: {
        selection:
          '`"range"` (a start and an end) or `"multiple"` (separate days). Required; the value type follows it.',
        value:
          "Controlled value: a range (always sorted) or `null`, or a sorted list of ISO dates with no duplicates.",
        defaultValue: "Initial value when uncontrolled.",
        onValueChange:
          "Called when the range or the list changes. A range is `{ from, to: null }` after its first day, and complete after its second.",
        locale:
          "Locale of the segments, the calendar, the summary and every announced text. Defaults to the browser's.",
        weekStartsOn: "First day of the week in the calendar. Defaults to the locale's.",
        min: "Earliest choosable day (`YYYY-MM-DD`).",
        max: "Latest choosable day (`YYYY-MM-DD`).",
        disabledDates: "ISO dates the calendar disables.",
        isDateDisabled: "Called with each ISO date; `true` disables it in the calendar.",
        minDays:
          "Fewest days in a range, counting both ends. Ends that would be too close are disabled while the end is chosen.",
        maxDays: "Most days in a range, counting both ends (1 to 27 August is 27).",
        excludeDisabled:
          "A range cannot contain a disabled day: choosing an end beyond one starts a new range there.",
        maxSelected:
          "Most separate days. Once reached, the other days are disabled until one is removed.",
        formatSummary: "Your own text for the summary of several days.",
        placeholder: "Shown in the summary button while no day is chosen. No default.",
        presets:
          "Shortcuts beside the calendar, with a range or a list as value (or a function that returns one). Requires `presetsLabel`.",
        presetsLabel: "Accessible name of the group of presets. Required with `presets`.",
        openCalendarLabel:
          "Accessible name of the calendar button of a range, in your language. Required with `range`.",
        startLabel: "Accessible name of the start segments. Required with `range`.",
        endLabel: "Accessible name of the end segments. Required with `range`.",
        previousMonthLabel: "Accessible name of the previous-month button. Required.",
        nextMonthLabel: "Accessible name of the next-month button. Required.",
        name: "Name of the hidden inputs for native forms: `name[from]` and `name[to]`, or `name[]` per day.",
        label: "Names the range group, the summary button and the calendar dialog.",
        required:
          "Shows the required mark and sets `aria-required` on the segments. It adds no validation.",
        loading:
          "Disables the segments and buttons, shows a spinner in the frame and sets `aria-busy`. The value is still submitted.",
        disabled: "Disables the segments, the buttons and the action; the value is not submitted.",
        info: "Content of the info tooltip next to the label; part of the description.",
        helperText: "Text below the field; part of the description.",
        error: "Error state: `aria-invalid` and destructive styles.",
        errorMessage: "Message shown in place of the helper text while `error` is true.",
        action: "A button at the inline end of the frame (for example, to clear).",
        onBlur:
          "Called when focus leaves the field and its calendar; opening the calendar does not count.",
        "aria-label": "Accessible name of the field when there is no visible `label`.",
        "aria-labelledby": "Ids of the elements that name the field when there is no `label`.",
        className: "Extra classes for the root.",
        classNames:
          "Extra classes per part: `segments`, `segment`, `calendarButton`, `summary`, `popover`, `calendar`, `presets` plus the family's parts (`control` is the frame).",
        loadingLabel:
          "Accessible name of the loading spinner, in your language. Required with `loading`; there is no default.",
        infoLabel:
          "Accessible name of the info button, in your language. Required with `info`; there is no default.",
        id: "Id of the first start segment, or of the summary button. Generated when missing.",
        ref: "Reaches the first start segment, or the summary button, so react-hook-form's error focus lands there.",
      },
      DateRangeValue: {
        from: "The start day (`YYYY-MM-DD`).",
        to: "The end day, or `null` while it is being chosen.",
      },
    },
    stories: {
      Range:
        "1 to 27 August with the pointer (the hovered end previews the band), then 3 to 5 with the keyboard.",
      Multiple:
        "Days off listed with `Intl.ListFormat`, and two training days capped by `maxSelected`.",
      Limits:
        "3 to 7 weekdays in August that cannot cross a weekend: too-short and too-long ends are disabled, and an end beyond a weekend starts over.",
      Presets:
        "A first week and the next 14 days for a range, and a first weekend for several days.",
      Keyboard:
        "Typing both ends; an end before the start is shown sorted once focus leaves the field.",
      States: "Required with info and helper, error with message, loading and disabled.",
      Rtl: "In a right-to-left page each end keeps its left-to-right segments, the start sits on the right, and the calendar mirrors.",
      Responsive:
        "A 288 px container: the two ends wrap onto two lines, the summary truncates inside its frame and the popover fits the viewport.",
    },
    keyboard: {
      "Tab / Shift + Tab":
        "Moves through the start and end segments (or the summary button), then the calendar button and the action.",
      Segments:
        "As in Date Time Field: digits with auto-advance, Arrow Up / Arrow Down, Arrow Left / Arrow Right, Home / End, Backspace / Delete.",
      "Calendar: arrows": "Move between days (Shift + Left / Right by months).",
      "Calendar: Page Up / Page Down": "Previous or next month (Shift: year).",
      "Calendar: Home / End": "First or last day of the week.",
      "Enter / Space":
        "On a button: opens the calendar. On a day: chooses it (a range closes once complete; several days stay open).",
      Escape: "Closes the calendar; focus returns to the button.",
    },
    aria: [
      "A range is a `group` named by `label`, holding two segment groups named by `startLabel` and `endLabel`; each segment is a `spinbutton` named by `Intl.DisplayNames`.",
      'Several days are chosen from a `button` named by the label and the summary, with `aria-haspopup="dialog"` and `aria-expanded`.',
      'The popover is a `dialog` named by `label`. The day grid has `aria-multiselectable`; chosen days carry `aria-selected`, today `aria-current="date"`, and every day button is named by its full date from `Intl` only.',
      "The segments and the summary are described by the helper text and info; the segments carry `aria-required` and `aria-invalid`.",
      "Every target is at least 24 × 24 px (44 × 44 px on touch screens), and transitions respect reduced motion.",
    ],
    theming: [
      "The frame is shadcn's Input Group; the calendar is shadcn's Calendar: `--primary` for the ends and chosen days, `--muted` for the band between them and the hover preview.",
      "Parts carry `data-slot`: `date-selection-frame`, `date-range-inputs`, `date-segments`, `date-segment`, `date-selection-summary`, `field-calendar-button`, `field-popover`, `field-presets`, `calendar`.",
    ],
  },
  es: {
    summary:
      'Varios días en un calendario. Con `selection="range"` el valor es `{ from, to }` (`to` es `null` mientras se elige el final), escrito en dos grupos de segmentos o elegido en el calendario. Con `selection="multiple"` es una lista ordenada de fechas ISO, elegidas en el calendario desde un botón de resumen. Los límites, los días bloqueados, la duración del rango, un máximo de días y los atajos son opcionales e independientes. No trae textos propios: el calendario exige los nombres de sus botones de mes, y un rango los de sus extremos y su botón de calendario.',
    whenToUse: [
      "Para un intervalo de días: una estancia, un periodo de informe, unas vacaciones (del 1 al 27 de agosto).",
      "Para cualquier conjunto de días sueltos: turnos, días libres, días de entrega.",
    ],
    whenNotToUse: [
      "Dentro de un `FormProvider` de react-hook-form: usa Date Selection Control.",
      "Para una sola fecha o una hora: usa Date Time Field.",
      "Para un rango con horas: no está soportado; usa dos Date Time Field en modo `datetime`.",
    ],
    anatomy: {
      DateSelectionField:
        "Cabecera del field (`label`, asterisco, info), un marco con los segmentos de inicio y fin y el botón del calendario (rango) o el botón de resumen (varios días), el spinner y la acción opcional, el popover con el calendario y los atajos, y la ayuda o el error debajo.",
      DateRangeValue: "Un rango: su inicio, y su final o `null` mientras se elige.",
    },
    props: {
      DateSelectionField: {
        selection:
          '`"range"` (un inicio y un final) o `"multiple"` (días sueltos). Obligatorio; el tipo del valor depende de él.',
        value:
          "Valor controlado: un rango (siempre ordenado) o `null`, o una lista ordenada de fechas ISO sin repetidas.",
        defaultValue: "Valor inicial sin controlar.",
        onValueChange:
          "Se llama cuando cambia el rango o la lista. Un rango es `{ from, to: null }` tras su primer día, y está completo tras el segundo.",
        locale:
          "Idioma de los segmentos, el calendario, el resumen y todo lo que se anuncia. Por defecto, el del navegador.",
        weekStartsOn: "Primer día de la semana en el calendario. Por defecto, el del idioma.",
        min: "Primer día que se puede elegir (`YYYY-MM-DD`).",
        max: "Último día que se puede elegir (`YYYY-MM-DD`).",
        disabledDates: "Fechas ISO que el calendario deshabilita.",
        isDateDisabled: "Se llama con cada fecha ISO; `true` la deshabilita en el calendario.",
        minDays:
          "Mínimo de días de un rango, contando los dos extremos. Los finales demasiado cercanos se deshabilitan mientras se elige el final.",
        maxDays:
          "Máximo de días de un rango, contando los dos extremos (del 1 al 27 de agosto son 27).",
        excludeDisabled:
          "Un rango no puede contener un día deshabilitado: elegir un final más allá de uno empieza ahí un rango nuevo.",
        maxSelected:
          "Máximo de días sueltos. Al llegar, los demás días se deshabilitan hasta quitar uno.",
        formatSummary: "Tu propio texto para el resumen de varios días.",
        placeholder:
          "Se muestra en el botón de resumen mientras no hay días. Sin valor por defecto.",
        presets:
          "Atajos junto al calendario, con un rango o una lista como valor (o una función que lo devuelve). Exige `presetsLabel`.",
        presetsLabel: "Nombre accesible del grupo de atajos. Obligatorio con `presets`.",
        openCalendarLabel:
          "Nombre accesible del botón del calendario de un rango, en tu idioma. Obligatorio con `range`.",
        startLabel: "Nombre accesible de los segmentos de inicio. Obligatorio con `range`.",
        endLabel: "Nombre accesible de los segmentos de fin. Obligatorio con `range`.",
        previousMonthLabel: "Nombre accesible del botón de mes anterior. Obligatorio.",
        nextMonthLabel: "Nombre accesible del botón de mes siguiente. Obligatorio.",
        name: "Nombre de los inputs ocultos para formularios nativos: `name[from]` y `name[to]`, o `name[]` por día.",
        label: "Nombra el grupo del rango, el botón de resumen y el diálogo del calendario.",
        required:
          "Muestra el asterisco y pone `aria-required` en los segmentos. No añade validación.",
        loading:
          "Deshabilita los segmentos y los botones, muestra un spinner en el marco y pone `aria-busy`. El valor se sigue enviando.",
        disabled: "Deshabilita los segmentos, los botones y la acción; el valor no se envía.",
        info: "Contenido del tooltip de información junto al label; forma parte de la descripción.",
        helperText: "Texto bajo el field; forma parte de la descripción.",
        error: "Estado de error: `aria-invalid` y estilos destructivos.",
        errorMessage: "Mensaje que sustituye a la ayuda mientras `error` es true.",
        action: "Un botón al final del marco (por ejemplo, para vaciar).",
        onBlur:
          "Se llama cuando el foco sale del field y de su calendario; abrir el calendario no cuenta.",
        "aria-label": "Nombre accesible del field cuando no hay `label` visible.",
        "aria-labelledby": "Ids de los elementos que nombran el field cuando no hay `label`.",
        className: "Clases extra para la raíz.",
        classNames:
          "Clases extra por parte: `segments`, `segment`, `calendarButton`, `summary`, `popover`, `calendar`, `presets` y las partes de la familia (`control` es el marco).",
        loadingLabel:
          "Nombre accesible del spinner de carga, en tu idioma. Obligatorio con `loading`; no hay valor por defecto.",
        infoLabel:
          "Nombre accesible del botón de información, en tu idioma. Obligatorio con `info`; no hay valor por defecto.",
        id: "Id del primer segmento de inicio, o del botón de resumen. Se genera si falta.",
        ref: "Llega al primer segmento de inicio, o al botón de resumen, así el foco de error de react-hook-form va ahí.",
      },
      DateRangeValue: {
        from: "El día de inicio (`YYYY-MM-DD`).",
        to: "El día final, o `null` mientras se elige.",
      },
    },
    stories: {
      Range:
        "Del 1 al 27 de agosto con el puntero (el final bajo el puntero anticipa la banda), luego del 3 al 5 con el teclado.",
      Multiple:
        "Días libres listados con `Intl.ListFormat`, y dos días de formación limitados por `maxSelected`.",
      Limits:
        "De 3 a 7 días laborables de agosto sin cruzar un fin de semana: los finales demasiado cortos o largos se deshabilitan, y un final tras un fin de semana empieza de nuevo.",
      Presets:
        "Una primera semana y los próximos 14 días para un rango, y un primer fin de semana para varios días.",
      Keyboard:
        "Escribir los dos extremos; un final anterior al inicio se muestra ordenado al salir del field.",
      States: "Obligatorio con info y ayuda, error con mensaje, cargando y deshabilitado.",
      Rtl: "En una página de derecha a izquierda cada extremo conserva sus segmentos de izquierda a derecha, el inicio queda a la derecha y el calendario se refleja.",
      Responsive:
        "Un contenedor de 288 px: los dos extremos pasan a dos líneas, el resumen se recorta dentro de su marco y el popover cabe en la ventana.",
    },
    keyboard: {
      "Tab / Shift + Tab":
        "Recorre los segmentos de inicio y fin (o el botón de resumen), luego el botón del calendario y la acción.",
      Segments:
        "Como en Date Time Field: dígitos con avance automático, Flecha arriba / abajo, Flecha izquierda / derecha, Inicio / Fin, Retroceso / Suprimir.",
      "Calendar: arrows": "Se mueven entre días (Mayús + Izquierda / Derecha, por meses).",
      "Calendar: Page Up / Page Down": "Mes anterior o siguiente (con Mayús, año).",
      "Calendar: Home / End": "Primer o último día de la semana.",
      "Enter / Space":
        "En un botón: abre el calendario. En un día: lo elige (un rango se cierra al completarse; con varios días sigue abierto).",
      Escape: "Cierra el calendario; el foco vuelve al botón.",
    },
    aria: [
      "Un rango es un `group` nombrado por `label`, con dos grupos de segmentos nombrados por `startLabel` y `endLabel`; cada segmento es un `spinbutton` nombrado con `Intl.DisplayNames`.",
      'Los días sueltos se eligen desde un `button` nombrado por el label y el resumen, con `aria-haspopup="dialog"` y `aria-expanded`.',
      'El popover es un `dialog` nombrado por `label`. La rejilla de días tiene `aria-multiselectable`; los días elegidos llevan `aria-selected`, hoy `aria-current="date"`, y cada botón de día se nombra solo con su fecha completa de `Intl`.',
      "Los segmentos y el resumen se describen con la ayuda y la info; los segmentos llevan `aria-required` y `aria-invalid`.",
      "Toda zona pulsable mide al menos 24 × 24 px (44 × 44 px en pantallas táctiles), y las transiciones respetan el movimiento reducido.",
    ],
    theming: [
      "El marco es el Input Group de shadcn; el calendario es el Calendar de shadcn: `--primary` para los extremos y los días elegidos, `--muted` para la banda entre ellos y la vista previa bajo el puntero.",
      "Las partes llevan `data-slot`: `date-selection-frame`, `date-range-inputs`, `date-segments`, `date-segment`, `date-selection-summary`, `field-calendar-button`, `field-popover`, `field-presets`, `calendar`.",
    ],
  },
});
