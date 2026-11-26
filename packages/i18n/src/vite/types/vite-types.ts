/** Options of the `aureusI18n` Vite plugin. Only `typesFrom` is required. */
export interface AureusI18nOptions {
  /**
   * The reference language (`"es"`). The keys of `t()` are typed from its files, and every other
   * language is compared with it. It must be one of the discovered languages.
   */
  typesFrom: string;
  /**
   * Folder globs searched for namespaces, relative to the Vite root. `*` matches one path
   * segment and `**` any number of segments. A matched folder is a namespace named after the
   * folder that contains it: `src/features/auth/locales` → `auth`.
   *
  /**
   * Folder globs searched for namespaces, relative to the Vite root. `*` matches one path segment
   * and `**` any number of segments. A matched folder is a namespace named after the folder that
   * contains it: `src/features/auth/locales` → `auth` (and `src/locales` → `src`).
   *
   * @default ["src/**\/locales"]
   */
  include?: readonly string[];
  /**
   * Folder globs removed from the search, relative to the Vite root. `node_modules`, `dist` and
   * folders whose name starts with `.` are always skipped.
   *
   * @default []
   */
  exclude?: readonly string[];
  /**
   * Folders with an explicit namespace name, relative to the Vite root:
   * `{ "src/shared/i18n": "shared" }`. A folder listed here is a namespace even if it is not called
   * `locales` or is not matched by `include`.
   */
  namespaces?: Readonly<Record<string, string>>;
  /**
   * The namespace `t()` uses when none is given. Keys of other namespaces then need their
   * namespace (`useTranslation("auth")` or `t("auth:login.title")`). It must be one of the
   * discovered namespaces.
   */
  defaultNamespace?: string;
  /**
   * Where the generated declaration file is written, relative to the Vite root. Commit it, so
   * `tsc` works in CI without starting Vite.
   *
   * @default "src/types/i18next.d.ts"
   */
  typesFile?: string;
}
