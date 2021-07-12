import { CharactersKey } from "./CharactersKey";


export const charactersKeys = Buffer.from([
  CharactersKey.underscore,
  CharactersKey.hyphenMinus,
  ...CharactersKey.english_alphabet_lower,
  ...CharactersKey.english_alphabet_upper,
]);
