import { UserIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/shadcn/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/shadcn/ui/avatar";
import { initials } from "../utils";

export type AvatarSize = "sm" | "md" | "lg" | "xl";

/** Side of each size, and the matching text size of the initials. */
export const avatarSizes: Record<AvatarSize, string> = {
  sm: "size-6 text-[0.625rem]",
  md: "size-10 text-sm",
  lg: "size-16 text-lg",
  xl: "size-24 text-2xl",
};

/** The mask of a shape, on the avatar and on everything that follows its outline. */
export const shapeClassName = (shape: "circle" | "square") =>
  shape === "circle" ? "rounded-full" : "rounded-lg";

export interface AvatarPreviewProps {
  src?: string;
  shape: "circle" | "square";
  size: AvatarSize;
  fallback?: ReactNode;
  initialsFrom?: string;
  /** Upload progress, from 0 to 100, with its accessible name; no ring without it. */
  progress?: { value: number; label: string | undefined };
  className?: string;
}

/**
 * The avatar: the photo, or the fallback while there is none or it fails to load. The fallback is
 * the consumer's `fallback`, then the initials of `initialsFrom`, then a decorative user icon. The
 * image is decorative (`alt=""`): the button around it carries the name.
 */
export function AvatarPreview({
  src,
  shape,
  size,
  fallback,
  initialsFrom,
  progress,
  className,
}: AvatarPreviewProps) {
  const radius = shapeClassName(shape);
  const letters = initials(initialsFrom);
  return (
    <span data-slot="avatar-preview" className="relative inline-flex shrink-0">
      <Avatar
        data-shape={shape}
        className={cn(avatarSizes[size], radius, "after:rounded-[inherit]", className)}
      >
        {src ? <AvatarImage src={src} alt="" className={radius} /> : null}
        <AvatarFallback data-slot="avatar-fallback-content" className={cn(radius, "font-medium")}>
          {fallback ??
            (letters ? (
              // Drawn with CSS, so the letters are not text content: a button around the avatar is
              // named only by its label, and its visible text never contradicts that name.
              <span
                aria-hidden="true"
                data-slot="avatar-initials"
                data-initials={letters}
                className="after:content-[attr(data-initials)]"
              />
            ) : (
              <UserIcon aria-hidden="true" className="size-1/2" />
            ))}
        </AvatarFallback>
      </Avatar>
      {progress ? <ProgressRing {...progress} shape={shape} /> : null}
    </span>
  );
}

/** A ring over the avatar that fills with the upload's progress. */
function ProgressRing({
  value,
  label,
  shape,
}: {
  value: number;
  label: string | undefined;
  shape: "circle" | "square";
}) {
  const circumference = 2 * Math.PI * 46;
  return (
    <span
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(value)}
      data-slot="avatar-progress"
      className={cn("absolute inset-0 bg-background/40", shapeClassName(shape))}
    >
      <svg viewBox="0 0 100 100" aria-hidden="true" className="size-full -rotate-90">
        <circle cx="50" cy="50" r="46" fill="none" strokeWidth="6" className="stroke-muted" />
        <circle
          cx="50"
          cy="50"
          r="46"
          fill="none"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - value / 100)}
          className="stroke-primary transition-[stroke-dashoffset] motion-reduce:transition-none"
        />
      </svg>
    </span>
  );
}
