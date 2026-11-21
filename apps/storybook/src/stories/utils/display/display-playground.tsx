import type {
  CalendarFormatName,
  DateTimeFormatName,
  TimeFormatName,
} from "@aureus-core/utils/display";
import { createDisplay } from "@aureus-core/utils/display";
import type { Locale } from "@sb/i18n/locale-types";
import { displayStrings } from "./display-strings";

export type DisplayFunction = "text" | "number" | "boolean" | "date" | "time" | "dateTime" | "list";

export interface DisplayPlaygroundProps {
  /** Documentation language (toolbar). */
  locale: Locale;
  fn: DisplayFunction;
  /** The value as typed: a number for `number`, `true`/`false` for `boolean`, comma-separated items for `list`. */
  value: string;
  /** Passes `null` instead of `value`. */
  missing: boolean;
  empty: string;
  // text
  maxLength?: number;
  ellipsis?: string;
  blankAsEmpty?: boolean;
  // number
  decimals?: number;
  padDecimals?: boolean;
  grouping?: boolean;
  currency?: string;
  negativeFormat?: "minus" | "parentheses";
  // boolean
  trueLabel: string;
  falseLabel: string;
  // dates
  dateFormat?: CalendarFormatName;
  timeFormat?: TimeFormatName;
  dateTimeFormat?: DateTimeFormatName;
  timeZone?: string;
  // list
  listType?: Intl.ListFormatType;
  listStyle?: Intl.ListFormatStyle;
  maxItems?: number;
  /** `{count}` is replaced by the number of hidden items. */
  moreText: string;
}

/** The `Intl` locale used for each documentation language. */
const intlLocale: Record<Locale, string> = { en: "en-US", es: "es-ES" };

/** Storybook clears a number control to `undefined` or `NaN`; both mean "not set". */
const optional = (value: number | undefined) =>
  value === undefined || Number.isNaN(value) ? undefined : value;
const optionalText = (value: string | undefined) => (value ? value : undefined);

function run(props: DisplayPlaygroundProps): { call: string; result: string } {
  const display = createDisplay({
    empty: props.empty,
    locale: intlLocale[props.locale],
    timeZone: optionalText(props.timeZone),
  });
  const { fn, value, missing } = props;
  /** The value as passed to the function, for the printed call. */
  let parsed: unknown = value;
  const show = (args: unknown, result: string) => ({
    call: `display.${fn}(${missing ? "null" : JSON.stringify(parsed)}${args === undefined ? "" : `, ${JSON.stringify(args)}`})`,
    result,
  });

  switch (fn) {
    case "text": {
      const options = {
        maxLength: optional(props.maxLength),
        ellipsis: optionalText(props.ellipsis),
        blankAsEmpty: props.blankAsEmpty || undefined,
      };
      return show(options, display.text(missing ? null : value, options));
    }
    case "number": {
      parsed = Number(value);
      const options = {
        decimals: optional(props.decimals),
        padDecimals: props.padDecimals || undefined,
        grouping: props.grouping || undefined,
        currency: optionalText(props.currency),
        negativeFormat: props.negativeFormat,
      };
      return show(options, display.number(missing ? null : Number(value), options));
    }
    case "boolean": {
      parsed = value.trim() === "true";
      const options = { true: props.trueLabel, false: props.falseLabel };
      return show(options, display.boolean(missing ? null : (parsed as boolean), options));
    }
    case "date": {
      const options = { format: props.dateFormat };
      return show(options, display.date(missing ? null : value, options));
    }
    case "time": {
      const options = { format: props.timeFormat };
      return show(options, display.time(missing ? null : value, options));
    }
    case "dateTime": {
      const options = { format: props.dateTimeFormat };
      return show(options, display.dateTime(missing ? null : value, options));
    }
    case "list": {
      const items = value.split(",");
      parsed = items;
      const maxItems = optional(props.maxItems);
      const base = { type: props.listType, style: props.listStyle };
      const result =
        maxItems === undefined
          ? display.list(missing ? null : items, base)
          : display.list(missing ? null : items, {
              ...base,
              maxItems,
              more: (hidden) => props.moreText.replace("{count}", String(hidden)),
            });
      return show(
        maxItems === undefined ? base : { ...base, maxItems, more: "(hidden) => …" },
        result,
      );
    }
  }
}

/** Calls one display function with the controls' value and options, and shows the result. */
export function DisplayPlayground(props: DisplayPlaygroundProps) {
  const strings = displayStrings[props.locale];
  const { call, result } = run(props);
  return (
    <dl className="grid gap-2 text-sm">
      <dt className="font-medium text-muted-foreground">{strings.call}</dt>
      <dd>
        <code className="break-all">{call}</code>
      </dd>
      <dt className="font-medium text-muted-foreground">{strings.result}</dt>
      <dd>
        <output className="text-lg" data-testid="display-result">
          {result}
        </output>
      </dd>
    </dl>
  );
}
