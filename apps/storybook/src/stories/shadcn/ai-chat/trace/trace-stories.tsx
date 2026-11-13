import { CodeBlock, CodeBlockContent } from "@aureus-core/ui/shadcn/code-block";
import {
  Trace,
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceDescription,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from "@aureus-core/ui/shadcn/trace";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { CircleAlertIcon, FileTextIcon, GlobeIcon, SearchIcon, WrenchIcon } from "lucide-react";
import { expect, fn, userEvent } from "storybook/test";
import { docs } from "./trace-docs";

/**
 * Upstream TraceDescription uses `text-muted-foreground/70` (2.9:1) and pending lines `opacity-60`
 * (2.4:1). Both accept `className`, so the stories restore full-strength muted text, as a
 * consumer should (see the docs' Accessibility notes).
 */
const readableDescription = "text-muted-foreground";
const readablePending = "data-[status=pending]:opacity-100";

interface TraceArgs {
  defaultOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const meta = {
  title: "shadcn/AI & Chat/Trace",
  parameters: { aureusDocs: docs },
  args: { defaultOpen: false, onOpenChange: fn() },
  argTypes: {
    defaultOpen: { control: "boolean", table: { category: "State" } },
    onOpenChange: { table: { category: "Events" } },
  },
  render: ({ defaultOpen, onOpenChange }) => (
    <Trace className="w-[28rem]">
      <TraceCollapsible
        key={String(defaultOpen)}
        defaultOpen={defaultOpen}
        onOpenChange={onOpenChange}
      >
        <TraceCollapsibleTrigger>
          <TraceLine>
            <TraceIcon>
              <SearchIcon />
            </TraceIcon>
            <TraceTitle>Searched the docs</TraceTitle>
            <TraceDescription className={readableDescription}>3 results</TraceDescription>
          </TraceLine>
        </TraceCollapsibleTrigger>
        <TraceCollapsibleContent>
          <Trace className="ps-6">
            {["getting-started.mdx", "theming.mdx", "dark-mode.mdx"].map((file) => (
              <TraceLine key={file}>
                <TraceIcon>
                  <FileTextIcon />
                </TraceIcon>
                <TraceTitle>{file}</TraceTitle>
              </TraceLine>
            ))}
          </Trace>
        </TraceCollapsibleContent>
      </TraceCollapsible>
    </Trace>
  ),
} satisfies Meta<TraceArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Enter expands the step and reveals its detail; Space collapses it again. */
export const Playground: Story = {
  play: async ({ args, canvas }) => {
    const trigger = canvas.getByRole("button", { name: /Searched the docs/ });
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await userEvent.tab();
    await expect(trigger).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await expect(canvas.getByText("theming.mdx")).toBeInTheDocument();
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(true);
    await userEvent.keyboard(" ");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
  },
};

export const Steps: Story = {
  render: () => (
    <Trace className="w-[28rem]">
      <TraceLine>
        <TraceIcon>
          <GlobeIcon />
        </TraceIcon>
        <TraceTitle>Read aureus.dev/pricing</TraceTitle>
        <TraceDescription className={readableDescription}>0.8 s</TraceDescription>
      </TraceLine>
      <TraceLine status="running">
        <TraceIcon>
          <WrenchIcon />
        </TraceIcon>
        <TraceTitle>Running get_invoices…</TraceTitle>
      </TraceLine>
      <TraceLine status="pending" className={readablePending}>
        <TraceIcon>
          <FileTextIcon />
        </TraceIcon>
        <TraceTitle>Write summary (pending)</TraceTitle>
      </TraceLine>
    </Trace>
  ),
  play: async ({ canvasElement }) => {
    const statuses = [...canvasElement.querySelectorAll('[data-slot="trace-line"]')].map((line) =>
      line.getAttribute("data-status"),
    );
    await expect(statuses).toEqual([null, "running", "pending"]);
  },
};

export const Nested: Story = { args: { defaultOpen: true } };

export const WithError: Story = {
  render: () => (
    <Trace className="w-[28rem]">
      <TraceCollapsible defaultOpen>
        <TraceCollapsibleTrigger>
          <TraceLine status="error">
            <TraceIcon>
              <CircleAlertIcon />
            </TraceIcon>
            <TraceTitle>Failed: run_migration</TraceTitle>
            <TraceDescription className={readableDescription}>exit code 1</TraceDescription>
          </TraceLine>
        </TraceCollapsibleTrigger>
        <TraceCollapsibleContent>
          <CodeBlock variant="destructive" size="sm" className="mt-2">
            <CodeBlockContent aria-label="Migration error">
              {'ERROR: relation "users" already exists'}
            </CodeBlockContent>
          </CodeBlock>
        </TraceCollapsibleContent>
      </TraceCollapsible>
    </Trace>
  ),
};
