import { describe, expectTypeOf, it } from "vitest";
import type { CalendarFormatName, DateFormatName, DateTimeFormatName, TimeFormatName } from "..";
import { createDateFormatter } from "..";

describe("date-formats types", () => {
  it("rejects a name outside the catalog", () => {
    const dates = createDateFormatter();
    // @ts-expect-error: "custom" is not a catalog name.
    dates.format("2026-11-21", "custom");
    // @ts-expect-error: formats cannot be defined by the consumer.
    dates.format("2026-11-21", { pattern: "dd/MM/yyyy" });
  });

  it("splits the names into exact groups", () => {
    expectTypeOf<CalendarFormatName>().toEqualTypeOf<
      | "short"
      | "medium"
      | "long"
      | "full"
      | "numericDate"
      | "dayMonth"
      | "monthYear"
      | "weekday"
      | "month"
      | "year"
    >();
    expectTypeOf<TimeFormatName>().toEqualTypeOf<"time" | "timeWithSeconds">();
    expectTypeOf<DateTimeFormatName>().toEqualTypeOf<
      "shortDateTime" | "mediumDateTime" | "longDateTime"
    >();
    expectTypeOf<DateFormatName>().toEqualTypeOf<
      CalendarFormatName | TimeFormatName | DateTimeFormatName
    >();
  });

  it("accepts Date, timestamps, strings and missing values", () => {
    const dates = createDateFormatter();
    expectTypeOf(dates.format)
      .parameter(0)
      .toEqualTypeOf<Date | number | string | null | undefined>();
    expectTypeOf(dates.format(null, "short")).toEqualTypeOf<string | null>();
  });
});
