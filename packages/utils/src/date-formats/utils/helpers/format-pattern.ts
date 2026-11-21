import { dateTimeFormat, warnOnce } from "@/internal/utils/helpers";
import { dateTokens } from "../constants";

type Token = { type: "literal"; text: string } | { type: "field"; token: string };

/** Splits a pattern into tokens: runs of one letter, `'quoted'` literals (`''` is a quote). */
export function tokenize(pattern: string): Token[] {
  const tokens: Token[] = [];
  const literal = (text: string) => {
    const last = tokens.at(-1);
    if (last?.type === "literal") last.text += text;
    else tokens.push({ type: "literal", text });
  };
  let index = 0;
  while (index < pattern.length) {
    const char = pattern[index] as string;
    if (char === "'") {
      if (pattern[index + 1] === "'") {
        literal("'");
        index += 2;
        continue;
      }
      let end = index + 1;
      let text = "";
      while (end < pattern.length) {
        if (pattern[end] === "'" && pattern[end + 1] === "'") {
          text += "'";
          end += 2;
        } else if (pattern[end] === "'") break;
        else text += pattern[end++];
      }
      literal(text);
      index = end + 1;
    } else if (/[A-Za-z]/.test(char)) {
      let end = index;
      while (pattern[end] === char) end++;
      const run = pattern.slice(index, end);
      if (dateTokens.has(run)) tokens.push({ type: "field", token: run });
      else {
        warnOnce(
          `date-formats:token:${run}`,
          `date-formats: "${run}" is not a pattern token; it is written literally. Quote literal text ('…').`,
        );
        literal(run);
      }
      index = end;
    } else {
      literal(char);
      index++;
    }
  }
  return tokens;
}

type Locale = string | string[] | undefined;

const pad = (value: number, length: number) => String(value).padStart(length, "0");

function partOf(formatter: Intl.DateTimeFormat, date: Date, type: Intl.DateTimeFormatPartTypes) {
  return formatter.formatToParts(date).find((part) => part.type === type)?.value ?? "";
}

/**
 * Writes `date` with a pattern. Numbers are always ASCII digits; month and weekday names and the
 * day period come from `locale`. `timeZone` is the zone the parts are read in.
 */
export function formatPattern(
  date: Date,
  pattern: string,
  locale: Locale,
  timeZone: string | undefined,
): string {
  const numeric = dateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hourCycle: "h23",
  })
    .formatToParts(date)
    .reduce<Record<string, number>>((parts, part) => {
      if (part.type !== "literal") parts[part.type] = Number(part.value);
      return parts;
    }, {});
  const { year = 0, month = 0, day = 0, hour = 0, minute = 0, second = 0 } = numeric;
  const hour12 = hour % 12 || 12;

  const name = (options: Intl.DateTimeFormatOptions, type: Intl.DateTimeFormatPartTypes) =>
    partOf(dateTimeFormat(locale, { timeZone, ...options }), date, type);

  return tokenize(pattern)
    .map((token) => {
      if (token.type === "literal") return token.text;
      switch (token.token) {
        case "yyyy":
          return pad(year, 4);
        case "yy":
          return pad(year % 100, 2);
        case "M":
          return String(month);
        case "MM":
          return pad(month, 2);
        case "MMM":
          return name({ month: "short" }, "month");
        case "MMMM":
          return name({ month: "long" }, "month");
        case "d":
          return String(day);
        case "dd":
          return pad(day, 2);
        case "EEE":
          return name({ weekday: "short" }, "weekday");
        case "EEEE":
          return name({ weekday: "long" }, "weekday");
        case "H":
          return String(hour);
        case "HH":
          return pad(hour, 2);
        case "h":
          return String(hour12);
        case "hh":
          return pad(hour12, 2);
        case "m":
          return String(minute);
        case "mm":
          return pad(minute, 2);
        case "s":
          return String(second);
        case "ss":
          return pad(second, 2);
        default: // "a"
          return name({ hour: "numeric", hour12: true }, "dayPeriod");
      }
    })
    .join("");
}
