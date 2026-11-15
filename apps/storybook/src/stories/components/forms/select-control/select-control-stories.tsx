import { SelectControl, type SelectControlProps } from "@aureus-core/ui/components/select-control";
import type { SelectOption } from "@aureus-core/ui/components/select-field";
import { SelectField } from "@aureus-core/ui/components/select-field";
import { Button } from "@aureus-core/ui/shadcn/button";
import { colors, countries, currencies } from "@fixtures/select-options";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ComponentType, type ReactNode, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { z } from "zod";
import { type ActionArgs, actionArgs, actionArgTypes, splitActionArgs } from "../field-action-args";
import { docs } from "./select-control-docs";

const schema = z.object({
  country: z.string({ error: "Choose a country." }),
  tags: z.array(z.string()),
  currency: z.string().nullable(),
  region: z.string().nullable(),
});

/** `WithSchema` also requires at least one tag; the other stories do not render that control. */
const strictSchema = schema.extend({
  tags: z.array(z.string()).min(1, "Choose at least one color."),
});

type Profile = {
  country: string | null;
  tags: string[];
  currency: string | null;
  region: string | null;
};

/**
 * The form every story renders into: one `useForm` with a schema resolver, a `FormProvider` and a
 * submit button. The last submitted payload is printed below, to show what the form stores.
 */
function DemoForm({ children, strict }: { children: ReactNode; strict?: boolean }) {
  const form = useForm<Profile>({
    resolver: zodResolver(strict ? strictSchema : schema) as never,
    defaultValues: { country: null, tags: [], currency: "EUR", region: "es" },
    mode: "onTouched",
  });
  const [payload, setPayload] = useState<string>();

  return (
    <FormProvider {...form}>
      <form
        noValidate
        className="flex w-full max-w-sm flex-col gap-6"
        onSubmit={form.handleSubmit((values) => setPayload(JSON.stringify(values)))}
      >
        {children}
        <Button type="submit" className="self-start">
          Save
        </Button>
        {payload ? (
          <output aria-label="Submitted data" className="font-mono text-xs break-all">
            {payload}
          </output>
        ) : null}
      </form>
    </FormProvider>
  );
}

/** Flat args for the single-select Playground (the props type is a union of feature variants). */
/** Waits until no popup is open or closing: until then the rest of the page is inert. */
const popupClosed = () =>
  waitFor(() =>
    expect(
      document.querySelector(
        "[data-slot=select-popup]:not([data-closed]), [data-slot=select-popup][data-ending-style]",
      ),
    ).toBeNull(),
  );

type SelectControlStoryArgs = ActionArgs & {
  name: string;
  label: string;
  placeholder?: string;
  helperText?: string;
  emptyMessage?: string;
  options: SelectOption[];
  required?: boolean;
  loading?: boolean;
  disabled?: boolean;
  onValueChange: (value: string | null) => void;
};

const meta = {
  title: "components/Forms/Select Control",
  component: SelectControl as unknown as ComponentType<SelectControlStoryArgs>,
  parameters: { aureusDocs: docs },
  decorators: [
    (Story, { parameters }) => (
      <DemoForm strict={parameters.strictSchema === true}>
        <Story />
      </DemoForm>
    ),
  ],
  render: (args) => {
    const [props, action] = splitActionArgs(args);
    return <SelectControl {...(props as SelectControlProps)} action={action} />;
  },
  args: {
    name: "country",
    label: "Country",
    placeholder: "Choose a country",
    helperText: "Where the account is registered.",
    required: true,
    options: countries,
    onValueChange: fn(),
    ...actionArgs,
    showAction: false,
  },
  argTypes: {
    name: { control: false, table: { category: "Behavior" } },
    label: { control: "text", table: { category: "Content" } },
    helperText: { control: "text", table: { category: "Content" } },
    placeholder: { control: "text", table: { category: "Messages (no defaults)" } },
    emptyMessage: { control: "text", table: { category: "Messages (no defaults)" } },
    options: { control: "object", table: { category: "Content" } },
    required: { control: "boolean", table: { category: "State" } },
    loading: { control: "boolean", table: { category: "State" } },
    disabled: { control: "boolean", table: { category: "State" } },
    ...actionArgTypes,
    onValueChange: { table: { category: "Events" } },
  },
} satisfies Meta<SelectControlStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Bound to `country`. The submitted value is the option's `value`. */
export const Playground: Story = {
  play: async ({ canvas }) => {
    const field = canvas.getByRole("combobox", { name: /^Country/ });
    await userEvent.click(field);
    await userEvent.click(await within(document.body).findByRole("option", { name: "Francia" }));
    await popupClosed();
    await userEvent.click(canvas.getByRole("button", { name: "Save" }));
    const payload = await canvas.findByRole("status", { name: "Submitted data" });
    await expect(payload).toHaveTextContent('"country":"fr"');
  },
};

export const WithSchema: Story = {
  parameters: { strictSchema: true },
  render: () => (
    <>
      <SelectControl
        name="country"
        label="Country"
        required
        options={countries}
        placeholder="Choose a country"
      />
      <SelectControl
        name="tags"
        label="Colors"
        required
        options={colors}
        multiple
        multipleDisplay="chips"
        removeChipLabel={(option) => `Remove ${option.label}`}
      />
    </>
  ),
  play: async ({ canvas }) => {
    const body = within(document.body);
    const country = canvas.getByRole("combobox", { name: /^Country/ });
    const tags = canvas.getByRole("combobox", { name: /^Colors/ });
    await userEvent.click(canvas.getByRole("button", { name: "Save" }));
    await waitFor(() => expect(country).toHaveAttribute("aria-invalid", "true"));
    await expect(canvas.getByText("Choose a country.")).toBeVisible();
    await expect(canvas.getByText("Choose at least one color.")).toBeVisible();
    await expect(country).toHaveFocus();

    await userEvent.click(country);
    await userEvent.click(await body.findByRole("option", { name: "España" }));
    await popupClosed();
    await userEvent.click(tags);
    await userEvent.click(await body.findByRole("option", { name: "Verde" }));
    await userEvent.keyboard("{Escape}");
    await popupClosed();
    await userEvent.click(canvas.getByRole("button", { name: "Save" }));
    const payload = await canvas.findByRole("status", { name: "Submitted data" });
    await expect(payload).toHaveTextContent('"country":"es","tags":["green"]');
  },
};

export const DisabledVsLoading: Story = {
  render: () => (
    <>
      <SelectControl name="country" label="Country" options={countries} />
      <SelectControl
        name="currency"
        label="Currency (loading)"
        options={currencies}
        loading
        helperText="Still submitted."
      />
      <SelectControl
        name="region"
        label="Region (disabled)"
        options={countries}
        disabled
        helperText="Left out."
      />
    </>
  ),
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("combobox", { name: "Country" }));
    await userEvent.click(await within(document.body).findByRole("option", { name: "Francia" }));
    await popupClosed();
    await userEvent.click(canvas.getByRole("button", { name: "Save" }));
    const payload = await canvas.findByRole("status", { name: "Submitted data" });
    await expect(payload).toHaveTextContent('"currency":"EUR"');
    await expect(payload).not.toHaveTextContent("region");
  },
};

const shared = {
  label: "Country",
  required: true,
  options: countries,
  placeholder: "Choose a country",
  helperText: "Where the account is registered.",
} as const;

export const Parity: Story = {
  render: () => (
    <div className="grid gap-6 sm:grid-cols-2">
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-muted-foreground">SelectField</span>
        <SelectField {...shared} id="parity-field" name="country" />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-muted-foreground">SelectControl</span>
        <SelectControl {...shared} id="parity-control" name="country" />
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const [field, control] = [...canvasElement.querySelectorAll("[data-slot=field]")];
    // Base UI generates its own ids (hidden input, popup); only the authored ids are compared.
    const normalize = (element: Element | undefined, id: string) =>
      element?.outerHTML
        .split(id)
        .join("ID")
        .replace(/_r_[0-9a-z]+_/g, "R");
    await expect(normalize(control, "parity-control")).toBe(normalize(field, "parity-field"));
  },
};
