import { isAbsolute, join, relative, resolve } from "node:path";
import type { Plugin, ViteDevServer } from "vite";
import {
  HMR_UPDATE_EVENT,
  RESOLVED_VIRTUAL_MODULE_ID,
  VIRTUAL_MODULE_ID,
} from "@/internal/utils/constants";
import type { AureusI18nOptions } from "./types";
import {
  checkKeyParity,
  DEFAULT_INCLUDE,
  DEFAULT_TYPES_FILE,
  formatParityReport,
  globBase,
  type LocaleContents,
  loadLocales,
  readOrReport,
  renderTypesFile,
  renderVirtualModule,
  type ScanResult,
  scanNamespaces,
  toPosixPath,
  writeIfChanged,
} from "./utils/helpers";

/** Names quoted and separated by commas, for error messages. */
const quoteList = (values: readonly string[]) => values.map((value) => `"${value}"`).join(", ");

/** Throws when `typesFrom` or `defaultNamespace` name something that was not discovered. */
function validate(scan: ScanResult, options: AureusI18nOptions): void {
  if (!scan.languages.includes(options.typesFrom)) {
    throw new Error(
      `[aureusI18n] typesFrom is "${options.typesFrom}", but no ${options.typesFrom}.json file was found. ` +
        `Discovered languages: ${quoteList(scan.languages) || "none"}.`,
    );
  }
  const names = scan.namespaces.map((namespace) => namespace.name);
  if (options.defaultNamespace !== undefined && !names.includes(options.defaultNamespace)) {
    throw new Error(
      `[aureusI18n] defaultNamespace is "${options.defaultNamespace}", but no such namespace was found. ` +
        `Discovered namespaces: ${quoteList(names)}.`,
    );
  }
}

/** What changed between two scans, for the development log (`added namespace "payments"`). */
function describeChanges(previous: ScanResult, next: ScanResult): string {
  const diff = (kind: string, before: readonly string[], after: readonly string[]) => [
    ...after.filter((name) => !before.includes(name)).map((name) => `added ${kind} "${name}"`),
    ...before.filter((name) => !after.includes(name)).map((name) => `removed ${kind} "${name}"`),
  ];
  const names = (scan: ScanResult) => scan.namespaces.map((namespace) => namespace.name);
  const changes = [
    ...diff("namespace", names(previous), names(next)),
    ...diff("language", previous.languages, next.languages),
  ];
  return changes.length > 0 ? changes.join(", ") : "files added or removed";
}

/** A comparable summary of a scan: which namespaces exist and which files each one has. */
const scanSignature = (scan: ScanResult) =>
  JSON.stringify(
    scan.namespaces.map((namespace) => [namespace.name, namespace.dir, namespace.files]),
  );

/**
 * Vite plugin that turns an app's locale folders into i18next resources. With no option other
 * than `typesFrom`, every `src/**\/locales` folder is a namespace named after the folder that
 * contains it, and every `<language>.json` file inside it is a language. The plugin:
 *
 * - serves `virtual:aureus-i18n`, with one lazily loaded chunk per language and namespace, for
 *   `createI18n` from `@aureus-core/i18n/runtime`;
 * - writes a declaration file (`src/types/i18next.d.ts` by default) that types `t()` and
 *   `useTranslation()` from the `typesFrom` files;
 * - compares every language's keys with `typesFrom`: a warning while developing, an error in
 *   `vite build`;
 * - during development, picks up new or removed namespaces and languages (full reload) and edited
 *   texts (hot update, no reload).
 *
 * ```ts
 * // vite.config.ts
 * import { aureusI18n } from "@aureus-core/i18n/vite";
 *
 * export default defineConfig({
 *   plugins: [react(), aureusI18n({ typesFrom: "es", defaultNamespace: "common" })],
 * });
 * ```
 */
export function aureusI18n(options: AureusI18nOptions): Plugin {
  const include = options.include ?? DEFAULT_INCLUDE;
  const typesFile = options.typesFile ?? DEFAULT_TYPES_FILE;

  let root = process.cwd();
  let isBuild = false;
  let scan: ScanResult | undefined;
  let contents: LocaleContents = new Map();
  let lastReport: string | undefined;
  let server: ViteDevServer | undefined;

  const scanRoot = () =>
    scanNamespaces(root, {
      include,
      ...(options.exclude ? { exclude: options.exclude } : {}),
      ...(options.namespaces ? { namespaces: options.namespaces } : {}),
    });

  const contentOf = (file: string) => contents.get(toPosixPath(file));

  /** Writes the declaration file and returns the parity report (or `undefined`). */
  function regenerate(current: ScanResult): string | undefined {
    const typesOptions = {
      typesFrom: options.typesFrom,
      defaultNamespace: options.defaultNamespace,
    };
    writeIfChanged(resolve(root, typesFile), renderTypesFile(current, typesOptions, contentOf));
    return formatParityReport(
      checkKeyParity(current, options.typesFrom, contentOf),
      options.typesFrom,
    );
  }

  /** Logs the parity report during development, only when it changed since the last one. */
  function warnInDev(report: string | undefined): void {
    if (report !== undefined && report !== lastReport) {
      server?.config.logger.warn(report, { timestamp: true });
    }
    lastReport = report;
  }

  const logError = (message: string) => server?.config.logger.error(message, { timestamp: true });

  /** Folders whose changes can add or remove namespaces or languages. */
  const watchedBases = () =>
    [...include.map(globBase), ...Object.keys(options.namespaces ?? {})].map((base) =>
      toPosixPath(resolve(root, base)),
    );

  const isInside = (path: string, folder: string) => {
    const rel = relative(folder, path);
    return rel === "" || (!rel.startsWith("..") && !isAbsolute(rel));
  };

  /** Repeats discovery after a file or folder was added or removed during development. */
  function onStructureChange(path: string): void {
    if (!server || !scan) return;
    const changed = toPosixPath(path);
    if (!watchedBases().some((base) => isInside(changed, base))) return;
    let next: ScanResult;
    try {
      next = scanRoot();
      validate(next, options);
    } catch (error) {
      logError((error as Error).message);
      return;
    }
    const removedOrAdded = scanSignature(next) !== scanSignature(scan);
    if (!removedOrAdded) return;
    server.config.logger.info(
      `[aureusI18n] Locales changed (${describeChanges(scan, next)}): types regenerated, reloading the page.`,
      { timestamp: true },
    );
    scan = next;
    contents = loadLocales(root, next, (error) => logError(error.message));
    warnInDev(regenerate(next));

    const graph = server.environments.client.moduleGraph;
    const virtualModule = graph.getModuleById(RESOLVED_VIRTUAL_MODULE_ID);
    if (virtualModule) graph.invalidateModule(virtualModule);
    server.ws.send({ type: "full-reload" });
  }

  return {
    name: "aureus-i18n",

    configResolved(config) {
      root = config.root;
      isBuild = config.command === "build";
    },

    buildStart() {
      const current = scanRoot();
      validate(current, options);
      const errors: string[] = [];
      contents = loadLocales(root, current, (error) => errors.push(error.message));
      if (errors.length > 0) {
        if (isBuild) this.error(errors.join("\n"));
        for (const message of errors) logError(message);
      }
      scan = current;
      const report = regenerate(current);
      if (isBuild) {
        if (report !== undefined) this.error(report);
      } else {
        warnInDev(report);
      }
    },

    resolveId(id) {
      return id === VIRTUAL_MODULE_ID ? RESOLVED_VIRTUAL_MODULE_ID : undefined;
    },

    load(id) {
      if (id !== RESOLVED_VIRTUAL_MODULE_ID) return undefined;
      const current = scan ?? scanRoot();
      return renderVirtualModule(current, {
        dev: !isBuild,
        defaultNamespace: options.defaultNamespace,
      });
    },

    configureServer(devServer) {
      server = devServer;
      // Explicit folders may live outside the root, which Vite does not watch by default.
      for (const folder of Object.keys(options.namespaces ?? {}))
        devServer.watcher.add(join(root, folder));
      for (const event of ["add", "unlink", "addDir", "unlinkDir"] as const) {
        devServer.watcher.on(event, onStructureChange);
      }
    },

    hotUpdate({ type, file }) {
      if (this.environment.name !== "client" || !scan) return undefined;
      const changed = toPosixPath(file);
      const owner = scan.namespaces
        .flatMap((namespace) =>
          Object.entries(namespace.files).map(([language, path]) => ({
            namespace,
            language,
            path,
          })),
        )
        .find((entry) => toPosixPath(entry.path) === changed);
      if (!owner) return undefined;
      // Added and removed files are handled by the watcher (full reload), never by HMR.
      if (type !== "update") return [];

      const content = readOrReport(root, file, (error) => logError(error.message));
      contents.set(changed, content);
      warnInDev(regenerate(scan));
      if (content !== undefined) {
        server?.ws.send({
          type: "custom",
          event: HMR_UPDATE_EVENT,
          data: { language: owner.language, namespace: owner.namespace.name, content },
        });
      }
      return [];
    },
  };
}
