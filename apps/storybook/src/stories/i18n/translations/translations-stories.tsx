import { defaultLocale, isLocale } from "@sb/i18n/locale-types";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { TranslationsDemo } from "./translations-demo";
import { translationsStrings } from "./translations-strings";

const meta = {
  title: "i18n/Translations",
  component: TranslationsDemo,
  // Documented by the "Guide" MDX page: no autodocs page.
  tags: ["!autodocs"],
  parameters: { actions: { disable: true }, controls: { disable: true } },
  args: { locale: defaultLocale },
  // The demo's labels follow the toolbar's language; the example app has its own selector.
  render: (args, { globals }) => (
    <TranslationsDemo
      {...args}
      locale={isLocale(globals.locale) ? globals.locale : defaultLocale}
    />
  ),
} satisfies Meta<typeof TranslationsDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * `createI18n` with in-memory resources: change the example app's language, and open the payments
 * screen to load its namespace on demand.
 */
export const LiveDemo: Story = {
  args: { delay: 50 },
  play: async ({ canvasElement, globals }) => {
    const t = translationsStrings[isLocale(globals.locale) ? globals.locale : defaultLocale];
    const canvas = within(canvasElement);
    await expect(await canvas.findByText("Welcome back, Ana")).toBeVisible();
    const loaded = () => canvas.getByRole("list", { name: t.loadedFiles }).textContent ?? "";
    await expect(loaded()).toContain("en/common");
    await expect(loaded()).not.toContain("payments");

    await userEvent.click(canvas.getByRole("button", { name: t.openPayments }));
    await expect(await canvas.findByText("3 pending payments")).toBeVisible();
    await expect(loaded()).toContain("en/payments");

    await userEvent.click(canvas.getByRole("radio", { name: "Español" }));
    await expect(await canvas.findByText("3 pagos pendientes")).toBeVisible();
    await expect(canvas.getByText("Bienvenida de nuevo, Ana")).toBeVisible();
    await expect(loaded()).toContain("es/payments");

    await userEvent.click(canvas.getByRole("radio", { name: "العربية" }));
    await expect(await canvas.findByText("اتجاه النص: rtl")).toBeVisible();
  },
};
