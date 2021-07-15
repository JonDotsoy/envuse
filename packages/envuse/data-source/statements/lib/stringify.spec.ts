import { stringify } from "./stringify";
import { b } from "./toBuffer";
import { DataSource } from "../../data-source";
import { BlockType } from "../comps/Block";

describe("parse ast", () => {
  it("should parse ast variable", () => {
    const body = DataSource.createDataSource(Buffer.concat([b(`a=3\n`)]));

    expect(JSON.stringify(body, null, 2)).toMatchInlineSnapshot(`
      "{
        \\"$type\\": \\"Block\\",
        \\"pos\\": 0,
        \\"end\\": 4,
        \\"children\\": [
          {
            \\"$type\\": \\"Variable\\",
            \\"pos\\": 0,
            \\"end\\": 4,
            \\"keyVariable\\": {
              \\"$type\\": \\"VariableKey\\",
              \\"pos\\": 0,
              \\"end\\": 1,
              \\"value\\": \\"a\\"
            },
            \\"valueVariable\\": {
              \\"$type\\": \\"VariableValue\\",
              \\"pos\\": 2,
              \\"end\\": 4,
              \\"value\\": \\"3\\"
            }
          }
        ]
      }"
    `);
  });

  it("should parse ast operator", () => {
    const body = DataSource.createDataSource(
      Buffer.concat([b(`#; if true\n`), b(`a=b\n`), b(`#; fi\n`)])
    );

    expect(JSON.stringify(body, null, 2)).toMatchInlineSnapshot(`
      "{
        \\"$type\\": \\"Block\\",
        \\"pos\\": 0,
        \\"end\\": 21,
        \\"children\\": [
          {
            \\"$type\\": \\"CommentOperator\\",
            \\"pos\\": 0,
            \\"end\\": 20,
            \\"operator\\": {
              \\"$type\\": \\"VariableKey\\",
              \\"pos\\": 3,
              \\"end\\": 5,
              \\"value\\": \\"if\\"
            },
            \\"statement\\": {
              \\"$type\\": \\"CommentOperatorStatement\\",
              \\"pos\\": 6,
              \\"end\\": 11,
              \\"statements\\": [
                {
                  \\"$type\\": \\"StatementObject\\",
                  \\"pos\\": 6,
                  \\"end\\": 10,
                  \\"type\\": \\"Boolean\\",
                  \\"value\\": true
                }
              ]
            },
            \\"block\\": {
              \\"$type\\": \\"Block\\",
              \\"pos\\": 11,
              \\"end\\": 20,
              \\"children\\": [
                {
                  \\"$type\\": \\"Variable\\",
                  \\"pos\\": 11,
                  \\"end\\": 15,
                  \\"keyVariable\\": {
                    \\"$type\\": \\"VariableKey\\",
                    \\"pos\\": 11,
                    \\"end\\": 12,
                    \\"value\\": \\"a\\"
                  },
                  \\"valueVariable\\": {
                    \\"$type\\": \\"VariableValue\\",
                    \\"pos\\": 13,
                    \\"end\\": 15,
                    \\"value\\": \\"b\\"
                  }
                }
              ]
            }
          },
          {
            \\"$type\\": \\"SpaceNewLine\\",
            \\"pos\\": 20,
            \\"end\\": 21
          }
        ]
      }"
    `);
  });
});

describe("serialize", () => {
  it("serialize component block", () => {
    const block: BlockType = {
      $type: "Block",
      children: [
        {
          $type: "Variable",
          keyVariable: {
            $type: "VariableKey",
            value: "aa",
          },
          valueVariable: {
            $type: "VariableValue",
            value: "bbb",
          },
        },
      ],
    };

    expect(stringify(block).toString()).toMatchInlineSnapshot(`
      "aa=\\"bbb\\"
      "
    `);
  });

  it("serialize component variable and comment", () => {
    const block: BlockType = {
      $type: "Block",
      children: [
        {
          $type: "Comment",
          value: "Iam comment",
        },
        {
          $type: "Variable",
          keyVariable: {
            $type: "VariableKey",
            value: "aaa",
          },
          valueVariable: {
            $type: "VariableValue",
            value: "bbb",
          },
        },
      ],
    };

    expect(stringify(block).toString()).toMatchInlineSnapshot(`
      "# Iam comment
      aaa=\\"bbb\\"
      "
    `);
  });

  it("serialize component variable and comment", () => {
    const block = DataSource.createDataSource(
      Buffer.concat([b(`#; if true === true\n`), b(`aaa=bbb\n`), b(`#; fi\n`)])
    );

    expect(stringify(block).toString()).toMatchInlineSnapshot(`
      "#; if true === true
      aaa=\\"bbb\\"
      #; fi
      "
    `);
  });

  it("should serialize component complex", () => {
    const block = DataSource.createDataSource(
      Buffer.concat([
        b(`# single comment\n`),
        b(`abc=abc\n`),
        b(`c="abnc\\nasd"\n`),
        b(`#;if true === 12 === abc.def === "abc"\n`),
        b(`cde=321\n`),
        b(`#;fi\n`),
        b(`\n`),
        b(`# Comment\n`),
        b(`other=true\n`),
      ])
    );

    expect(stringify(block).toString()).toMatchInlineSnapshot(`
      "# single comment
      abc=\\"abc\\"
      c=\\"abnc\\\\\\\\nasd\\"
      #; if true === 12 === abc.def === \\"abc\\"
      cde=\\"321\\"
      #; fi
      # Comment
      other=\\"true\\"
      "
    `);
  });

  it("should serialize component declaration manual", () => {
    const block: BlockType = {
      $type: "Block",
      children: [
        {
          $type: "Comment",
          value: "I am comment",
        },
        {
          $type: "CommentOperator",
          operator: {
            $type: "VariableKey",
            value: "if",
          },
          statement: {
            $type: "CommentOperatorStatement",
            statements: [
              {
                $type: "StatementObject",
                type: "Boolean",
                value: true,
              },
            ],
          },
          block: {
            $type: "Block",
            children: [],
          },
        },
      ],
    };

    expect(stringify(block).toString()).toMatchInlineSnapshot(`
      "# I am comment
      #; if true
      #; fi
      "
    `);
  });
});
