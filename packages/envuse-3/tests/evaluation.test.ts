import * as t from "node:test";
import assert from "node:assert/strict";
import { evaluate } from "../src/evaluation";
import { lines } from "./utils/lines";
import { parse } from "../src/parse";
import { describeDeclaration } from "../src/declaration";
import {
  CannotConvert,
  FieldCannotConvert,
} from "../src/errors/evaluation-error";
import { mkdirSync, writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { inspect } from "node:util";
import {
  DocumentSchema,
  NodeDocumentSchema,
  VariableSchema,
} from "../src/types/node";

t.test("evaluate sample payload envuse", (t) => {
  let payload = lines`
    # comment
    ABC: number
    # asd
  `;

  const doc = parse(payload);
  const declaration = describeDeclaration(doc);
  const evaluation = evaluate(declaration, { ABC: "320" });

  assert.deepEqual(evaluation.config, {
    ABC: 320,
  });
});

t.test("should wrong in evaluate value string", () => {
  let payload = lines`
    ABC: string
  `;

  const doc = parse(payload);
  const declaration = describeDeclaration(doc);

  const { message } = new FieldCannotConvert({
    key: "ABC",
    raw: undefined,
    type: "string",
  });

  assert.throws(
    () => {
      evaluate(declaration, {});
    },
    { message }
  );
});

t.test("should wrong in evaluate value string and indicate the trace", () => {
  let payload = lines`
    AAA:number
    ABC:no_valid_type
    CCC:no_valid_type
  `;
  // mkdirSync(`${__dirname}/demos`, { recursive: true })
  // writeFileSync(`${__dirname}/demos/demo01.envuse`, payload)

  const doc = parse(payload);
  NodeDocumentSchema.parse(doc);
  // writeFileSync(`${__dirname}/demos/demo01.envuse.ast`, inspect(doc, { depth: null }))
  const declaration = describeDeclaration(doc);

  const { message } = new FieldCannotConvert({
    key: "ABC",
    raw: undefined,
    type: "string",
  });

  evaluate(
    declaration,
    { AAA: "123" },
    { location: pathToFileURL(`${__dirname}/demos/demo01.envuse`) }
  );
});
