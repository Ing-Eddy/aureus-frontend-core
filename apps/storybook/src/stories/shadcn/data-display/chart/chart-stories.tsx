import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@aureus-core/ui/shadcn/chart";
import { browserShare, monthlyVisitors } from "@fixtures/chart-data";
import type { Meta, StoryObj } from "@storybook/react-vite";
import * as Recharts from "recharts";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { docs } from "./chart-docs";

const visitorsConfig = {
  desktop: { label: "Desktop", color: "var(--chart-2)" },
  mobile: { label: "Mobile", color: "var(--chart-4)" },
} satisfies ChartConfig;

const browserConfig = {
  visitors: { label: "Visitors" },
  chrome: { label: "Chrome", color: "var(--chart-1)" },
  safari: { label: "Safari", color: "var(--chart-2)" },
  firefox: { label: "Firefox", color: "var(--chart-3)" },
  edge: { label: "Edge", color: "var(--chart-4)" },
  other: { label: "Other", color: "var(--chart-5)" },
} satisfies ChartConfig;

const data = [...monthlyVisitors];
const shortMonth = (value: string) => value.slice(0, 3);

interface ChartArgs {
  indicator: "dot" | "line" | "dashed";
  hideLabel: boolean;
  showLegend: boolean;
  stacked: boolean;
}

const meta = {
  title: "shadcn/Data Display/Chart",
  parameters: { aureusDocs: docs },
  args: { indicator: "dot", hideLabel: false, showLegend: true, stacked: false },
  argTypes: {
    indicator: {
      control: "inline-radio",
      options: ["dot", "line", "dashed"],
      table: { category: "Tooltip" },
    },
    hideLabel: { control: "boolean", table: { category: "Tooltip" } },
    showLegend: { control: "boolean", table: { category: "Legend" } },
    stacked: { control: "boolean", table: { category: "Appearance" } },
  },
  render: ({ indicator, hideLabel, showLegend, stacked }) => (
    <ChartContainer
      config={visitorsConfig}
      className="h-64 w-[32rem]"
      role="figure"
      aria-label="Visitors per month"
    >
      <Recharts.BarChart accessibilityLayer data={data}>
        <Recharts.CartesianGrid vertical={false} />
        <Recharts.XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={shortMonth}
        />
        <ChartTooltip
          content={<ChartTooltipContent indicator={indicator} hideLabel={hideLabel} />}
        />
        {showLegend && <ChartLegend content={<ChartLegendContent />} />}
        <Recharts.Bar
          dataKey="desktop"
          fill="var(--color-desktop)"
          radius={4}
          stackId={stacked ? "a" : undefined}
        />
        <Recharts.Bar
          dataKey="mobile"
          fill="var(--color-mobile)"
          radius={4}
          stackId={stacked ? "a" : undefined}
        />
      </Recharts.BarChart>
    </ChartContainer>
  ),
} satisfies Meta<ChartArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The legend renders one item per config entry; hovering a bar shows the tooltip with its month. */
export const Playground: Story = {
  play: async ({ canvas, canvasElement }) => {
    await waitFor(() => expect(canvas.getByText("Desktop")).toBeVisible());
    await expect(canvas.getByText("Mobile")).toBeVisible();
    await expect(canvasElement.querySelector('[data-slot="chart"] style')?.textContent).toContain(
      "--color-desktop: var(--chart-2)",
    );
    // Recharts' accessibility layer: the chart surface takes focus and → moves the tooltip.
    const surface = await waitFor(() => {
      const element = canvasElement.querySelector<SVGElement>(".recharts-surface[tabindex]");
      expect(element).not.toBeNull();
      return element as SVGElement;
    });
    surface.focus();
    await userEvent.keyboard("{ArrowRight}");
    await waitFor(() =>
      expect(within(canvasElement).getByText(/^(January|February)$/)).toBeInTheDocument(),
    );
  },
};

export const Line: Story = {
  render: () => (
    <ChartContainer
      config={visitorsConfig}
      className="h-64 w-[32rem]"
      role="figure"
      aria-label="Visitors per month, line chart"
    >
      <Recharts.LineChart accessibilityLayer data={data} margin={{ left: 12, right: 12 }}>
        <Recharts.CartesianGrid vertical={false} />
        <Recharts.XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={shortMonth}
        />
        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
        <Recharts.Line
          dataKey="desktop"
          type="monotone"
          stroke="var(--color-desktop)"
          strokeWidth={2}
          dot={false}
        />
        <Recharts.Line
          dataKey="mobile"
          type="monotone"
          stroke="var(--color-mobile)"
          strokeWidth={2}
          dot={false}
        />
      </Recharts.LineChart>
    </ChartContainer>
  ),
};

export const Area: Story = {
  render: () => (
    <ChartContainer
      config={visitorsConfig}
      className="h-64 w-[32rem]"
      role="figure"
      aria-label="Visitors per month, stacked area chart"
    >
      <Recharts.AreaChart accessibilityLayer data={data} margin={{ left: 12, right: 12 }}>
        <defs>
          {(["desktop", "mobile"] as const).map((key) => (
            <linearGradient key={key} id={`fill-${key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={`var(--color-${key})`} stopOpacity={0.8} />
              <stop offset="95%" stopColor={`var(--color-${key})`} stopOpacity={0.1} />
            </linearGradient>
          ))}
        </defs>
        <Recharts.CartesianGrid vertical={false} />
        <Recharts.XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={shortMonth}
        />
        <ChartTooltip content={<ChartTooltipContent indicator="dashed" />} />
        <Recharts.Area
          dataKey="mobile"
          type="natural"
          fill="url(#fill-mobile)"
          stroke="var(--color-mobile)"
          stackId="a"
        />
        <Recharts.Area
          dataKey="desktop"
          type="natural"
          fill="url(#fill-desktop)"
          stroke="var(--color-desktop)"
          stackId="a"
        />
        <ChartLegend content={<ChartLegendContent />} />
      </Recharts.AreaChart>
    </ChartContainer>
  ),
};

/** `nameKey="browser"` makes the legend list the config labels of the slices. */
export const Pie: Story = {
  render: () => (
    <ChartContainer
      config={browserConfig}
      className="aspect-square h-72"
      role="figure"
      aria-label="Visitors by browser"
    >
      <Recharts.PieChart accessibilityLayer>
        <ChartTooltip content={<ChartTooltipContent nameKey="browser" hideLabel />} />
        <Recharts.Pie
          data={[...browserShare]}
          dataKey="visitors"
          nameKey="browser"
          innerRadius={50}
        />
        <ChartLegend content={<ChartLegendContent nameKey="browser" />} className="flex-wrap" />
      </Recharts.PieChart>
    </ChartContainer>
  ),
  play: async ({ canvas }) => {
    for (const label of ["Chrome", "Safari", "Firefox", "Edge", "Other"]) {
      await waitFor(() => expect(canvas.getByText(label)).toBeVisible());
    }
  },
};

const themedConfig = {
  desktop: {
    label: "Desktop",
    theme: { light: "oklch(0.55 0.2 260)", dark: "oklch(0.75 0.14 260)" },
  },
  mobile: { label: "Mobile", theme: { light: "oklch(0.6 0.17 150)", dark: "oklch(0.8 0.13 150)" } },
} satisfies ChartConfig;

/** Per-theme colors: the container writes a light rule and a `.dark` rule for each series. */
export const ThemeColors: Story = {
  render: () => (
    <ChartContainer
      config={themedConfig}
      className="h-64 w-[32rem]"
      role="figure"
      aria-label="Visitors per month, themed colors"
    >
      <Recharts.BarChart accessibilityLayer data={data}>
        <Recharts.CartesianGrid vertical={false} />
        <Recharts.XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={shortMonth}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Recharts.Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
        <Recharts.Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
      </Recharts.BarChart>
    </ChartContainer>
  ),
  play: async ({ canvasElement }) => {
    const css = canvasElement.querySelector('[data-slot="chart"] style')?.textContent ?? "";
    await expect(css).toContain(".dark [data-chart=");
    await expect(css).toContain("oklch(0.75 0.14 260)");
  },
};
