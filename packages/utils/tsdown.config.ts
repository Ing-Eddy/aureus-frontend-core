import { defineConfig } from "tsdown";

export default defineConfig({
  // Tests never ship: `*-tests` files anywhere and every `tests/` folder.
  entry: ["src/**/*.ts", "!src/**/*-tests.ts", "!src/**/tests/**"],
  root: "src",
  unbundle: true, // one output file per source file -> consumers only load what they import
  format: "esm",
  // Runs in browsers and in Node: no platform-specific resolution or polyfills.
  platform: "neutral",
  dts: true,
  // Keep the expression, so the consumer's bundler decides whether development-only warnings ship.
  define: { "process.env.NODE_ENV": "process.env.NODE_ENV" },
});
