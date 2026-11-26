import type { NumberSymbols } from "./number-locale";
import { parseNumber } from "./parse-number";

/** The outcome of `evaluateExpression`. */
export type ExpressionResult =
  | {
      /** Whether the expression is valid. */
      ok: true;
      /** Its value, always finite. */
      value: number;
    }
  | { ok: false };

/** One piece of an expression. */
type Token =
  | {
      /** What the token is. */
      type: "number";
      /** The number, the operator (`neg` is the unary minus) or the parenthesis. */
      value: number;
    }
  | { type: "operator"; value: "+" | "-" | "*" | "/" | "neg" }
  | { type: "paren"; value: "(" | ")" };

/** Higher binds tighter. */
const PRECEDENCE = { "+": 1, "-": 1, "*": 2, "/": 2, neg: 3 } as const;

/**
 * Whether `text` is one amount in accounting parentheses, such as "(1,234.50)" or "$(5)": a
 * negative number, not an expression. A shorthand suffix inside ("(5k)") does not count, so its
 * "k" is never dropped silently.
 */
function isAccountingAmount(text: string): boolean {
  if (/\d\s*[kmb]\b/i.test(text)) return false;
  return /^\([\d.,]+\)$/.test(text.replace(/[^\d.,+\-*/()−×÷]/g, ""));
}

/**
 * Whether `text` should be evaluated as an expression: it starts with "=", or it has an
 * operator or parenthesis after its first character ("-5" is a number, "5-3" and "=-5" are
 * expressions). An amount in accounting parentheses is a number.
 */
export function isExpression(text: string): boolean {
  const trimmed = text.trim();
  if (trimmed.startsWith("=")) return true;
  if (isAccountingAmount(trimmed)) return false;
  return /[+\-*/()−×÷]/.test(trimmed.slice(1));
}

/** The tokens of an expression, or `undefined` for a character or number that is not valid. */
function tokenize(source: string, symbols: NumberSymbols): Token[] | undefined {
  const tokens: Token[] = [];
  let index = 0;
  const numberChars = new RegExp(
    `[\\d${escapeRegExp(symbols.decimal)}${escapeRegExp(symbols.group)}\\s.,]`,
  );
  while (index < source.length) {
    const char = source.charAt(index);
    if (/\s/.test(char)) {
      index++;
      continue;
    }
    if (/[\d.,]/.test(char) || char === symbols.decimal) {
      let end = index;
      while (end < source.length && numberChars.test(source.charAt(end))) end++;
      const value = parseNumber(source.slice(index, end), symbols);
      if (value === null || value === undefined) return undefined;
      tokens.push({ type: "number", value });
      index = end;
      continue;
    }
    if (char === "(" || char === ")") {
      tokens.push({ type: "paren", value: char });
    } else if ("+-*/−×÷".includes(char)) {
      const op = char === "−" ? "-" : char === "×" ? "*" : char === "÷" ? "/" : char;
      const previous = tokens.at(-1);
      const unary =
        op === "-" &&
        (!previous ||
          previous.type === "operator" ||
          (previous.type === "paren" && previous.value === "("));
      tokens.push({ type: "operator", value: unary ? "neg" : (op as "+" | "-" | "*" | "/") });
    } else {
      return undefined;
    }
    index++;
  }
  return tokens;
}

/** `char` escaped to be used inside a regular expression. */
function escapeRegExp(char: string) {
  return char.replace(/[\\^$.*+?()[\]{}|-]/g, "\\$&");
}

/**
 * Reorders the tokens to reverse Polish notation (shunting-yard), or `undefined` for unmatched
 * parentheses.
 */
function toRpn(tokens: Token[]): Token[] | undefined {
  const output: Token[] = [];
  const stack: Token[] = [];
  for (const token of tokens) {
    if (token.type === "number") output.push(token);
    else if (token.type === "operator") {
      while (true) {
        const top = stack.at(-1);
        if (top?.type !== "operator") break;
        const rightAssociative = token.value === "neg";
        const higher = PRECEDENCE[top.value] > PRECEDENCE[token.value];
        const equal = PRECEDENCE[top.value] === PRECEDENCE[token.value];
        if (higher || (equal && !rightAssociative)) output.push(stack.pop() as Token);
        else break;
      }
      stack.push(token);
    } else if (token.value === "(") stack.push(token);
    else {
      while (stack.length && !(stack.at(-1)?.type === "paren")) output.push(stack.pop() as Token);
      if (!stack.length) return undefined;
      stack.pop();
    }
  }
  while (stack.length) {
    const token = stack.pop() as Token;
    if (token.type === "paren") return undefined;
    output.push(token);
  }
  return output;
}

/**
 * Evaluates `+ - * /`, parentheses and unary minus, with an optional leading "=", numbers written
 * in the locale's format. A tokenizer, shunting-yard and an RPN evaluator: no code is executed.
 * Division by zero and malformed input are invalid.
 */
export function evaluateExpression(text: string, symbols: NumberSymbols): ExpressionResult {
  const source = text.trim().replace(/^=/, "");
  const tokens = tokenize(source, symbols);
  if (!tokens?.length) return { ok: false };
  const rpn = toRpn(tokens);
  if (!rpn) return { ok: false };

  const stack: number[] = [];
  for (const token of rpn) {
    if (token.type === "number") {
      stack.push(token.value);
      continue;
    }
    if (token.type !== "operator") return { ok: false };
    if (token.value === "neg") {
      const operand = stack.pop();
      if (operand === undefined) return { ok: false };
      stack.push(-operand);
      continue;
    }
    const right = stack.pop();
    const left = stack.pop();
    if (left === undefined || right === undefined) return { ok: false };
    if (token.value === "/" && right === 0) return { ok: false };
    stack.push(
      token.value === "+"
        ? left + right
        : token.value === "-"
          ? left - right
          : token.value === "*"
            ? left * right
            : left / right,
    );
  }
  const value = stack.length === 1 ? stack[0] : undefined;
  return value !== undefined && Number.isFinite(value) ? { ok: true, value } : { ok: false };
}
