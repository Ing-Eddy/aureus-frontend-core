import { defaultLocale, isLocale, type Locale } from "@sb/i18n/locale-types";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { SchemaFormExamples } from "./schema-form-examples";
import { schemaFormStrings } from "./schema-form-strings";

const meta = {
  title: "hooks/Schema form",
  component: SchemaFormExamples,
  // Documented by the "Guide" MDX page: no autodocs page.
  tags: ["!autodocs"],
  parameters: { actions: { disable: true }, controls: { disable: true } },
  args: { example: "basic", locale: defaultLocale },
  // The examples follow the toolbar's language.
  render: (args, { globals }) => (
    <SchemaFormExamples
      {...args}
      locale={isLocale(globals.locale) ? globals.locale : defaultLocale}
    />
  ),
} satisfies Meta<typeof SchemaFormExamples>;

export default meta;
type Story = StoryObj<typeof meta>;

const stringsFor = (globals: Record<string, unknown>) =>
  schemaFormStrings[isLocale(globals.locale) ? globals.locale : defaultLocale];

const textbox = (canvas: ReturnType<typeof within>, name: string) =>
  canvas.getByRole("textbox", { name: new RegExp(name) });

/** A login form from `createFormHook({ schema: useLoginSchema, defaultValues })`. */
export const Basic: Story = {
  args: { example: "basic" },
  play: async ({ canvasElement, globals }) => {
    const t = stringsFor(globals);
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: t.save }));
    await waitFor(() => expect(canvas.getAllByText(t.required)).toHaveLength(2));
    await userEvent.type(textbox(canvas, t.email), "ana");
    await waitFor(() => expect(canvas.getByText(t.invalidEmail)).toBeVisible());
  },
};

/** The same hook creates (no `values`) and edits (`values` arrives later, like a query result). */
export const CreateAndEdit: Story = {
  args: { example: "createAndEdit" },
  play: async ({ canvasElement, globals }) => {
    const t = stringsFor(globals);
    const canvas = within(canvasElement);
    await expect(textbox(canvas, t.companyName)).toHaveValue("");
    await userEvent.click(canvas.getByRole("button", { name: t.loadCompany }));
    await waitFor(() => expect(textbox(canvas, t.companyName)).toHaveValue("Acme S.A."));
    await expect(textbox(canvas, t.city)).toHaveValue("Lima");
    await expect(textbox(canvas, t.taxId)).toHaveValue("");
  },
};

/** Backend errors: arrays of messages per field and a root error, then a Laravel body applied imperatively. */
export const ServerErrors: Story = {
  args: { example: "serverErrors" },
  play: async ({ canvasElement, globals }) => {
    const t = stringsFor(globals);
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: t.simulateServer }));
    await waitFor(() =>
      expect(canvas.getByText(`${t.serverTaken} ${t.serverDomain}`)).toBeVisible(),
    );
    await expect(canvas.getByText(t.serverRoot)).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: t.simulateLaravel }));
    await waitFor(() => expect(canvas.getByText(t.serverPassword)).toBeVisible());
  },
};

/** A schema hook memoized on `t`: switching the language translates the visible errors. */
export const Multilanguage: Story = {
  args: { example: "multilanguage" },
  play: async ({ canvasElement, globals }) => {
    const start = stringsFor(globals);
    const other: Locale = isLocale(globals.locale) && globals.locale === "es" ? "en" : "es";
    const next = schemaFormStrings[other];
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: start.save }));
    await waitFor(() => expect(canvas.getAllByText(start.required)).toHaveLength(2));
    await userEvent.click(
      canvas.getByRole("button", { name: other === "es" ? start.spanish : start.english }),
    );
    await waitFor(() => expect(canvas.getAllByText(next.required)).toHaveLength(2));
  },
};

/** `schemaParams` reaches the schema hook: in edit mode the tax ID is no longer required. */
export const SchemaParams: Story = {
  args: { example: "schemaParams" },
  play: async ({ canvasElement, globals }) => {
    const t = stringsFor(globals);
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: t.save }));
    await waitFor(() => expect(canvas.getAllByText(t.required)).toHaveLength(2));
    await userEvent.click(canvas.getByRole("switch", { name: t.editMode }));
    await waitFor(() => expect(canvas.getAllByText(t.required)).toHaveLength(1));
  },
};

/** The values use the schema's input (a string), the submitted data its output (a number). */
export const Transforms: Story = {
  args: { example: "transforms" },
  play: async ({ canvasElement, globals }) => {
    const t = stringsFor(globals);
    const canvas = within(canvasElement);
    await userEvent.type(textbox(canvas, t.age), "42");
    await userEvent.click(canvas.getByRole("button", { name: t.save }));
    await waitFor(() =>
      expect(canvas.getByRole("status", { name: t.submitted })).toHaveTextContent('{"age":42}'),
    );
  },
};
