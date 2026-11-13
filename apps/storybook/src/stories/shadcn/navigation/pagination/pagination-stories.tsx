import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@aureus-core/ui/shadcn/pagination";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { type MouseEvent, useState } from "react";
import { expect, fn, userEvent } from "storybook/test";
import { docs } from "./pagination-docs";

interface PaginationArgs {
  total: number;
  initialPage: number;
  onPageChange: (page: number) => void;
}

/** Page numbers to show: first, last, the current page and its neighbours, with gaps. */
function pageWindow(current: number, total: number): (number | "gap")[] {
  const pages = new Set([1, total, current - 1, current, current + 1]);
  const sorted = [...pages].filter((page) => page >= 1 && page <= total).sort((a, b) => a - b);
  return sorted.flatMap((page, index) => {
    const previous = sorted[index - 1];
    return previous !== undefined && page - previous > 1 ? (["gap", page] as const) : [page];
  });
}

function ControlledPagination({ total, initialPage, onPageChange }: PaginationArgs) {
  const [page, setPage] = useState(initialPage);
  const go = (next: number) => (event: MouseEvent) => {
    event.preventDefault();
    if (next < 1 || next > total) return;
    setPage(next);
    onPageChange(next);
  };
  const edge = (disabled: boolean) =>
    disabled ? { "aria-disabled": true, className: "pointer-events-none opacity-50" } : {};
  return (
    <div className="grid gap-4">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href={`#page-${page - 1}`}
              onClick={go(page - 1)}
              {...edge(page === 1)}
            />
          </PaginationItem>
          {pageWindow(page, total).map((item, index) =>
            item === "gap" ? (
              // biome-ignore lint/suspicious/noArrayIndexKey: gaps have no identity of their own.
              <PaginationItem key={`gap-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem key={item}>
                <PaginationLink href={`#page-${item}`} isActive={item === page} onClick={go(item)}>
                  {item}
                </PaginationLink>
              </PaginationItem>
            ),
          )}
          <PaginationItem>
            <PaginationNext
              href={`#page-${page + 1}`}
              onClick={go(page + 1)}
              {...edge(page === total)}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      <p className="text-center text-muted-foreground text-sm" aria-live="polite">
        Page {page} of {total}
      </p>
    </div>
  );
}

const meta = {
  title: "shadcn/Navigation/Pagination",
  parameters: { aureusDocs: docs },
  args: { total: 10, initialPage: 1, onPageChange: fn() },
  argTypes: {
    total: { control: { type: "number", min: 1, max: 50 }, table: { category: "Content" } },
    initialPage: { control: { type: "number", min: 1 }, table: { category: "State" } },
    onPageChange: { table: { category: "Events" } },
  },
  render: (args) => <ControlledPagination key={`${args.total}-${args.initialPage}`} {...args} />,
} satisfies Meta<PaginationArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The active page has `aria-current`; Next moves forward; Previous is disabled on page 1. */
export const Playground: Story = {
  play: async ({ args, canvas }) => {
    await expect(canvas.getByRole("navigation", { name: "pagination" })).toBeInTheDocument();
    await expect(canvas.getByRole("link", { name: "1" })).toHaveAttribute("aria-current", "page");
    await expect(canvas.getByRole("link", { name: "Go to previous page" })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
    await userEvent.click(canvas.getByRole("link", { name: "Go to next page" }));
    await expect(args.onPageChange).toHaveBeenLastCalledWith(2);
    await expect(canvas.getByRole("link", { name: "2" })).toHaveAttribute("aria-current", "page");
    await expect(canvas.getByText("Page 2 of 10")).toBeVisible();
  },
};

export const WithEllipsis: Story = {
  args: { initialPage: 5, total: 20 },
  play: async ({ canvas }) => {
    await expect(canvas.getAllByText("More pages")).toHaveLength(2);
    await expect(canvas.getByRole("link", { name: "5" })).toHaveAttribute("aria-current", "page");
  },
};

/** Clicking a page number and then the last page updates the active link. */
export const Controlled: Story = {
  args: { total: 7 },
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole("link", { name: "2" }));
    await userEvent.click(canvas.getByRole("link", { name: "7" }));
    await expect(args.onPageChange).toHaveBeenLastCalledWith(7);
    await expect(canvas.getByRole("link", { name: "Go to next page" })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
  },
};
