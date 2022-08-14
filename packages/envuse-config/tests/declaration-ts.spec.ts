import * as t from "node:test";
import assert from "node:assert/strict";
import { lines } from "./utils/lines";
import { describeDeclaration } from "../src/declaration";
import { parse } from "../src/parse";
import { describeDeclarationTs } from "../src/declaration-ts";
import { Console } from "node:console";

t.test("generate ts definition", (t) => {
  const payload = lines`
    ABC: string
    DEF: number
    GHI
    ZZZ: json
    arr: array
  `;

  const declaration = describeDeclaration(parse(payload));
  const tsStr = describeDeclarationTs(declaration).toString();

  const expectTSStr =
    "" +
    `\n` +
    `  {\n` +
    `    "ABC": string\n` +
    `    "DEF": number\n` +
    `    "GHI": string\n` +
    `    "ZZZ": any\n` +
    `    "arr": string[]\n` +
    `  }\n`;

  assert.equal(tsStr, expectTSStr);
});
