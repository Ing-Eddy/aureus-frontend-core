import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/**/*.{ts,tsx}", "!src/**/*-tests.{ts,tsx}"],
  root: "src",
  unbundle: true, // one output file per source file -> consumers only load what they import
  format: "esm",
  platform: "browser",
  dts: true,
  copy: [{ from: "src/styles", to: "dist" }],
  inputOptions: {
    onLog(level, log, defaultHandler) {
      // shadcn emits "use client" for RSC; consumers are Vite SPAs, so dropping it is harmless.
      if (log.code === "MODULE_LEVEL_DIRECTIVE") return;
      defaultHandler(level, log);
    },
  },
});
