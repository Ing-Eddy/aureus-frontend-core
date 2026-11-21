import { defaultLocale, isLocale } from "@sb/i18n/locale-types";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { DateFormatCatalog } from "./date-format-catalog";

const meta = {
  title: "utils/Date formats",
  component: DateFormatCatalog,
  // Documented by the "Guide" MDX page: no autodocs page.
  tags: ["!autodocs"],
  parameters: { controls: { disable: true }, actions: { disable: true } },
  args: { locale: defaultLocale },
  argTypes: { locale: { control: false } },
  // The table follows the toolbar's language.
  render: (_args, { globals }) => (
    <DateFormatCatalog locale={isLocale(globals.locale) ? globals.locale : defaultLocale} />
  ),
} satisfies Meta<typeof DateFormatCatalog>;

export default meta;
type Story = StoryObj<typeof meta>;

const cell = (canvasElement: HTMLElement, name: string, column: "local" | "instant") =>
  canvasElement.querySelector(`[data-format="${name}"] [data-column="${column}"]`);

export const Catalog: Story = {
  play: async ({ canvasElement, globals }) => {
    const canvas = within(canvasElement);
    expect(canvas.getAllByRole("row")).toHaveLength(16); // header + fifteen names
    const expected =
      globals.locale === "es"
        ? { long: "21 de noviembre de 2026", time: "14:30" }
        : { long: "November 21, 2026", time: /^2:30\sPM$/ };
    expect(cell(canvasElement, "long", "local")).toHaveTextContent(expected.long);
    expect(cell(canvasElement, "time", "instant")?.textContent).toMatch(expected.time);
  },
};

/** The same table in Spanish, whatever the toolbar says. */
export const CatalogInSpanish: Story = {
  globals: { locale: "es" },
  play: async ({ canvasElement }) => {
    expect(cell(canvasElement, "long", "local")).toHaveTextContent("21 de noviembre de 2026");
    expect(cell(canvasElement, "monthYear", "local")).toHaveTextContent("noviembre de 2026");
    expect(cell(canvasElement, "time", "local")).toHaveTextContent("14:30");
  },
};
