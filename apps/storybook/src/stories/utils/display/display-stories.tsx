import { dateFormatNames } from "@aureus-core/utils/date-formats";
import { defaultLocale, isLocale } from "@sb/i18n/locale-types";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { DisplayPlayground, type DisplayPlaygroundProps } from "./display-playground";

/** Shows a control only for the function it applies to. */
const only = (fn: DisplayPlaygroundProps["fn"]) => ({ arg: "fn", eq: fn });

const timeNames = ["time", "timeWithSeconds"];
const dateTimeNames = ["shortDateTime", "mediumDateTime", "longDateTime"];
const calendarNames = dateFormatNames.filter(
  (name) => !timeNames.includes(name) && !dateTimeNames.includes(name),
);

const meta = {
  title: "utils/Display",
  component: DisplayPlayground,
  // Documented by the "Guide" MDX page: no autodocs page.
  tags: ["!autodocs"],
  parameters: { actions: { disable: true } },
  args: {
    locale: defaultLocale,
    fn: "text",
    value: "  Hello world  ",
    missing: false,
    empty: "-",
    trueLabel: "Yes",
    falseLabel: "No",
    moreText: "{count} more",
  },
  argTypes: {
    locale: { control: false },
    fn: {
      control: "select",
      options: ["text", "number", "boolean", "date", "time", "dateTime", "list"],
      table: { category: "Call" },
    },
    value: { control: "text", table: { category: "Call" } },
    missing: { control: "boolean", table: { category: "Call" } },
    empty: { control: "text", table: { category: "Display" } },
    timeZone: { control: "text", table: { category: "Display" } },
    maxLength: { control: "number", if: only("text"), table: { category: "Options" } },
    ellipsis: { control: "text", if: only("text"), table: { category: "Options" } },
    blankAsEmpty: { control: "boolean", if: only("text"), table: { category: "Options" } },
    decimals: { control: "number", if: only("number"), table: { category: "Options" } },
    padDecimals: { control: "boolean", if: only("number"), table: { category: "Options" } },
    grouping: { control: "boolean", if: only("number"), table: { category: "Options" } },
    currency: { control: "text", if: only("number"), table: { category: "Options" } },
    negativeFormat: {
      control: "inline-radio",
      options: ["minus", "parentheses"],
      if: only("number"),
      table: { category: "Options" },
    },
    trueLabel: { control: "text", if: only("boolean"), table: { category: "Options" } },
    falseLabel: { control: "text", if: only("boolean"), table: { category: "Options" } },
    dateFormat: {
      control: "select",
      options: calendarNames,
      if: only("date"),
      table: { category: "Options" },
    },
    timeFormat: {
      control: "select",
      options: timeNames,
      if: only("time"),
      table: { category: "Options" },
    },
    dateTimeFormat: {
      control: "select",
      options: dateTimeNames,
      if: only("dateTime"),
      table: { category: "Options" },
    },
    listType: {
      control: "inline-radio",
      options: ["conjunction", "disjunction", "unit"],
      if: only("list"),
      table: { category: "Options" },
    },
    listStyle: {
      control: "inline-radio",
      options: ["long", "short", "narrow"],
      if: only("list"),
      table: { category: "Options" },
    },
    maxItems: { control: "number", if: only("list"), table: { category: "Options" } },
    moreText: { control: "text", if: only("list"), table: { category: "Options" } },
  },
  // The output follows the toolbar's language.
  render: (args, { globals }) => (
    <DisplayPlayground
      {...args}
      locale={isLocale(globals.locale) ? globals.locale : defaultLocale}
    />
  ),
} satisfies Meta<typeof DisplayPlayground>;

export default meta;
type Story = StoryObj<typeof meta>;

const result = (canvasElement: HTMLElement) =>
  within(canvasElement).getByTestId("display-result").textContent;

export const Playground: Story = {
  play: async ({ canvasElement }) => {
    expect(result(canvasElement)).toBe("Hello world");
  },
};

export const MissingValue: Story = {
  args: { missing: true, empty: "—" },
  play: async ({ canvasElement }) => {
    expect(result(canvasElement)).toBe("—");
  },
};

export const EmojiCut: Story = {
  args: { value: "👍🏽👍🏽👍🏽 great", maxLength: 3, ellipsis: "…" },
  play: async ({ canvasElement }) => {
    expect(result(canvasElement)).toBe("👍🏽👍🏽…");
  },
};

export const Money: Story = {
  args: {
    fn: "number",
    value: "-1234.5",
    decimals: 2,
    padDecimals: true,
    grouping: true,
    currency: "USD",
    negativeFormat: "parentheses",
  },
  globals: { locale: "en" },
  play: async ({ canvasElement }) => {
    expect(result(canvasElement)).toBe("($1,234.50)");
  },
};

export const LongDate: Story = {
  args: { fn: "date", value: "2026-11-21", dateFormat: "long" },
  globals: { locale: "es" },
  play: async ({ canvasElement }) => {
    expect(result(canvasElement)).toBe("21 de noviembre de 2026");
  },
};

export const ListWithMore: Story = {
  args: { fn: "list", value: "a, b, , c, d, e", maxItems: 2, moreText: "{count} más" },
  globals: { locale: "es" },
  play: async ({ canvasElement }) => {
    expect(result(canvasElement)).toBe("a, b y 3 más");
  },
};
