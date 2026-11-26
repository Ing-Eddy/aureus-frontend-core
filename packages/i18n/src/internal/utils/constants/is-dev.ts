/**
 * True outside production builds. Bundlers replace `process.env.NODE_ENV` statically, as they do
 * for React itself, so development-only warnings are removed from production bundles.
 */
export const isDev = process.env.NODE_ENV !== "production";
