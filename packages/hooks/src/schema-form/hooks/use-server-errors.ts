import { useEffect, useRef } from "react";
import type { FieldValues, UseFormReturn } from "react-hook-form";
import type { ApplyServerErrorsOptions } from "../types";
import { setServerErrors } from "../utils/helpers";

/**
 * Sets `serverErrors` on the form each time a new object is received. The same object passed again on
 * later renders is not set again, so an error the user has fixed does not come back.
 */
export function useServerErrors<In extends FieldValues, B>(
  // biome-ignore lint/suspicious/noExplicitAny: any form, whatever its context and output types.
  form: UseFormReturn<In, any, any>,
  serverErrors: B | null | undefined,
  options: ApplyServerErrorsOptions<B, In>,
): void {
  // The latest options, read when errors arrive, so inline functions do not re-apply the errors.
  const optionsRef = useRef(options);
  optionsRef.current = options;

  useEffect(() => {
    setServerErrors(form, serverErrors, optionsRef.current, "useSchemaForm");
  }, [form, serverErrors]);
}
