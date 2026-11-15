import { REGEXP_ONLY_CHARS, REGEXP_ONLY_DIGITS, REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";

/** Characters an OTP accepts. A custom set gives a regexp source matching the whole value. */
export type OtpCharset =
  | "digits"
  | "letters"
  | "alphanumeric"
  | { pattern: string; inputMode?: "numeric" | "text" };

export interface ResolvedCharset {
  /** Regexp source for the input's `pattern` (checked on the whole value by `input-otp`). */
  pattern: string;
  inputMode: "numeric" | "text";
}

/** The input `pattern` and mobile keyboard for a charset. */
export function resolveCharset(charset: OtpCharset = "digits"): ResolvedCharset {
  if (typeof charset === "object") {
    return { pattern: charset.pattern, inputMode: charset.inputMode ?? "text" };
  }
  if (charset === "letters") return { pattern: REGEXP_ONLY_CHARS, inputMode: "text" };
  if (charset === "alphanumeric")
    return { pattern: REGEXP_ONLY_DIGITS_AND_CHARS, inputMode: "text" };
  return { pattern: REGEXP_ONLY_DIGITS, inputMode: "numeric" };
}

/** Whether one character matches the charset's pattern. */
function matchesChar(pattern: string, char: string) {
  return new RegExp(pattern).test(char);
}

export interface SanitizeOptions {
  length: number;
  charset?: OtpCharset;
  uppercase?: boolean;
}

/** Applies `uppercase`, drops characters outside the charset and trims to `length`. */
export function sanitizeOtp(value: string, { length, charset, uppercase }: SanitizeOptions) {
  const { pattern } = resolveCharset(charset);
  const text = uppercase ? value.toUpperCase() : value;
  return [...text]
    .filter((char) => matchesChar(pattern, char))
    .join("")
    .slice(0, length);
}

/** Pasted codes often come formatted ("123 456", "123-456"): separators are removed first. */
export function transformPastedOtp(pasted: string, options: SanitizeOptions) {
  return sanitizeOtp(pasted.replace(/[\s-]/g, ""), options);
}
