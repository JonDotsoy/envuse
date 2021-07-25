import { DataSource } from "../../data-source";
import { diff } from "./diff";
import { b } from "./toBuffer";

describe("diff", () => {
  it("should diff deleted", () => {
    const block1 = DataSource.createDataSource(
      Buffer.concat([
        b("foo=bar\n"),
        b("aaa=bbb\n"),
        b("ccc=ddd\n"),
        b("hhh=iii\n"),
      ])
    );

    const block2 = DataSource.createDataSource(
      Buffer.concat([
        b("foo=bar\n"),
        b("aaa=bbb\n"),
        b("eee=fff\n"),
        b("hhh=jjj\n"),
      ])
    );

    expect(diff(block1, block2)).toMatchInlineSnapshot(`
      Object {
        "changes": Array [
          Object {
            "base": Object {
              "$type": "Variable",
              "children": undefined,
              "end": 23,
              "keyVariable": Object {
                "$type": "VariableKey",
                "children": undefined,
                "end": 19,
                "pos": 16,
                "value": "ccc",
              },
              "pos": 16,
              "typeVariable": undefined,
              "valueVariable": Object {
                "$type": "VariableValue",
                "children": undefined,
                "end": 23,
                "pos": 20,
                "value": "ddd",
              },
            },
            "type": "deleted",
          },
          Object {
            "base": Object {
              "$type": "Variable",
              "children": undefined,
              "end": 31,
              "keyVariable": Object {
                "$type": "VariableKey",
                "children": undefined,
                "end": 27,
                "pos": 24,
                "value": "hhh",
              },
              "pos": 24,
              "typeVariable": undefined,
              "valueVariable": Object {
                "$type": "VariableValue",
                "children": undefined,
                "end": 31,
                "pos": 28,
                "value": "iii",
              },
            },
            "compare": Object {
              "$type": "Variable",
              "children": undefined,
              "end": 31,
              "keyVariable": Object {
                "$type": "VariableKey",
                "children": undefined,
                "end": 27,
                "pos": 24,
                "value": "hhh",
              },
              "pos": 24,
              "typeVariable": undefined,
              "valueVariable": Object {
                "$type": "VariableValue",
                "children": undefined,
                "end": 31,
                "pos": 28,
                "value": "jjj",
              },
            },
            "type": "changed",
          },
          Object {
            "compare": Object {
              "$type": "Variable",
              "children": undefined,
              "end": 23,
              "keyVariable": Object {
                "$type": "VariableKey",
                "children": undefined,
                "end": 19,
                "pos": 16,
                "value": "eee",
              },
              "pos": 16,
              "typeVariable": undefined,
              "valueVariable": Object {
                "$type": "VariableValue",
                "children": undefined,
                "end": 23,
                "pos": 20,
                "value": "fff",
              },
            },
            "type": "append",
          },
        ],
      }
    `);
  });
});
