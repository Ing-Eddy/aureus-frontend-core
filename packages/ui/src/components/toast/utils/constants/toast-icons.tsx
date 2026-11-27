import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react";
import type { ReactNode } from "react";
import type { ToastStatus } from "../../types";

/** The icon of each status; `neutral` has none. They are decorative, so hidden from readers. */
export const toastIcons: Partial<Record<ToastStatus, ReactNode>> = {
  success: <CircleCheckIcon aria-hidden="true" />,
  info: <InfoIcon aria-hidden="true" />,
  warning: <TriangleAlertIcon aria-hidden="true" />,
  danger: <OctagonXIcon aria-hidden="true" />,
  // Not shadcn's Spinner: it carries a fixed English accessible name.
  loading: <Loader2Icon aria-hidden="true" className="animate-spin" />,
};
