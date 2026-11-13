import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@aureus-core/ui/shadcn/menubar";
import { expectClosed, screen } from "@sb/testing/overlay";
import { pressKey } from "@sb/testing/press-key";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, fn, userEvent, waitFor } from "storybook/test";
import { docs } from "./menubar-docs";

interface MenubarArgs {
  loop: boolean;
  onValueChange: (value: string) => void;
  onSelect: (item: string) => void;
}

function EditorMenubar({ loop, onValueChange, onSelect }: MenubarArgs) {
  const [wrap, setWrap] = useState(true);
  const [zoom, setZoom] = useState("100");
  return (
    <Menubar aria-label="Editor" loop={loop} onValueChange={onValueChange}>
      <MenubarMenu value="file">
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem onSelect={() => onSelect("new")}>
            New tab <MenubarShortcut>⌘T</MenubarShortcut>
          </MenubarItem>
          <MenubarItem onSelect={() => onSelect("open")}>
            Open… <MenubarShortcut>⌘O</MenubarShortcut>
          </MenubarItem>
          <MenubarSub>
            <MenubarSubTrigger>Share</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem onSelect={() => onSelect("share-email")}>Email link</MenubarItem>
              <MenubarItem onSelect={() => onSelect("share-copy")}>Copy link</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarSeparator />
          <MenubarItem disabled>Print… (no printer)</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu value="edit">
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarItem onSelect={() => onSelect("undo")}>
            Undo <MenubarShortcut>⌘Z</MenubarShortcut>
          </MenubarItem>
          <MenubarItem onSelect={() => onSelect("redo")}>
            Redo <MenubarShortcut>⇧⌘Z</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem variant="destructive" onSelect={() => onSelect("clear")}>
            Clear document
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu value="view">
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent>
          <MenubarCheckboxItem checked={wrap} onCheckedChange={setWrap}>
            Word wrap
          </MenubarCheckboxItem>
          <MenubarSeparator />
          <MenubarRadioGroup value={zoom} onValueChange={setZoom}>
            <MenubarRadioItem value="75">Zoom 75%</MenubarRadioItem>
            <MenubarRadioItem value="100">Zoom 100%</MenubarRadioItem>
            <MenubarRadioItem value="125">Zoom 125%</MenubarRadioItem>
          </MenubarRadioGroup>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}

const meta = {
  title: "shadcn/Overlays/Menubar",
  parameters: { aureusDocs: docs },
  args: { loop: true, onValueChange: fn(), onSelect: fn() },
  argTypes: {
    loop: { control: "boolean", table: { category: "Behavior" } },
    onValueChange: { table: { category: "Events" } },
    onSelect: { table: { category: "Events" } },
  },
  render: (args) => <EditorMenubar {...args} />,
} satisfies Meta<MenubarArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

const item = (name: string) => screen().getByRole("menuitem", { name: new RegExp(`^${name}`) });

/**
 * ← / → move across the bar; with a menu open, → opens the next one; ↓ and Enter pick an item;
 * Esc closes and returns focus to the bar.
 */
export const Playground: Story = {
  play: async ({ args, canvas }) => {
    const file = canvas.getByRole("menuitem", { name: "File" });
    await userEvent.tab();
    await expect(file).toHaveFocus();
    await pressKey("ArrowRight");
    await expect(canvas.getByRole("menuitem", { name: "Edit" })).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await screen().findByRole("menu");
    await expect(args.onValueChange).toHaveBeenLastCalledWith("edit");
    await pressKey("ArrowRight");
    await waitFor(() => expect(args.onValueChange).toHaveBeenLastCalledWith("view"));
    await pressKey("ArrowLeft");
    await waitFor(() => expect(args.onValueChange).toHaveBeenLastCalledWith("edit"));
    // A menu opened by moving across the bar focuses its panel; the first ↓ lands on the first item.
    await waitFor(() => expect(item("Undo")).toBeInTheDocument());
    await userEvent.keyboard("{ArrowDown}");
    await expect(item("Undo")).toHaveFocus();
    await userEvent.keyboard("{ArrowDown}{Enter}");
    await expect(args.onSelect).toHaveBeenLastCalledWith("redo");
    await expectClosed("menu");

    await userEvent.keyboard("{Enter}");
    await screen().findByRole("menu");
    await userEvent.keyboard("{Escape}");
    await expectClosed("menu");
    await waitFor(() => expect(canvas.getByRole("menuitem", { name: "Edit" })).toHaveFocus());
  },
};

/** Choosing a zoom level updates the radio group; the submenu opens with →. */
export const EditorMenus: Story = {
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole("menuitem", { name: "View" }));
    await userEvent.click(await screen().findByRole("menuitemradio", { name: "Zoom 125%" }));
    await expectClosed("menu");
    await userEvent.click(canvas.getByRole("menuitem", { name: "View" }));
    await expect(await screen().findByRole("menuitemradio", { name: "Zoom 125%" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
    await userEvent.keyboard("{Escape}");
    await expectClosed("menu");

    await userEvent.click(canvas.getByRole("menuitem", { name: "File" }));
    await screen().findByRole("menu");
    await userEvent.hover(item("Share"));
    await userEvent.click(await screen().findByRole("menuitem", { name: "Copy link" }));
    await expect(args.onSelect).toHaveBeenLastCalledWith("share-copy");
    await expectClosed("menu");
  },
};
