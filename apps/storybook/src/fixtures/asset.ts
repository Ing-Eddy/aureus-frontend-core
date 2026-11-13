/**
 * URL of a file in `public/`. `BASE_URL` is "/" in dev and tests and "./" in the static build, so
 * the same story works locally and on GitHub Pages, where the site lives under `/<repo>/`.
 */
export const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;
