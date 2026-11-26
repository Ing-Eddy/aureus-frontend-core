import {
  type ChangeEvent,
  type ClipboardEvent,
  type FocusEvent,
  type KeyboardEvent,
  type RefObject,
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useControllableState } from "@/internal/hooks";
import { isDev } from "@/internal/utils/constants";
import {
  addScaled,
  applyShorthand,
  caretFromCount,
  clamp,
  countSignificant,
  decimalPlaces,
  evaluateExpression,
  type FormatOptions,
  formatDisplay,
  formatEditing,
  formatPartial,
  getNumberSymbols,
  hasShorthand,
  isExpression,
  maxSafe,
  parseNumber,
  round,
  sanitize,
} from "../utils";
import { handleNumberKeyDown } from "./use-number-keyboard";
import { useRememberedExpression } from "./use-remembered-expression";
import { useWheelStep } from "./use-wheel-step";

/** Options of `useNumberInput`: the props of `NumberField` with their defaults applied. */
export interface UseNumberInputOptions {
  /** The input, for the caret, selection and wheel. */
  inputRef: RefObject<HTMLInputElement | null>;
  /** Controlled value; `null` is empty. */
  value?: number | null;
  /** Initial value when uncontrolled. */
  defaultValue?: number | null;
  /** Called with the parsed value while typing and on commit. */
  onValueChange?: (value: number | null) => void;
  /** Lowest value. */
  min?: number;
  /** Highest value. */
  max?: number;
  /** Whether a commit clamps to `[min, max]`. */
  clampOnBlur: boolean;
  /** Whether negative values are allowed. */
  allowNegative: boolean;
  /** Step of the arrows and buttons. */
  step: number;
  /** Step with Shift, PageUp and PageDown. */
  largeStep: number;
  /** Locale of the separators. */
  locale: string;
  /** Whether thousands are separated. */
  grouping: boolean;
  /** Maximum fraction digits; unlimited without it. */
  decimals?: number;
  /** Whether the fraction is padded to `decimals`. */
  padDecimals: boolean;
  /** How negatives show when not editing. */
  negativeFormat: "minus" | "parentheses";
  /** Whether focus selects the text. */
  selectOnFocus: boolean;
  /** Whether the mouse wheel steps. */
  wheel: boolean;
  /** Whether `k`, `m` and `b` expand. */
  shorthand: boolean;
  /** Whether arithmetic is evaluated. */
  expressions: boolean;
  /** The field cannot change (disabled or loading). */
  locked: boolean;
  /** The consumer's handler, run after the text is applied. */
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  /** The consumer's handler, run after editing starts. */
  onFocus?: (event: FocusEvent<HTMLInputElement>) => void;
  /** The consumer's handler, run after the commit. */
  onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
  /** The consumer's handler, run first; `preventDefault()` skips the field's key handling. */
  onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
  /** The consumer's handler, run first; `preventDefault()` skips the field's paste handling. */
  onPaste?: (event: ClipboardEvent<HTMLInputElement>) => void;
}

/** Which way a step moves. */
type Direction = "increment" | "decrement";

/**
 * State machine of the number field: a committed `value` (`number | null`), and a `draft` text
 * shown while editing. Typing reformats live and keeps the caret; Enter or blur commits
 * (shorthand, expression, rounding, clamping); Escape restores the last committed text.
 */
export function useNumberInput(options: UseNumberInputOptions) {
  const {
    inputRef,
    min,
    max,
    clampOnBlur,
    allowNegative,
    step,
    largeStep,
    locale,
    grouping,
    decimals,
    padDecimals,
    negativeFormat,
    selectOnFocus,
    wheel,
    shorthand,
    expressions,
    locked,
  } = options;

  const symbols = useMemo(() => getNumberSymbols(locale), [locale]);
  const format: FormatOptions = useMemo(
    () => ({ symbols, grouping, decimals, padDecimals, negativeFormat }),
    [symbols, grouping, decimals, padDecimals, negativeFormat],
  );

  const [value, setValue] = useControllableState<number | null>({
    value: options.value,
    defaultValue: options.defaultValue ?? null,
    onChange: options.onValueChange,
  });
  const [focused, setFocused] = useState(false);
  const [draft, setDraft] = useState("");
  const [expressionError, setExpressionError] = useState(false);
  const { memory, remember, forget } = useRememberedExpression(value);

  const snapshot = useRef<{ draft: string; value: number | null }>({ draft: "", value: null });
  const pendingCaret = useRef<number | null>(null);
  /** The text right after the last commit: committing it again changes nothing. */
  const committedText = useRef<string | null>(null);
  const pendingSelectAll = useRef(false);

  const lowerBound = allowNegative ? min : Math.max(min ?? 0, 0);

  const report = useCallback(
    (next: number | null) => {
      if (next !== value) setValue(next);
    },
    [value, setValue],
  );

  // Put the caret back (or select all) once the new draft is rendered.
  useLayoutEffect(() => {
    const input = inputRef.current;
    if (!input || input.ownerDocument.activeElement !== input) return;
    if (pendingSelectAll.current) {
      pendingSelectAll.current = false;
      input.select();
    } else if (pendingCaret.current !== null) {
      input.setSelectionRange(pendingCaret.current, pendingCaret.current);
      pendingCaret.current = null;
    }
  });

  /** Applies a raw text (typed, or produced by a key) with its caret. */
  const applyText = useCallback(
    (raw: string, caret: number) => {
      setExpressionError(false);
      if (expressions && isExpression(raw)) {
        setDraft(raw);
        return;
      }
      if (shorthand && hasShorthand(raw)) {
        setDraft(sanitize(raw, { symbols, decimals, allowNegative, shorthand }));
        return;
      }
      const clean = sanitize(raw, { symbols, decimals, allowNegative });
      const formatted = formatPartial(clean, format);
      pendingCaret.current = caretFromCount(
        formatted,
        countSignificant(raw, caret, symbols),
        symbols,
      );
      setDraft(formatted);
      const parsed = parseNumber(clean, symbols, { allowNegative });
      if (parsed !== undefined) report(parsed);
    },
    [expressions, shorthand, symbols, decimals, allowNegative, format, report],
  );

  const commit = useCallback((): boolean => {
    const text = draft;
    // Already committed (e.g. Enter, then blur): keep the value and any remembered expression.
    if (text === committedText.current && !expressionError) return false;
    let result: number | null | undefined;
    let source: string | undefined;

    if (expressions && isExpression(text)) {
      const evaluated = evaluateExpression(text, symbols);
      if (!evaluated.ok) {
        setExpressionError(true);
        return true;
      }
      result = evaluated.value;
      source = text.trim();
    } else if (shorthand && hasShorthand(text)) {
      result = applyShorthand(text, symbols);
    } else {
      result = parseNumber(text, symbols, { allowNegative });
    }

    if (result === undefined) result = value;
    if (result !== null) {
      result = round(result, decimals);
      if (!allowNegative && result < 0) result = 0;
      if (clampOnBlur) result = clamp(result, lowerBound, max);
      if (isDev && Math.abs(result) > maxSafe(decimals ?? decimalPlaces(result))) {
        console.warn(
          `NumberField: ${result} is beyond the range where a number keeps its digits exact.`,
        );
      }
    }

    setExpressionError(false);
    report(result);
    if (source && result !== null) remember(source, result);
    else forget();

    const next = formatEditing(result, format);
    setDraft(next);
    committedText.current = next;
    snapshot.current = { draft: source ?? next, value: result };
    return next !== text;
  }, [
    draft,
    expressionError,
    expressions,
    shorthand,
    symbols,
    allowNegative,
    value,
    decimals,
    clampOnBlur,
    lowerBound,
    max,
    report,
    remember,
    forget,
    format,
  ]);

  const setTo = useCallback(
    (next: number) => {
      const bounded = clamp(round(next, decimals), lowerBound, max);
      setExpressionError(false);
      forget();
      report(bounded);
      if (focused) {
        const text = formatEditing(bounded, format);
        pendingCaret.current = text.length;
        setDraft(text);
      }
    },
    [decimals, lowerBound, max, forget, report, focused, format],
  );

  const step_ = useCallback(
    (direction: Direction, large = false) => {
      if (locked) return;
      const amount = (large ? largeStep : step) * (direction === "increment" ? 1 : -1);
      const base = value ?? clamp(0, lowerBound, max);
      setTo(addScaled(base, amount));
    },
    [locked, largeStep, step, value, lowerBound, max, setTo],
  );

  useWheelStep(inputRef, wheel && !locked, (direction) => step_(direction));

  const canIncrement = !locked && !(max !== undefined && value !== null && value >= max);
  const canDecrement =
    !locked && !(lowerBound !== undefined && value !== null && value <= lowerBound);

  const deleteAcrossSeparator = useCallback(
    (key: "Backspace" | "Delete"): boolean => {
      const input = inputRef.current;
      if (!input || !grouping) return false;
      const start = input.selectionStart ?? 0;
      if (start !== (input.selectionEnd ?? 0)) return false;
      const text = input.value;
      if (key === "Backspace" && start >= 2 && text.charAt(start - 1) === symbols.group) {
        applyText(text.slice(0, start - 2) + text.slice(start), start - 2);
        return true;
      }
      if (key === "Delete" && text.charAt(start) === symbols.group) {
        applyText(text.slice(0, start) + text.slice(start + 2), start);
        return true;
      }
      return false;
    },
    [inputRef, grouping, symbols.group, applyText],
  );

  const inputProps = {
    value: focused || expressionError ? draft : formatDisplay(value, format),
    onChange: (event: ChangeEvent<HTMLInputElement>) => {
      applyText(event.target.value, event.target.selectionStart ?? event.target.value.length);
      options.onChange?.(event);
    },
    onFocus: (event: FocusEvent<HTMLInputElement>) => {
      const text = expressionError ? draft : memory ? memory.source : formatEditing(value, format);
      setDraft(text);
      snapshot.current = { draft: text, value };
      setFocused(true);
      pendingSelectAll.current = selectOnFocus;
      options.onFocus?.(event);
    },
    onBlur: (event: FocusEvent<HTMLInputElement>) => {
      commit();
      setFocused(false);
      options.onBlur?.(event);
    },
    onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => {
      options.onKeyDown?.(event);
      if (event.defaultPrevented) return;
      handleNumberKeyDown(event, {
        step: step_,
        toMin: lowerBound !== undefined ? () => setTo(lowerBound) : undefined,
        toMax: max !== undefined ? () => setTo(max) : undefined,
        commit,
        revert: () => {
          const { draft: previousDraft, value: previousValue } = snapshot.current;
          if (previousDraft === draft && previousValue === value && !expressionError) return false;
          setExpressionError(false);
          setDraft(previousDraft);
          report(previousValue);
          return true;
        },
        deleteAcrossSeparator,
      });
    },
    onPaste: (event: ClipboardEvent<HTMLInputElement>) => {
      options.onPaste?.(event);
      if (event.defaultPrevented) return;
      const text = event.clipboardData.getData("text");
      // Plain digits, shorthand and expressions are inserted as typed; formatted amounts replace
      // the whole value.
      if (/^\d+$/.test(text.trim())) return;
      if (expressions && isExpression(text)) return;
      if (shorthand && hasShorthand(text)) return;
      event.preventDefault();
      const parsed = parseNumber(text, symbols, { allowNegative });
      if (parsed === undefined || parsed === null) return;
      const rounded = round(parsed, decimals);
      const next = formatEditing(rounded, format);
      setExpressionError(false);
      forget();
      pendingCaret.current = next.length;
      setDraft(next);
      report(rounded);
    },
  };

  return {
    value,
    inputProps,
    step: step_,
    canIncrement,
    canDecrement,
    expressionError,
    remembered: memory,
    format,
  };
}
