import { defineComponentDocs } from "@sb/docs/define-component-docs";

export const docs = defineComponentDocs({
  name: "Calendar",
  importPath: "@aureus-core/ui/shadcn/calendar",
  exports: ["Calendar", "CalendarDayButton"],
  primitive: { label: "React DayPicker", href: "https://daypicker.dev/" },
  api: {
    Calendar: {
      mode: { type: '"single" | "multiple" | "range"' },
      selected: { type: "Date | Date[] | DateRange" },
      onSelect: { type: "(selected, triggerDate, modifiers, event) => void" },
      required: { type: "boolean", default: "false" },
      defaultMonth: { type: "Date" },
      month: { type: "Date" },
      onMonthChange: { type: "(month: Date) => void" },
      numberOfMonths: { type: "number", default: "1" },
      disabled: { type: "Matcher | Matcher[]" },
      captionLayout: {
        type: '"label" | "dropdown" | "dropdown-months" | "dropdown-years"',
        default: '"label"',
      },
      showOutsideDays: { type: "boolean", default: "true" },
      showWeekNumber: { type: "boolean", default: "false" },
      weekStartsOn: { type: "0 | 1 | 2 | 3 | 4 | 5 | 6" },
      locale: { type: "date-fns Locale" },
      today: { type: "Date" },
      buttonVariant: { type: "Button variant", default: '"ghost"' },
    },
    CalendarDayButton: {
      day: { type: "CalendarDay", required: true },
      modifiers: { type: "Modifiers", required: true },
    },
  },
  stories: [
    "Multiple",
    "Range",
    "DisabledDates",
    "TwoMonths",
    "Dropdowns",
    "Localized",
    "DatePicker",
  ],
  keyboard: [
    "Tab",
    "← / →",
    "↑ / ↓",
    "Page Up / Page Down",
    "Shift + Page Up / Down",
    "Home / End",
    "Enter / Space",
  ],
  links: [
    { label: "shadcn/ui: Calendar", href: "https://ui.shadcn.com/docs/components/calendar" },
    { label: "React DayPicker", href: "https://daypicker.dev/" },
    { label: "date-fns", href: "https://date-fns.org/" },
  ],
  en: {
    summary:
      "A month grid for picking one date, several dates or a range. It wraps React DayPicker with the package styles, so every DayPicker prop works.",
    whenToUse: [
      "Inline, when the date is the main task (booking, scheduling).",
      "Inside a Popover as a date picker for form fields (see DatePicker).",
      'With `mode="range"` for start and end dates.',
    ],
    whenNotToUse: [
      "For a date the user knows by heart (birth date): three inputs or a text field are faster.",
      'For times: combine it with an Input of `type="time"`.',
    ],
    anatomy: {
      Calendar:
        'The DayPicker root (`data-slot="calendar"`): caption with month and navigation buttons, weekday headers and a grid of day buttons.',
      CalendarDayButton:
        "The default button for each day. Pass it through `components={{ DayButton }}` to customize the content of a day.",
    },
    props: {
      Calendar: {
        mode: "Selection mode. Without it the calendar only displays dates.",
        selected: "The selected value: a Date, an array of Dates, or `{ from, to }`.",
        onSelect: "Called with the new selection.",
        required: "Prevents unselecting the current value by clicking it again.",
        defaultMonth: "Month shown first when uncontrolled. Fix it for predictable layouts.",
        month: "Controlled visible month.",
        onMonthChange: "Called when the user navigates to another month.",
        numberOfMonths: "How many months to show side by side.",
        disabled:
          "Dates that cannot be selected: a Date, a range, `{ before }`, `{ after }`, `{ dayOfWeek }` or a function.",
        captionLayout:
          "`label` shows the month name; the dropdown options add month and/or year selects.",
        showOutsideDays: "Shows the days of the previous and next month, muted.",
        showWeekNumber: "Adds a week-number column.",
        weekStartsOn: "First day of the week (0 = Sunday). Defaults to the locale.",
        locale: "A date-fns locale for month and weekday names.",
        today: "Overrides today's date (useful for tests and time zones).",
        buttonVariant: "Button variant of the previous/next navigation buttons.",
      },
      CalendarDayButton: {
        day: "The day being rendered.",
        modifiers: "State of the day: selected, today, disabled, range_start…",
      },
    },
    stories: {
      Multiple: '`mode="multiple"` toggles each clicked date in and out of an array.',
      Range: '`mode="range"` selects a `{ from, to }` interval across two months.',
      DisabledDates: "Weekends and past dates disabled through `disabled` matchers.",
      TwoMonths: "`numberOfMonths={2}` with week numbers.",
      Dropdowns:
        '`captionLayout="dropdown"` with `startMonth`/`endMonth` limits for quick year jumps.',
      Localized:
        "A date-fns locale (Spanish) changes month and weekday names and the first day of the week.",
      DatePicker:
        "The composition used in forms: a Button trigger in a Popover with a Calendar, showing the value formatted with date-fns.",
    },
    keyboard: {
      Tab: "Moves focus to the navigation buttons and then to the selected (or today's) day.",
      "← / →": "Moves to the previous or next day.",
      "↑ / ↓": "Moves to the same weekday in the previous or next week.",
      "Page Up / Page Down": "Moves to the previous or next month.",
      "Shift + Page Up / Down": "Moves to the previous or next year.",
      "Home / End": "Moves to the start or end of the week.",
      "Enter / Space": "Selects the focused day.",
    },
    aria: [
      'The grid is a `role="grid"` table and each day is a button named with its full date. DayPicker\'s default name (“Sunday, June 29th, 2025”) does not contain the visible “29” as a word, which fails WCAG 2.5.3 Label in Name: pass `labels={{ labelDayButton: (date) => format(date, "EEEE d MMMM yyyy") }}` as the stories do.',
      "Selected days have `aria-selected`; disabled days are `disabled`; today is announced through the `today` modifier label.",
      "Navigation buttons are labelled “Go to the Previous/Next Month” by DayPicker; pass `labels` to translate them.",
    ],
    theming: [
      "Selected day: `--primary`; range middle: `--muted`; today: `--muted` background; outside days: `--muted-foreground`.",
      'Cell size comes from `--cell-size` (default `--spacing(7)`); set it with `className="[--cell-size:--spacing(9)]"`.',
    ],
  },
  es: {
    summary:
      "Una cuadrícula mensual para elegir una fecha, varias o un rango. Envuelve React DayPicker con los estilos del paquete, así que todas las props de DayPicker funcionan.",
    whenToUse: [
      "En línea, cuando la fecha es la tarea principal (reservas, agenda).",
      "Dentro de un Popover como selector de fecha en formularios (ver DatePicker).",
      'Con `mode="range"` para fechas de inicio y fin.',
    ],
    whenNotToUse: [
      "Para una fecha que el usuario sabe de memoria (nacimiento): tres campos o un campo de texto son más rápidos.",
      'Para horas: combínalo con un Input de `type="time"`.',
    ],
    anatomy: {
      Calendar:
        'La raíz de DayPicker (`data-slot="calendar"`): cabecera con el mes y los botones de navegación, nombres de los días y una cuadrícula de botones de día.',
      CalendarDayButton:
        "El botón por defecto de cada día. Pásalo con `components={{ DayButton }}` para personalizar el contenido de un día.",
    },
    props: {
      Calendar: {
        mode: "Modo de selección. Sin él, el calendario solo muestra fechas.",
        selected: "El valor elegido: un Date, un array de Dates o `{ from, to }`.",
        onSelect: "Se llama con la nueva selección.",
        required: "Impide deseleccionar el valor actual al pulsarlo otra vez.",
        defaultMonth:
          "Mes que se muestra primero cuando no está controlado. Fíjalo para un diseño predecible.",
        month: "Mes visible controlado.",
        onMonthChange: "Se llama cuando el usuario navega a otro mes.",
        numberOfMonths: "Cuántos meses se muestran lado a lado.",
        disabled:
          "Fechas que no se pueden elegir: un Date, un rango, `{ before }`, `{ after }`, `{ dayOfWeek }` o una función.",
        captionLayout:
          "`label` muestra el nombre del mes; las opciones dropdown añaden selectores de mes y/o año.",
        showOutsideDays: "Muestra atenuados los días del mes anterior y siguiente.",
        showWeekNumber: "Añade una columna con el número de semana.",
        weekStartsOn: "Primer día de la semana (0 = domingo). Por defecto, el del locale.",
        locale: "Un locale de date-fns para los nombres de meses y días.",
        today: "Sustituye la fecha de hoy (útil para tests y zonas horarias).",
        buttonVariant: "Variante de Button de los botones anterior/siguiente.",
      },
      CalendarDayButton: {
        day: "El día que se renderiza.",
        modifiers: "Estado del día: selected, today, disabled, range_start…",
      },
    },
    stories: {
      Multiple: '`mode="multiple"` añade o quita cada fecha pulsada de un array.',
      Range: '`mode="range"` elige un intervalo `{ from, to }` entre dos meses.',
      DisabledDates:
        "Fines de semana y fechas pasadas deshabilitados mediante matchers en `disabled`.",
      TwoMonths: "`numberOfMonths={2}` con números de semana.",
      Dropdowns:
        '`captionLayout="dropdown"` con límites `startMonth`/`endMonth` para saltar de año rápidamente.',
      Localized:
        "Un locale de date-fns (español) cambia los nombres de meses y días y el primer día de la semana.",
      DatePicker:
        "La composición usada en formularios: un Button disparador en un Popover con un Calendar, que muestra el valor formateado con date-fns.",
    },
    keyboard: {
      Tab: "Mueve el foco a los botones de navegación y luego al día elegido (o al de hoy).",
      "← / →": "Va al día anterior o siguiente.",
      "↑ / ↓": "Va al mismo día de la semana anterior o siguiente.",
      "Page Up / Page Down": "Va al mes anterior o siguiente.",
      "Shift + Page Up / Down": "Va al año anterior o siguiente.",
      "Home / End": "Va al inicio o al final de la semana.",
      "Enter / Space": "Elige el día enfocado.",
    },
    aria: [
      'La cuadrícula es una tabla `role="grid"` y cada día es un botón con la fecha completa como nombre. El nombre por defecto de DayPicker (“Sunday, June 29th, 2025”) no contiene el “29” visible como palabra, lo que incumple WCAG 2.5.3 (etiqueta en el nombre): pasa `labels={{ labelDayButton: (date) => format(date, "EEEE d MMMM yyyy") }}` como hacen las historias.',
      "Los días elegidos tienen `aria-selected`; los deshabilitados son `disabled`; el día de hoy se anuncia mediante la etiqueta del modificador `today`.",
      "DayPicker nombra los botones de navegación “Go to the Previous/Next Month”; pasa `labels` para traducirlos.",
    ],
    theming: [
      "Día elegido: `--primary`; tramo intermedio del rango: `--muted`; hoy: fondo `--muted`; días de fuera: `--muted-foreground`.",
      'El tamaño de celda viene de `--cell-size` (por defecto `--spacing(7)`); cámbialo con `className="[--cell-size:--spacing(9)]"`.',
    ],
  },
});
