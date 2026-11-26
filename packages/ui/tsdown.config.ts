import { defineConfig } from "tsdown";

// Build of the published package: JavaScript, declarations and the stylesheets, into `dist/`.
export default defineConfig({
  // Tests never ship: `*-tests` files anywhere, every `tests/` folder (with its helpers), and the
  // shared test helpers in `internal/testing`.
  entry: [
    "src/**/*.{ts,tsx}",
    "!src/**/*-tests.{ts,tsx}",
    "!src/**/tests/**",
    "!src/internal/testing/**",
  ],
  root: "src",
  unbundle: true, // one output file per source file -> consumers only load what they import
  format: "esm",
  platform: "browser",
  dts: true,
  // Rolldown inlines `process.env.NODE_ENV` for the browser platform. Keep the expression, so the
  // consumer's bundler decides whether development-only warnings ship.
  define: { "process.env.NODE_ENV": "process.env.NODE_ENV" },
  // The stylesheets ship as source CSS: the consumer's Tailwind processes them.
  copy: [{ from: "src/styles", to: "dist" }],
  inputOptions: {
    onLog(level, log, defaultHandler) {
      // shadcn emits "use client" for RSC; consumers are Vite SPAs, so dropping it is harmless.
      if (log.code === "MODULE_LEVEL_DIRECTIVE") return;
      defaultHandler(level, log);
    },
  },
});
