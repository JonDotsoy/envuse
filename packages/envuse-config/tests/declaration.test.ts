import * as t from "node:test";
import assert from "node:assert/strict";
import { describeDeclaration } from "../src/declaration";
import { parse } from "../src/parse";
import { lines } from "./utils/lines";

t.test("generate declaration", () => {
  const payload = lines`
    ABC: string
    DEF: number
    GHI
    ARR: array
    OBJ: json
  `;

  const declaration = describeDeclaration(parse(payload));

  assert.deepEqual(declaration, {
    variables: {
      ABC: { type: "string", value_template: null },
      DEF: { type: "number", value_template: null },
      GHI: { type: "string", value_template: null },
      ARR: { type: "array", value_template: null },
      OBJ: { type: "json", value_template: null },
    },
  });
});
