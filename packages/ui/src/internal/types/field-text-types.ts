import type { ReactNode } from "react";

/**
 * The loading state and the accessible name of its spinner. Turning `loading` on (including a
 * runtime boolean such as `loading={isSaving}`) requires `loadingLabel`; no text is generated.
 */
export type FieldLoadingTexts =
  | {
      /** Disables the input and the action and shows a spinner inside the input frame. */
      loading?: false;
      /** Only allowed together with `loading`. */
      loadingLabel?: never;
    }
  | {
      /** Disables the input and the action and shows a spinner inside the input frame. */
      loading: boolean;
      /** Accessible name of the loading spinner, in the developer's language. Required with `loading`. */
      loadingLabel: string;
    };

/**
 * The info tooltip and the accessible name of its button. Passing `info` requires `infoLabel`;
 * no text is generated.
 */
export type FieldInfoTexts =
  | {
      /**
       * Content of the info tooltip. Shows an info button at the far end of the label row and adds
       * the content to the input's accessible description.
       */
      info?: undefined;
      /** Only allowed together with `info`. */
      infoLabel?: never;
    }
  | {
      /**
       * Content of the info tooltip. Shows an info button at the far end of the label row and adds
       * the content to the input's accessible description.
       */
      info: ReactNode;
      /** Accessible name of the info button, in the developer's language. Required with `info`. */
      infoLabel: string;
    };

/** The texts every field requires when its loading state or its info tooltip is used. */
export type FieldTexts = FieldLoadingTexts & FieldInfoTexts;

/**
 * Loading and info props as the shared internals read them. The public unions only constrain the
 * consumer; inside the library every member is optional.
 */
export interface FieldStatusInternal {
  /** Whether the loading spinner is shown. */
  loading?: boolean;
  /** Accessible name of the spinner. */
  loadingLabel?: string;
  /** Content of the info tooltip; no info button without it. */
  info?: ReactNode;
  /** Accessible name of the info button. */
  infoLabel?: string;
}

/** `Omit` that keeps discriminated unions: it omits the keys from each member separately. */
export type DistributiveOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never;
