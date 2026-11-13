const scale = [
  ["text-xs", "0.75rem"],
  ["text-sm", "0.875rem"],
  ["text-base", "1rem"],
  ["text-lg", "1.125rem"],
  ["text-xl", "1.25rem"],
  ["text-2xl", "1.5rem"],
  ["text-3xl", "1.875rem"],
  ["text-4xl", "2.25rem"],
] as const;

/**
 * Tailwind's type scale in the package font. Replaces Storybook's Typeset block, whose size labels are
 * hard-coded at 40% opacity in dark docs (3.66:1, below WCAG AA). Colors come from the package tokens,
 * so the specimen follows the theme toolbar like any component.
 */
export function TypeScale({ sample }: { sample: string }) {
  return (
    <div
      style={{ display: "grid", gap: "1rem", margin: "1.5rem 0", fontFamily: "var(--font-sans)" }}
    >
      {scale.map(([utility, size]) => (
        <div
          key={utility}
          style={{ display: "flex", alignItems: "baseline", gap: "1.5rem", minWidth: 0 }}
        >
          <code
            style={{
              flexShrink: 0,
              width: "9rem",
              fontSize: "0.75rem",
              color: "var(--muted-foreground)",
            }}
          >
            {utility} · {size}
          </code>
          <span
            style={{
              fontSize: size,
              color: "var(--foreground)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {sample}
          </span>
        </div>
      ))}
    </div>
  );
}
