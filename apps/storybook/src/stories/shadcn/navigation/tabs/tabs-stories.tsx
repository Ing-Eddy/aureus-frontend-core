import { Button } from "@aureus-core/ui/shadcn/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@aureus-core/ui/shadcn/tabs";
import { pressKey } from "@sb/testing/press-key";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, fn, userEvent } from "storybook/test";
import { docs } from "./tabs-docs";

interface TabsArgs {
  variant: "default" | "line";
  orientation: "horizontal" | "vertical";
  activationMode: "automatic" | "manual";
  onValueChange: (value: string) => void;
}

const sections = [
  { value: "overview", label: "Overview", body: "Visitors grew 12% this month." },
  { value: "analytics", label: "Analytics", body: "Most traffic comes from search." },
  { value: "reports", label: "Reports", body: "3 reports are scheduled for Monday." },
] as const;

function DemoTabs({
  variant,
  orientation,
  activationMode,
  onValueChange,
  disabled,
}: TabsArgs & { disabled?: string }) {
  return (
    <Tabs
      defaultValue="overview"
      orientation={orientation}
      activationMode={activationMode}
      onValueChange={onValueChange}
      className="w-96"
    >
      <TabsList variant={variant} aria-label="Dashboard sections">
        {sections.map((section) => (
          <TabsTrigger
            key={section.value}
            value={section.value}
            disabled={section.value === disabled}
          >
            {section.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {sections.map((section) => (
        <TabsContent key={section.value} value={section.value} className="p-2 text-sm">
          {section.body}
        </TabsContent>
      ))}
    </Tabs>
  );
}

const meta = {
  title: "shadcn/Navigation/Tabs",
  parameters: { aureusDocs: docs },
  args: {
    variant: "default",
    orientation: "horizontal",
    activationMode: "automatic",
    onValueChange: fn(),
  },
  argTypes: {
    variant: {
      control: "inline-radio",
      options: ["default", "line"],
      table: { category: "Appearance" },
    },
    orientation: {
      control: "inline-radio",
      options: ["horizontal", "vertical"],
      table: { category: "Appearance" },
    },
    activationMode: {
      control: "inline-radio",
      options: ["automatic", "manual"],
      table: { category: "Behavior" },
    },
    onValueChange: { table: { category: "Events" } },
  },
  render: (args) => <DemoTabs {...args} />,
} satisfies Meta<TabsArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Arrow keys move between tabs and activate their panels; Tab then enters the panel. */
export const Playground: Story = {
  play: async ({ args, canvas }) => {
    await userEvent.tab();
    await expect(canvas.getByRole("tab", { name: "Overview" })).toHaveFocus();
    await pressKey("ArrowRight");
    const analytics = canvas.getByRole("tab", { name: "Analytics" });
    await expect(analytics).toHaveFocus();
    await expect(analytics).toHaveAttribute("aria-selected", "true");
    await expect(args.onValueChange).toHaveBeenLastCalledWith("analytics");
    await expect(canvas.getByRole("tabpanel")).toHaveTextContent("Most traffic comes from search.");
    await pressKey("End");
    await expect(canvas.getByRole("tab", { name: "Reports" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    await userEvent.tab();
    await expect(canvas.getByRole("tabpanel")).toHaveFocus();
  },
};

export const Line: Story = { args: { variant: "line" } };

/**
 * Upstream limitation: the shadcn Tabs keeps `orientation` for its own styling and does not pass it
 * to Radix, so vertical tabs still navigate with ← / → (and the tablist reports horizontal).
 */
export const Vertical: Story = {
  args: { orientation: "vertical" },
  play: async ({ canvas }) => {
    await userEvent.tab();
    await pressKey("ArrowRight");
    await expect(canvas.getByRole("tab", { name: "Analytics" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  },
};

export const DisabledTab: Story = {
  render: (args) => <DemoTabs {...args} disabled="analytics" />,
  play: async ({ canvas }) => {
    await userEvent.tab();
    await pressKey("ArrowRight");
    await expect(canvas.getByRole("tab", { name: "Reports" })).toHaveFocus();
    await expect(canvas.getByRole("tab", { name: "Analytics" })).toBeDisabled();
  },
};

/** In manual mode the arrow keys only move focus; Enter activates the focused tab. */
export const ManualActivation: Story = {
  args: { activationMode: "manual" },
  play: async ({ canvas }) => {
    await userEvent.tab();
    await pressKey("ArrowRight");
    const analytics = canvas.getByRole("tab", { name: "Analytics" });
    await expect(analytics).toHaveFocus();
    await expect(analytics).toHaveAttribute("aria-selected", "false");
    await userEvent.keyboard("{Enter}");
    await expect(analytics).toHaveAttribute("aria-selected", "true");
  },
};

function ControlledExample() {
  const [tab, setTab] = useState("account");
  return (
    <div className="grid w-96 gap-3">
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList aria-label="Profile">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
        </TabsList>
        <TabsContent value="account" className="p-2 text-sm">
          Account details.
        </TabsContent>
        <TabsContent value="password" className="p-2 text-sm">
          Change your password.
        </TabsContent>
      </Tabs>
      <Button variant="outline" size="sm" onClick={() => setTab("password")}>
        Go to password
      </Button>
    </div>
  );
}

export const Controlled: Story = {
  render: () => <ControlledExample />,
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Go to password" }));
    await expect(canvas.getByRole("tab", { name: "Password" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  },
};
