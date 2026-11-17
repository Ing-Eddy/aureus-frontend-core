import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxSeparator,
  ComboboxValue,
  useComboboxAnchor,
} from "@aureus-core/ui/shadcn/combobox";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Fragment } from "react";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { docs } from "./combobox-docs";

const frameworks = ["Next.js", "SvelteKit", "Nuxt.js", "Remix", "Astro", "Qwik"] as const;

const timezones = [
  { value: "Europe", items: ["Lisbon", "Madrid", "Paris", "Berlin"] },
  { value: "Americas", items: ["Bogotá", "Mexico City", "New York", "São Paulo"] },
  { value: "Asia", items: ["Tokyo", "Seoul", "Singapore"] },
] as const;

const body = () => within(document.body);

interface PlaygroundArgs {
  autoHighlight: boolean;
  disabled: boolean;
  showClear: boolean;
  placeholder: string;
  onValueChange: (value: string | null) => void;
  onInputValueChange: (value: string) => void;
}

/**
 * The chevron trigger and clear button (inside ComboboxInput) and the chip remove buttons are
 * icon-only buttons with no accessible name, and the upstream shadcn component does not forward
 * props to them. Base UI renders all three with `tabindex="-1"`: they are pointer shortcuts with
 * keyboard equivalents (↓ opens, Esc clears, Backspace removes a chip). `button-name` stays on for
 * every other button; only those three slots are excluded.
 */
const a11y = {
  config: {
    rules: [
      {
        id: "button-name",
        selector:
          'button:not([data-slot="input-group-button"]):not([data-slot="combobox-clear"]):not([data-slot="combobox-chip-remove"])',
      },
    ],
  },
};

const meta = {
  title: "shadcn/Forms/Combobox",
  parameters: { aureusDocs: docs, a11y },
  args: {
    autoHighlight: false,
    disabled: false,
    showClear: false,
    placeholder: "Select a framework",
    onValueChange: fn(),
    onInputValueChange: fn(),
  },
  argTypes: {
    placeholder: { control: "text", table: { category: "Content" } },
    autoHighlight: { control: "boolean", table: { category: "Behavior" } },
    showClear: { control: "boolean", table: { category: "Appearance" } },
    disabled: { control: "boolean", table: { category: "State" } },
    onValueChange: { table: { category: "Events" } },
    onInputValueChange: { table: { category: "Events" } },
  },
  render: ({ placeholder, showClear, disabled, ...args }) => (
    <Combobox
      items={frameworks}
      disabled={disabled}
      autoHighlight={args.autoHighlight}
      onValueChange={(value) => args.onValueChange(value as string | null)}
      onInputValueChange={(value) => args.onInputValueChange(value)}
    >
      <ComboboxInput
        aria-label="Framework"
        placeholder={placeholder}
        showClear={showClear}
        disabled={disabled}
      />
      <ComboboxContent>
        <ComboboxEmpty>No frameworks found.</ComboboxEmpty>
        <ComboboxList aria-label="Frameworks">
          {(item: string) => (
            <ComboboxItem key={item} value={item}>
              {item}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  ),
} satisfies Meta<PlaygroundArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Typing filters the list; arrows plus Enter select; Escape closes and keeps focus in the input. */
export const Playground: Story = {
  play: async ({ args, canvas }) => {
    const input = canvas.getByRole("combobox", { name: "Framework" });
    await userEvent.click(input);
    await userEvent.type(input, "re");
    await expect(args.onInputValueChange).toHaveBeenLastCalledWith("re");
    const listbox = await body().findByRole("listbox");
    await waitFor(() => expect(within(listbox).getAllByRole("option")).toHaveLength(1));
    await userEvent.keyboard("{ArrowDown}{Enter}");
    await expect(args.onValueChange).toHaveBeenLastCalledWith("Remix");
    await expect(input).toHaveValue("Remix");

    await userEvent.keyboard("{ArrowDown}");
    await body().findByRole("listbox");
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(body().queryByRole("listbox")).toBeNull());
    await expect(input).toHaveFocus();
  },
};

export const Groups: Story = {
  render: () => (
    <Combobox items={timezones}>
      <ComboboxInput aria-label="City" placeholder="Select a city" />
      <ComboboxContent>
        <ComboboxEmpty>No cities found.</ComboboxEmpty>
        <ComboboxList aria-label="Cities">
          {(group: (typeof timezones)[number], index: number) => (
            <Fragment key={group.value}>
              {index > 0 && <ComboboxSeparator />}
              <ComboboxGroup items={group.items}>
                <ComboboxLabel>{group.value}</ComboboxLabel>
                <ComboboxCollection>
                  {(item: string) => (
                    <ComboboxItem key={item} value={item}>
                      {item}
                    </ComboboxItem>
                  )}
                </ComboboxCollection>
              </ComboboxGroup>
            </Fragment>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  ),
  play: async ({ canvas }) => {
    const input = canvas.getByRole("combobox", { name: "City" });
    await userEvent.click(input);
    await userEvent.type(input, "in");
    const listbox = await body().findByRole("listbox");
    await waitFor(() =>
      expect(
        within(listbox)
          .getAllByRole("option")
          .map((option) => option.textContent),
      ).toEqual(["Berlin", "Singapore"]),
    );
    await userEvent.keyboard("{Escape}{Escape}");
  },
};

/** A query with no matches shows the empty message. */
export const Empty: Story = {
  play: async ({ canvas }) => {
    const input = canvas.getByRole("combobox", { name: "Framework" });
    await userEvent.click(input);
    await userEvent.type(input, "zzz");
    const empty = await body().findByText("No frameworks found.");
    // The popup fades in: wait for it instead of checking the first frame.
    await waitFor(() => expect(empty).toBeVisible());
    await userEvent.keyboard("{Escape}{Escape}");
  },
};

export const WithClear: Story = {
  args: { showClear: true },
  render: ({ showClear, onValueChange }) => (
    <Combobox
      items={frameworks}
      defaultValue="Astro"
      onValueChange={(value) => onValueChange(value)}
    >
      <ComboboxInput aria-label="Framework" showClear={showClear} />
      <ComboboxContent>
        <ComboboxList aria-label="Frameworks">
          {(item: string) => (
            <ComboboxItem key={item} value={item}>
              {item}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  ),
  play: async ({ args, canvas, canvasElement }) => {
    const input = canvas.getByRole("combobox", { name: "Framework" });
    await expect(input).toHaveValue("Astro");
    const clear = canvasElement.querySelector<HTMLElement>('[data-slot="combobox-clear"]');
    await expect(clear).not.toBeNull();
    if (clear) await userEvent.click(clear);
    await expect(args.onValueChange).toHaveBeenLastCalledWith(null);
    await expect(input).toHaveValue("");
  },
};

function MultipleExample({ onValueChange }: { onValueChange: (value: string[]) => void }) {
  const anchor = useComboboxAnchor();
  return (
    <Combobox
      multiple
      autoHighlight
      items={frameworks}
      defaultValue={["Next.js"]}
      onValueChange={(value: string[]) => onValueChange(value)}
    >
      <ComboboxChips ref={anchor} className="w-80">
        <ComboboxValue>
          {(values: string[]) => (
            <>
              {values.map((value) => (
                <ComboboxChip key={value}>{value}</ComboboxChip>
              ))}
              <ComboboxChipsInput aria-label="Frameworks" placeholder="Add framework…" />
            </>
          )}
        </ComboboxValue>
      </ComboboxChips>
      <ComboboxContent anchor={anchor}>
        <ComboboxEmpty>No frameworks found.</ComboboxEmpty>
        <ComboboxList aria-label="Frameworks">
          {(item: string) => (
            <ComboboxItem key={item} value={item}>
              {item}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}

/** With `autoHighlight`, typing and Enter add a chip; Backspace on the empty input removes the last one. */
export const Multiple: Story = {
  render: ({ onValueChange }) => (
    <MultipleExample onValueChange={onValueChange as (value: string[]) => void} />
  ),
  play: async ({ args, canvas, canvasElement }) => {
    const chips = () =>
      [...canvasElement.querySelectorAll('[data-slot="combobox-chip"]')].map((chip) =>
        chip.textContent?.trim(),
      );
    const input = canvas.getByRole("combobox", { name: "Frameworks" });
    await userEvent.click(input);
    await userEvent.type(input, "sv");
    await body().findByRole("listbox");
    await userEvent.keyboard("{Enter}");
    await expect(args.onValueChange).toHaveBeenLastCalledWith(["Next.js", "SvelteKit"]);
    await expect(chips()).toEqual(["Next.js", "SvelteKit"]);
    await userEvent.keyboard("{Escape}");
    await userEvent.clear(input);
    await userEvent.keyboard("{Backspace}");
    await expect(chips()).toEqual(["Next.js"]);
  },
};

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("combobox", { name: "Framework" })).toBeDisabled();
  },
};
