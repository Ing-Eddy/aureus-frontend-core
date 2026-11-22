import { Separator } from "@aureus-core/ui/shadcn/separator";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { docs } from "./separator-docs";

const meta = {
  title: "shadcn/Layout/Separator",
  component: Separator,
  parameters: { aureusDocs: docs },
  args: { orientation: "horizontal", decorative: true },
  argTypes: {
    orientation: {
      control: "inline-radio",
      options: ["horizontal", "vertical"],
      table: { category: "Appearance" },
    },
    decorative: { control: "boolean", table: { category: "Behavior" } },
  },
  render: (args) => (
    <div
      className={
        args.orientation === "vertical" ? "flex h-12 items-center gap-4" : "grid w-72 gap-4"
      }
    >
      <div className="text-sm">
        <p className="font-medium">Aureus Frontend Kit</p>
        <p className="text-muted-foreground">Shared frontend resources.</p>
      </div>
      <Separator {...args} />
      <p className="text-sm">Docs · Source · Releases</p>
    </div>
  ),
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Decorative by default: no separator role is exposed. */
export const Playground: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole("separator")).toBeNull();
  },
};

export const Vertical: Story = {
  render: () => (
    <nav aria-label="Project" className="flex h-5 items-center gap-4 text-sm">
      <a href="#blog">Blog</a>
      <Separator orientation="vertical" />
      <a href="#docs">Docs</a>
      <Separator orientation="vertical" />
      <a href="#source">Source</a>
    </nav>
  ),
};

export const Semantic: Story = {
  args: { decorative: false },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("separator")).toBeInTheDocument();
  },
};
