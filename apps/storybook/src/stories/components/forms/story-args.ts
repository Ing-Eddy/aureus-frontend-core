/** Every key of every member of a union. */
type AllKeys<T> = T extends unknown ? keyof T : never;

/** The type of `K` across the members of a union that have it. */
type ValueAt<T, K extends PropertyKey> = T extends unknown
  ? K extends keyof T
    ? T[K]
    : never
  : never;

/**
 * Story args for a component whose props are discriminated unions (a feature and the texts it
 * requires): one flat object where every prop is optional, so the Controls panel can turn each
 * feature and its texts on and off. Stories cast the args back to the component's props when
 * they render it; the union still checks every hand-written element.
 */
export type StoryArgs<P> = { [K in AllKeys<P>]?: ValueAt<P, K> };

type LoadingTexts =
  | { loading?: false; loadingLabel?: undefined }
  | { loading: true; loadingLabel: string };
type InfoTexts = { info?: undefined; infoLabel?: undefined } | { info: string; infoLabel: string };

/** The loading props of a playground: `loadingLabel` only while `loading` is on. */
export function loadingTexts(loading: boolean, loadingLabel: string): LoadingTexts {
  return loading ? { loading: true, loadingLabel } : {};
}

/** The info props of a playground: the tooltip and `infoLabel` only when `info` has text. */
export function infoTexts(info: string, infoLabel: string): InfoTexts {
  return info ? { info, infoLabel } : {};
}
