import {
  SelectField,
  type SelectFieldProps,
  type SelectOption,
} from "@aureus-core/ui/components/select-field";
import { cities, colors, countries, currencies } from "@fixtures/select-options";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ComponentType, useEffect, useState } from "react";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { type ActionArgs, actionArgs, actionArgTypes, splitActionArgs } from "../field-action-args";
import { docs } from "./select-field-docs";

/** Flat, story-only args; the render builds the discriminated props and their required texts. */
interface PlaygroundArgs extends ActionArgs {
  label: string;
  placeholder: string;
  helperText: string;
  info: string;
  emptyMessage: string;
  noResultsMessage: string;
  maxSelectedMessage: string;
  errorMessage: string;
  multiple: boolean;
  multipleDisplay: "chips" | "summary";
  searchable: boolean;
  filter: boolean;
  clearable: boolean;
  selectAll: boolean;
  maxSelected?: number;
  closeOnSelect?: boolean;
  required: boolean;
  loading: boolean;
  disabled: boolean;
  error: boolean;
  options: SelectOption[];
  onValueChange: (value: unknown) => void;
}

const text = (value: string) => (value === "" ? undefined : value);

/**
 * Waits until no popup is open or still running its exit transition (Base UI keeps a closed
 * Select popup mounted, marked `data-closed`): until then the page outside it is inert and focus
 * has not returned to the field.
 */
const popupClosed = () =>
  waitFor(() =>
    expect(
      document.querySelector(
        "[data-slot=select-popup]:not([data-closed]), [data-slot=select-popup][data-ending-style]",
      ),
    ).toBeNull(),
  );

function buildProps(args: PlaygroundArgs): SelectFieldProps {
  const [base, action] = splitActionArgs(args);
  const common = {
    label: base.label,
    options: base.options,
    placeholder: text(base.placeholder),
    helperText: text(base.helperText),
    info: text(base.info),
    emptyMessage: text(base.emptyMessage),
    errorMessage: text(base.errorMessage),
    closeOnSelect: base.closeOnSelect,
    required: base.required,
    loading: base.loading,
    disabled: base.disabled,
    error: base.error,
    action,
    onValueChange: base.onValueChange,
  };
  const search = base.searchable
    ? {
        searchable: true as const,
        searchLabel: "Search options",
        searchPlaceholder: "Type to filter",
        filter: base.filter,
        noResultsMessage: text(base.noResultsMessage),
      }
    : {};
  const clear = base.clearable ? { clearable: true as const, clearLabel: "Clear selection" } : {};
  const selection = !base.multiple
    ? {}
    : {
        multiple: true as const,
        maxSelected: base.maxSelected,
        maxSelectedMessage: text(base.maxSelectedMessage),
        selectAll: base.selectAll ? { label: "Select all" } : undefined,
        ...(base.multipleDisplay === "chips"
          ? {
              multipleDisplay: "chips" as const,
              removeChipLabel: (option: SelectOption) => `Remove ${option.label}`,
            }
          : {
              multipleDisplay: "summary" as const,
              renderSummary: (selected: SelectOption[]) => `${selected.length} selected`,
            }),
      };
  return { ...common, ...search, ...clear, ...selection } as SelectFieldProps;
}

const content = { table: { category: "Content" } };
const messages = { table: { category: "Messages (no defaults)" } };
const behavior = { table: { category: "Behavior" } };
const state = { table: { category: "State" } };

const meta = {
  title: "components/Forms/Select Field",
  component: SelectField as unknown as ComponentType<PlaygroundArgs>,
  parameters: { aureusDocs: docs },
  decorators: [
    (Story) => (
      <div className="w-full max-w-sm">
        <Story />
      </div>
    ),
  ],
  render: (args) => <SelectField {...buildProps(args)} />,
  args: {
    label: "Country",
    placeholder: "",
    helperText: "",
    info: "",
    emptyMessage: "",
    noResultsMessage: "",
    maxSelectedMessage: "",
    errorMessage: "",
    multiple: false,
    multipleDisplay: "chips",
    searchable: false,
    filter: true,
    clearable: false,
    selectAll: false,
    required: false,
    loading: false,
    disabled: false,
    error: false,
    options: countries,
    onValueChange: fn(),
    ...actionArgs,
    showAction: false,
  },
  argTypes: {
    label: { control: "text", ...content },
    helperText: { control: "text", ...content },
    info: { control: "text", ...content },
    placeholder: { control: "text", ...messages },
    emptyMessage: { control: "text", ...messages },
    noResultsMessage: { control: "text", ...messages },
    maxSelectedMessage: { control: "text", ...messages },
    errorMessage: { control: "text", ...messages },
    multiple: { control: "boolean", ...behavior },
    multipleDisplay: { control: "inline-radio", options: ["chips", "summary"], ...behavior },
    searchable: { control: "boolean", ...behavior },
    filter: { control: "boolean", ...behavior },
    clearable: { control: "boolean", ...behavior },
    selectAll: { control: "boolean", ...behavior },
    maxSelected: { control: { type: "number", min: 1 }, ...behavior },
    closeOnSelect: { control: "boolean", ...behavior },
    required: { control: "boolean", ...state },
    loading: { control: "boolean", ...state },
    disabled: { control: "boolean", ...state },
    error: { control: "boolean", ...state },
    options: { control: "object", ...content },
    ...actionArgTypes,
    onValueChange: { table: { category: "Events" } },
  },
} satisfies Meta<PlaygroundArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Every feature has a control; messages start empty to show that nothing appears without them. */
export const Playground: Story = {
  play: async ({ args, canvas }) => {
    const field = canvas.getByRole("combobox", { name: "Country" });
    await userEvent.click(field);
    await waitFor(() => expect(field).toHaveAttribute("aria-expanded", "true"));
    await userEvent.click(await within(document.body).findByRole("option", { name: "Francia" }));
    await expect(args.onValueChange).toHaveBeenLastCalledWith("fr");
    await expect(field).toHaveTextContent("Francia");
    // Let the popup finish closing, so the accessibility check sees the settled page.
    await popupClosed();
  },
};

export const Single: Story = {
  args: { label: "Country", placeholder: "Choose a country" },
  play: async ({ canvas }) => {
    const field = canvas.getByRole("combobox", { name: "Country" });
    await expect(field).toHaveTextContent("Choose a country");
    await userEvent.click(field);
    await userEvent.click(await within(document.body).findByRole("option", { name: "Japón" }));
    await expect(field).toHaveTextContent("Japón");
    await expect(field).toHaveAttribute("aria-expanded", "false");
    await popupClosed();
  },
};

export const Multiple: Story = {
  render: () => (
    <SelectField
      label="Colors"
      options={colors}
      multiple
      multipleDisplay="chips"
      removeChipLabel={(option) => `Remove ${option.label}`}
      defaultValue={["red", "blue"]}
      clearable
      clearLabel="Clear colors"
    />
  ),
  play: async ({ canvas }) => {
    const field = canvas.getByRole("combobox", { name: "Colors" });
    await userEvent.click(canvas.getByRole("button", { name: "Remove Azul" }));
    await expect(canvas.queryByRole("button", { name: "Remove Azul" })).toBeNull();
    await userEvent.click(field);
    await userEvent.click(await within(document.body).findByRole("option", { name: "Verde" }));
    await expect(field).toHaveAttribute("aria-expanded", "true");
    await expect(canvas.getByRole("button", { name: "Remove Verde" })).toBeVisible();
  },
};

export const MultipleSummary: Story = {
  render: () => (
    <SelectField
      label="Currencies"
      options={currencies}
      multiple
      multipleDisplay="summary"
      renderSummary={(selected) =>
        selected.length === 1 ? selected[0]?.label : `${selected.length} currencies selected`
      }
      defaultValue={["USD", "EUR"]}
    />
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("combobox", { name: "Currencies" })).toHaveTextContent(
      "2 currencies selected",
    );
  },
};

export const Searchable: Story = {
  render: () => (
    <SelectField
      label="Country"
      options={countries}
      searchable
      searchLabel="Search countries"
      searchPlaceholder="Type to filter"
      noResultsMessage="No country matches"
    />
  ),
  play: async ({ canvas }) => {
    const body = within(document.body);
    await userEvent.click(canvas.getByRole("combobox", { name: "Country" }));
    const search = await body.findByRole("combobox", { name: "Search countries" });
    await waitFor(() => expect(search).toHaveFocus());
    await userEvent.type(search, "espana");
    await expect(body.getAllByRole("option").map((option) => option.textContent)).toEqual([
      "España",
    ]);
  },
};

export const GroupsAndDescriptions: Story = {
  render: () => <SelectField label="Country" options={countries} placeholder="Choose a country" />,
  play: async ({ canvas }) => {
    const body = within(document.body);
    await userEvent.click(canvas.getByRole("combobox", { name: "Country" }));
    await waitFor(() => expect(body.getByText("América")).toBeVisible());
    await expect(body.getByText("Peso mexicano (MXN)")).toBeVisible();
    await expect(await body.findByRole("option", { name: "Chile" })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
  },
};

export const Messages: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <SelectField
        label="With empty message"
        options={[]}
        emptyMessage="There are no accounts yet"
      />
      <SelectField label="Without empty message" options={[]} />
      <SelectField
        label="With no-results message"
        options={countries}
        searchable
        searchLabel="Search countries"
        noResultsMessage="No country matches your search"
      />
    </div>
  ),
  play: async ({ canvas }) => {
    const body = within(document.body);
    await userEvent.click(canvas.getByRole("combobox", { name: "With empty message" }));
    await expect(await body.findByRole("status")).toHaveTextContent("There are no accounts yet");
    await userEvent.keyboard("{Escape}");
    await popupClosed();

    await userEvent.click(canvas.getByRole("combobox", { name: "Without empty message" }));
    await expect(await body.findByRole("status")).toHaveTextContent("");
    await userEvent.keyboard("{Escape}");
    await popupClosed();

    await userEvent.click(canvas.getByRole("combobox", { name: "With no-results message" }));
    await userEvent.type(await body.findByRole("combobox", { name: "Search countries" }), "zzz");
    await expect(await body.findByRole("status")).toHaveTextContent(
      "No country matches your search",
    );
  },
};

function ServerSearchExample() {
  const [query, setQuery] = useState("");
  const [options, setOptions] = useState<SelectOption[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) {
      setOptions([]);
      return;
    }
    setLoading(true);
    const timer = setTimeout(() => {
      setOptions(cities.filter((city) => city.label.toLowerCase().startsWith(query.toLowerCase())));
      setLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <SelectField
      label="City"
      options={options}
      searchable
      searchLabel="Search cities"
      searchPlaceholder="Type at least one letter"
      filter={false}
      onSearchChange={setQuery}
      optionsLoading={loading}
      optionsLoadingMessage="Searching cities…"
      noResultsMessage="No city found"
      emptyMessage="Start typing to search"
    />
  );
}

export const ServerSearch: Story = {
  render: () => <ServerSearchExample />,
  play: async ({ canvas }) => {
    const body = within(document.body);
    await userEvent.click(canvas.getByRole("combobox", { name: "City" }));
    await expect(await body.findByRole("status")).toHaveTextContent("Start typing to search");
    await userEvent.type(await body.findByRole("combobox", { name: "Search cities" }), "li");
    await expect(await body.findByRole("status")).toHaveTextContent("Searching cities…");
    await waitFor(() => expect(body.getByRole("option", { name: "Lima" })).toBeVisible());
  },
};

export const LimitAndSelectAll: Story = {
  render: () => (
    <SelectField
      label="Colors"
      options={colors}
      multiple
      multipleDisplay="summary"
      renderSummary={(selected) => `${selected.length} of 3 colors`}
      maxSelected={3}
      maxSelectedMessage="You can choose up to 3 colors"
      selectAll={{ label: "Select all (up to 3)" }}
    />
  ),
  play: async ({ canvas }) => {
    const body = within(document.body);
    const field = canvas.getByRole("combobox", { name: "Colors" });
    await userEvent.click(field);
    await userEvent.click(await body.findByRole("option", { name: "Select all (up to 3)" }));
    await expect(field).toHaveTextContent("3 of 3 colors");
    await expect(await body.findByText("You can choose up to 3 colors")).toBeVisible();
    // The selected options' checkboxes are filled (a real style check, not only `aria-selected`).
    const rojo = await body.findByRole("option", { name: "Rojo" });
    const box = rojo.querySelector("[data-slot=select-checkbox]") as HTMLElement;
    await expect(getComputedStyle(box).backgroundColor).not.toBe("rgba(0, 0, 0, 0)");
    await expect(await body.findByRole("option", { name: "Morado" })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
  },
};

function CreatableExample() {
  const [options, setOptions] = useState<SelectOption[]>([
    { value: "urgent", label: "Urgent" },
    { value: "review", label: "Review" },
  ]);
  const [value, setValue] = useState<string[]>([]);
  return (
    <SelectField
      label="Tags"
      options={options}
      value={value}
      onValueChange={setValue}
      multiple
      multipleDisplay="chips"
      removeChipLabel={(option) => `Remove ${option.label}`}
      searchable
      searchLabel="Search or create tags"
      creatable
      createLabel={(query) => `Create tag "${query}"`}
      onCreate={(query) => {
        const created = { value: query.toLowerCase(), label: query };
        setOptions((current) => [...current, created]);
        setValue((current) => [...current, created.value]);
      }}
    />
  );
}

export const Creatable: Story = {
  render: () => <CreatableExample />,
  play: async ({ canvas }) => {
    const body = within(document.body);
    await userEvent.click(canvas.getByRole("combobox", { name: "Tags" }));
    await userEvent.type(
      await body.findByRole("combobox", { name: "Search or create tags" }),
      "Billing",
    );
    await userEvent.click(await body.findByRole("option", { name: 'Create tag "Billing"' }));
    await expect(canvas.getByRole("button", { name: "Remove Billing" })).toBeVisible();
  },
};

export const Keyboard: Story = {
  render: () => <SelectField label="Country" options={countries} placeholder="Choose a country" />,
  play: async ({ canvas }) => {
    const field = canvas.getByRole("combobox", { name: "Country" });
    field.focus();
    await userEvent.keyboard("{ArrowDown}");
    await expect(field).toHaveAttribute("aria-expanded", "true");
    const japan = await within(document.body).findByRole("option", { name: "Japón" });
    await waitFor(() => expect(japan).toBeVisible());
    await userEvent.keyboard("j");
    await waitFor(() => expect(japan).toHaveAttribute("data-highlighted"));
    await userEvent.keyboard("{Enter}");
    await expect(field).toHaveTextContent("Japón");
    await popupClosed();
    await expect(field).toHaveFocus();
    await userEvent.keyboard("{ArrowDown}");
    await userEvent.keyboard("{Escape}");
    await expect(field).toHaveAttribute("aria-expanded", "false");
    await popupClosed();
    await waitFor(() => expect(field).toHaveFocus());
  },
};

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <SelectField label="Country" options={countries} required info="Used for taxes." />
      <SelectField label="Currency" options={currencies} helperText="The account's currency." />
      <SelectField
        label="Region"
        options={countries}
        error
        errorMessage="Choose a region."
        placeholder="Choose a region"
      />
      <SelectField label="Account" options={currencies} loading />
      <SelectField label="Owner" options={colors} defaultValue="red" disabled />
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("combobox", { name: /^Country/ })).toHaveAttribute(
      "aria-required",
      "true",
    );
    await expect(canvas.getByRole("alert")).toHaveTextContent("Choose a region.");
    await userEvent.click(canvas.getByRole("combobox", { name: "Account" }));
    await expect(canvas.getByRole("combobox", { name: "Account" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  },
};

export const Responsive: Story = {
  decorators: [
    (Story) => (
      <div className="w-56 border border-dashed p-2">
        <Story />
      </div>
    ),
  ],
  render: () => (
    <SelectField
      label="Colors for the new marketing campaign"
      options={colors}
      multiple
      multipleDisplay="chips"
      removeChipLabel={(option) => `Remove ${option.label}`}
      defaultValue={["red", "blue", "green", "yellow"]}
    />
  ),
  play: async ({ canvasElement }) => {
    const field = canvasElement.querySelector("[data-slot=field]") as HTMLElement;
    await expect(field.scrollWidth).toBeLessThanOrEqual(field.clientWidth);
  },
};
