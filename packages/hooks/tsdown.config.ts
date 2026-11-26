import { defineConfig } from "tsdown";

// Build of the published package: one JavaScript file and declarations per source file.
export default defineConfig({
  // Tests never ship: `*-tests` files anywhere and every `tests/` folder (with its helpers).
  entry: ["src/**/*.{ts,tsx}", "!src/**/*-tests.{ts,tsx}", "!src/**/tests/**"],
  root: "src",
  unbundle: true, // one output file per source file -> consumers only load what they import
  format: "esm",
  platform: "browser",
  dts: true,
  // Keep the expression, so the consumer's bundler decides whether development-only warnings ship.
  define: { "process.env.NODE_ENV": "process.env.NODE_ENV" },
});
