import * as t from "node:test";
import assert from "node:assert/strict";
import { updateDeclarationPayload } from "../src/update-declaration-payload";
import { lines } from "./utils/lines";
import { parse } from "../src/parse";
import { describeDeclaration } from "../src/declaration";

t.test("should generate first declaration payload", () => {
  let doc = parse(lines`
    ABC: string
  `);

  let declaration = describeDeclaration(doc);

  let payload = ``;

  const payloadResult = updateDeclarationPayload(
    payload,
    `configs/production.["\r\nabc"].envuse`,
    declaration
  );
  const payloadResultExpected = lines`
    /** @declaration {"configTypes":{"configs/production.[\"\r\nabc\"].envuse":{"variables":{"ABC":{"type":"string","value_template":null,"_node":null}}}}} */

    export type listConfigTypes =
      {
        "configs/production.[\"\r\nabc\"].envuse": 
          {
            "ABC": string
          }
    
      }
  
  `;

  assert.deepEqual(payloadResult, payloadResultExpected);
});

t.test("should generate first declaration payload", () => {
  let doc = parse(lines`
    ABC: string
  `);

  let declaration = describeDeclaration(doc);

  let payload = ``;

  const payloadResult = updateDeclarationPayload(payload, "abc", declaration);
  const payloadResultExpected = lines`
    /** @declaration {"configTypes":{"abc":{"variables":{"ABC":{"type":"string","value_template":null,"_node":null}}}}} */

    export type listConfigTypes =
      {
        "abc": 
          {
            "ABC": string
          }
    
      }
  
  `;

  assert.deepEqual(payloadResult, payloadResultExpected);
});

t.test("should update declaration payload", () => {
  let doc = parse(lines`
    ABC: string
    DEF: number
    GHI: boolean
    JK: array
  `);

  let declaration = describeDeclaration(doc);

  let payload = lines`
    /** @declaration {"configTypes":{"xyz":{"variables":{"ABC":{"type":"string","value_template":null,"_node":null}}}}} */

    export type listConfigTypes = {
      "xyz": {
        NAME: string;
      };
    };
  `;

  const payloadResult = updateDeclarationPayload(payload, "abc", declaration);
  const payloadResultExpected = lines`
    /** @declaration {"configTypes":{"xyz":{"variables":{"ABC":{"type":"string","value_template":null,"_node":null}}},"abc":{"variables":{"ABC":{"type":"string","value_template":null,"_node":null},"DEF":{"type":"number","value_template":null,"_node":null},"GHI":{"type":"boolean","value_template":null,"_node":null},"JK":{"type":"array","value_template":null,"_node":null}}}}} */

    export type listConfigTypes =
      {
        "xyz": 
          {
            "ABC": string
          }

        "abc": 
          {
            "ABC": string
            "DEF": number
            "GHI": boolean
            "JK": string[]
          }

      }

  `;

  assert.deepEqual(payloadResult, payloadResultExpected);
});
