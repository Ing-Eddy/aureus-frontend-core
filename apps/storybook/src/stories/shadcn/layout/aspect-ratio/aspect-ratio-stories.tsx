import { AspectRatio } from "@aureus-core/ui/shadcn/aspect-ratio";
import { asset } from "@fixtures/asset";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { docs } from "./aspect-ratio-docs";

const meta = {
  title: "shadcn/Layout/Aspect Ratio",
  component: AspectRatio,
  parameters: { aureusDocs: docs },
  args: { ratio: 16 / 9 },
  argTypes: {
    ratio: { control: { type: "number", step: 0.1 }, table: { category: "Appearance" } },
  },
  render: (args) => (
    <div className="w-80 overflow-hidden rounded-lg">
      <AspectRatio {...args}>
        <img
          src={asset("/images/desert.svg")}
          alt="Desert dunes at noon"
          className="size-full object-cover"
        />
      </AspectRatio>
    </div>
  ),
} satisfies Meta<typeof AspectRatio>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The box keeps the ratio: 320px wide at 16:9 is 180px tall. */
export const Playground: Story = {
  play: async ({ canvas }) => {
    const image = canvas.getByRole("img", { name: "Desert dunes at noon" });
    const box = image.parentElement?.getBoundingClientRect();
    await expect(Math.round(box?.height ?? 0)).toBe(180);
  },
};

export const Ratios: Story = {
  render: () => (
    <div className="flex items-start gap-4">
      {[
        { label: "16:9", ratio: 16 / 9 },
        { label: "4:3", ratio: 4 / 3 },
        { label: "1:1", ratio: 1 },
      ].map(({ label, ratio }) => (
        <figure key={label} className="grid w-40 gap-1">
          <div className="overflow-hidden rounded-md">
            <AspectRatio ratio={ratio}>
              <img src={asset("/images/forest.svg")} alt="" className="size-full object-cover" />
            </AspectRatio>
          </div>
          <figcaption className="text-muted-foreground text-xs">{label}</figcaption>
        </figure>
      ))}
    </div>
  ),
};

export const Video: Story = {
  render: () => (
    <figure className="grid w-96 gap-2">
      <AspectRatio
        ratio={16 / 9}
        className="flex items-center justify-center rounded-lg bg-muted text-muted-foreground text-sm"
      >
        Video player
      </AspectRatio>
      <figcaption className="text-muted-foreground text-sm">Product tour · 2:14</figcaption>
    </figure>
  ),
};
