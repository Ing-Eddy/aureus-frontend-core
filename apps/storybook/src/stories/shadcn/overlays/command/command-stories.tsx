import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@aureus-core/ui/shadcn/command";
import { Kbd } from "@aureus-core/ui/shadcn/kbd";
import { expectClosed, screen } from "@sb/testing/overlay";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  CalculatorIcon,
  CalendarIcon,
  CreditCardIcon,
  SettingsIcon,
  SmileIcon,
  UserIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { docs } from "./command-docs";

interface CommandArgs {
  loop: boolean;
  placeholder: string;
  onSelect: (value: string) => void;
}

function Palette({ onSelect, placeholder }: Pick<CommandArgs, "onSelect" | "placeholder">) {
  return (
    <>
      <CommandInput placeholder={placeholder} />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem value="calendar" onSelect={onSelect}>
            <CalendarIcon />
            Calendar
          </CommandItem>
          <CommandItem value="emoji" keywords={["smiley", "face"]} onSelect={onSelect}>
            <SmileIcon />
            Search emoji
          </CommandItem>
          <CommandItem value="calculator" disabled>
            <CalculatorIcon />
            Calculator (offline)
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Settings">
          <CommandItem value="profile" onSelect={onSelect}>
            <UserIcon />
            Profile
            <CommandShortcut>⌘P</CommandShortcut>
          </CommandItem>
          <CommandItem value="billing" onSelect={onSelect}>
            <CreditCardIcon />
            Billing
            <CommandShortcut>⌘B</CommandShortcut>
          </CommandItem>
          <CommandItem value="settings" onSelect={onSelect}>
            <SettingsIcon />
            Settings
            <CommandShortcut>⌘S</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </>
  );
}

/**
 * cmdk renders CommandSeparator as `role="separator"` inside the `role="listbox"`, and leaves the
 * listbox without options when nothing matches; both break axe `aria-required-children`. That is
 * cmdk's markup, not something a consumer can change through props, so the rule skips only the cmdk
 * list and keeps checking every other element.
 */
const a11y = {
  config: { rules: [{ id: "aria-required-children", selector: "[role]:not([cmdk-list])" }] },
};

const meta = {
  title: "shadcn/Overlays/Command",
  parameters: { aureusDocs: docs, a11y },
  args: { loop: false, placeholder: "Type a command or search…", onSelect: fn() },
  argTypes: {
    loop: { control: "boolean", table: { category: "Behavior" } },
    placeholder: { control: "text", table: { category: "Content" } },
    onSelect: { table: { category: "Events" } },
  },
  render: ({ loop, ...args }) => (
    <Command label="Command menu" loop={loop} className="w-96 rounded-lg border">
      <Palette {...args} />
    </Command>
  ),
} satisfies Meta<CommandArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

const option = (canvas: ReturnType<typeof within>, name: RegExp) =>
  canvas.getByRole("option", { name });

/** Typing filters (keywords match too); arrows move the highlight; Enter calls `onSelect`. */
export const Playground: Story = {
  play: async ({ args, canvas }) => {
    const input = canvas.getByRole("combobox", { name: "Command menu" });
    await userEvent.click(input);
    await userEvent.type(input, "smiley");
    await waitFor(() => expect(canvas.getAllByRole("option")).toHaveLength(1));
    await expect(option(canvas, /Search emoji/)).toHaveAttribute("aria-selected", "true");
    await userEvent.keyboard("{Enter}");
    await expect(args.onSelect).toHaveBeenLastCalledWith("emoji");

    await userEvent.clear(input);
    await userEvent.keyboard("{ArrowDown}{ArrowDown}");
    // The disabled Calculator is skipped: Calendar → Search emoji → Profile.
    await expect(option(canvas, /Profile/)).toHaveAttribute("aria-selected", "true");
    await userEvent.keyboard("{Enter}");
    await expect(args.onSelect).toHaveBeenLastCalledWith("profile");
  },
};

export const Empty: Story = {
  play: async ({ canvas }) => {
    await userEvent.type(canvas.getByRole("combobox", { name: "Command menu" }), "zzz");
    await expect(await canvas.findByText("No results found.")).toBeVisible();
  },
};

function DialogExample({ onSelect }: { onSelect: (value: string) => void }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((value) => !value);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);
  return (
    <>
      <p className="text-muted-foreground text-sm">
        Press <Kbd>⌘K</Kbd> or <Kbd>Ctrl K</Kbd> to open the palette.
      </p>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command label="Command palette">
          <Palette
            placeholder="Type a command or search…"
            onSelect={(value) => {
              onSelect(value);
              setOpen(false);
            }}
          />
        </Command>
      </CommandDialog>
    </>
  );
}

/** ⌘K opens the dialog with focus in the search; Enter runs the command and closes it. */
export const Dialog: Story = {
  render: ({ onSelect }) => <DialogExample onSelect={onSelect} />,
  play: async ({ args }) => {
    await userEvent.keyboard("{Meta>}k{/Meta}");
    const dialog = await screen().findByRole("dialog", { name: "Command Palette" });
    const input = within(dialog).getByRole("combobox", { name: "Command palette" });
    await waitFor(() => expect(input).toHaveFocus());
    await userEvent.type(input, "bill");
    await userEvent.keyboard("{Enter}");
    await expect(args.onSelect).toHaveBeenLastCalledWith("billing");
    await expectClosed();

    await userEvent.keyboard("{Control>}k{/Control}");
    await screen().findByRole("dialog");
    await userEvent.keyboard("{Escape}");
    await expectClosed();
  },
};
