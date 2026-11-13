import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@aureus-core/ui/shadcn/context-menu";
import { expectClosed, screen } from "@sb/testing/overlay";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, fn, userEvent, waitFor } from "storybook/test";
import { docs } from "./context-menu-docs";

interface MenuArgs {
  modal: boolean;
  disabled: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (item: string) => void;
}

const area = "flex h-36 w-72 items-center justify-center rounded-lg border border-dashed text-sm";

const meta = {
  title: "shadcn/Overlays/Context Menu",
  parameters: { aureusDocs: docs },
  args: { modal: true, disabled: false, onOpenChange: fn(), onSelect: fn() },
  argTypes: {
    modal: { control: "boolean", table: { category: "Behavior" } },
    disabled: { control: "boolean", table: { category: "State" } },
    onOpenChange: { table: { category: "Events" } },
    onSelect: { table: { category: "Events" } },
  },
  render: ({ modal, disabled, onOpenChange, onSelect }) => (
    <ContextMenu modal={modal} onOpenChange={onOpenChange}>
      <ContextMenuTrigger disabled={disabled} className={area}>
        Right-click here
      </ContextMenuTrigger>
      <ContextMenuContent className="w-52">
        <ContextMenuItem onSelect={() => onSelect("back")}>
          Back
          <ContextMenuShortcut>⌘[</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem disabled>
          Forward
          <ContextMenuShortcut>⌘]</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem onSelect={() => onSelect("reload")}>
          Reload
          <ContextMenuShortcut>⌘R</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuSub>
          <ContextMenuSubTrigger>More tools</ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-44">
            <ContextMenuItem onSelect={() => onSelect("save-page")}>Save page…</ContextMenuItem>
            <ContextMenuItem onSelect={() => onSelect("dev-tools")}>
              Developer tools
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuSeparator />
        <ContextMenuItem variant="destructive" onSelect={() => onSelect("delete")}>
          Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
} satisfies Meta<MenuArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

const menuItem = (name: string) => screen().getByRole("menuitem", { name: new RegExp(`^${name}`) });

/** Right-click opens the menu; arrows skip the disabled item; → opens the submenu; Enter selects. */
export const Playground: Story = {
  play: async ({ args, canvas }) => {
    await userEvent.pointer({ keys: "[MouseRight]", target: canvas.getByText("Right-click here") });
    await screen().findByRole("menu");
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(true);
    await userEvent.keyboard("{ArrowDown}");
    await expect(menuItem("Back")).toHaveFocus();
    await userEvent.keyboard("{ArrowDown}");
    await expect(menuItem("Reload")).toHaveFocus();
    await userEvent.keyboard("{ArrowDown}{ArrowRight}");
    await waitFor(() => expect(menuItem("Save page")).toHaveFocus());
    await userEvent.keyboard("{Enter}");
    await expect(args.onSelect).toHaveBeenLastCalledWith("save-page");
    await expectClosed("menu");

    await userEvent.pointer({ keys: "[MouseRight]", target: canvas.getByText("Right-click here") });
    await screen().findByRole("menu");
    await userEvent.keyboard("{Escape}");
    await expectClosed("menu");
  },
};

function CheckboxAndRadioExample() {
  const [bookmarks, setBookmarks] = useState(true);
  const [person, setPerson] = useState("pedro");
  return (
    <ContextMenu>
      <ContextMenuTrigger className={area}>Right-click for view options</ContextMenuTrigger>
      <ContextMenuContent className="w-56">
        <ContextMenuCheckboxItem checked={bookmarks} onCheckedChange={setBookmarks}>
          Show bookmarks
        </ContextMenuCheckboxItem>
        <ContextMenuCheckboxItem>Show full URLs</ContextMenuCheckboxItem>
        <ContextMenuSeparator />
        <ContextMenuLabel inset>People</ContextMenuLabel>
        <ContextMenuRadioGroup value={person} onValueChange={setPerson}>
          <ContextMenuRadioItem value="pedro">Pedro Duarte</ContextMenuRadioItem>
          <ContextMenuRadioItem value="colm">Colm Tuite</ContextMenuRadioItem>
        </ContextMenuRadioGroup>
      </ContextMenuContent>
    </ContextMenu>
  );
}

export const CheckboxAndRadio: Story = {
  render: () => <CheckboxAndRadioExample />,
  play: async ({ canvas }) => {
    const target = canvas.getByText("Right-click for view options");
    await userEvent.pointer({ keys: "[MouseRight]", target });
    await userEvent.click(await screen().findByRole("menuitemradio", { name: "Colm Tuite" }));
    await expectClosed("menu");
    await userEvent.pointer({ keys: "[MouseRight]", target });
    await expect(
      await screen().findByRole("menuitemradio", { name: "Colm Tuite" }),
    ).toHaveAttribute("aria-checked", "true");
    await expect(
      screen().getByRole("menuitemcheckbox", { name: "Show bookmarks" }),
    ).toHaveAttribute("aria-checked", "true");
    await userEvent.keyboard("{Escape}");
    await expectClosed("menu");
  },
};

/** A disabled trigger lets the native menu through: the custom menu never opens. */
export const DisabledTrigger: Story = {
  args: { disabled: true },
  play: async ({ args, canvas }) => {
    await userEvent.pointer({ keys: "[MouseRight]", target: canvas.getByText("Right-click here") });
    await expect(screen().queryByRole("menu")).toBeNull();
    await expect(args.onOpenChange).not.toHaveBeenCalled();
  },
};
