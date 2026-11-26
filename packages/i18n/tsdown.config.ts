import { defineConfig } from "tsdown";

// Build of the published package: one JavaScript file and declarations per source file.
export default defineConfig({
  // Tests never ship: `*-tests` files anywhere and every `tests/` folder (with its fixtures and helpers).
  entry: ["src/**/*.{ts,tsx}", "!src/**/*-tests.{ts,tsx}", "!src/**/tests/**"],
  root: "src",
  unbundle: true, // one output file per source file -> the runtime never pulls in the plugin's code
  format: "esm",
  // `vite/` runs in Node and `runtime/` in browsers: no platform-specific resolution or polyfills.
  // The plugin's Node built-ins stay imports; `scripts/check-package.mjs` verifies that the runtime
  // output imports none of them.
  platform: "neutral",
  deps: { neverBundle: [/^node:/] },
  dts: true,
  // Keep the expression, so the consumer's bundler decides whether development-only warnings ship.
  define: { "process.env.NODE_ENV": "process.env.NODE_ENV" },
});
