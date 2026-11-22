import { isDev } from "../constants";

const warned = new Set<string>();

/**
 * Logs `message` with `console.warn` once per `key`, and only outside production builds. Messages
 * start with the hook name in brackets (`[useSchemaForm] …`).
 */
export function warnOnce(key: string, message: string): void {
  if (!isDev || warned.has(key)) return;
  warned.add(key);
  console.warn(message);
}

/** Forgets every warning already logged. For tests only; not part of any public module. */
export function resetWarnings(): void {
  warned.clear();
}
