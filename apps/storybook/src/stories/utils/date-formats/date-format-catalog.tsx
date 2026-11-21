import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@aureus-core/ui/shadcn/table";
import {
  createDateFormatter,
  type DateFormatName,
  dateFormatNames,
} from "@aureus-core/utils/date-formats";
import type { Locale } from "@sb/i18n/locale-types";
import { dateFormatsStrings } from "./date-formats-strings";

/** Fixed sample values: never `new Date()`, so the table is the same on every run. */
export const samples = {
  calendar: "2026-11-21",
  time: "14:30:05",
  dateTime: "2026-11-21T14:30:05",
  instant: "2026-11-21T14:30:05Z",
} as const;

const timeNames = new Set<DateFormatName>(["time", "timeWithSeconds"]);
const dateTimeNames = new Set<DateFormatName>(["shortDateTime", "mediumDateTime", "longDateTime"]);

function groupOf(name: DateFormatName): "calendar" | "time" | "dateTime" {
  if (timeNames.has(name)) return "time";
  return dateTimeNames.has(name) ? "dateTime" : "calendar";
}

/** The `Intl` locale shown for each documentation language. */
export const intlLocale: Record<Locale, string> = { en: "en-US", es: "es-ES" };

export interface DateFormatCatalogProps {
  locale: Locale;
}

/** Every catalog name for a local value of its group and for an instant shown in UTC. */
export function DateFormatCatalog({ locale }: DateFormatCatalogProps) {
  const strings = dateFormatsStrings[locale];
  const dates = createDateFormatter({ locale: intlLocale[locale], timeZone: "UTC" });
  return (
    <Table>
      <TableCaption>{strings.caption}</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>{strings.name}</TableHead>
          <TableHead>{strings.group}</TableHead>
          <TableHead>{strings.local}</TableHead>
          <TableHead>{strings.instant}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {dateFormatNames.map((name) => {
          const group = groupOf(name);
          return (
            <TableRow key={name} data-format={name}>
              <TableCell>
                <code>{name}</code>
              </TableCell>
              <TableCell>{strings[group]}</TableCell>
              <TableCell data-column="local">{dates.format(samples[group], name)}</TableCell>
              <TableCell data-column="instant">{dates.format(samples.instant, name)}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
