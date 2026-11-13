import { DirectionProvider, useDirection } from "@aureus-core/ui/shadcn/direction";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@aureus-core/ui/shadcn/tabs";
import { pressKey } from "@sb/testing/press-key";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent } from "storybook/test";
import { docs } from "./direction-docs";

interface DirectionArgs {
  direction: "ltr" | "rtl";
}

function DirectionDemo({ direction }: DirectionArgs) {
  return (
    <div dir={direction} lang={direction === "rtl" ? "ar" : "en"} data-testid="region">
      <DirectionProvider dir={direction}>
        <Tabs defaultValue="one" className="w-80">
          <TabsList aria-label={direction === "rtl" ? "الأقسام" : "Sections"}>
            <TabsTrigger value="one">{direction === "rtl" ? "الأول" : "First"}</TabsTrigger>
            <TabsTrigger value="two">{direction === "rtl" ? "الثاني" : "Second"}</TabsTrigger>
            <TabsTrigger value="three">{direction === "rtl" ? "الثالث" : "Third"}</TabsTrigger>
          </TabsList>
          <TabsContent value="one" className="p-2 text-sm">
            {direction === "rtl" ? "المحتوى الأول" : "First panel"}
          </TabsContent>
          <TabsContent value="two" className="p-2 text-sm">
            {direction === "rtl" ? "المحتوى الثاني" : "Second panel"}
          </TabsContent>
          <TabsContent value="three" className="p-2 text-sm">
            {direction === "rtl" ? "المحتوى الثالث" : "Third panel"}
          </TabsContent>
        </Tabs>
      </DirectionProvider>
    </div>
  );
}

const meta = {
  title: "shadcn/Layout/Direction",
  parameters: { aureusDocs: docs },
  args: { direction: "rtl" },
  argTypes: {
    direction: {
      control: "inline-radio",
      options: ["ltr", "rtl"],
      table: { category: "Behavior" },
    },
  },
  render: (args) => <DirectionDemo {...args} />,
} satisfies Meta<DirectionArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The region renders with `dir="rtl"`, and ← moves to the next tab, following the reading direction. */
export const Playground: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByTestId("region")).toHaveAttribute("dir", "rtl");
    await userEvent.tab();
    await expect(canvas.getByRole("tab", { name: "الأول" })).toHaveFocus();
    await pressKey("ArrowLeft");
    await expect(canvas.getByRole("tab", { name: "الثاني" })).toHaveFocus();
  },
};

export const RightToLeft: Story = {};

function ReadDirectionExample() {
  const direction = useDirection();
  return <p className="text-sm">useDirection() → {direction}</p>;
}

export const ReadDirection: Story = {
  render: () => (
    <DirectionProvider dir="rtl">
      <ReadDirectionExample />
    </DirectionProvider>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByText("useDirection() → rtl")).toBeVisible();
  },
};
