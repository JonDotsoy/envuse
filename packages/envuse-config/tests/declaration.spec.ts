import * as t from "node:test";
import assert from "node:assert/strict";
import { describeDeclaration } from "../src/declaration";
import { parse } from "../src/parse";
import { lines } from "./utils/lines";
import { z } from "zod";

t.test("generate declaration", () => {
  const payload = lines`
    ABC: string
    DEF: number
    GHI
    ARR: array
    OBJ: json
  `;

  const declaration = describeDeclaration(parse(payload));

  z.object({
    variables: z.object({
      ABC: z.object({ type: z.literal("string"), value_template: z.null() }),
      DEF: z.object({ type: z.literal("number"), value_template: z.null() }),
      GHI: z.object({ type: z.literal("string"), value_template: z.null() }),
      ARR: z.object({ type: z.literal("array"), value_template: z.null() }),
      OBJ: z.object({ type: z.literal("json"), value_template: z.null() }),
    }),
  }).parse(declaration);
});
