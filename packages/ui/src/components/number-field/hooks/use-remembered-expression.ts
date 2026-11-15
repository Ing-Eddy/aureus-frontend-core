import { useCallback, useEffect, useState } from "react";

export interface RememberedExpression {
  source: string;
  result: number;
}

/**
 * The last expression the user committed, kept while the field is mounted. It is forgotten as
 * soon as the value stops being its result (a typed number, a step, or a change from outside).
 */
export function useRememberedExpression(value: number | null) {
  const [memory, setMemory] = useState<RememberedExpression | null>(null);

  useEffect(() => {
    if (memory && memory.result !== value) setMemory(null);
  }, [value, memory]);

  const remember = useCallback(
    (source: string, result: number) => setMemory({ source, result }),
    [],
  );
  const forget = useCallback(() => setMemory(null), []);

  return { memory: memory && memory.result === value ? memory : null, remember, forget };
}
