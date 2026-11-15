import { zodResolver } from "@hookform/resolvers/zod";
import { type RenderResult, render } from "@testing-library/react";
import type { ReactNode } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { type Mock, vi } from "vitest";
import { z } from "zod";
import { TooltipProvider } from "@/shadcn/ui/tooltip";

export const signupSchema = z.object({
  plan: z.string({ error: "Choose a plan." }),
  source: z.string({ error: "Tell us how you found us." }).min(1, "Tell us how you found us."),
});

/** Accepts any value, to observe what react-hook-form submits for disabled or loading fields. */
export const lenientSchema = z.object({ plan: z.unknown(), source: z.unknown() });

export type Signup = { plan: string | null; source: string | null };
type Schema = typeof signupSchema | typeof lenientSchema;

export const plans = [
  { value: "free", label: "Free" },
  { value: "pro", label: "Pro" },
  { value: "enterprise", label: "Enterprise", disabled: true },
];

export const sources = [
  { value: "search", label: "Search engine" },
  { value: "friend", label: "A friend" },
];

function Harness({
  children,
  defaultValues,
  schema,
  onSubmit,
}: {
  children: ReactNode;
  defaultValues: Partial<Signup>;
  schema: Schema;
  onSubmit: (values: Signup) => void;
}) {
  const form = useForm<Signup>({
    resolver: zodResolver(schema as unknown as typeof lenientSchema) as never,
    defaultValues,
  });
  return (
    <TooltipProvider>
      <FormProvider {...form}>
        <form noValidate onSubmit={form.handleSubmit((values) => onSubmit(values))}>
          {children}
          <button type="submit">Save</button>
        </form>
      </FormProvider>
    </TooltipProvider>
  );
}

/** Renders `children` inside a schema-driven form, the way consumers use controls. */
export function renderInForm(
  children: ReactNode,
  defaultValues: Partial<Signup> = { plan: null, source: null },
  schema: Schema = signupSchema,
): RenderResult & { onSubmit: Mock<(values: Signup) => void> } {
  const onSubmit = vi.fn<(values: Signup) => void>();
  const result = render(
    <Harness defaultValues={defaultValues} schema={schema} onSubmit={onSubmit}>
      {children}
    </Harness>,
  );
  return { ...result, onSubmit };
}
