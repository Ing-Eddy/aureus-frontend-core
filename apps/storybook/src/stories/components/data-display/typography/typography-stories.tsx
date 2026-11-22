import {
  Typography,
  type TypographyAlign,
  type TypographyElement,
  type TypographyLineClamp,
  type TypographyTone,
  type TypographyVariant,
  type TypographyWeight,
  type TypographyWrap,
  typographyElements,
  typographyVariants,
} from "@aureus-core/ui/components/typography";
import { Card, CardContent } from "@aureus-core/ui/shadcn/card";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { type RefObject, useEffect, useRef, useState } from "react";
import { expect } from "storybook/test";
import { docs } from "./typography-docs";

interface PlaygroundArgs {
  text: string;
  variant: TypographyVariant;
  as?: TypographyElement;
  tone?: TypographyTone;
  weight?: TypographyWeight;
  align?: TypographyAlign;
  wrap?: TypographyWrap;
  truncate: boolean;
  lineClamp?: TypographyLineClamp;
  italic: boolean;
  tabularNums: boolean;
}

const sample = "The quick brown fox jumps over the lazy dog";
const longText =
  "Typography sets the rhythm of an interface. Consistent sizes, weights and line heights make a page easy to scan, and a fixed catalog of styles keeps every screen of every app speaking the same visual language, from the largest title to the smallest caption.";

/** Pixels of a computed length, for play assertions. */
const px = (element: Element, property: "fontSize" | "fontWeight" | "lineHeight") =>
  Number.parseFloat(getComputedStyle(element)[property]);

/** The computed metrics of an element, shown next to each variant (follows any override). */
function Metrics({ target }: { target: RefObject<HTMLDivElement | null> }) {
  const [metrics, setMetrics] = useState("");
  useEffect(() => {
    const element = target.current;
    if (!element) return;
    const style = getComputedStyle(element);
    const size = Number.parseFloat(style.fontSize);
    const lineHeight = Number.parseFloat(style.lineHeight);
    setMetrics(
      `${Math.round(size * 100) / 100}px · ${Number.isNaN(lineHeight) ? style.lineHeight : `${Math.round((lineHeight / size) * 100) / 100}`} · ${style.fontWeight}`,
    );
  }, [target]);
  return <span className="text-muted-foreground text-xs tabular-nums">{metrics}</span>;
}

function VariantRow({ variant }: { variant: TypographyVariant }) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div className="grid gap-1 border-b pb-4 last:border-b-0 sm:grid-cols-[9rem_1fr] sm:items-baseline sm:gap-6">
      <div className="flex flex-col">
        <code className="text-xs">{variant}</code>
        <Metrics target={ref} />
      </div>
      <Typography ref={ref} variant={variant} as="div" className="min-w-0">
        {variant === "code" ? "pnpm add @aureus-core/ui" : sample}
      </Typography>
    </div>
  );
}

const meta = {
  title: "components/Data Display/Typography",
  parameters: { aureusDocs: docs },
  args: {
    text: sample,
    variant: "body",
    truncate: false,
    italic: false,
    tabularNums: false,
  },
  argTypes: {
    text: { control: "text", table: { category: "Content" } },
    variant: {
      control: "select",
      options: [...typographyVariants],
      table: { category: "Appearance" },
    },
    tone: {
      control: "inline-radio",
      options: [undefined, "default", "muted", "primary", "destructive"],
      table: { category: "Appearance" },
    },
    weight: {
      control: "inline-radio",
      options: [undefined, "regular", "medium", "semibold", "bold"],
      table: { category: "Appearance" },
    },
    italic: { control: "boolean", table: { category: "Appearance" } },
    tabularNums: { control: "boolean", table: { category: "Appearance" } },
    align: {
      control: "inline-radio",
      options: [undefined, "start", "center", "end", "justify"],
      table: { category: "Layout" },
    },
    wrap: {
      control: "inline-radio",
      options: [undefined, "balance", "pretty", "nowrap"],
      table: { category: "Layout" },
    },
    truncate: { control: "boolean", table: { category: "Layout" } },
    lineClamp: {
      control: "select",
      options: [undefined, 1, 2, 3, 4, 5, 6],
      table: { category: "Layout" },
    },
    as: {
      control: "select",
      options: [undefined, ...typographyElements],
      table: { category: "Semantics" },
    },
  },
  render: ({ text, truncate, lineClamp, as, ...args }) => {
    // The playground can set both; the component lets `lineClamp` win, as documented.
    const clamp = lineClamp !== undefined ? { lineClamp } : { truncate };
    return (
      <div className="max-w-xl">
        <Typography {...args} {...clamp} as={as as "div" | undefined}>
          {text}
        </Typography>
      </div>
    );
  },
} satisfies Meta<PlaygroundArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A bare `Typography` is a `body` paragraph with no color, alignment or wrapping of its own. */
export const Playground: Story = {
  play: async ({ canvas }) => {
    const paragraph = canvas.getByText(sample);
    await expect(paragraph.tagName).toBe("P");
    await expect(paragraph).toHaveAttribute("data-variant", "body");
    await expect(px(paragraph, "fontSize")).toBe(16);
  },
};

export const Variants: Story = {
  render: () => (
    <div className="grid max-w-4xl gap-4">
      {typographyVariants.map((variant) => (
        <VariantRow key={variant} variant={variant} />
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const rows = canvasElement.querySelectorAll('[data-slot="typography"]');
    await expect(rows).toHaveLength(typographyVariants.length);
    const h3 = canvasElement.querySelector('[data-variant="h3"]') as HTMLElement;
    await expect(px(h3, "fontSize")).toBe(24);
    await expect(px(h3, "fontWeight")).toBe(600);
    const overline = canvasElement.querySelector('[data-variant="overline"]') as HTMLElement;
    await expect(getComputedStyle(overline).textTransform).toBe("uppercase");
    const code = canvasElement.querySelector('[data-variant="code"]') as HTMLElement;
    await expect(getComputedStyle(code).fontFamily).toContain("Geist Mono");
  },
};

export const SemanticVsVisual: Story = {
  render: () => (
    <article className="grid max-w-xl gap-3">
      <Typography variant="h1">Billing</Typography>
      <Typography variant="h3" as="h2">
        Invoices
      </Typography>
      <Typography variant="body">
        The section heading is a level 2 heading in the document outline, styled as h3 to fit the
        page.
      </Typography>
      <Typography variant="h6" as="h3">
        Overdue
      </Typography>
    </article>
  ),
  play: async ({ canvas }) => {
    const section = canvas.getByRole("heading", { level: 2, name: "Invoices" });
    await expect(section).toHaveAttribute("data-variant", "h3");
    await expect(px(section, "fontSize")).toBe(24);
    await expect(canvas.getByRole("heading", { level: 3, name: "Overdue" })).toHaveClass(
      "typography-h6",
    );
  },
};

const tones: (TypographyTone | undefined)[] = [
  undefined,
  "default",
  "muted",
  "primary",
  "destructive",
];

export const Tones: Story = {
  render: () => (
    <div className="grid gap-2">
      {tones.map((tone) => (
        <Typography key={tone ?? "inherit"} tone={tone}>
          {tone ?? "inherit (no tone)"} — {sample}
        </Typography>
      ))}
    </div>
  ),
  play: async ({ canvas }) => {
    const muted = canvas.getByText(/^muted/);
    await expect(muted).toHaveClass("text-muted-foreground");
    await expect(muted.tagName).toBe("P");
    await expect(px(muted, "fontWeight")).toBe(400);
  },
};

const weights: TypographyWeight[] = ["regular", "medium", "semibold", "bold"];

export const Weights: Story = {
  render: () => (
    <div className="grid gap-2">
      {weights.map((weight) => (
        <Typography key={weight} variant="body-sm" weight={weight}>
          {weight} — {sample}
        </Typography>
      ))}
    </div>
  ),
  play: async ({ canvas }) => {
    const bold = canvas.getByText(/^bold/);
    await expect(px(bold, "fontWeight")).toBe(700);
    await expect(px(bold, "fontSize")).toBe(14);
  },
};

export const Truncation: Story = {
  render: () => (
    <div className="grid max-w-sm gap-4">
      <Typography variant="body-sm" truncate>
        {longText}
      </Typography>
      <Typography variant="body-sm" lineClamp={2}>
        {longText}
      </Typography>
      <Typography variant="h4" lineClamp={1}>
        {longText}
      </Typography>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const [single, clamped, heading] = canvasElement.querySelectorAll<HTMLElement>(
      '[data-slot="typography"]',
    );
    await expect(single).toHaveClass("truncate");
    await expect(single?.scrollWidth).toBeGreaterThan(single?.clientWidth ?? 0);
    await expect(clamped).toHaveClass("line-clamp-2");
    const lineHeight = px(clamped as HTMLElement, "lineHeight");
    await expect(clamped?.clientHeight).toBeLessThanOrEqual(Math.ceil(lineHeight * 2) + 1);
    await expect(heading).toHaveClass("typography-h4", "line-clamp-1");
  },
};

const wraps: (TypographyWrap | undefined)[] = [undefined, "balance", "pretty"];

export const Wrapping: Story = {
  render: () => (
    <div className="grid max-w-md gap-6">
      {wraps.map((wrap) => (
        <div key={wrap ?? "default"} className="grid gap-1">
          <code className="text-muted-foreground text-xs">wrap={wrap ?? "—"}</code>
          <Typography variant="h3" wrap={wrap}>
            A heading long enough to wrap onto a second line
          </Typography>
        </div>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const headings = canvasElement.querySelectorAll('[data-slot="typography"]');
    await expect(headings[1]).toHaveClass("text-balance");
    await expect(headings[2]).toHaveClass("text-pretty");
  },
};

export const AsChild: Story = {
  render: () => (
    <Typography variant="body" tone="primary" asChild>
      <a href="#pricing" className="underline underline-offset-4">
        See pricing plans
      </a>
    </Typography>
  ),
  play: async ({ canvas }) => {
    const link = canvas.getByRole("link", { name: "See pricing plans" });
    await expect(link).toHaveClass("typography-body", "text-primary", "underline");
    await expect(link).toHaveAttribute("data-slot", "typography");
  },
};

export const Composition: Story = {
  render: () => (
    <div className="grid max-w-2xl gap-8">
      <header className="grid gap-2">
        <Typography variant="overline" tone="muted">
          Billing
        </Typography>
        <Typography variant="h1" wrap="balance">
          Invoices and payments
        </Typography>
        <Typography variant="lead" tone="muted">
          Review what you owe, download receipts and update how you pay.
        </Typography>
      </header>
      <Card>
        <CardContent className="grid gap-3">
          <Typography variant="h3" as="h2">
            November summary
          </Typography>
          <Typography variant="body">
            You have{" "}
            <Typography as="strong" variant="body" weight="semibold">
              3 open invoices
            </Typography>{" "}
            for a total of{" "}
            <Typography as="span" variant="body" tabularNums>
              $1,284.00
            </Typography>
            . Payments made with <Typography variant="code">ACH</Typography> take two business days.
          </Typography>
          <Typography variant="caption" as="time" dateTime="2026-11-22" tone="muted">
            Updated November 22, 2026
          </Typography>
        </CardContent>
      </Card>
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("heading", { level: 1 })).toHaveClass("typography-h1");
    await expect(canvas.getByRole("heading", { level: 2 })).toHaveClass("typography-h3");
    const time = canvas.getByText("Updated November 22, 2026");
    await expect(time.tagName).toBe("TIME");
    await expect(time).toHaveAttribute("datetime", "2026-11-22");
    const code = canvas.getByText("ACH");
    await expect(px(code, "fontSize")).toBe(14);
  },
};
