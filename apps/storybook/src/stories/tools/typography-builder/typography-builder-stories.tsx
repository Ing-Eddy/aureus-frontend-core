import { defaultLocale, isLocale } from "@sb/i18n/locale-types";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, spyOn, userEvent, waitFor, within } from "storybook/test";
import type { DraftStorage } from "../shared/storage";
import { TypographyBuilder } from "./typography-builder";

const meta = {
  title: "Tools/Typography Builder",
  component: TypographyBuilder,
  // A tool, not component documentation: no autodocs page, full-bleed canvas.
  tags: ["!autodocs"],
  parameters: { layout: "fullscreen", controls: { disable: true }, actions: { disable: true } },
  args: { locale: defaultLocale },
  argTypes: { locale: { control: false }, storage: { control: false } },
  render: (_args, { globals, loaded }) => (
    <TypographyBuilder
      locale={isLocale(globals.locale) ? globals.locale : defaultLocale}
      storage={(loaded as { storage?: DraftStorage }).storage}
    />
  ),
} satisfies Meta<typeof TypographyBuilder>;

export default meta;
type Story = StoryObj<typeof meta>;

const frame = (canvasElement: HTMLElement) =>
  canvasElement.querySelector<HTMLIFrameElement>('iframe[data-ready="true"]');

const waitForPreview = (canvasElement: HTMLElement) =>
  waitFor(() => expect(frame(canvasElement)).not.toBeNull(), { timeout: 10_000 });

const codeText = (canvasElement: HTMLElement) =>
  canvasElement.querySelector('[data-testid="export-code"]')?.textContent ?? "";

/** Computed font size, in px, of a variant in the preview's specimen. */
function previewSize(canvasElement: HTMLElement, variant: string): number {
  const doc = frame(canvasElement)?.contentDocument;
  const element = doc?.querySelector(`[data-variant="${variant}"]`);
  if (!element || !doc?.defaultView) return Number.NaN;
  return Number.parseFloat(doc.defaultView.getComputedStyle(element).fontSize);
}

/** In-memory storage, so the test stories never read or overwrite a visitor's saved draft. */
function memoryStorage(): DraftStorage {
  const data = new Map<string, string>();
  return {
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => void data.set(key, value),
    removeItem: (key) => void data.delete(key),
  };
}

/**
 * Test-only stories: hidden from the sidebar (`!dev`, written on each story because the indexer reads
 * tags statically) since their play functions edit the draft; the story tests still run them.
 */
const testOnly = {
  loaders: [() => ({ storage: memoryStorage() })],
} satisfies Pick<Story, "loaders">;

/** The builder, with the visitor's draft restored from the browser. */
export const Default: Story = {};

/** Applies a pairing, regenerates the scale, overrides a weight, checks the preview and exports. */
export const PairAndExport: Story = {
  ...testOnly,
  tags: ["!dev"],
  play: async ({ canvas, canvasElement, step }) => {
    await waitForPreview(canvasElement);
    await expect(canvas.getByTestId("readability-summary")).toHaveTextContent(
      "passes the readability checks",
    );
    await expect(canvas.getByTestId("install-command")).toHaveTextContent("No install needed");
    await expect(codeText(canvasElement)).not.toContain("@import");

    await step("Apply a pairing", async () => {
      await userEvent.click(canvas.getByRole("button", { name: "Apply Inter + JetBrains Mono" }));
      await waitFor(() =>
        expect(codeText(canvasElement)).toContain('@import "@fontsource-variable/inter";'),
      );
      await expect(codeText(canvasElement)).toContain(
        '--typography-font-sans: "Inter Variable", "Inter", ui-sans-serif, system-ui, sans-serif;',
      );
      await expect(canvas.getByTestId("install-command")).toHaveTextContent(
        "pnpm add @fontsource-variable/inter @fontsource-variable/jetbrains-mono",
      );
      await expect(
        canvas.getByRole("button", { name: "Inter + JetBrains Mono (applied)" }),
      ).toHaveAttribute("aria-pressed", "true");
    });

    await step("Regenerate the scale", async () => {
      const before = previewSize(canvasElement, "h3");
      await userEvent.selectOptions(canvas.getByLabelText("Ratio"), "1.333");
      await expect(canvas.getByTestId("base-note")).toHaveTextContent("Generated from the scale.");
      await waitFor(() => expect(previewSize(canvasElement, "h3")).toBeGreaterThan(before));
    });

    await step("Override the weight of h2", async () => {
      const item = canvas.getByTestId("variant-h2");
      await userEvent.click(within(item).getByRole("button", { name: /^h2/ }));
      const weight = within(item).getByLabelText("Weight");
      await userEvent.clear(weight);
      await userEvent.type(weight, "800");
      await waitFor(() =>
        expect(codeText(canvasElement)).toContain("--typography-h2-weight: 800;"),
      );
      await expect(within(item).getByText("Overridden")).toBeVisible();
      // Regenerating keeps the override (1.25 stays above the small-screen ratio, so h1 is fluid).
      await userEvent.selectOptions(canvas.getByLabelText("Ratio"), "1.25");
      await expect(codeText(canvasElement)).toContain("--typography-h2-weight: 800;");
    });

    await step("Fluid headings follow the preview width", async () => {
      const code = codeText(canvasElement);
      const min = Number(/--typography-h1-size: clamp\(([\d.]+)rem/.exec(code)?.[1]) * 16;
      const max =
        Number(/--typography-h1-size: clamp\([^,]+,[^,]+, ([\d.]+)rem\)/.exec(code)?.[1]) * 16;
      await userEvent.click(canvas.getByRole("radio", { name: "360px" }));
      await waitFor(() => expect(frame(canvasElement)?.getAttribute("data-width")).toBe("360"));
      await waitFor(() => expect(previewSize(canvasElement, "h1")).toBeCloseTo(min, 0));
      await userEvent.click(canvas.getByRole("radio", { name: "1280px" }));
      await waitFor(() => expect(previewSize(canvasElement, "h1")).toBeCloseTo(max, 0));
    });

    await step("Download and copy", async () => {
      await expect(canvas.getByText("The file is saved as typography.css.")).toBeVisible();
      const name = canvas.getByLabelText("Name");
      await userEvent.clear(name);
      await userEvent.type(name, "Docs");
      await expect(canvas.getByText("The file is saved as docs.css.")).toBeVisible();
      const blobs: Blob[] = [];
      const downloads: string[] = [];
      const createUrl = spyOn(URL, "createObjectURL").mockImplementation((blob) => {
        blobs.push(blob as Blob);
        return "blob:typography-builder-test";
      });
      const revokeUrl = spyOn(URL, "revokeObjectURL").mockImplementation(() => {});
      const click = spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(function (
        this: HTMLAnchorElement,
      ) {
        downloads.push(this.download);
      });
      const writeText = spyOn(navigator.clipboard, "writeText").mockResolvedValue();
      try {
        await userEvent.click(canvas.getByRole("button", { name: "Download .css" }));
        await expect(downloads).toEqual(["docs.css"]);
        await expect(await blobs[0]?.text()).toBe(codeText(canvasElement));
        await userEvent.click(canvas.getByRole("button", { name: "Copy" }));
        await expect(writeText).toHaveBeenCalledWith(codeText(canvasElement));
      } finally {
        createUrl.mockRestore();
        revokeUrl.mockRestore();
        click.mockRestore();
        writeText.mockRestore();
      }
    });
  },
};

const customExport = `/* Imported */
@import "@fontsource/comic-neue";

:root {
  --typography-font-sans: "Inter Variable", "Inter", ui-sans-serif, system-ui, sans-serif;
  --typography-font-heading: "Comic Neue", ui-sans-serif, system-ui, sans-serif;
  --typography-h1-weight: 800;
  --typography-lead-line-height: 1.7;
  --typography-caption-size: big;
}`;

/** Pastes an export with a custom font, then rejects CSS that has no typography variables. */
export const Import: Story = {
  ...testOnly,
  tags: ["!dev"],
  play: async ({ canvas, canvasElement, step }) => {
    await waitForPreview(canvasElement);
    const textarea = canvas.getByLabelText("Typography CSS");
    const report = canvas.getByTestId("import-report");

    await step("Import an export", async () => {
      await userEvent.click(textarea);
      await userEvent.paste(customExport);
      await userEvent.click(canvas.getByRole("button", { name: "Import pasted CSS" }));
      await expect(report).toHaveTextContent("Imported 4 values.");
      await expect(report).toHaveTextContent("Ignored: --typography-caption-size");
      const code = codeText(canvasElement);
      await expect(code).toContain('@import "@fontsource/comic-neue";');
      await expect(code).toContain("--typography-h1-weight: 800;");
      await expect(code).toContain("--typography-lead-line-height: 1.7;");
      await expect(canvas.getByTestId("install-unverified")).toHaveTextContent(
        "@fontsource/comic-neue",
      );
    });

    await step("Reject CSS without typography variables", async () => {
      const before = codeText(canvasElement);
      await userEvent.clear(textarea);
      await userEvent.paste(":root { --primary: oklch(0.5 0.2 260); }");
      await userEvent.click(canvas.getByRole("button", { name: "Import pasted CSS" }));
      await expect(report).toHaveTextContent("No --typography-* variables found");
      await expect(codeText(canvasElement)).toBe(before);
    });
  },
};

/** Small body text and a heading out of order raise warnings, and export stays available. */
export const ReadabilityWarnings: Story = {
  ...testOnly,
  tags: ["!dev"],
  play: async ({ canvas, canvasElement }) => {
    await waitForPreview(canvasElement);
    const summary = canvas.getByTestId("readability-summary");
    const setSize = async (variant: string, value: string) => {
      const item = canvas.getByTestId(`variant-${variant}`);
      await userEvent.click(within(item).getByRole("button", { name: new RegExp(`^${variant}`) }));
      const size = within(item).getByLabelText("Size");
      await userEvent.clear(size);
      await userEvent.type(size, value);
    };
    await setSize("body", "0.8rem");
    await waitFor(() => expect(summary).toHaveTextContent("body is 0.8rem"));
    await setSize("h3", "1.1rem");
    await waitFor(() => expect(summary).toHaveTextContent("h3 (1.1rem) is smaller"));
    await expect(summary).toHaveTextContent("2 readability warnings");
    await expect(canvas.getByRole("button", { name: "Download .css" })).toBeEnabled();
  },
};
