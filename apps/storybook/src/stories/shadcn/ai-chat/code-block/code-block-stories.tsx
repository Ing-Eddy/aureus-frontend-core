import { useHighlightedCode } from "@aureus-core/ui/hooks/use-highlighted-code";
import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockFooter,
  CodeBlockHeader,
  CodeBlockLine,
  CodeBlockTitle,
} from "@aureus-core/ui/shadcn/code-block";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, spyOn, userEvent, waitFor } from "storybook/test";
import { docs } from "./code-block-docs";

const samples = {
  typescript: `import { Button } from "@aureus-core/ui/shadcn/button";

export function Save({ onSave }: { onSave: () => void }) {
  return <Button onClick={onSave}>Save</Button>;
}`,
  python: `def fibonacci(n: int) -> int:
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b
    return a`,
  bash: `pnpm add @aureus-core/ui
pnpm add -D tailwindcss @tailwindcss/vite`,
} as const;

type Language = keyof typeof samples;

interface HighlightedProps {
  code: string;
  language: string;
  title?: string;
  lineNumbers?: boolean;
  startLine?: number;
  highlight?: number[];
  wrap?: boolean;
  className?: string;
}

/** The composition consumers write: the hook tokenizes, CodeBlockLine renders each line. */
function HighlightedCode({
  code,
  language,
  title,
  lineNumbers,
  startLine = 1,
  highlight = [],
  wrap,
  className,
}: HighlightedProps) {
  const lines = useHighlightedCode(code, language);
  return (
    <CodeBlock className={className ?? "w-[36rem]"}>
      <CodeBlockHeader>
        <CodeBlockTitle>{title ?? language}</CodeBlockTitle>
        <CodeBlockActions>
          <CodeBlockCopyButton value={code} />
        </CodeBlockActions>
      </CodeBlockHeader>
      <CodeBlockContent
        lineNumbers={lineNumbers}
        startLine={startLine}
        wrap={wrap}
        aria-label={`${title ?? language} code`}
      >
        {lines
          .map((line, index) => ({ line, number: index + startLine }))
          .map(({ line, number }) => (
            <CodeBlockLine
              key={number}
              variant={highlight.includes(number) ? "highlighted" : "default"}
            >
              {line}
            </CodeBlockLine>
          ))}
      </CodeBlockContent>
    </CodeBlock>
  );
}

/**
 * Shiki's GitHub themes (set in the package's `lib/highlighter`, owned by the shadcn CLI) have
 * tokens below WCAG AA, e.g. orange `#e36209` at 3.48:1 on white. Consumers cannot change those
 * themes, so axe excludes only the highlighted code text from its context and checks the rest of the
 * story (header, buttons, frame, footer).
 */
const a11y = {
  context: { include: ["body"], exclude: [['[data-slot="code-block-line-content"]']] },
};

interface CodeArgs {
  language: Language;
  lineNumbers: boolean;
  wrap: boolean;
}

const meta = {
  title: "shadcn/AI & Chat/Code Block",
  parameters: { aureusDocs: docs, a11y },
  args: { language: "typescript", lineNumbers: true, wrap: false },
  argTypes: {
    language: {
      control: "inline-radio",
      options: Object.keys(samples),
      table: { category: "Content" },
    },
    lineNumbers: { control: "boolean", table: { category: "Appearance" } },
    wrap: { control: "boolean", table: { category: "Appearance" } },
  },
  render: ({ language, lineNumbers, wrap }) => (
    <HighlightedCode
      code={samples[language]}
      language={language}
      title="save.tsx"
      lineNumbers={lineNumbers}
      wrap={wrap}
    />
  ),
} satisfies Meta<CodeArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

const tokenized = (root: HTMLElement) =>
  root.querySelector('[data-slot="code-block-line"] span[style]') !== null;

/** Copy writes the raw code to the clipboard (mocked) and the button becomes "Copied". */
export const Playground: Story = {
  play: async ({ canvas, canvasElement }) => {
    const writeText = spyOn(navigator.clipboard, "writeText").mockResolvedValue(undefined);
    await waitFor(() => expect(tokenized(canvasElement)).toBe(true), { timeout: 5000 });
    await userEvent.click(canvas.getByRole("button", { name: "Copy" }));
    await expect(writeText).toHaveBeenCalledWith(samples.typescript);
    await expect(await canvas.findByRole("button", { name: "Copied" })).toBeInTheDocument();
    writeText.mockRestore();
  },
};

export const Languages: Story = {
  render: () => (
    <div className="grid gap-4">
      {(Object.keys(samples) as Language[]).map((language) => (
        <HighlightedCode key={language} code={samples[language]} language={language} />
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    await waitFor(
      () =>
        expect(
          canvasElement.querySelectorAll('[data-slot="code-block-line"] span[style]').length,
        ).toBeGreaterThan(10),
      { timeout: 5000 },
    );
  },
};

export const HighlightedLines: Story = {
  render: () => (
    <HighlightedCode
      code={samples.python}
      language="python"
      title="fibonacci.py"
      lineNumbers
      highlight={[3, 4]}
    />
  ),
  play: async ({ canvasElement }) => {
    const lines = canvasElement.querySelectorAll('[data-slot="code-block-line"]');
    await expect(lines[2]).toHaveAttribute("data-variant", "highlighted");
    await expect(lines[0]).toHaveAttribute("data-variant", "default");
  },
};

export const Diff: Story = {
  render: () => (
    <CodeBlock className="w-[36rem]">
      <CodeBlockHeader>
        <CodeBlockTitle>theme.css</CodeBlockTitle>
      </CodeBlockHeader>
      <CodeBlockContent aria-label="Diff of theme.css">
        <CodeBlockLine>{":root {"}</CodeBlockLine>
        <CodeBlockLine variant="removed">
          {"  --destructive: oklch(0.577 0.245 27.325);"}
        </CodeBlockLine>
        <CodeBlockLine variant="added">{"  --destructive: oklch(0.51 0.2 27.325);"}</CodeBlockLine>
        <CodeBlockLine>{"}"}</CodeBlockLine>
      </CodeBlockContent>
      <CodeBlockFooter>1 line removed, 1 line added</CodeBlockFooter>
    </CodeBlock>
  ),
};

const longCode = Array.from(
  { length: 40 },
  (_, index) =>
    `const value${index + 120} = compute(${index}); // a deliberately long line so the block scrolls horizontally when it does not wrap`,
).join("\n");

export const LongBlock: Story = {
  render: () => (
    <HighlightedCode
      code={longCode}
      language="typescript"
      title="generated.ts"
      lineNumbers
      startLine={120}
      className="w-[36rem] [&_pre]:max-h-64"
    />
  ),
  play: async ({ canvasElement }) => {
    const pre = canvasElement.querySelector<HTMLElement>(
      '[data-slot="code-block-content"]',
    ) as HTMLElement;
    await expect(pre).toHaveAttribute("tabindex", "0");
    await expect(pre.scrollWidth).toBeGreaterThan(pre.clientWidth);
  },
};

/** An unknown language never loads a grammar: the hook keeps returning readable plain lines. */
export const Loading: Story = {
  render: () => (
    <HighlightedCode
      code={"SELECT 1;\n-- plain text until a grammar loads"}
      language="cobol"
      title="query"
    />
  ),
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByText("SELECT 1;")).toBeVisible();
    await expect(tokenized(canvasElement)).toBe(false);
  },
};

export const ErrorOutput: Story = {
  render: () => (
    <CodeBlock variant="destructive" size="sm" className="w-[36rem]">
      <CodeBlockHeader>
        <CodeBlockTitle>Build failed</CodeBlockTitle>
      </CodeBlockHeader>
      <CodeBlockContent aria-label="Error output">
        {
          "TypeError: Cannot read properties of undefined (reading 'map')\n    at Table (table.tsx:42:18)"
        }
      </CodeBlockContent>
    </CodeBlock>
  ),
};
