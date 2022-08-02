import { inspect } from "util";
import { parse } from "./parse";

const res = parse(`
# hola
ABC : string = \`a\`
BBB : number = \`b\`

`);

// Error.prepareStackTrace

console.log(inspect(res, { depth: null, colors: true }));
