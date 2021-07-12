import { stringify } from "./stringify";
import { BlockObj } from "../comps/_compsTypes";
import { b } from "./toBuffer";
import { EnvuseFileParser } from "../../envuse-file-parser";
import { BlockType } from "../comps/Block";

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
    const block = EnvuseFileParser.parseToAst(
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
    const block = EnvuseFileParser.parseToAst(
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
                type: "String",
                value: "asd",
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
      #; if \\"asd\\"
      "
    `);
  });
});
