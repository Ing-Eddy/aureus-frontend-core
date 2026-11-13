import { ScrollArea, ScrollBar } from "@aureus-core/ui/shadcn/scroll-area";
import { Separator } from "@aureus-core/ui/shadcn/separator";
import { images } from "@fixtures/files";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Fragment } from "react";
import { expect, userEvent } from "storybook/test";
import { docs } from "./scroll-area-docs";

/**
 * Radix does not make the viewport focusable, so text-only content cannot be scrolled with the
 * keyboard (axe `scrollable-region-focusable`), and ScrollArea does not forward props to it. A ref
 * on the root makes it a tab stop, as a consumer would.
 */
const focusableViewport = (root: HTMLDivElement | null) =>
  root?.querySelector('[data-slot="scroll-area-viewport"]')?.setAttribute("tabindex", "0");

const gridRows = Array.from({ length: 30 }, (_, row) => ({
  id: `row-${row}`,
  text: Array.from({ length: 12 }, (_, column) => `r${row}c${column}`).join("  "),
}));

const tags = Array.from({ length: 40 }, (_, index) => `v1.2.0-beta.${40 - index}`);

interface ScrollArgs {
  type: "auto" | "always" | "scroll" | "hover";
}

const meta = {
  title: "shadcn/Layout/Scroll Area",
  parameters: { aureusDocs: docs },
  args: { type: "hover" },
  argTypes: {
    type: {
      control: "inline-radio",
      options: ["auto", "always", "scroll", "hover"],
      table: { category: "Behavior" },
    },
  },
  render: ({ type }) => (
    <ScrollArea
      ref={focusableViewport}
      type={type}
      className="h-72 w-48 rounded-md border"
      aria-label="Release tags"
    >
      <div className="p-4">
        <h4 className="mb-4 font-medium text-sm leading-none">Tags</h4>
        {tags.map((tag) => (
          <Fragment key={tag}>
            <div className="text-sm">{tag}</div>
            <Separator className="my-2" />
          </Fragment>
        ))}
      </div>
    </ScrollArea>
  ),
} satisfies Meta<ScrollArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

const viewport = (root: HTMLElement) =>
  root.querySelector<HTMLElement>('[data-slot="scroll-area-viewport"]') as HTMLElement;

/**
 * The content overflows and the viewport is a tab stop, so the browser's native keyboard scrolling
 * applies (synthetic key events cannot trigger native scrolling, so that part is not asserted).
 */
export const Playground: Story = {
  play: async ({ canvasElement }) => {
    const element = viewport(canvasElement);
    await expect(element.scrollHeight).toBeGreaterThan(element.clientHeight);
    await userEvent.tab();
    await expect(element).toHaveFocus();
  },
};

export const Horizontal: Story = {
  render: () => (
    <ScrollArea
      ref={focusableViewport}
      className="w-96 whitespace-nowrap rounded-md border"
      aria-label="Photos"
    >
      <div className="flex w-max gap-4 p-4">
        {images.map((image) => (
          <figure key={image.src} className="shrink-0">
            <img src={image.src} alt={image.alt} className="h-32 w-48 rounded-md object-cover" />
            <figcaption className="pt-2 text-muted-foreground text-xs">{image.alt}</figcaption>
          </figure>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  ),
  play: async ({ canvasElement }) => {
    const element = viewport(canvasElement);
    await expect(element.scrollWidth).toBeGreaterThan(element.clientWidth);
  },
};

export const Both: Story = {
  render: () => (
    <ScrollArea
      ref={focusableViewport}
      type="always"
      className="h-48 w-72 rounded-md border"
      aria-label="Wide table"
    >
      <div className="w-[40rem] p-4 font-mono text-xs">
        {gridRows.map((row) => (
          <div key={row.id}>{row.text}</div>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  ),
};
