import { Label } from "@aureus-core/ui/shadcn/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@aureus-core/ui/shadcn/select";
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ComponentProps, ReactNode } from "react";
import { expect, fn, userEvent, within } from "storybook/test";
import { docs } from "./select-docs";

const fruits = ["Apple", "Banana", "Blueberry", "Grapes", "Pineapple"] as const;

function Labelled({
  id,
  label,
  children,
  size,
  invalid,
}: {
  id: string;
  label: string;
  children: ReactNode;
  size?: "sm" | "default";
  invalid?: boolean;
}) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <SelectTrigger id={id} size={size} className="w-48" aria-invalid={invalid || undefined}>
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      {children}
    </div>
  );
}

const fruitItems = (
  <SelectContent>
    <SelectGroup>
      {fruits.map((fruit) => (
        <SelectItem key={fruit} value={fruit.toLowerCase()}>
          {fruit}
        </SelectItem>
      ))}
    </SelectGroup>
  </SelectContent>
);

const meta = {
  title: "shadcn/Forms/Select",
  component: Select,
  parameters: { aureusDocs: docs },
  args: { disabled: false, required: false, onValueChange: fn(), onOpenChange: fn() },
  argTypes: {
    disabled: { control: "boolean", table: { category: "State" } },
    required: { control: "boolean", table: { category: "Behavior" } },
    onValueChange: { table: { category: "Events" } },
    onOpenChange: { table: { category: "Events" } },
  },
  render: (args: ComponentProps<typeof Select>) => (
    <Select {...args}>
      <Labelled id="select-playground" label="Fruit">
        {fruitItems}
      </Labelled>
    </Select>
  ),
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The keyboard opens the list, arrows plus Enter select, and Escape closes it with focus back on
 * the trigger. The list renders in a portal, so it is queried from `document.body`.
 */
export const Playground: Story = {
  play: async ({ args, canvas }) => {
    const body = within(document.body);
    const trigger = canvas.getByRole("combobox", { name: "Fruit" });
    await userEvent.tab();
    await expect(trigger).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    const listbox = await body.findByRole("listbox");
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(true);
    await userEvent.keyboard("{ArrowDown}{Enter}");
    await expect(args.onValueChange).toHaveBeenLastCalledWith("banana");
    await expect(listbox).not.toBeInTheDocument();
    await expect(trigger).toHaveTextContent("Banana");
    await expect(trigger).toHaveFocus();

    await userEvent.keyboard("{Enter}");
    await body.findByRole("listbox");
    await userEvent.keyboard("{ArrowDown}{Escape}");
    await expect(body.queryByRole("listbox")).toBeNull();
    await expect(trigger).toHaveTextContent("Banana");
    await expect(trigger).toHaveFocus();
  },
};

export const GroupsAndSeparators: Story = {
  render: (args) => (
    <Select {...args} defaultValue="carrot">
      <Labelled id="select-groups" label="Food">
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Fruits</SelectLabel>
            <SelectItem value="apple">Apple</SelectItem>
            <SelectItem value="banana">Banana</SelectItem>
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>Vegetables</SelectLabel>
            <SelectItem value="carrot">Carrot</SelectItem>
            <SelectItem value="leek">Leek</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Labelled>
    </Select>
  ),
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("combobox", { name: "Food" }));
    const listbox = within(await within(document.body).findByRole("listbox"));
    await expect(listbox.getByRole("group", { name: "Vegetables" })).toBeInTheDocument();
    await expect(listbox.getByRole("option", { name: "Carrot" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    await userEvent.keyboard("{Escape}");
  },
};

/** The keyboard skips the disabled item. */
export const DisabledItems: Story = {
  render: (args) => (
    <Select {...args}>
      <Labelled id="select-disabled-items" label="Plan">
        <SelectContent>
          <SelectItem value="free">Free</SelectItem>
          <SelectItem value="pro" disabled>
            Pro (sold out)
          </SelectItem>
          <SelectItem value="team">Team</SelectItem>
        </SelectContent>
      </Labelled>
    </Select>
  ),
  play: async ({ args, canvas }) => {
    canvas.getByRole("combobox", { name: "Plan" }).focus();
    await userEvent.keyboard("{Enter}");
    const listbox = within(await within(document.body).findByRole("listbox"));
    await expect(listbox.getByRole("option", { name: "Pro (sold out)" })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
    await userEvent.keyboard("{ArrowDown}{Enter}");
    await expect(args.onValueChange).toHaveBeenLastCalledWith("team");
  },
};

const timezones = Array.from({ length: 30 }, (_, index) => {
  const offset = index - 12;
  return `UTC${offset >= 0 ? "+" : "−"}${String(Math.abs(offset)).padStart(2, "0")}:00`;
});

export const Scrollable: Story = {
  render: (args) => (
    <Select {...args}>
      <div className="grid gap-2">
        <Label htmlFor="select-scroll">Time zone</Label>
        <SelectTrigger id="select-scroll" className="w-48">
          <SelectValue placeholder="Select a time zone" />
        </SelectTrigger>
      </div>
      <SelectContent className="max-h-64">
        {timezones.map((zone) => (
          <SelectItem key={zone} value={zone}>
            {zone}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  ),
  play: async ({ canvas }) => {
    canvas.getByRole("combobox", { name: "Time zone" }).focus();
    await userEvent.keyboard("{Enter}");
    const listbox = await within(document.body).findByRole("listbox");
    await expect(within(listbox).getAllByRole("option")).toHaveLength(timezones.length);
    await userEvent.keyboard("{End}{Enter}");
    await expect(canvas.getByRole("combobox", { name: "Time zone" })).toHaveTextContent(
      timezones.at(-1) ?? "",
    );
  },
};

export const Popper: Story = {
  render: (args) => (
    <Select {...args}>
      <div className="grid gap-2">
        <Label htmlFor="select-popper">Fruit</Label>
        <SelectTrigger id="select-popper" className="w-56">
          <SelectValue placeholder="Select a fruit" />
        </SelectTrigger>
      </div>
      <SelectContent position="popper" sideOffset={4}>
        {fruits.map((fruit) => (
          <SelectItem key={fruit} value={fruit.toLowerCase()}>
            {fruit}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-end gap-4">
      {(["sm", "default"] as const).map((size) => (
        <Select key={size} {...args}>
          <Labelled id={`select-size-${size}`} label={size} size={size}>
            {fruitItems}
          </Labelled>
        </Select>
      ))}
    </div>
  ),
};

export const Invalid: Story = {
  render: (args) => (
    <Select {...args}>
      <div className="grid gap-2">
        <Label htmlFor="select-invalid">Fruit</Label>
        <SelectTrigger
          id="select-invalid"
          className="w-48"
          aria-invalid
          aria-describedby="select-invalid-error"
        >
          <SelectValue placeholder="Select a fruit" />
        </SelectTrigger>
        <p id="select-invalid-error" className="text-destructive text-sm">
          Pick a fruit.
        </p>
      </div>
      {fruitItems}
    </Select>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("combobox", { name: "Fruit" })).toHaveAccessibleDescription(
      "Pick a fruit.",
    );
  },
};

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ args, canvas }) => {
    const trigger = canvas.getByRole("combobox", { name: "Fruit" });
    await expect(trigger).toBeDisabled();
    await userEvent.click(trigger, { pointerEventsCheck: 0 });
    await expect(args.onOpenChange).not.toHaveBeenCalled();
  },
};
