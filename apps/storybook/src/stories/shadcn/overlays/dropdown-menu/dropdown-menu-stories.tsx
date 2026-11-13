import { Avatar, AvatarFallback, AvatarImage } from "@aureus-core/ui/shadcn/avatar";
import { Button } from "@aureus-core/ui/shadcn/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@aureus-core/ui/shadcn/dropdown-menu";
import { currentUser } from "@fixtures/users";
import { expectClosed, screen } from "@sb/testing/overlay";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { LogOutIcon, MoreHorizontalIcon, SettingsIcon, UserIcon } from "lucide-react";
import { useState } from "react";
import { expect, fn, userEvent, waitFor } from "storybook/test";
import { docs } from "./dropdown-menu-docs";

interface MenuArgs {
  modal: boolean;
  align: "start" | "center" | "end";
  onOpenChange: (open: boolean) => void;
  onSelect: (item: string) => void;
}

const meta = {
  title: "shadcn/Overlays/Dropdown Menu",
  parameters: { aureusDocs: docs },
  args: { modal: true, align: "start", onOpenChange: fn(), onSelect: fn() },
  argTypes: {
    modal: { control: "boolean", table: { category: "Behavior" } },
    align: {
      control: "inline-radio",
      options: ["start", "center", "end"],
      table: { category: "Appearance" },
    },
    onOpenChange: { table: { category: "Events" } },
    onSelect: { table: { category: "Events" } },
  },
  render: ({ modal, align, onOpenChange, onSelect }) => (
    <DropdownMenu modal={modal} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" aria-label="Project actions">
          <MoreHorizontalIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className="w-48">
        <DropdownMenuItem onSelect={() => onSelect("rename")}>Rename</DropdownMenuItem>
        <DropdownMenuItem onSelect={() => onSelect("duplicate")}>
          Duplicate
          <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem disabled>Move to team (soon)</DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Share</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem onSelect={() => onSelect("share-email")}>Email link</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => onSelect("share-copy")}>Copy link</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onSelect={() => onSelect("delete")}>
          Delete
          <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
} satisfies Meta<MenuArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

const menuItem = (name: string) => screen().getByRole("menuitem", { name: new RegExp(`^${name}`) });

/**
 * The keyboard opens the menu; arrows skip the disabled item; Enter calls `onSelect`; → opens the
 * submenu; Esc closes and returns focus to the trigger.
 */
export const Playground: Story = {
  play: async ({ args, canvas }) => {
    const trigger = canvas.getByRole("button", { name: "Project actions" });
    trigger.focus();
    await userEvent.keyboard("{Enter}");
    await screen().findByRole("menu");
    await waitFor(() => expect(menuItem("Rename")).toHaveFocus());
    await userEvent.keyboard("{ArrowDown}");
    await expect(menuItem("Duplicate")).toHaveFocus();
    await userEvent.keyboard("{ArrowDown}");
    await expect(menuItem("Share")).toHaveFocus();
    await userEvent.keyboard("{ArrowRight}");
    await waitFor(() => expect(menuItem("Email link")).toHaveFocus());
    await userEvent.keyboard("{ArrowLeft}");
    await expect(menuItem("Share")).toHaveFocus();
    await userEvent.keyboard("{ArrowUp}{Enter}");
    await expect(args.onSelect).toHaveBeenLastCalledWith("duplicate");
    await expectClosed("menu");
    await expect(trigger).toHaveFocus();

    await userEvent.keyboard("{Enter}");
    await screen().findByRole("menu");
    await userEvent.keyboard("{Escape}");
    await expectClosed("menu");
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(false);
    await expect(trigger).toHaveFocus();
  },
};

function CheckboxExample() {
  const [statusBar, setStatusBar] = useState(true);
  const [activityBar, setActivityBar] = useState(false);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">View</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Appearance</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem checked={statusBar} onCheckedChange={setStatusBar}>
          Status bar
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem checked={activityBar} onCheckedChange={setActivityBar}>
          Activity bar
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem disabled>Panel (unavailable)</DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export const CheckboxItems: Story = {
  render: () => <CheckboxExample />,
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "View" }));
    const activity = await screen().findByRole("menuitemcheckbox", { name: "Activity bar" });
    await expect(activity).toHaveAttribute("aria-checked", "false");
    await userEvent.click(activity);
    await expectClosed("menu");
    await userEvent.click(canvas.getByRole("button", { name: "View" }));
    await expect(
      await screen().findByRole("menuitemcheckbox", { name: "Activity bar" }),
    ).toHaveAttribute("aria-checked", "true");
    await userEvent.keyboard("{Escape}");
    await expectClosed("menu");
  },
};

function RadioExample({ onValueChange }: { onValueChange: (value: string) => void }) {
  const [position, setPosition] = useState("bottom");
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Panel position: {position}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Panel position</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={position}
          onValueChange={(value) => {
            setPosition(value);
            onValueChange(value);
          }}
        >
          <DropdownMenuRadioItem value="top">Top</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="bottom">Bottom</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="right">Right</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/** Choosing a radio item calls `onValueChange` with its value. */
export const RadioItems: Story = {
  render: ({ onSelect }) => <RadioExample onValueChange={onSelect} />,
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: /Panel position/ }));
    await userEvent.click(await screen().findByRole("menuitemradio", { name: "Right" }));
    await expect(args.onSelect).toHaveBeenLastCalledWith("right");
    await expectClosed("menu");
    await expect(canvas.getByRole("button", { name: "Panel position: right" })).toBeVisible();
  },
};

/** Hovering the sub-trigger opens the submenu; choosing an item there calls `onSelect`. */
export const Submenu: Story = {
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Project actions" }));
    await screen().findByRole("menu");
    await userEvent.hover(menuItem("Share"));
    await userEvent.click(await screen().findByRole("menuitem", { name: "Copy link" }));
    await expect(args.onSelect).toHaveBeenLastCalledWith("share-copy");
    await expectClosed("menu");
  },
};

export const UserMenu: Story = {
  render: ({ onSelect }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-auto gap-2 px-2">
          <Avatar className="size-6">
            <AvatarImage src={currentUser.avatar} alt="" />
            <AvatarFallback>{currentUser.initials}</AvatarFallback>
          </Avatar>
          {currentUser.name}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel>
          <span className="block">{currentUser.name}</span>
          <span className="block font-normal text-muted-foreground text-xs">
            {currentUser.email}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onSelect={() => onSelect("profile")}>
            <UserIcon />
            Profile
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => onSelect("settings")}>
            <SettingsIcon />
            Settings
            <DropdownMenuShortcut>⌘,</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onSelect={() => onSelect("logout")}>
          <LogOutIcon />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: /Ada Lovelace/ }));
    await screen().findByRole("menu");
    await userEvent.keyboard("lo");
    await expect(menuItem("Log out")).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await expect(args.onSelect).toHaveBeenLastCalledWith("logout");
    // Wait for the menu to unmount: while open, Radix hides the page with aria-hidden.
    await expectClosed("menu");
  },
};
