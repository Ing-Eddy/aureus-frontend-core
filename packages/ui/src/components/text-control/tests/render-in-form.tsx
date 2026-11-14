import { zodResolver } from "@hookform/resolvers/zod";
import { type RenderResult, render } from "@testing-library/react";
import type { ReactNode } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { type Mock, vi } from "vitest";
import { z } from "zod";
import { TooltipProvider } from "@/shadcn/ui/tooltip";

export const profileSchema = z.object({
  username: z.string().min(3, "At least 3 characters"),
  nickname: z.string(),
});

export type Profile = z.infer<typeof profileSchema>;

interface HarnessProps {
  children: ReactNode;
  defaultValues: Profile;
  onSubmit: (values: Profile) => void;
}

function Harness({ children, defaultValues, onSubmit }: HarnessProps) {
  const form = useForm<Profile>({ resolver: zodResolver(profileSchema), defaultValues });
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
  defaultValues: Profile,
): RenderResult & { onSubmit: Mock<(values: Profile) => void> } {
  const onSubmit = vi.fn<(values: Profile) => void>();
  const result = render(
    <Harness defaultValues={defaultValues} onSubmit={onSubmit}>
      {children}
    </Harness>,
  );
  return { ...result, onSubmit };
}
