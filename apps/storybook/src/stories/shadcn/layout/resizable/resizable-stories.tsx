import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@aureus-core/ui/shadcn/resizable";
import { pressKey } from "@sb/testing/press-key";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, waitFor } from "storybook/test";
import { docs } from "./resizable-docs";

interface ResizableArgs {
  orientation: "horizontal" | "vertical";
  withHandle: boolean;
  onLayoutChange: (layout: unknown) => void;
}

// Panels scroll their content when it overflows (axe then requires a focusable region): keep the
// demo content smaller than the minimum panel size.
const pane = (label: string) => (
  <div className="flex items-center justify-center p-3 font-medium text-sm">{label}</div>
);

const meta = {
  title: "shadcn/Layout/Resizable",
  parameters: { aureusDocs: docs },
  args: { orientation: "horizontal", withHandle: true, onLayoutChange: fn() },
  argTypes: {
    orientation: {
      control: "inline-radio",
      options: ["horizontal", "vertical"],
      table: { category: "Appearance" },
    },
    withHandle: { control: "boolean", table: { category: "Appearance" } },
    onLayoutChange: { table: { category: "Events" } },
  },
  render: ({ orientation, withHandle, onLayoutChange }) => (
    // v4 sets an inline `height: 100%` on the group: size its parent, not the group.
    <div className="h-64 w-[36rem] rounded-lg border">
      <ResizablePanelGroup
        key={orientation}
        orientation={orientation}
        onLayoutChange={onLayoutChange}
      >
        <ResizablePanel defaultSize="50%" minSize="15%">
          {pane("Sidebar")}
        </ResizablePanel>
        <ResizableHandle withHandle={withHandle} aria-label="Resize sidebar" />
        <ResizablePanel defaultSize="50%" minSize="15%">
          {pane("Content")}
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  ),
} satisfies Meta<ResizableArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

const value = (handle: HTMLElement) => Number(handle.getAttribute("aria-valuenow"));

/** Arrow keys on the focused handle change the panel size; Home jumps to the minimum (15%). */
export const Playground: Story = {
  play: async ({ args, canvas }) => {
    const handle = canvas.getByRole("separator", { name: "Resize sidebar" });
    await waitFor(() => expect(value(handle)).toBe(50));
    await userEvent.tab();
    await expect(handle).toHaveFocus();
    await pressKey("ArrowRight", 2);
    await waitFor(() => expect(value(handle)).toBeGreaterThan(50));
    await expect(args.onLayoutChange).toHaveBeenCalled();
    await pressKey("Home");
    await waitFor(() => expect(value(handle)).toBe(15));
  },
};

export const Vertical: Story = {
  args: { orientation: "vertical" },
  play: async ({ canvas }) => {
    const handle = canvas.getByRole("separator", { name: "Resize sidebar" });
    await waitFor(() => expect(value(handle)).toBe(50));
    handle.focus();
    await pressKey("ArrowDown");
    await waitFor(() => expect(value(handle)).toBeGreaterThan(50));
  },
};

export const Nested: Story = {
  render: () => (
    <div className="h-72 w-[36rem] rounded-lg border">
      <ResizablePanelGroup orientation="horizontal">
        <ResizablePanel defaultSize="30%">{pane("Files")}</ResizablePanel>
        <ResizableHandle aria-label="Resize files" />
        <ResizablePanel defaultSize="70%">
          <ResizablePanelGroup orientation="vertical">
            <ResizablePanel defaultSize="65%">{pane("Editor")}</ResizablePanel>
            <ResizableHandle aria-label="Resize terminal" />
            <ResizablePanel defaultSize="35%">{pane("Terminal")}</ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getAllByRole("separator")).toHaveLength(2);
  },
};

/** The handle stops at `minSize` (20%) and `maxSize` (60%). */
export const WithMinSizes: Story = {
  render: () => (
    <div className="h-48 w-[36rem] rounded-lg border">
      <ResizablePanelGroup orientation="horizontal">
        <ResizablePanel defaultSize="40%" minSize="20%" maxSize="60%">
          {pane("20%–60%")}
        </ResizablePanel>
        <ResizableHandle withHandle aria-label="Resize panel" />
        <ResizablePanel defaultSize="60%">{pane("Rest")}</ResizablePanel>
      </ResizablePanelGroup>
    </div>
  ),
  play: async ({ canvas }) => {
    const handle = canvas.getByRole("separator", { name: "Resize panel" });
    handle.focus();
    await pressKey("Home");
    await waitFor(() => expect(value(handle)).toBe(20));
    await pressKey("End");
    await waitFor(() => expect(value(handle)).toBe(60));
  },
};
