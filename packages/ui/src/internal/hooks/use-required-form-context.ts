import { type FieldValues, type UseFormReturn, useFormContext } from "react-hook-form";

/**
 * The surrounding react-hook-form context. Throws a descriptive error, naming the component,
 * when there is no `FormProvider` above it.
 */
export function useRequiredFormContext(componentName: string): UseFormReturn<FieldValues> {
  // `useFormContext` is typed as non-null but returns null outside a provider.
  const context = useFormContext() as UseFormReturn<FieldValues> | null;
  if (!context) {
    throw new Error(`${componentName} must be rendered inside a react-hook-form FormProvider.`);
  }
  return context;
}
