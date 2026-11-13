import { defaultLocale, isLocale } from "@sb/i18n/locale-types";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, spyOn, userEvent, waitFor, within } from "storybook/test";
import { normalizeColor } from "./core/color";
import type { DraftStorage } from "./core/draft-storage";
import { ThemeBuilder } from "./theme-builder";

const meta = {
  title: "Tools/Theme Builder",
  component: ThemeBuilder,
  // A tool, not component documentation: no autodocs page, full-bleed canvas.
  tags: ["!autodocs"],
  parameters: { layout: "fullscreen", controls: { disable: true }, actions: { disable: true } },
  args: { locale: defaultLocale },
  argTypes: { locale: { control: false }, storage: { control: false } },
  render: (_args, { globals, loaded }) => (
    <ThemeBuilder
      locale={isLocale(globals.locale) ? globals.locale : defaultLocale}
      storage={(loaded as { storage?: DraftStorage }).storage}
    />
  ),
} satisfies Meta<typeof ThemeBuilder>;

export default meta;
type Story = StoryObj<typeof meta>;

const waitForPreviews = (canvasElement: HTMLElement) =>
  waitFor(
    () => expect(canvasElement.querySelectorAll('iframe[data-ready="true"]')).toHaveLength(2),
    { timeout: 10_000 },
  );

const codeText = (canvasElement: HTMLElement) =>
  canvasElement.querySelector('[data-testid="export-code"]')?.textContent ?? "";

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
 * tags statically) since their play functions edit the theme; the story tests still run them. A
 * fresh in-memory storage each time keeps them deterministic.
 */
const testOnly = {
  loaders: [() => ({ storage: memoryStorage() })],
} satisfies Pick<Story, "loaders">;

/** The builder, with the visitor's draft restored from the browser. */
export const Default: Story = {};

/**
 * Generates a theme from a brand color, overrides a token with a failing value, then downloads
 * and copies the result.
 */
export const GenerateAndExport: Story = {
  ...testOnly,
  tags: ["!dev"],
  play: async ({ canvas, canvasElement, step }) => {
    await waitForPreviews(canvasElement);
    await expect(canvas.getByTestId("contrast-summary")).toHaveTextContent(
      "Meets WCAG AA for text contrast",
    );

    await step("Change the primary color", async () => {
      const primary = canvas.getByLabelText("Primary color");
      await userEvent.clear(primary);
      await userEvent.type(primary, "#2563eb");
      const expected = normalizeColor("#2563eb");
      await waitFor(() => expect(codeText(canvasElement)).toContain(`--primary: ${expected};`));
      await expect(canvas.getByTestId("base-note")).toHaveTextContent("generated from the inputs");
    });

    await step("Reject an invalid color", async () => {
      const destructive = canvas.getByLabelText("Destructive color");
      const before = codeText(canvasElement);
      await userEvent.clear(destructive);
      await userEvent.type(destructive, "not-a-color");
      await expect(destructive).toHaveAttribute("aria-invalid", "true");
      await expect(canvas.getByText(/Not a valid color/)).toBeVisible();
      await expect(codeText(canvasElement)).toBe(before);
    });

    await step("Override a token with a failing value", async () => {
      const muted = canvas.getByLabelText("--muted-foreground (Light)");
      await userEvent.clear(muted);
      await userEvent.type(muted, "oklch(0.75 0 0)");
      const summary = canvas.getByTestId("contrast-summary");
      await waitFor(() =>
        expect(within(summary).getByText(/--muted-foreground on --muted/)).toBeVisible(),
      );
      await expect(canvas.getByTestId("export-warning")).toBeVisible();
      await expect(codeText(canvasElement)).toContain("--muted-foreground: oklch(0.75 0 0);");
    });

    await step("Download the file", async () => {
      const name = canvas.getByLabelText("Theme name");
      await userEvent.clear(name);
      await userEvent.type(name, "Ocean Breeze");
      await expect(canvas.getByText("The file is saved as ocean-breeze.css.")).toBeVisible();

      const blobs: Blob[] = [];
      const downloads: string[] = [];
      const createUrl = spyOn(URL, "createObjectURL").mockImplementation((blob) => {
        blobs.push(blob as Blob);
        return "blob:theme-builder-test";
      });
      const revokeUrl = spyOn(URL, "revokeObjectURL").mockImplementation(() => {});
      const click = spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(function (
        this: HTMLAnchorElement,
      ) {
        downloads.push(this.download);
      });
      try {
        await userEvent.click(canvas.getByRole("button", { name: "Download .css" }));
        await expect(downloads).toEqual(["ocean-breeze.css"]);
        await expect(await blobs[0]?.text()).toBe(codeText(canvasElement));
        await expect(blobs[0]?.type).toBe("text/css");
      } finally {
        createUrl.mockRestore();
        revokeUrl.mockRestore();
        click.mockRestore();
      }
    });

    await step("Copy the file", async () => {
      const writeText = spyOn(navigator.clipboard, "writeText").mockResolvedValue();
      try {
        await userEvent.click(canvas.getByRole("button", { name: "Copy" }));
        await expect(writeText).toHaveBeenCalledWith(codeText(canvasElement));
        await expect(canvas.getByRole("button", { name: "Copied" })).toBeVisible();
      } finally {
        writeText.mockRestore();
      }
    });
  },
};

const sampleTheme = `:root {
  --background: oklch(0.99 0.002 247.8);
  --foreground: oklch(0.2 0.02 260);
  --primary: oklch(0.6 0.18 250);
  --primary-foreground: oklch(1 0 0);
  --destructive-foreground: oklch(1 0 0);
  --radius: 0.5rem;
}
.dark {
  --background: oklch(0.15 0.02 260);
  --primary: oklch(0.7 0.15 250);
}`;

/** Pastes an existing shadcn theme, then rejects CSS that has no theme tokens. */
export const Import: Story = {
  ...testOnly,
  tags: ["!dev"],
  play: async ({ canvas, canvasElement, step }) => {
    await waitForPreviews(canvasElement);
    const textarea = canvas.getByLabelText("Theme CSS");
    const report = canvas.getByTestId("import-report");

    await step("Import a theme", async () => {
      await userEvent.click(textarea);
      await userEvent.paste(sampleTheme);
      await userEvent.click(canvas.getByRole("button", { name: "Import pasted CSS" }));
      await expect(report).toHaveTextContent("Imported 7 values.");
      await expect(report).toHaveTextContent("Ignored: --destructive-foreground (light)");
      await expect(report).toHaveTextContent("--sidebar (dark)");
      await expect(codeText(canvasElement)).toContain("--primary: oklch(0.6 0.18 250);");
      await expect(codeText(canvasElement)).toContain("--radius: 0.5rem;");
    });

    await step("Reject CSS without theme tokens", async () => {
      const before = codeText(canvasElement);
      await userEvent.clear(textarea);
      await userEvent.paste(".button { color: red; }");
      await userEvent.click(canvas.getByRole("button", { name: "Import pasted CSS" }));
      await expect(report).toHaveTextContent("No shadcn theme tokens found");
      await expect(codeText(canvasElement)).toBe(before);
    });
  },
};
