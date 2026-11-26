/** What `findUndocumented` checks. */
export interface FindUndocumentedOptions {
  /** Absolute path of the package folder. It must hold the package's `tsconfig.json`. */
  readonly packageDir: string;
  /**
   * Globs of the public entry points, relative to `packageDir` (`"src/*\/index.ts"`). Files under
   * an `internal/` folder are never entry points. Each glob must match at least one file.
   */
  readonly entries: readonly string[];
}
