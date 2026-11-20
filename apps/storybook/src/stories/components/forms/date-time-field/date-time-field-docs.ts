import { defineComponentDocs } from "@sb/docs/define-component-docs";

export const docs = defineComponentDocs({
  name: "Date Time Field",
  importPath: "@aureus-core/ui/components/date-time-field",
  exports: [
    "DateTimeField",
    "DateTimeFieldProps",
    "DateTimePreset",
    "DateTimeFieldClassNames",
    "toDate",
    "fromDate",
    "todayIso",
    "addDaysIso",
    "isIsoDate",
    "isIsoTime",
    "isIsoDateTime",
  ],
  primitive: {
    label: "shadcn/ui: Calendar (react-day-picker) and Popover",
    href: "https://ui.shadcn.com/docs/components/calendar",
  },
  providers: [{ name: "TooltipProvider", importPath: "@aureus-core/ui/shadcn/tooltip" }],
  api: {
    DateTimeField: {
      mode: { type: '"date" | "time" | "datetime"', default: '"date"' },
      value: { type: "string | null" },
      defaultValue: { type: "string | null", default: "null" },
      onValueChange: { type: "(value: string | null) => void" },
      locale: { type: "string" },
      hourCycle: { type: "12 | 24" },
      granularity: { type: '"minute" | "second"', default: '"minute"' },
      minuteStep: { type: "number", default: "1" },
      secondStep: { type: "number", default: "1" },
      weekStartsOn: { type: "0 | 1 | 2 | 3 | 4 | 5 | 6" },
      min: { type: "string" },
      max: { type: "string" },
      disabledDates: { type: "string[]" },
      isDateDisabled: { type: "(date: string) => boolean" },
      presets: { type: "DateTimePreset[]" },
      presetsLabel: { type: "string" },
      openCalendarLabel: { type: "string" },
      previousMonthLabel: { type: "string" },
      nextMonthLabel: { type: "string" },
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
      classNames: { type: "DateTimeFieldClassNames" },
      loadingLabel: { type: "string" },
      infoLabel: { type: "string" },
      id: { type: "string" },
      ref: { type: "Ref<HTMLSpanElement>" },
    },
    DateTimePreset: {
      label: { type: "ReactNode", required: true },
      value: { type: "string | (() => string)", required: true },
    },
    helpers: {
      toDate: { type: "(value: string) => Date | null" },
      fromDate: { type: '(date: Date, mode, granularity?: "minute" | "second") => string' },
      todayIso: { type: "() => string" },
      addDaysIso: { type: "(date: string, days: number) => string" },
      isIsoDate: { type: "(value: unknown) => value is string" },
      isIsoTime: { type: "(value: unknown) => value is string" },
      isIsoDateTime: { type: "(value: unknown) => value is string" },
    },
  },
  stories: [
    "DateOnly",
    "TimeOnly",
    "DateAndTime",
    "Locales",
    "Limits",
    "Presets",
    "Steps",
    "Keyboard",
    "States",
    "Rtl",
    "Responsive",
  ],
  keyboard: [
    "Tab / Shift + Tab",
    "Digits",
    "Arrow Up / Arrow Down",
    "Arrow Left / Arrow Right",
    "Home / End",
    "Backspace / Delete",
    "Calendar: arrows",
    "Calendar: Page Up / Page Down",
    "Calendar: Home / End",
    "Enter / Space",
    "Escape",
  ],
  links: [
    { label: "Guide: Fields & controls", href: "?path=/docs/guides-fields-controls--docs" },
    { label: "Date Time Control", href: "?path=/docs/components-forms-date-time-control--docs" },
    {
      label: "Date Selection Field",
      href: "?path=/docs/components-forms-date-selection-field--docs",
    },
    {
      label: "WAI-ARIA: Date picker dialog",
      href: "https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/datepicker-dialog/",
    },
    {
      label: "WAI-ARIA: Spinbutton pattern",
      href: "https://www.w3.org/WAI/ARIA/apg/patterns/spinbutton/",
    },
  ],
  en: {
    summary:
      'A date, a time, or both, typed in segments in the locale\'s order, with a calendar in a popover for the modes with a date. The value is a local ISO string with no time zone (`"2026-08-01"`, `"14:30"`, `"2026-08-01T14:30"`), and `null` while the input is empty or incomplete. Limits, blocked days, presets, minute and second steps and the hour cycle are opt-in and independent. It ships no texts of its own: the calendar requires the names of its three buttons, and every other text (segment names, captions, weekdays, day names) comes from `Intl` with `locale`.',
    whenToUse: [
      "For one date (a birthday, a delivery date), one time (an opening hour) or one moment (a meeting).",
      "When people should be able to both type a date quickly and browse a calendar.",
    ],
    whenNotToUse: [
      "Inside a react-hook-form `FormProvider`: use Date Time Control.",
      "For a start and an end, or several separate days: use Date Selection Field.",
      "For a date in a time zone other than the user's: the value has no time zone.",
    ],
    anatomy: {
      DateTimeField:
        "Field header (`label`, required mark, info), a frame with the segments (day, month, year, hour, minute, second and day period, as the mode needs), the calendar button, the spinner and the optional action, the popover with the calendar and the presets, and the helper or error text below.",
      DateTimePreset: "A shortcut beside the calendar: its label and its value.",
      helpers:
        "Pure functions for the ISO values, exported from the same entry point. None of them goes through UTC.",
    },
    props: {
      DateTimeField: {
        mode: '`"date"` (a date and a calendar), `"time"` (a time, no calendar) or `"datetime"` (both). The value format follows it.',
        value:
          "Controlled value: `YYYY-MM-DD`, `HH:mm[:ss]` or `YYYY-MM-DDTHH:mm[:ss]` for the mode, or `null`. An invalid value is shown empty, and a development warning names it.",
        defaultValue: "Initial value when uncontrolled.",
        onValueChange:
          "Called with each complete value, and with `null` once the input is no longer complete. An incomplete input never emits a date.",
        locale:
          "Locale of the segment order, separators, digits, names, the calendar and every announced text. Defaults to the browser's.",
        hourCycle:
          "`12` shows hours 1–12 and a day period segment; `24` shows 0–23. Defaults to the locale's. The value always uses 24 hours.",
        granularity: '`"second"` adds a second segment and seconds to the value.',
        minuteStep:
          "How far Arrow Up / Arrow Down move the minutes; from a value off the step, an arrow goes to the next multiple. Typed minutes are kept as typed.",
        secondStep: "The same for the seconds.",
        weekStartsOn: "First day of the week in the calendar. Defaults to the locale's.",
        min: "Earliest value, an ISO string of the mode. The calendar disables the days before it and the arrows stop at it; typed values are not clamped, so a schema decides.",
        max: "Latest value, as `min`.",
        disabledDates: "ISO dates the calendar disables.",
        isDateDisabled: "Called with each ISO date; `true` disables it in the calendar.",
        presets:
          'Shortcuts beside the calendar. A function value is evaluated when the popover opens and when the preset is chosen, so relative dates stay current. Not allowed with `mode="time"`. Requires `presetsLabel`.',
        presetsLabel: "Accessible name of the group of presets. Required with `presets`.",
        openCalendarLabel:
          "Accessible name of the calendar button, in your language. Required with a calendar; there is no default.",
        previousMonthLabel:
          "Accessible name of the previous-month button. Required with a calendar.",
        nextMonthLabel: "Accessible name of the next-month button. Required with a calendar.",
        name: "Name of the hidden input with the ISO value, for native forms (empty while incomplete).",
        label: "Names the group of segments and the calendar dialog.",
        required:
          "Shows the required mark and sets `aria-required` on the segments. It adds no validation.",
        loading:
          "Disables the segments and the calendar button, shows a spinner in the frame and sets `aria-busy`. The value is still submitted.",
        disabled:
          "Disables the segments, the calendar button and the action; the value is not submitted.",
        info: "Content of the info tooltip next to the label; part of each segment's description.",
        helperText: "Text below the field; part of each segment's description.",
        error: "Error state: `aria-invalid` on the segments and destructive styles.",
        errorMessage: "Message shown in place of the helper text while `error` is true.",
        action: "A button at the inline end of the frame (for example, to clear).",
        onBlur:
          "Called when focus leaves the field and its calendar; opening the calendar does not count.",
        "aria-label": "Accessible name of the segments when there is no visible `label`.",
        "aria-labelledby": "Ids of the elements that name the segments when there is no `label`.",
        className: "Extra classes for the root.",
        classNames:
          "Extra classes per part: `segments`, `segment`, `calendarButton`, `popover`, `calendar`, `presets` plus the family's parts (`control` is the frame).",
        loadingLabel:
          "Accessible name of the loading spinner, in your language. Required with `loading`; there is no default.",
        infoLabel:
          "Accessible name of the info button, in your language. Required with `info`; there is no default.",
        id: "Id of the first segment. Generated when missing; the other segments, the label, helper and info derive their ids from it.",
        ref: "Reaches the first segment, so `focus()` and react-hook-form's error focus land there.",
      },
      DateTimePreset: {
        label: "Content of the preset button, in your language. No default.",
        value: "A value of the field's mode, or a function that returns one.",
      },
      helpers: {
        toDate:
          "A local `Date` for a date (at 00:00), a time (today) or a date and time; `null` when invalid.",
        fromDate: "The ISO value of a `Date` in local time for a mode.",
        todayIso: "Today's local date.",
        addDaysIso:
          "A date moved by calendar days, also across daylight-saving changes and month ends.",
        isIsoDate: "`true` only for a real `YYYY-MM-DD` date; use it in schemas with `refine`.",
        isIsoTime: "`true` only for `HH:mm` or `HH:mm:ss`.",
        isIsoDateTime: "`true` only for a real `YYYY-MM-DDTHH:mm[:ss]`.",
      },
    },
    stories: {
      DateOnly:
        "A date: open the calendar, move with the arrows and press Enter; the popover closes and focus returns to the button.",
      TimeOnly:
        "A time in 24 hours, in 12 hours with a day period (type “a” for AM), and with seconds.",
      DateAndTime:
        "Picking a day keeps the time; with no time yet, focus moves to the hour. Minutes step by 15.",
      Locales:
        "Spanish, US English, Japanese and Egyptian Arabic: order, separators, digits, segment names and the calendar caption all come from `Intl`.",
      Limits:
        "Weekdays in August except the 14th: blocked days, no navigation outside the limits, and arrows that stop at `min`.",
      Presets: "Today, in a week and in a month; the matching preset is pressed.",
      Steps: "Minutes in steps of 15 and seconds in steps of 10.",
      Keyboard:
        "Auto-advance, separators, a phone keyboard, arrows, Backspace, and the calendar grid's Page Down.",
      States: "Required with info and helper, error with message, loading and disabled.",
      Rtl: "In a right-to-left page the segments keep the locale's left-to-right order; the button and the calendar mirror.",
      Responsive:
        "A 288 px container with seconds, a day period, presets and an action: nothing overflows, and the popover fits the viewport.",
    },
    keyboard: {
      "Tab / Shift + Tab":
        "Moves through the segments, then to the calendar button and the action.",
      Digits:
        "Fill the focused segment; focus moves on once it is complete or no further digit fits (for example “4” in the month). Separators also move on. Letters choose the day period.",
      "Arrow Up / Arrow Down":
        "Change the focused segment by one step (`minuteStep`, `secondStep`), wrapping within it. An empty segment starts at now. A complete value stops at `min` and `max`.",
      "Arrow Left / Arrow Right": "Move to the segment on that side.",
      "Home / End": "Set the focused segment to its lowest or highest value.",
      "Backspace / Delete": "Clear the focused segment; Backspace in an empty segment moves back.",
      "Calendar: arrows": "Move between days (Shift + Left / Right by months).",
      "Calendar: Page Up / Page Down": "Previous or next month (Shift: year).",
      "Calendar: Home / End": "First or last day of the week.",
      "Enter / Space": "On the calendar button: opens the calendar. On a day: chooses it.",
      Escape: "Closes the calendar; focus returns to the button.",
    },
    aria: [
      "The segments of a value form a `group` named by `label`. Each segment is a `spinbutton` named by the browser's own name for it (`Intl.DisplayNames`: “day”, “month”, “year”, “hour”…), with `aria-valuemin`, `aria-valuemax`, and `aria-valuenow` and `aria-valuetext` while it has a value (the month's text is its name).",
      "Each segment is described by the helper text and info and carries `aria-required` and `aria-invalid`; the group carries `aria-disabled` and `aria-busy`.",
      'The calendar button is named by `openCalendarLabel` and exposes `aria-haspopup="dialog"` and `aria-expanded`. The popover is a `dialog` named by `label`; on opening, focus moves to the chosen day, today or the first enabled day.',
      'Every day button is named by its full date from `Intl`. Today is marked with `aria-current="date"` and chosen days with `aria-selected`: no English word (“Today”, “selected”) is ever added.',
      "Every target is at least 24 × 24 px (44 × 44 px on touch screens), and transitions respect reduced motion.",
    ],
    theming: [
      "The frame is shadcn's Input Group; the calendar is shadcn's Calendar (`--primary` for chosen days, `--muted` for today and ranges) inside shadcn's Popover (`--popover`).",
      "A focused segment uses `--accent`; empty segments use `--muted-foreground`.",
      "Parts carry `data-slot`: `date-time-frame`, `date-segments`, `date-segment`, `field-calendar-button`, `field-popover`, `field-presets`, `calendar`.",
    ],
  },
  es: {
    summary:
      'Una fecha, una hora o las dos, escritas por segmentos en el orden del idioma, con un calendario en un popover para los modos con fecha. El valor es un string ISO local sin zona horaria (`"2026-08-01"`, `"14:30"`, `"2026-08-01T14:30"`), y `null` mientras el input está vacío o incompleto. Los límites, los días bloqueados, los atajos, los pasos de minutos y segundos y el formato de hora son opcionales e independientes. No trae textos propios: el calendario exige los nombres de sus tres botones, y todos los demás textos (nombres de segmentos, títulos, días de la semana, nombres de los días) salen de `Intl` con `locale`.',
    whenToUse: [
      "Para una fecha (un cumpleaños, una entrega), una hora (la de apertura) o un momento (una reunión).",
      "Cuando se debe poder escribir la fecha rápido y también buscarla en un calendario.",
    ],
    whenNotToUse: [
      "Dentro de un `FormProvider` de react-hook-form: usa Date Time Control.",
      "Para un inicio y un fin, o varios días sueltos: usa Date Selection Field.",
      "Para una fecha en una zona horaria distinta a la del usuario: el valor no tiene zona horaria.",
    ],
    anatomy: {
      DateTimeField:
        "Cabecera del field (`label`, asterisco, info), un marco con los segmentos (día, mes, año, hora, minuto, segundo y periodo del día, según el modo), el botón del calendario, el spinner y la acción opcional, el popover con el calendario y los atajos, y la ayuda o el error debajo.",
      DateTimePreset: "Un atajo junto al calendario: su texto y su valor.",
      helpers:
        "Funciones puras para los valores ISO, exportadas desde el mismo punto de entrada. Ninguna pasa por UTC.",
    },
    props: {
      DateTimeField: {
        mode: '`"date"` (una fecha y un calendario), `"time"` (una hora, sin calendario) o `"datetime"` (las dos). El formato del valor depende de él.',
        value:
          "Valor controlado: `YYYY-MM-DD`, `HH:mm[:ss]` o `YYYY-MM-DDTHH:mm[:ss]` según el modo, o `null`. Un valor no válido se muestra vacío, y un aviso en desarrollo lo nombra.",
        defaultValue: "Valor inicial sin controlar.",
        onValueChange:
          "Se llama con cada valor completo, y con `null` cuando el input deja de estar completo. Un input incompleto nunca emite una fecha.",
        locale:
          "Idioma del orden de los segmentos, los separadores, los dígitos, los nombres, el calendario y todo lo que se anuncia. Por defecto, el del navegador.",
        hourCycle:
          "`12` muestra horas 1–12 y un segmento de periodo del día; `24` muestra 0–23. Por defecto, el del idioma. El valor siempre usa 24 horas.",
        granularity: '`"second"` añade un segmento de segundos y los segundos al valor.',
        minuteStep:
          "Cuánto mueven los minutos Flecha arriba / Flecha abajo; desde un valor fuera del paso, una flecha va al múltiplo siguiente. Los minutos escritos se respetan.",
        secondStep: "Lo mismo para los segundos.",
        weekStartsOn: "Primer día de la semana en el calendario. Por defecto, el del idioma.",
        min: "Valor más temprano, un string ISO del modo. El calendario deshabilita los días anteriores y las flechas se detienen en él; lo escrito no se recorta, así que decide el schema.",
        max: "Valor más tardío, como `min`.",
        disabledDates: "Fechas ISO que el calendario deshabilita.",
        isDateDisabled: "Se llama con cada fecha ISO; `true` la deshabilita en el calendario.",
        presets:
          'Atajos junto al calendario. Un valor función se evalúa al abrir el popover y al elegir el atajo, así las fechas relativas están al día. No se permite con `mode="time"`. Exige `presetsLabel`.',
        presetsLabel: "Nombre accesible del grupo de atajos. Obligatorio con `presets`.",
        openCalendarLabel:
          "Nombre accesible del botón del calendario, en tu idioma. Obligatorio con calendario; no hay valor por defecto.",
        previousMonthLabel:
          "Nombre accesible del botón de mes anterior. Obligatorio con calendario.",
        nextMonthLabel: "Nombre accesible del botón de mes siguiente. Obligatorio con calendario.",
        name: "Nombre del input oculto con el valor ISO, para formularios nativos (vacío mientras está incompleto).",
        label: "Nombra el grupo de segmentos y el diálogo del calendario.",
        required:
          "Muestra el asterisco y pone `aria-required` en los segmentos. No añade validación.",
        loading:
          "Deshabilita los segmentos y el botón del calendario, muestra un spinner en el marco y pone `aria-busy`. El valor se sigue enviando.",
        disabled:
          "Deshabilita los segmentos, el botón del calendario y la acción; el valor no se envía.",
        info: "Contenido del tooltip de información junto al label; forma parte de la descripción de cada segmento.",
        helperText: "Texto bajo el field; forma parte de la descripción de cada segmento.",
        error: "Estado de error: `aria-invalid` en los segmentos y estilos destructivos.",
        errorMessage: "Mensaje que sustituye a la ayuda mientras `error` es true.",
        action: "Un botón al final del marco (por ejemplo, para vaciar).",
        onBlur:
          "Se llama cuando el foco sale del field y de su calendario; abrir el calendario no cuenta.",
        "aria-label": "Nombre accesible de los segmentos cuando no hay `label` visible.",
        "aria-labelledby": "Ids de los elementos que nombran los segmentos cuando no hay `label`.",
        className: "Clases extra para la raíz.",
        classNames:
          "Clases extra por parte: `segments`, `segment`, `calendarButton`, `popover`, `calendar`, `presets` y las partes de la familia (`control` es el marco).",
        loadingLabel:
          "Nombre accesible del spinner de carga, en tu idioma. Obligatorio con `loading`; no hay valor por defecto.",
        infoLabel:
          "Nombre accesible del botón de información, en tu idioma. Obligatorio con `info`; no hay valor por defecto.",
        id: "Id del primer segmento. Se genera si falta; los demás segmentos, el label, la ayuda y la info derivan sus ids de él.",
        ref: "Llega al primer segmento, así `focus()` y el foco de error de react-hook-form van ahí.",
      },
      DateTimePreset: {
        label: "Contenido del botón del atajo, en tu idioma. Sin valor por defecto.",
        value: "Un valor del modo del field, o una función que lo devuelve.",
      },
      helpers: {
        toDate:
          "Un `Date` local para una fecha (a las 00:00), una hora (hoy) o una fecha con hora; `null` si no es válido.",
        fromDate: "El valor ISO de un `Date` en hora local para un modo.",
        todayIso: "La fecha local de hoy.",
        addDaysIso:
          "Una fecha movida en días de calendario, también con cambios de horario y finales de mes.",
        isIsoDate: "`true` solo para una fecha real `YYYY-MM-DD`; úsala en schemas con `refine`.",
        isIsoTime: "`true` solo para `HH:mm` o `HH:mm:ss`.",
        isIsoDateTime: "`true` solo para un `YYYY-MM-DDTHH:mm[:ss]` real.",
      },
    },
    stories: {
      DateOnly:
        "Una fecha: abre el calendario, muévete con las flechas y pulsa Enter; el popover se cierra y el foco vuelve al botón.",
      TimeOnly:
        "Una hora en 24 horas, en 12 horas con periodo del día (escribe “a” para AM) y con segundos.",
      DateAndTime:
        "Elegir un día conserva la hora; si aún no hay hora, el foco pasa a la hora. Los minutos van de 15 en 15.",
      Locales:
        "Español, inglés de EE. UU., japonés y árabe de Egipto: orden, separadores, dígitos, nombres de los segmentos y el título del calendario salen de `Intl`.",
      Limits:
        "Días laborables de agosto salvo el 14: días bloqueados, sin navegar fuera de los límites, y flechas que se detienen en `min`.",
      Presets: "Hoy, en una semana y en un mes; el atajo que coincide aparece pulsado.",
      Steps: "Minutos de 15 en 15 y segundos de 10 en 10.",
      Keyboard:
        "Avance automático, separadores, un teclado de móvil, flechas, Retroceso y el Av Pág de la rejilla del calendario.",
      States: "Obligatorio con info y ayuda, error con mensaje, cargando y deshabilitado.",
      Rtl: "En una página de derecha a izquierda los segmentos conservan el orden de izquierda a derecha del idioma; el botón y el calendario se reflejan.",
      Responsive:
        "Un contenedor de 288 px con segundos, periodo del día, atajos y una acción: nada se desborda y el popover cabe en la ventana.",
    },
    keyboard: {
      "Tab / Shift + Tab": "Recorre los segmentos, luego el botón del calendario y la acción.",
      Digits:
        "Rellenan el segmento enfocado; el foco avanza cuando está completo o ya no cabe otro dígito (por ejemplo “4” en el mes). Los separadores también avanzan. Las letras eligen el periodo del día.",
      "Arrow Up / Arrow Down":
        "Cambian el segmento enfocado un paso (`minuteStep`, `secondStep`), dando la vuelta dentro de él. Un segmento vacío empieza en el momento actual. Un valor completo se detiene en `min` y `max`.",
      "Arrow Left / Arrow Right": "Pasan al segmento de ese lado.",
      "Home / End": "Ponen el segmento enfocado en su valor más bajo o más alto.",
      "Backspace / Delete":
        "Vacían el segmento enfocado; Retroceso en un segmento vacío vuelve al anterior.",
      "Calendar: arrows": "Se mueven entre días (Mayús + Izquierda / Derecha, por meses).",
      "Calendar: Page Up / Page Down": "Mes anterior o siguiente (con Mayús, año).",
      "Calendar: Home / End": "Primer o último día de la semana.",
      "Enter / Space": "En el botón del calendario: lo abre. En un día: lo elige.",
      Escape: "Cierra el calendario; el foco vuelve al botón.",
    },
    aria: [
      "Los segmentos de un valor forman un `group` nombrado por `label`. Cada segmento es un `spinbutton` nombrado con el nombre que le da el navegador (`Intl.DisplayNames`: “día”, “mes”, “año”, “hora”…), con `aria-valuemin`, `aria-valuemax`, y `aria-valuenow` y `aria-valuetext` mientras tiene valor (el texto del mes es su nombre).",
      "Cada segmento se describe con la ayuda y la info y lleva `aria-required` y `aria-invalid`; el grupo lleva `aria-disabled` y `aria-busy`.",
      'El botón del calendario se nombra con `openCalendarLabel` y expone `aria-haspopup="dialog"` y `aria-expanded`. El popover es un `dialog` nombrado por `label`; al abrirse, el foco va al día elegido, a hoy o al primer día habilitado.',
      'Cada botón de día se nombra con su fecha completa de `Intl`. Hoy se marca con `aria-current="date"` y los días elegidos con `aria-selected`: nunca se añade una palabra en inglés (“Today”, “selected”).',
      "Toda zona pulsable mide al menos 24 × 24 px (44 × 44 px en pantallas táctiles), y las transiciones respetan el movimiento reducido.",
    ],
    theming: [
      "El marco es el Input Group de shadcn; el calendario es el Calendar de shadcn (`--primary` para los días elegidos, `--muted` para hoy y los rangos) dentro del Popover de shadcn (`--popover`).",
      "Un segmento enfocado usa `--accent`; los segmentos vacíos usan `--muted-foreground`.",
      "Las partes llevan `data-slot`: `date-time-frame`, `date-segments`, `date-segment`, `field-calendar-button`, `field-popover`, `field-presets`, `calendar`.",
    ],
  },
});
