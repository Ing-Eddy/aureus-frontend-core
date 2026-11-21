/**
 * The tokens of the internal pattern formatter (the Unicode / date-fns letters). A run of the
 * same letter is one token; any other unquoted letter run is written literally, with a warning.
 */
export const dateTokens = new Set([
  "yyyy",
  "yy",
  "M",
  "MM",
  "MMM",
  "MMMM",
  "d",
  "dd",
  "EEE",
  "EEEE",
  "H",
  "HH",
  "h",
  "hh",
  "m",
  "mm",
  "s",
  "ss",
  "a",
]);
