import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/**/*.{ts,tsx}", "!src/**/*-tests.{ts,tsx}"],
  root: "src",
  unbundle: true, // one output file per source file -> consumers only load what they import
  format: "esm",
  platform: "browser",
  dts: true,
  copy: [{ from: "src/styles", to: "dist" }],
});
