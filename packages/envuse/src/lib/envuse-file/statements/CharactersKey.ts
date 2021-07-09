import { range } from "./range";

export namespace CharactersKey {
  /** symbol: = */
  export const equalsSign = 0x3d;
  /** symbol: \ */
  export const backslash = 0x5c;
  /** symbol: " */
  export const doubleQuotes = 0x22;
  /** symbol: ' */
  export const singleQuote = 0x27;
  /** symbol: . */
  export const dot = 0x2e;
  /** symbol: # */
  export const numberSign = 0x23;
  /** symbols: 0123456789 */
  export const numbers = Array.from(range(0x30, 0x39));
  /** symbols: abcdefghijklmnopqrstuvwxyz */
  export const english_alphabet_lower = Array.from(range(0x61, 0x7a));
  /** symbols: ABCDEFGHIJKLMNOPQRSTUVWXYZ */
  export const english_alphabet_upper = Array.from(range(0x41, 0x5a));
  /** symbols: abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ */
  export const english_alphabet = [
    ...english_alphabet_lower,
    ...english_alphabet_upper,
  ];
  /** symbol: _ */
  export const underscore = 0x5f;
  /** symbol: - */
  export const hyphenMinus = 0x2d;
  /** symbol: " " */
  export const space = 0x20;
  /** symbol: "\n" */
  export const newLineLF = 0x0a;
  /** symbol: "\r" */
  export const carriageReturn = 0x0d;
  /** symbols: "\r\n" */
  export const newLineCRLF = [carriageReturn, newLineLF];
  /** symbol: "\t" */
  export const horizontalTab = 0x09;
}
